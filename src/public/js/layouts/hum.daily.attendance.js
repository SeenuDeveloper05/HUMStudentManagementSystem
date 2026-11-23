class HumDailyAttendance extends HTMLElement {
    constructor() {
        super();

        const template = document.getElementById("hum_daily_attendance");

        this.appendChild(template.content.cloneNode(true));

        this.selectors = {

            attendancePage: ".hum-attendance-page",

            // Navigation
            attendanceTabs: "#hum_attendance_tabs",
            attendanceTabButton: "#hum_attendance_tabs .nav-link",
            dailyAttendanceTab: "#hum_attendance_daily_tab",
            attendanceHistoryTab: "#hum_attendance_history_tab",
            attendanceAnalysisTab: "#hum_attendance_analysis_tab",

            // Tab panes
            dailyAttendancePane: "#hum_attendance_daily_pane",
            attendanceHistoryPane: "#hum_attendance_history_pane",
            attendanceAnalysisPane: "#hum_attendance_analysis_pane",

            // Header
            saveAttendanceButton: "#hum_attendance_save_btn",

            // Filters
            attendanceDate: "#hum_attendance_date",
            attendanceBranch: "#hum_attendance_branch",
            studentColumn: "#hum_attendance_search_column",
            studentSearch: "#hum_attendance_student_search",
            lengthFilter: "#hum_daily_page_length",

            // Error message
            attendanceError: "#hum_attendance_error",

            // Attendance table
            attendanceTableWrapper: "#hum_attendance_table_wrapper",
            attendanceTable: "#hum_attendance_table",
            attendanceTableBody: "#hum_attendance_table_body",

            // Attendance row controls
            attendanceStatusButton: ".hum-attendance-status-btn",
            attendancePresentButton: ".hum-attendance-present-btn",
            attendanceAbsentButton: ".hum-attendance-absent-btn",
            attendanceLeaveCheckbox: ".hum-attendance-leave-checkbox",

            // Attendance summary
            attendanceSummary: "#hum_attendance_summary",
            presentCount: "#hum_attendance_present_count",
            absentCount: "#hum_attendance_absent_count",
            studentCount: "#hum_attendance_student_count",

            // template container
            attendanceHistoryContainer: "#hum_attendance_history",
            attendanceAnalysisContainer: "#hum_attendance_analysis"

        };

        this.attendanceDataTable = null;

        // Fixed teacher id
        this.teacherId = 1;

        // Selected attendance of every loaded student (key = studentId),
        // so the selections are not lost when the table redraws (search / filter).
        this.attendanceSelections = {};

        this.attendanceDataTableConfig = {
            processing: true,
            serverSide: true,
            pageLength: 20,

            dom:
                't' +
                '<"row align-items-center mt-2 mb-1 px-2"' +
                '<"col-md-6 d-flex align-items-center"i>' +
                '<"col-md-6 d-flex justify-content-md-end hum-custom-pagination"p>' +
                '>',

            ajax: (requestData, callback) => {
                const classObject = this;

                $.ajax({
                    url: "https://dev-api.humhealth.com/StudentManagementSystemAPI/student/list",
                    type: "POST",
                    dataType: "json",
                    contentType: "application/json",
                    data: JSON.stringify(classObject.attendanceStudentFormatRequestData(requestData))
                })
                    .then(async (jsonResponse) => {
                        const rows = await classObject.displayAttendanceStudentDataList(jsonResponse);

                        callback({
                            draw: jsonResponse.draw ?? requestData.draw,
                            recordsTotal: jsonResponse.recordsTotal,
                            recordsFiltered: jsonResponse.recordsFiltered,
                            data: rows
                        });
                    })
                    .catch(() => {
                        callback({
                            draw: requestData.draw,
                            recordsTotal: 0,
                            recordsFiltered: 0,
                            data: []
                        });
                    });
            },

            columns: [
                {
                    data: "sno",
                    searchable: false,
                    orderable: false,
                    visible: true
                },
                {
                    data: "name",
                    searchable: false,
                    orderable: false,
                    visible: true
                },
                {
                    data: "branchOfStudy",
                    searchable: false,
                    orderable: false,
                    visible: true
                },
                {
                    data: "attendance",
                    searchable: false,
                    orderable: false,
                    visible: true
                },
                {
                    data: "sickleave",
                    searchable: false,
                    orderable: false,
                    visible: true
                },
                {
                    data: "ecaleave",
                    searchable: false,
                    orderable: false,
                    visible: true
                }

            ]
        };
    }

    connectedCallback() {
        try {
            this.bindAllRequiredEvents();
            this.initializeToastr();
            this.initializeDatePicker();
            this.getAttendanceList();
            this.initializetemplate();

        }
        catch (error) {
            console.log(error);
        }
    }

    bindAllRequiredEvents() {
        $(this)
            .on("input", this.selectors.studentSearch, { classObject: this }, this.handlerAttendanceStudentSearch)
            .on("change", this.selectors.studentColumn, { classObject: this }, this.handlerAttendanceStudentSearch)
            .on("change", this.selectors.lengthFilter, { classObject: this }, this.handlerAttendanceLengthChange)
            .on("change", this.selectors.attendanceBranch, { classObject: this }, this.handlerAttendanceStudentFilter)
            .on("click", this.selectors.attendanceStatusButton, { classObject: this }, this.handlerAttendanceStatusClick)
            .on("change", this.selectors.attendanceLeaveCheckbox, { classObject: this }, this.handlerAttendanceLeaveChange)
            .on("click", this.selectors.saveAttendanceButton, { classObject: this }, this.handlerAttendanceSave)
            .on("click", this.selectors.attendanceTabButton, { classObject: this }, this.handlerAttendanceTabClick);
    }

    initializetemplate() {
        const classObject = this;

        $(classObject.selectors.attendanceHistoryContainer).html("<hum-attendance-history-temp></hum-attendance-history-temp>");
        $(classObject.selectors.attendanceAnalysisContainer).html("<hum-attendance-analysis-temp></hum-attendance-analysis-temp>");
    }

    initializeToastr() {
        toastr.options = {
            closeButton: true,
            progressBar: true,
            positionClass: "toast-top-center",
            timeOut: 3000,
            preventDuplicates: true
        };
    }

    // Date picker: today by default, future dates are disabled
    initializeDatePicker() {
        const classObject = this;

        const datepickerConfig = {
            dateFormat: "m-d-Y",
            defaultDate: "today",
            maxDate: "today",
            position: "below"
        };

        $(classObject.selectors.attendanceDate)
            .flatpickr(datepickerConfig);
    }

    checkAttendance(event) {

        const classObject = this;

        return new Promise((resolve, reject) => {

            $.ajax({
                url: "https://dev-api.humhealth.com/StudentManagementSystemAPI/attendance/list/byday",
                method: "POST",
                dataType: "json",
                contentType: "application/json",

                data: JSON.stringify({
                    draw: 1,
                    length: 10,
                    start: 0,

                    attendanceFilter: {
                        date: this.ChangeDateFormat($(classObject.selectors.attendanceDate).val()) || null,
                        statusFlag: "",
                        studentBranchOfStudy: $(classObject.selectors.attendanceBranch).val() || "",
                        sickLeaveStatusFlag: "",
                        activitieStatusFlag: ""
                    },

                    order: {
                        column: "sno",
                        type: ""
                    },

                    search: "",
                    searchColumn: "",
                    filterBy: "",
                    filterValue: ""
                }),

                success: function (res) {

                    if (res.status === "Success") {

                        if (res.data.length === 0) {
                            resolve(true);
                        } else {
                            resolve(false);
                        }

                    } else {
                        reject(res);
                    }
                },

                error: (error) => {
                    console.log(error);
                    reject(error);
                }
            });
        });
    }

    // Save Attendance is shown only in the Daily Attendance tab
    handlerAttendanceTabClick(event) {
        const classObject = event.data.classObject;
        const tabId = $(event.currentTarget).attr("id");

        $(classObject.selectors.saveAttendanceButton).toggle(tabId === "hum_attendance_daily_tab");

        // Reload the history list every time the History tab is opened
        if (tabId === "hum_attendance_history_tab") {
            const historyElement = $(classObject.selectors.attendanceHistoryContainer)
                .children("hum-attendance-history-temp").get(0);

            if (historyElement) {
                historyElement.reloadAttendanceHistoryList();
            }
        }
    }

    handlerAttendanceStudentSearch(event) {
        const classObject = event.data.classObject;
        const length = Number($(classObject.selectors.lengthFilter).val()) || 20;

        classObject.attendanceDataTable.page.len(length).draw(true);
    }

    // Page length dropdown change
    handlerAttendanceLengthChange(event) {
        const classObject = event.data.classObject;
        const length = Number($(event.currentTarget).val()) || 20;

        classObject.attendanceDataTable.page.len(length).draw(true);
    }

    handlerAttendanceStudentFilter(event) {
        const classObject = event.data.classObject;
        const selectAttendance = $(classObject).find(classObject.selectors.attendanceBranch).val() || "";
        const length = Number($(classObject.selectors.lengthFilter).val()) || 20;

        if (selectAttendance === "") {
            $(classObject).find(classObject.selectors.attendanceTableWrapper).addClass("d-none");
            $(classObject).find(classObject.selectors.saveAttendanceButton).addClass("d-none")
        }
        else {
            $(classObject).find(classObject.selectors.attendanceTableWrapper).removeClass("d-none");
             $(classObject).find(classObject.selectors.saveAttendanceButton).removeClass("d-none")
            classObject.attendanceDataTable.page.len(length).draw(true);
        }
    }

    // Present / Absent button
    handlerAttendanceStatusClick(event) {
        const classObject = event.data.classObject;

        const studentId = $(event.currentTarget).data("student-id");
        const status = $(event.currentTarget).data("status");
        const record = classObject.attendanceSelections[studentId];

        if (!record) {
            return;
        }

        record.attendanceStatusFlag = status;

        // Present: leave checkboxes are disabled and reset to N
        if (status === "P") {
            record.approvedSickLeaveFlag = "N";
            record.extraCurricularActivitiesFlag = "N";
        }

        classObject.updateAttendanceRow($(event.currentTarget).closest("tr"), record);
    }

    // Sick Leave / ECA Leave checkbox (only one can be selected at a time)
    handlerAttendanceLeaveChange(event) {
        const classObject = event.data.classObject;

        const studentId = $(event.currentTarget).data("student-id");
        const leaveType = $(event.currentTarget).data("leave-type");
        const record = classObject.attendanceSelections[studentId];

        if (!record) {
            return;
        }

        const isChecked = $(event.currentTarget).is(":checked");

        // Reset both, then set only the clicked one
        record.approvedSickLeaveFlag = "N";
        record.extraCurricularActivitiesFlag = "N";

        if (isChecked) {
            if (leaveType === "sick") {
                record.approvedSickLeaveFlag = "Y";
            }
            else {
                record.extraCurricularActivitiesFlag = "Y";
            }
        }

        classObject.updateAttendanceRow($(event.currentTarget).closest("tr"), record);
    }
      ChangeDateFormat(dateString) {
        if (!dateString) {
            return "";
        }

        const dateParts = dateString.split("-");

        return dateParts[1] + "-" + dateParts[0] + "-" + dateParts[2];
    }

    // Save Attendance button
    handlerAttendanceSave(event) {
        event.preventDefault();
        const classObject = event.data.classObject;

        const branch = $(classObject.selectors.attendanceBranch).val() || "";
        const attendanceDate = $(classObject.selectors.attendanceDate).val() || "";

        // API accepts only one branch per request
        if (!branch) {
            toastr.warning("Please select a department");
            return;
        }

        if (!attendanceDate) {
            toastr.warning("Please select an attendance date");
            return;
        }

        const attendanceRequest = classObject.attendanceFormatSaveRequestData(branch, attendanceDate);

        if (attendanceRequest.length === 0) {
            toastr.error("No students to save");
            return;
        }

        classObject.saveAttendance(attendanceRequest);
    }

    attendanceFormatSaveRequestData(branch, attendanceDate) {
        const classObject = this;
        const attendanceDataRequest = [];

        for (const studentId in classObject.attendanceSelections) {
            const record = classObject.attendanceSelections[studentId];

            // Only the selected branch students go in this request
            if (record.branchOfStudy !== branch) {
                continue;
            }

            const isPresent = record.attendanceStatusFlag === "P";

            attendanceDataRequest.push({
                attendanceId: record.attendanceId || null,
                studentId: record.studentId,
                branchOfStudy: branch,
                attendanceDate: attendanceDate,
                attendanceStatusFlag: record.attendanceStatusFlag,
                approvedSickLeaveFlag: isPresent ? "N" : record.approvedSickLeaveFlag,
                extraCurricularActivitiesFlag: isPresent ? "N" : record.extraCurricularActivitiesFlag,
                teacherId: classObject.teacherId
            });
        }

        return attendanceDataRequest;
    }

    saveAttendance(attendanceRequest) {
        const classObject = this;

        $.ajax({
            url: "https://dev-api.humhealth.com/StudentManagementSystemAPI/attendance/take",
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(attendanceRequest),

            success: function (response) {
                // TEMPORARY messages: to be replaced with the message from the API response
                const successCount = Number(response.successCount) || 0;
                const failureCount = Number(response.failureCount) || 0;

                if (failureCount > 0) {
                    toastr.error(failureCount + " attendance records failed to save");
                }
                else if (successCount > 0) {
                    toastr.success(successCount + "Attendance records saveed successfully");
                    classObject.attendanceDataTable.ajax.reload(null, false);
                }
                else {
                    toastr.warning(response.data);
                }
            },

            error: function (error) {
                console.error(error);
                toastr.error("Unable to save attendance. Please try again.");
            }
        });

    }

    // Refresh one row (button highlight, checkbox enable/disable and checked state)
    updateAttendanceRow(row, record) {
        const classObject = this;
        const isPresent = record.attendanceStatusFlag === "P";

        $(row).find(classObject.selectors.attendancePresentButton).toggleClass("is-present", isPresent);
        $(row).find(classObject.selectors.attendanceAbsentButton).toggleClass("is-absent", !isPresent);

        $(row).find(classObject.selectors.attendanceLeaveCheckbox + '[data-leave-type="sick"]')
            .prop("checked", record.approvedSickLeaveFlag === "Y")
            .prop("disabled", isPresent);

        $(row).find(classObject.selectors.attendanceLeaveCheckbox + '[data-leave-type="eca"]')
            .prop("checked", record.extraCurricularActivitiesFlag === "Y")
            .prop("disabled", isPresent);
    }

    attendanceStudentFormatRequestData(requestData) {
        const classObject = this;

        this.studentFilterRequest = {
            draw: requestData.draw,

            // Send the selected dropdown value to the API
            length: Number(requestData.length) || Number($(classObject.selectors.lengthFilter).val()) || 20,

            start: requestData.start,

            filter: {
                gender: "",
                residingStatusFlag: "",
                activeFlag: "A",
                branchOfStudy: $(classObject.selectors.attendanceBranch).val() || ""
            },

            order: {
                column: "name",
                type: "asc"
            },

            search: $(classObject.selectors.studentSearch).val() || "",
            searchColumn: $(classObject.selectors.studentColumn).val() || ""
        };

        return this.studentFilterRequest;
    }

    displayAttendanceStudentDataList(response) {
        if (response.status === "Success") {
            return this.checkAttendance().then((res) => {
                if (res) {
                    return this.verifiedAttendancelist(response);

                } else {
                    return [];
                }
            }).catch(() => {
                return [];
            });

        }
    }

    verifiedAttendancelist(response) {
        const studentDataArray = [];
        let index = 1;

        for (const res of response.data) {
            const data = {};

            let branchOfStudy = res.branchOfStudy;

            switch (branchOfStudy) {
                case "CSCI":
                    branchOfStudy = "Computer Science";
                    break;

                case "BIOL":
                    branchOfStudy = "Biology";
                    break;

                case "COMM":
                    branchOfStudy = "Commerce";
                    break;

                case "ZOOL":
                    branchOfStudy = "Zoology";
                    break;

                case "ARTS":
                    branchOfStudy = "Arts";
                    break;

                default:
                    branchOfStudy = "";
                    break;
            }

            // Create the selection only the first time a student is loaded (default Present)
            if (!this.attendanceSelections[res.studentId]) {
                this.attendanceSelections[res.studentId] = {
                    attendanceId: res.attendanceId || null,
                    studentId: res.studentId,
                    branchOfStudy: res.branchOfStudy,
                    attendanceStatusFlag: "P",
                    approvedSickLeaveFlag: "N",
                    extraCurricularActivitiesFlag: "N"
                };
            }

            const record = this.attendanceSelections[res.studentId];

            data["sno"] = index++;
            data["name"] = [
                res.firstName, res.middleName, res.lastName
            ].filter(Boolean).join(" ");
            data["branchOfStudy"] = branchOfStudy;
            data["attendance"] = this.forAttendanceStatus(record);
            data["sickleave"] = this.forLeaveCheckbox(record, "sick");
            data["ecaleave"] = this.forLeaveCheckbox(record, "eca");

            studentDataArray.push(data);
        }

        return studentDataArray;
    }

    forAttendanceStatus(record) {
        const presentClass = record.attendanceStatusFlag === "P" ? "is-present" : "";
        const absentClass = record.attendanceStatusFlag === "A" ? "is-absent" : "";

        return `
            <div class="btn-group btn-group-sm hum-attendance-status-group" role="group">
                <button type="button"
                    class="btn hum-attendance-status-btn hum-attendance-present-btn ${presentClass}"
                    data-student-id="${record.studentId}"
                    data-status="P">
                    Present
                </button>

                <button type="button"
                    class="btn hum-attendance-status-btn hum-attendance-absent-btn ${absentClass}"
                    data-student-id="${record.studentId}"
                    data-status="A">
                    Absent
                </button>
            </div>
        `;
    }

    // Checkbox is disabled while the student is Present
    forLeaveCheckbox(record, leaveType) {
        const isPresent = record.attendanceStatusFlag === "P";

        const flag = leaveType === "sick"
            ? record.approvedSickLeaveFlag
            : record.extraCurricularActivitiesFlag;

        return `
            <label class="hum-attendance-yes">
                <input type="checkbox"
                    class="hum-attendance-leave-checkbox"
                    data-student-id="${record.studentId}"
                    data-leave-type="${leaveType}"
                    ${flag === "Y" ? "checked" : ""}
                    ${isPresent ? "disabled" : ""}>
                <span>Yes</span>
            </label>
        `;
    }

    getAttendanceList() {
        if (!this.attendanceDataTable) {
            this.attendanceDataTable = $(this).find(this.selectors.attendanceTable).DataTable(this.attendanceDataTableConfig);
            $(this).find(this.selectors.attendanceStatusButton).prop("disabled", true);
        }
    }
}

class HumAttendanceHistory extends HTMLElement{
    constructor(){
        super();

        const template=document.getElementById("hum_attendance_history_temp");

        this.appendChild(template.content.cloneNode(true));

        this.selectors = {
            historyMonth: "#hum_attendance_history_month",
            historyYear: "#hum_attendance_history_year",
            historyLength:"#hum_history_page_length",
            historyDepartment: "#hum_attendance_history_department",
            historyStatus: "#hum_attendance_history_status",
            historySickLeave: "#hum_attendance_history_sick_leave",
            historyEcaLeave: "#hum_attendance_history_eca_leave",
            historyDate: "#hum_attendance_history_date",

            historyTable: "#hum_attendance_history_table",
            historyTableBody: "#hum_attendance_history_table_body"
        };

        this.attendanceHistoryDataTable = null;

        this.attendanceHistoryDataTableConfig = {
            processing: true,
            serverSide: true,
            pageLength: 10,

            searching: false,
            dom:
                't' +
                '<"row align-items-center mt-2 mb-1 px-2"' +
                '<"col-md-6 d-flex align-items-center"i>' +
                '<"col-md-6 d-flex justify-content-md-end hum-custom-pagination"p>' +
                '>',

            ajax:{
                url:"https://dev-api.humhealth.com/StudentManagementSystemAPI/attendance/list/byday",
                type:"POST",
                dataType:"json",
                contentType: "application/json",

                data:(requestData)=>{
                    return JSON.stringify(
                        this.attendanceHistoryFormatRequestData(requestData)
                    );
                },

                dataSrc: (jsonResponse)=>{
                    return this.displayAttendanceHistoryDataList(jsonResponse);
                }
            },

            columns:[
                {
                    data: "date",
                    searchable: false,
                    orderable: false,
                    visible: true
                },
                {
                    data: "name",
                    searchable: false,
                    orderable: false,
                    visible: true
                },
                {
                    data: "branchOfStudy",
                    searchable: false,
                    orderable: false,
                    visible: true
                },
                {
                    data: "status",
                    searchable: false,
                    orderable: false,
                    visible: true
                },
                {
                    data: "sickleave",
                    searchable: false,
                    orderable: false,
                    visible: true
                },
                {
                    data: "ecaleave",
                    searchable: false,
                    orderable: false,
                    visible: true
                }
            ]
        };
    }

    connectedCallback(){
        try{
            this.bindAllRequiredEvents();
            this.initializeYearOptions();
            this.initializeDatePicker();
            this.ChangeDateFormat();
            this.getAttendanceHistoryList();

        }
        catch(error){
            console.log(error);
        }
    }

    bindAllRequiredEvents(){
        $(this).on("change",
            [
                this.selectors.historyMonth,
                this.selectors.historyYear,
                this.selectors.historyDepartment,
                this.selectors.historyStatus,
                this.selectors.historySickLeave,
                this.selectors.historyEcaLeave,
                this.selectors.historyDate
            ].join(","),
            {classObject:this},
            this.handlerAttendanceHistoryFilter
        );

        // Page length dropdown event
        $(this).on(
            "change",
            this.selectors.historyLength,
            {classObject:this},
            this.handlerAttendanceHistoryLengthChange
        );
    }

    initializeDatePicker() {
        const classObject = this;

        const datepickerConfig = {
            dateFormat: "m-d-Y",
            defaultDate: "",
            maxDate: "today",
            position: "below"
        };

        flatpickr(classObject.selectors.historyDate, datepickerConfig);
    }

    // Month starts on "All months"; year dropdown: current year and the previous 4 years
    initializeYearOptions(){
        const classObject = this;
        const currentYear = new Date().getFullYear();

        // Add the "All months" option if the template does not have it
        if($(classObject.selectors.historyMonth).find('option[value=""]').length === 0){
            $(classObject.selectors.historyMonth).prepend('<option value="">Select months</option>');
        }

        $(classObject.selectors.historyMonth).val("");

        for(let year = currentYear; year >= currentYear - 4; year--){
            $(classObject.selectors.historyYear).append(
                `<option value="${year}">${year}</option>`
            );
        }
    }

    // Existing filters
    handlerAttendanceHistoryFilter(event){
        const classObject = event.data.classObject;
        const length = Number($(classObject.selectors.historyLength).val()) || 20;

        classObject.attendanceHistoryDataTable.page.len(length).draw(true);
    }

    // Page length dropdown change
    handlerAttendanceHistoryLengthChange(event){
        const classObject = event.data.classObject;
        const length = Number($(event.currentTarget).val()) || 20;

        classObject.attendanceHistoryDataTable.page.len(length).draw(true);
    }

    // Called by the Daily Attendance page every time the History tab is opened
    reloadAttendanceHistoryList(){
        if(this.attendanceHistoryDataTable){
            const length = Number($(this.selectors.historyLength).val()) || 20;

            this.attendanceHistoryDataTable.page.len(length).draw(true);
        }
    }

    attendanceHistoryFormatRequestData(requestData){
        const classObject = this;

        const month = $(classObject.selectors.historyMonth).val() || "";
        const year = $(classObject.selectors.historyYear).val() || "";
        const date = $(classObject.selectors.historyDate).val() || null;

        // Month and year both selected: filter by Month (MM-yyyy). Otherwise list all attendance
        let filterBy = "";
        let filterValue = "";

        if(month && year){
            filterBy = "Month";
            filterValue = month + "-" + year;
        }

        this.attendanceHistoryFilterRequest = {
            draw: requestData.draw,

            // Send selected dropdown length to API
            length: Number($(classObject.selectors.historyLength).val()) || requestData.length || 20,

            start: requestData.start,

            attendanceFilter:{
                date:this.ChangeDateFormat(date)|| null,
                statusFlag: $(classObject.selectors.historyStatus).val() || "",
                studentBranchOfStudy: $(classObject.selectors.historyDepartment).val() || "",
                sickLeaveStatusFlag: $(classObject.selectors.historySickLeave).val() || "",
                activitieStatusFlag: $(classObject.selectors.historyEcaLeave).val() || ""
            },

            order:{
                column:"sno",
                type:"desc"
            },

            search:"",
            searchColumn:"",

            filterBy: filterBy,
            filterValue: filterValue
        };

        return this.attendanceHistoryFilterRequest;
    }

    displayAttendanceHistoryDataList(response){
        const attendanceHistoryArray = [];

        if(response.status === "Success"){

            for(const res of response.data){
                const data = {};

                let branchOfStudy = res.studentBranchOfStudy;

                switch (branchOfStudy) {
                    case "CSCI":
                        branchOfStudy = "Computer Science";
                        break;

                    case "BIOL":
                        branchOfStudy = "Biology";
                        break;

                    case "COMM":
                        branchOfStudy = "Commerce";
                        break;

                    case "ZOOL":
                        branchOfStudy = "Zoology";
                        break;

                    case "ARTS":
                        branchOfStudy = "Arts";
                        break;

                    default:
                        branchOfStudy = "";
                        break;
                }

                data["date"] = res.attendanceDate;
                data["name"] = [
                    res.studentFirstName,
                    res.studentLastName
                ].filter(Boolean).join(" ");
                data["branchOfStudy"] = branchOfStudy;
                data["status"] = this.forAttendanceStatus(res.attendanceStatusFlag);
                data["sickleave"] = this.forLeaveApproved(res.sickLeaveFlag, "sick");
                data["ecaleave"] = this.forLeaveApproved(res.extraCurricularActivitiesFlag, "eca");

                attendanceHistoryArray.push(data);
            }
        }

        return attendanceHistoryArray;
    }

    ChangeDateFormat(dateString) {
        if (!dateString) {
            return "";
        }

        const dateParts = dateString.split("-");

        return dateParts[1] + "-" + dateParts[0] + "-" + dateParts[2];
    }

    forAttendanceStatus(attendanceStatusFlag){
        if(attendanceStatusFlag === "P"){
            return `<span class="hum-attendance-history-status hum-attendance-history-status-present">Present</span>`;
        }

        return `<span class="hum-attendance-history-status hum-attendance-history-status-absent">Absent</span>`;
    }

    // "Approved" only when the leave flag is Y, otherwise a dash
    forLeaveApproved(leaveFlag, leaveType){
        if(leaveFlag !== "Y"){
            return `<span class="hum-attendance-history-dash">-</span>`;
        }

        const ecaClass = leaveType === "eca" ? "hum-attendance-history-approved-eca" : "";

        return `<span class="hum-attendance-history-approved ${ecaClass}">Approved</span>`;
    }

    getAttendanceHistoryList(){
        if(!this.attendanceHistoryDataTable){
            this.attendanceHistoryDataTable=$(this).find(this.selectors.historyTable).DataTable(this.attendanceHistoryDataTableConfig);
        }
    }

}


class HumAttendanceAnalysis extends HTMLElement{
    constructor(){
    super();
    const template = document.getElementById("hum_attendance_analysis_temp");
     this.appendChild(template.content.cloneNode(true));
     this.selectors = {

    // Analysis Filters
    attendanceAnalysisBranch: "#hum_attendance_analysis_branch",
    attendanceAnalysisMonth: "#hum_attendance_analysis_month",
    attendanceAnalysisYear: "#hum_attendance_analysis_year",
    attendanceAnalysisEcaCount: "#hum_attendance_analysis_eca_count",
    attendanceAnalysisSickCount: "#hum_attendance_analysis_sick_count",
    attendanceLength:"#hum_analysis_page_length",

    // Analysis Table
    attendanceAnalysisTable: "#hum_attendance_analysis_table",
    attendanceAnalysisTableBody: "#hum_attendance_analysis_table_body",

    // Absent dates button
    attendanceAnalysisDatesButton: ".hum-attendance-analysis-dates-btn"

};

     this.attendanceAnalysisDataTable = null;

     // Loaded students (key = studentId) for the View Dates popup
     this.attendanceAnalysisRecords = {};

     this.attendanceAnalysisDataTableConfig = {
         processing: true,
         serverSide: true,
         pageLength: 10,
         searching: false,
      dom:
        't' +
        '<"row align-items-center mt-2 mb-1 px-2"' +
        '<"col-md-6 d-flex align-items-center"i>' +
        '<"col-md-6 d-flex justify-content-md-end hum-custom-pagination"p>' +
         '>',

         ajax:{
             url:"https://dev-api.humhealth.com/StudentManagementSystemAPI/attendance/list/bymonth",
             type:"POST",
             dataType:"json",
             contentType: "application/json",

             data:(requestData)=>{
                 return JSON.stringify(
                     this.attendanceAnalysisFormatRequestData(requestData)
                 );
             },

             dataSrc: (jsonResponse)=>{
                 return this.displayAttendanceAnalysisDataList(jsonResponse);
             }
         },

         columns:[
             {
                 data: "sno",
                 searchable: false,
                 orderable: false,
                 visible: true
             },
             {
                 data: "name",
                 searchable: false,
                 orderable: false,
                 visible: true
             },
             {
                 data: "branchOfStudy",
                 searchable: false,
                 orderable: false,
                 visible: true
             },
             {
                 data: "totalWorkingDays",
                 searchable: false,
                 orderable: false,
                 visible: true
             },
             {
                 data: "presentCount",
                 searchable: false,
                 orderable: false,
                 visible: true
             },
             {
                 data: "absentCount",
                 searchable: false,
                 orderable: false,
                 visible: true
             },
             {
                 data: "sickDays",
                 searchable: false,
                 orderable: false,
                 visible: true
             },
             {
                 data: "activityDays",
                 searchable: false,
                 orderable: false,
                 visible: true
             },
             {
                 data: "absentDates",
                 searchable: false,
                 orderable: false,
                 visible: true
             }
         ]
     };

  }

   connectedCallback(){
    try{
          this.bindAllRequiredEvents();
          this.handlerYearOption();
          this.initializeToolTip();
          this.initializeCurrentMonthYear();
          this.getAttendanceAnalysisList();
    }catch(error){
       console.error(error);
    }
  }

    bindAllRequiredEvents(){
        $(this).on("change",
            [
                this.selectors.attendanceAnalysisBranch,
                this.selectors.attendanceAnalysisMonth,
                this.selectors.attendanceAnalysisYear
            ].join(","),
            {classObject:this},
            this.handlerAttendanceAnalysisFilter
        );

        $(this).on("input",
            [
                this.selectors.attendanceAnalysisEcaCount,
                this.selectors.attendanceAnalysisSickCount
            ].join(","),
            {classObject:this},
            this.handlerAttendanceAnalysisFilter
        );

        // Page length dropdown event
        $(this).on("change",
            this.selectors.attendanceLength,
            {classObject:this},
            this.handlerAttendanceAnalysisLengthChange
        );

        $(this).on("click",
            this.selectors.attendanceAnalysisDatesButton,
            {classObject:this},
            this.handlerAttendanceAnalysisDatesClick
        );
    } 

initializeToolTip() {

    new bootstrap.Tooltip(this, {
        selector: '[data-bs-toggle="tooltip"]',
        container: 'body',
        trigger: 'hover focus'
    });

}


      handlerYearOption() {
        const self = this;
        const today = new Date();

        let curyear = today.getFullYear() + 1;
        let options = "";

        for (let i = 0; i < 7; i++) {
            options += `<option value="${curyear}">${curyear}</option>`;
            curyear -= 1;
        }

        $(self.selectors.attendanceAnalysisYear).html(options);
    }

    // Month and year start on the current month and year
    initializeCurrentMonthYear(){
        const classObject = this;
        const today = new Date();
        const currentMonth = String(today.getMonth() + 1).padStart(2, "0");

        // The monthly analysis always needs a month, so there is no "All months" option
        

        $(classObject.selectors.attendanceAnalysisMonth).val(currentMonth);
        $(classObject.selectors.attendanceAnalysisYear).val(today.getFullYear());
    }

    handlerAttendanceAnalysisFilter(event){
        const classObject = event.data.classObject;
        const length = Number($(classObject.selectors.attendanceLength).val()) || 20;

        classObject.attendanceAnalysisDataTable.page.len(length).draw(true);
    }

    // Page length dropdown change
    handlerAttendanceAnalysisLengthChange(event){
        const classObject = event.data.classObject;
        const length = Number($(event.currentTarget).val()) || 20;

        classObject.attendanceAnalysisDataTable.page.len(length).draw(true);
    }

    // View Dates button: absent dates of that student, or a full attendance message
    handlerAttendanceAnalysisDatesClick(event){
        const classObject = event.data.classObject;

        const studentId = $(event.currentTarget).data("student-id");
        const record = classObject.attendanceAnalysisRecords[studentId];

        if(!record){
            return;
        }

        const swalOptions = {
            titleText: record.name,
            confirmButtonText: "Close",
            width: 300,
            padding: "1rem",
            customClass: {
                confirmButton: "btn btn-sm btn-primary"
            },
            buttonsStyling: false,
            didOpen: function(popup){
                popup.style.height = "auto";
            }
        };

        if(record.absentDates.length === 0){
            // No absent dates: full attendance
            swalOptions.text = "Has full attendance";
        }
        else{
            // Dates side by side, wrapping to the next line when the row is full
            const datesHtml = record.absentDates.map(function(absentDate){
                return `<span class="badge bg-light text-dark border" style="font-size:10px;font-weight:400;">${absentDate}</span>`;
            }).join("\n");

            swalOptions.html = `<div>${datesHtml}</div>`;
        }

        Swal.fire(swalOptions);
    }

    // Called by the Daily Attendance page every time the Analysis tab is opened
    reloadAttendanceAnalysisList(){
        if(this.attendanceAnalysisDataTable){
            const length = Number($(this.selectors.attendanceLength).val()) || 20;

            this.attendanceAnalysisDataTable.page.len(length).draw(true);
        }
    }

    attendanceAnalysisFormatRequestData(requestData){
        const classObject = this;

        const month = $(classObject.selectors.attendanceAnalysisMonth).val() || "";
        const year = $(classObject.selectors.attendanceAnalysisYear).val() || "";
        const ecaCount = $(classObject.selectors.attendanceAnalysisEcaCount).val();
        const sickCount = $(classObject.selectors.attendanceAnalysisSickCount).val();

        // Month and year both selected: filter by Month (MM-yyyy)
        let filterBy = "";
        let filterValue = "";

        if(month && year){
            filterBy = "Month";
            filterValue = month + "-" + year;
        }

        this.attendanceAnalysisFilterRequest = {
            draw: requestData.draw,

            // Send selected dropdown length to API
            length: Number($(classObject.selectors.attendanceLength).val()) || requestData.length || 20,

            start: requestData.start,

            attendanceFilter:{
                studentBranchOfStudy: $(classObject.selectors.attendanceAnalysisBranch).val() || "",
                exceedingEACLeaveCount: (ecaCount === "" || ecaCount === undefined) ? null : Number(ecaCount),
                exceedingSickLeaveCount: (sickCount === "" || sickCount === undefined) ? null : Number(sickCount),
                absenteeismPercentage: null
            },

            order:{
                column:"",
                type:""
            },

            search:"",
            searchColumn:"",

            filterBy: filterBy,
            filterValue: filterValue
        };

        return this.attendanceAnalysisFilterRequest;
    }

    displayAttendanceAnalysisDataList(response){
        const attendanceAnalysisArray = [];

        // A new list replaces the loaded students
        this.attendanceAnalysisRecords = {};

        if(response.status === "Success"){

            for(const res of response.data){
                const data = {};

                let branchOfStudy = res.studentBranchOfStudy;

                switch (branchOfStudy) {
                    case "CSCI":
                        branchOfStudy = "Computer Science";
                        break;

                    case "BIOL":
                        branchOfStudy = "Biology";
                        break;

                    case "COMM":
                        branchOfStudy = "Commerce";
                        break;

                    case "ZOOL":
                        branchOfStudy = "Zoology";
                        break;

                    case "ARTS":
                        branchOfStudy = "Arts";
                        break;

                    default:
                        branchOfStudy = "";
                        break;
                }

                const studentName = [
                    res.studentFirstName,
                    res.studentLastName
                ].filter(Boolean).join(" ");

                const absentDates = res.absentDates || [];

                // Keep the absent dates for the View Dates popup
                this.attendanceAnalysisRecords[res.studentId] = {
                    name: studentName,
                    absentDates: absentDates
                };

                data["sno"] = res.sno;
                data["name"] = studentName;
                data["branchOfStudy"] = branchOfStudy;
                data["totalWorkingDays"] = res.totalWorkingDays;
                data["presentCount"] = res.presentCount;
                data["absentCount"] = res.absentCount;
                data["sickDays"] = res.totalApprovedSickdays;
                data["activityDays"] = res.totalActivitiesPermissionDays;
                data["absentDates"] = this.forAbsentDates(res.studentId);
                attendanceAnalysisArray.push(data);
            }
        }

        return attendanceAnalysisArray;
    }

    // View Dates button for every student
    forAbsentDates(studentId){
        return `
            <button type="button"
                class="btn btn-sm btn-outline-primary hum-attendance-analysis-dates-btn"
                data-student-id="${studentId}"
                   data-bs-toggle="tooltip" 
                title="View absent dates">
                <span class="d-inline-flex align-items-center gap-1">
                    <span class="material-symbols-outlined hum-icon-font">calendar_month</span>
                    View Dates
                </span>
            </button>
        `;
    }

    getAttendanceAnalysisList(){
        if(!this.attendanceAnalysisDataTable){
            this.attendanceAnalysisDataTable=$(this).find(this.selectors.attendanceAnalysisTable).DataTable(this.attendanceAnalysisDataTableConfig);
        }
    }

}

customElements.define("hum-attendance-analysis-temp",HumAttendanceAnalysis);
customElements.define("hum-attendance-history-temp",HumAttendanceHistory);
customElements.define("hum-daily-attendance",HumDailyAttendance);