class HumMarkEntry extends HTMLElement {
    constructor() {
        super();
        const template = document.getElementById("hum_mark_entry_temp");
        this.appendChild(template.content.cloneNode(true));


        this.selectors = {

            // Main Page
            filterBranch: "#hum_mark_filter_branch",
            filterResult: "#hum_mark_filter_result",
            filterQuarter: "#hum_mark_filter_quarter",
            filterYear: "#hum_quarterly_filter_year",
            filterSubject: "#hum_mark_filter_subject",
            filterComparison: "#hum_mark_filter_comparison",
            filterValue: "#hum_mark_filter_value",
            filterSearch: "#hum_mark_filter_search",
            applyFilterButton: "#hum_mark_filter_apply_button",
            resetFilterButton: "#hum_mark_filter_reset_button",
            addButton: "#hum_mark_add_button",
            downloadExcelButton: "#hum_mark_download_excel_button",
            topperButton: "#hum_mark_topper_button",
            viewStudentQuarterButton: "#hum_mark_view_student_quarter_button",
            markTable: "#hum_mark_entry_table",
            markTableBody: "#hum_mark_table_body",

            // Bulk Mark Entry
            bulkModal: "#hum_mark_bulk_entry_modal",
            bulkForm: "#hum_mark_bulk_entry_form",
            bulkQuarter: "#hum_mark_bulk_quarter",
            bulkYear: "#hum_mark_bulk_year",
            bulkStudentCount: "#hum_mark_bulk_student_count",
            bulkEntries: "#hum_mark_bulk_entries",
            bulkStudent: "#hum_mark_bulk_student",
            bulkTamil: "#hum_mark_bulk_tamil",
            bulkEnglish: "#hum_mark_bulk_english",
            bulkMaths: "#hum_mark_bulk_maths",
            bulkScience: "#hum_mark_bulk_science",
            bulkSocialScience: "#hum_mark_bulk_social_science",
            bulkAddAnother: "#hum_mark_bulk_add_another",
            bulkTableContainer: "#hum_mark_bulk_table_container",
            bulkTableBody: "#hum_mark_bulk_table_body",
            bulkResult: "#hum_mark_bulk_result",
            bulkSaveButton: "#hum_mark_bulk_save_button",

            // Topper
            topperButton: "#hum_mark_topper_button",
            topperModal: "#hum_mark_topper_modal",
            topperQuarter: "#hum_mark_topper_quarter",
            topperYear: "#hum_mark_topper_year",
            topperBranch: "#hum_mark_topper_branch",
            topperSearchButton: "#hum_mark_topper_search_button",
            topperResult: "#hum_mark_topper_result",
            topperMessage: "#hum_mark_topper_message",
            topperAvatar: "#hum_mark_topper_avatar",
            topperStudentName: "#hum_mark_topper_student_name",
            topperStudentId: "#hum_mark_topper_student_id",
            topperStudentBranch: "#hum_mark_topper_student_branch",
            topperTotal: "#hum_mark_topper_total",
            topperStatus: "#hum_mark_topper_status",
            topperTamil: "#hum_mark_topper_tamil",
            topperEnglish: "#hum_mark_topper_english",
            topperMaths: "#hum_mark_topper_maths",
            topperScience: "#hum_mark_topper_science",
            topperSocialScience: "#hum_mark_topper_social_science",

            // Download Excel
            downloadExcelModal: "#hum_mark_download_excel_modal",
            downloadExcelQuarter: "#hum_mark_download_quarter",
            downloadExcelYear: "#hum_mark_download_year",
            downloadExcelBranch: "#hum_mark_download_branch",
            downloadExcelPreviewQuarter: "#hum_mark_download_preview_quarter",
            downloadExcelPreviewBranch: "#hum_mark_download_preview_branch",
            downloadExcelConfirmButton: "#hum_mark_download_excel_confirm_button",

            // View Student & Quarter
            viewStudentQuarterButton: "#hum_mark_view_student_quarter_button",
            viewStudentQuarterModal: "#hum_mark_student_quarter_modal",
            viewStudentSelect: "#hum_mark_view_student",
            viewStudentQuarter: "#hum_mark_view_quarter",
            viewStudentYear: "#hum_mark_view_year",
            viewStudentSearchButton: "#hum_mark_view_student_search_button",

            viewStudentResult: "#hum_mark_view_student_result",
            viewStudentMessage: "#hum_mark_view_student_message",

            viewStudentAvatar: "#hum_mark_view_student_avatar",
            viewStudentName: "#hum_mark_view_student_name",
            viewStudentId: "#hum_mark_view_student_id",
            viewStudentBranch: "#hum_mark_view_student_branch",
            viewStudentResultQuarter: "#hum_mark_view_student_result_quarter",
            viewStudentTotal: "#hum_mark_view_student_total",

            viewStudentTamil: "#hum_mark_view_student_tamil",
            viewStudentEnglish: "#hum_mark_view_student_english",
            viewStudentMaths: "#hum_mark_view_student_maths",
            viewStudentScience: "#hum_mark_view_student_science",
            viewStudentSocialScience: "#hum_mark_view_student_social_science",

            viewStudentCompliance: "#hum_mark_view_student_compliance",
            viewStudentStatus: "#hum_mark_view_student_status",

            // Download by Mark ID
            downloadIdModal: "#hum_mark_download_id_modal",
            downloadIdInput: "#hum_mark_download_id",
            downloadIdPreview: "#hum_mark_download_id_preview",
            downloadIdConfirmButton: "#hum_mark_download_id_confirm_button",
            downloadIdButton: ".hum-mark-download-id-btn",

            // View Mark Details
            viewDetailsModal: "#hum_mark_view_details_modal",
            detailsAvatar: "#hum_mark_details_avatar",
            detailsStudentName: "#hum_mark_details_student_name",
            detailsBranch: "#hum_mark_details_branch",
            detailsMarkId: "#hum_mark_details_mark_id",
            detailsStudentId: "#hum_mark_details_student_id",
            detailsQuarter: "#hum_mark_details_quarter",
            detailsTamil: "#hum_mark_details_tamil",
            detailsEnglish: "#hum_mark_details_english",
            detailsMaths: "#hum_mark_details_maths",
            detailsScience: "#hum_mark_details_science",
            detailsSocialScience: "#hum_mark_details_social_science",
            detailsTotal: "#hum_mark_details_total",
            detailsCompliance: "#hum_mark_details_compliance",
            detailsResult: "#hum_mark_details_result",

            // Email Report
            emailModal: "#hum_mark_email_report_modal",
            emailAvatar: "#hum_mark_email_avatar",
            emailStudentName: "#hum_mark_email_student_name",
            emailStudentBranch: "#hum_mark_email_student_branch",
            emailSendButton: "#hum_mark_email_send_button",

            //Action btn
            editMarkButton: ".hum-mark-edit-btn",
            viewMarkButton: ".hum-mark-view-btn",
            downloadMarkIdButton: ".hum-mark-download-id-btn",
            emailMarkButton: ".hum-mark-email-btn",
            downloadStudentReportButton: ".hum-mark-student-report-btn",
            // Table Input
            tableInTamil: ".hum_edit_tamil",
            tableInEnglish: ".hum_edit_english",
            tableInMaths: ".hum_edit_maths",
            tableInScience: ".hum_edit_science",
            tableInSocial: ".hum_edit_social",
            tableSaveButton: "#hum_mark_table_save_button",
            tableCancelButton: "#hum_mark_table_cancel_button",


        };
        this.markEntryDataTable = null;
        this.bulkMarkEntries = [];
        this.editMarkData = null;
        this.currentMarkQuarter = this.getCurrentMarkQuarter();
        this.markEntryAppliedFilters = {
            studentBranchOfStudy: "",
            result: "",
            quarter: null,
            subjectName: "",
            markComparison: "",
            markValue: null,
            search: "",
            searchColumn: "Fullname"

        };

        this.markEntryDataTableConfig = {
            processing: true,
            serverSide: true,
            pageLength: 50,
            searching: false,
            dom:
                't' +
                '<"row align-items-center mt-2 mb-1 px-2"' +
                '<"col-md-6 d-flex align-items-center"i>' +
                '<"col-md-6 d-flex justify-content-md-end hum-custom-pagination"p>' +
                '>',

            ajax: (requestData, callback) => {

                Promise.all([

                    this.getStudentListForMarkEntry(requestData),

                    this.getMarkListForMarkEntry(requestData)

                ])
                    .then(([studentResponse, markResponse]) => {

                        console.log("STUDENT API RESPONSE:", studentResponse);
                        console.log("MARK API RESPONSE:", markResponse);

                        console.log("STUDENT DATA:", studentResponse.data);
                        console.log("MARK DATA:", markResponse.data);
                        const mergedData = this.displayMarkEntryList(
                            markResponse,
                            studentResponse
                        );

                        callback({
                            draw: requestData.draw,
                            recordsTotal: studentResponse.recordsTotal,
                            recordsFiltered: studentResponse.recordsFiltered,
                            data: mergedData
                        });
                    })
                    .catch(error => {

                        console.error("Mark Entry API Error:", error);

                        console.error("HTTP Status:", error.status);

                        console.error("Response Text:", error.responseText);

                        console.error("Response JSON:", error.responseJSON);

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
                    data: "quarter",
                    searchable: false,
                    orderable: false,
                    visible: true
                },
                {
                    data: "tamil",
                    searchable: false,
                    orderable: false,
                    visible: true
                },
                {
                    data: "english",
                    searchable: false,
                    orderable: false,
                    visible: true
                },
                {
                    data: "maths",
                    searchable: false,
                    orderable: false,
                    visible: true
                },
                {
                    data: "science",
                    searchable: false,
                    orderable: false,
                    visible: true
                },
                {
                    data: "socialScience",
                    searchable: false,
                    orderable: false,
                    visible: true
                },
                {
                    data: "total",
                    searchable: false,
                    orderable: false,
                    visible: true
                },
                {
                    data: "complianceStatusFlag",
                    searchable: false,
                    orderable: false,
                    visible: true
                },
                {
                    data: "result",
                    searchable: false,
                    orderable: false,
                    visible: true
                },
                {
                    data: "action",
                    searchable: false,
                    orderable: false,
                    visible: true
                },
            ],
            columnDefs: [
                {
                    targets: "_all",
                    className: "text-center"
                }
            ],
            createdRow: (row, data) => {
                $(row).attr("mark-id", data.markId);
                $(row).attr("student-id", data.studentId);
                $(row).attr("quarter", data.quarter);
            },
            initComplete: () => {
                $(this).on("dblclick", "#hum_mark_table_body > tr", { classObject: this }, this.handlerTableInputMarkEdit)
                    .on("click", this.selectors.addButton, { classObject: this }, this.handlerTableInputMarkEdit)
            },

        };
    }
    connectedCallback() {
        try {
            this.handlerYearOption();
            this.initializeToastr();
            this.initializeToolTip();
            this.bindAllRequiredEvents();
            this.getMarkEntryList();
        } catch (error) {

        }
    }
    bindAllRequiredEvents() {
        $(this)
            .on("click", this.selectors.applyFilterButton, { classObject: this }, this.handlerApplyMarkFilter)
            .on("click", this.selectors.resetFilterButton, { classObject: this }, this.handlerResetMarkFilter)
            .on("click", this.selectors.viewMarkButton, { classObject: this }, this.handlerViewMark)
            .on("click", this.selectors.downloadMarkIdButton, { classObject: this }, this.handlerDownloadMarkId)
            .on("click", this.selectors.emailMarkButton, { classObject: this }, this.handlerOpenEmailMarkModal)
            .on("click", this.selectors.emailSendButton, { classObject: this }, this.handlerSendMarkReportEmail)
            .on("click", this.selectors.downloadStudentReportButton, { classObject: this }, this.handlerDownloadStudentMarkReport)
            .on("click", this.selectors.topperButton, { classObject: this }, this.handlerOpenTopperModal)
            .on("click", this.selectors.topperSearchButton, { classObject: this }, this.handlerGetQuarterTopper)
            .on("click", this.selectors.downloadExcelButton, { classObject: this }, this.handlerOpenDownloadExcelModal)
            .on("change", [this.selectors.downloadExcelQuarter, this.selectors.downloadExcelYear, this.selectors.downloadExcelBranch].join(","), { classObject: this }, this.handlerUpdateDownloadExcelPreview)
            .on("click", this.selectors.downloadExcelConfirmButton, { classObject: this }, this.handlerConfirmDownloadExcel)
            .on("click", this.selectors.viewStudentQuarterButton, { classObject: this }, this.handlerOpenViewStudentQuarterModal)
            .on("click", this.selectors.viewStudentSearchButton, { classObject: this }, this.handlerGetStudentQuarterMarks)
            .on("change", ".mark-input", { classObject: this }, this.markChanged)


            .on(
                "click",
                this.selectors.tableSaveButton,
                { classObject: this },
                this.handlerSaveTableMarkEdit
            )

          .on("click",
            this.selectors.tableCancelButton,
            { classObject: this },
            this.handlerCancelTableMarkEdit
)
    }

    markChanged(event) {
        $(this).closest("tr").addClass("mark-changed")
    }
    handlerApplyMarkFilter(event) {
        const classObject = event.data.classObject;
        const branchOfStudy = $(classObject).find(classObject.selectors.filterBranch).val();
        const result = $(classObject).find(classObject.selectors.filterResult).val();
        const quarter = $(classObject).find(classObject.selectors.filterQuarter).val();
        const year = $(classObject).find(classObject.selectors.filterYear).val();
        const subjectName = $(classObject).find(classObject.selectors.filterSubject).val();
        const markComparison = $(classObject).find(classObject.selectors.filterComparison).val();
        const markValue = Number($(classObject).find(classObject.selectors.filterValue).val().trim());

        classObject.markEntryAppliedFilters = {
            studentBranchOfStudy: branchOfStudy || "",
            result: result || "",
            quarter: this.currentMarkQuarter,
            subjectName: subjectName || "",
            markComparison: markComparison || "",
            markValue: markValue || null,
            search: $(classObject).find(classObject.selectors.filterSearch).val().trim() || "",
            searchColumn: "Fullname"
        };
        classObject.markEntryDataTable.page.len(50).draw(true);
    }
    handlerResetMarkFilter(event) {
        const classObject = event.data.classObject;
        $(classObject).find(classObject.selectors.filterBranch).val("");
        $(classObject).find(classObject.selectors.filterResult).val("");
        $(classObject).find(classObject.selectors.filterQuarter).val("");
        $(classObject).find(classObject.selectors.filterYear).val("");
        $(classObject).find(classObject.selectors.filterSubject).val("");
        $(classObject).find(classObject.selectors.filterComparison).val("");
        $(classObject).find(classObject.selectors.filterValue).val("");
        $(classObject).find(classObject.selectors.filterSearch).val("");


        classObject.markEntryAppliedFilters = {
            studentBranchOfStudy: "",
            result: "",
            quarter: null,
            subjectName: "",
            markComparison: "",
            markValue: null,
            search: "",
            searchColumn: "Fullname"

        };
        classObject.markEntryDataTable.page.len(50).draw(true);
    }
    getStudentListForMarkEntry(requestData) {

        const studentRequest = {

            draw: requestData.draw,
            length: 50,
            start: requestData.start,

            filter: {
                gender: "",
                residingStatusFlag: "",
                activeFlag: "A",
                branchOfStudy: this.markEntryAppliedFilters.studentBranchOfStudy || ""
            },

            order: {
                column: "",
                type: ""
            },

            search: this.markEntryAppliedFilters.search || "",

            searchColumn: this.markEntryAppliedFilters.search ? "Fullname" : ""

        };

        console.log("Student API Request:", studentRequest);

        return $.ajax({

            url: "https://dev-api.humhealth.com/StudentManagementSystemAPI/student/list",

            type: "POST",

            dataType: "json",

            contentType: "application/json",

            data: JSON.stringify(studentRequest)

        });

    }
    getMarkListForMarkEntry(requestData) {

        const markRequest = this.markEntryFormatRequestData(requestData);

        markRequest.length = 50;

        return $.ajax({
            url: "https://dev-api.humhealth.com/StudentManagementSystemAPI/mark/list",
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(markRequest)
        });

    }
    getCurrentMarkQuarter() {

        const currentDate = new Date();

        const currentMonth = currentDate.getMonth() + 1;

        const currentYear = currentDate.getFullYear();

        const quarter = "Q" + Math.ceil(currentMonth / 3);

        return quarter + "-" + currentYear;

    }

    // handlerTableInputMarkEdit(event){
    //   const classObject =event.data.classObject;

    //   $(classObject).find(classObject.selectors.tableInTamil).removeAttr("disabled").removeClass("hum-edit-in").addClass("hum-nor-edit-in");
    //   $(classObject).find(classObject.selectors.tableInEnglish).removeAttr("disabled").removeClass("hum-edit-in").addClass("hum-nor-edit-in");
    //   $(classObject).find(classObject.selectors.tableInMaths).removeAttr("disabled").removeClass("hum-edit-in").addClass("hum-nor-edit-in");
    //   $(classObject).find(classObject.selectors.tableInScience).removeAttr("disabled").removeClass("hum-edit-in").addClass("hum-nor-edit-in");
    //   $(classObject).find(classObject.selectors.tableInSocial).removeAttr("disabled").removeClass("hum-edit-in").addClass("hum-nor-edit-in");
    //   $(classObject).find(classObject.selectors.tableSaveButton).removeClass("d-none")
    //   $(classObject).find(classObject.selectors.tableCancelButton).removeClass("d-none")

    // }
    handlerTableInputMarkEdit(event) {

        const classObject = event.data.classObject;

        const tableRows = $(classObject)
            .find("#hum_mark_table_body > tr");


        if (!classObject.isTableMarkEditing) {

            classObject.tableMarkOriginalData = {};

            tableRows.each(function () {

                const row = $(this);

                const markId = row.attr("mark-id") || null;

                classObject.tableMarkOriginalData[markId] = {

                    tamil: row.find(classObject.selectors.tableInTamil).val(),

                    english: row.find(classObject.selectors.tableInEnglish).val(),

                    maths: row.find(classObject.selectors.tableInMaths).val(),

                    science: row.find(classObject.selectors.tableInScience).val(),

                    socialScience: row.find(classObject.selectors.tableInSocial).val()

                };

            });

            classObject.isTableMarkEditing = true;

        }

        tableRows.find(
            "input.hum_edit_tamil, input.hum_edit_english, input.hum_edit_maths, input.hum_edit_science, input.hum_edit_social"
        )
            .removeAttr("disabled")
            .removeClass("hum-edit-in")
            .addClass("hum-nor-edit-in");

        $(classObject).find(classObject.selectors.tableSaveButton)
            .removeClass("d-none")
            .prop("disabled", false);

        $(classObject).find(classObject.selectors.tableCancelButton)
            .removeClass("d-none");

    }
    handlerSaveTableMarkEdit(event) {

        const classObject = event.data.classObject;

        const tableRows = $(classObject)
            .find(classObject.selectors.markTableBody)
            .find("tr.mark-changed");

        const requestData = [];

        if (tableRows.length === 0) {

            toastr.warning("No student records available.");

            return;

        }

        let isValid = true;

        tableRows.each(function () {

            const row = $(this);

            const markId = row.attr("mark-id") || null;

            const studentId = row.attr("student-id");

            const quarter = row.attr("quarter");

            const tamil = row.find(classObject.selectors.tableInTamil).val();

            const english = row.find(classObject.selectors.tableInEnglish).val();

            const maths = row.find(classObject.selectors.tableInMaths).val();

            const science = row.find(classObject.selectors.tableInScience).val();

            const socialScience = row.find(classObject.selectors.tableInSocial).val();

            if (!studentId || !quarter) {

                toastr.error("Student ID or Quarter is missing.");

                isValid = false;

                return false;

            }

            const marks = [
                tamil,
                english,
                maths,
                science,
                socialScience
            ];

            if (marks.some(mark => mark === " " || mark === null || !Number.isFinite(Number(mark)) || Number(mark) < 0 || Number(mark) > 100)) {

                toastr.warning("Please check all subject marks. Marks must be between 0 and 100.");

                isValid = false;

                return false;

            }

            requestData.push({

                markId: markId,

                studentId: studentId,

                quarter: quarter,

                tamilMark: tamil,

                englishMark: english,

                mathsMark: maths,

                scienceMark: science,

                socialScienceMark: socialScience,

                teacherId: 1

            });

        });

        if (!isValid) {
            return;
        }

        const saveButton = $(classObject).find(classObject.selectors.tableSaveButton);

        saveButton.prop("disabled", true);

        $.ajax({

            url: "https://dev-api.humhealth.com/StudentManagementSystemAPI/mark/saveOrUpdate",

            type: "POST",

            dataType: "json",

            contentType: "application/json",

            data: JSON.stringify(requestData),

            success: function (response) {

                if (response.successCount === requestData.length &&
                    response.failureCount === 0) {

                    toastr.success("All displayed student marks saved successfully.");

                    classObject.tableMarkOriginalData = {};

                    classObject.isTableMarkEditing = false;

                    $(classObject).find(classObject.selectors.tableSaveButton)
                        .addClass("d-none");

                    $(classObject).find(classObject.selectors.tableCancelButton)
                        .addClass("d-none");

                    classObject.markEntryDataTable.ajax.reload(null, false);

                } else {
                    toastr.warning((response.successCount || 0) + " records saved. " + (response.failureCount || 0) + " records failed.");
                }

            },
            error: function (xhr) {
                console.error("Bulk Mark Save Error:", xhr.responseText);
                toastr.error("Unable to save student marks.");
            },

            complete: function () {
                saveButton.prop("disabled", false);
            }

        });

    }
    handlerCancelTableMarkEdit(event) {

    event.preventDefault();

    const classObject = event.data.classObject;
    const cancelButton = event.currentTarget;

    classObject.initializePopOver(cancelButton, function () {

        classObject.cancelTableMarkEdit();

    });

}
  cancelTableMarkEdit() {

    const classObject = this;

    const tableRows = $(classObject)
        .find(classObject.selectors.markTableBody)
        .find("tr");

    tableRows.each(function () {

        const row = $(this);

        const markId = row.attr("mark-id");

        const original = classObject.tableMarkOriginalData[markId];

        if (!original) {
            return;
        }

        row.find(classObject.selectors.tableInTamil).val(original.tamil);

        row.find(classObject.selectors.tableInEnglish).val(original.english);

        row.find(classObject.selectors.tableInMaths).val(original.maths);

        row.find(classObject.selectors.tableInScience).val(original.science);

        row.find(classObject.selectors.tableInSocial).val(original.socialScience);

    });

    tableRows.find("input.hum-nor-edit-in")
        .prop("disabled", true)
        .removeClass("hum-nor-edit-in")
        .addClass("hum-edit-in");

    classObject.tableMarkOriginalData = {};

    classObject.isTableMarkEditing = false;

    $(classObject).find(classObject.selectors.tableSaveButton)
        .addClass("d-none")
        .prop("disabled", false);

    $(classObject).find(classObject.selectors.tableCancelButton)
        .addClass("d-none");

    toastr.info("Mark editing cancelled.");

}

    handlerGetBulkStudentList() {

        const classObject = this;

        $.ajax({

            url: "https://dev-api.humhealth.com/StudentManagementSystemAPI/student/list",

            type: "POST",

            dataType: "json",

            contentType: "application/json",

            data: JSON.stringify({

                draw: 1,
                length: 50,
                start: 0,

                filter: {
                    gender: "",
                    residingStatusFlag: "",
                    activeFlag: "A",
                    branchOfStudy: ""
                },

                order: {
                    column: "",
                    type: ""
                },

                search: "",
                searchColumn: "Fullname"

            }),

            success: function (response) {

                if (response.status === "Success") {

                    let options = `<option value="">Select Student</option>`;

                    for (let student of response.data) {

                        const fullName = [
                            student.firstName,
                            student.middleName,
                            student.lastName
                        ].filter(Boolean).join(" ");

                        options += `
                        <option value="${student.studentId}">
                            ${fullName}
                        </option>
                    `;
                    }

                    $(classObject.selectors.bulkStudent).html(options);

                }
                else {

                    toastr.error("Unable to load students.");

                }

            },

            error: function () {

                toastr.error("Student list API failed.");

            }

        });

    }




    handlerGetMarkDetails(markId) {

        const classObject = this;

        $.ajax({

            url: "https://dev-api.humhealth.com/StudentManagementSystemAPI/mark/" + markId,

            type: "GET",

            dataType: "json",

            success: function (response) {

                if (response.status === "Success") {

                    const mark = response.data;

                    classObject.handlerDisplayEditMark(mark);

                }
                else {

                    toastr.error("Unable to fetch student mark details.");

                }

            },

            error: function () {

                toastr.error("Get mark details API failed.");

            }

        });

    }
    handlerViewMark(event) {

        const classObject = event.data.classObject;

        // Get Mark ID from button attribute
        const markId = $(event.currentTarget).attr("data-mark-id");

        if (!markId) {

            toastr.warning("Mark ID is missing.");

            return;
        }

        // Clear previous details
        $(classObject.selectors.detailsStudentName).text("");

        $(classObject.selectors.detailsBranch).text("");

        $(classObject.selectors.detailsMarkId).text("");

        $(classObject.selectors.detailsStudentId).text("");

        $(classObject.selectors.detailsQuarter).text("");

        $(classObject.selectors.detailsTamil).text("");

        $(classObject.selectors.detailsEnglish).text("");

        $(classObject.selectors.detailsMaths).text("");

        $(classObject.selectors.detailsScience).text("");

        $(classObject.selectors.detailsSocialScience).text("");

        $(classObject.selectors.detailsTotal).text("");

        $(classObject.selectors.detailsCompliance).text("");

        $(classObject.selectors.detailsResult).text("");

        // Open View Modal
        $(classObject).find(classObject.selectors.viewDetailsModal).modal("show");

        // Fetch Mark Details
        classObject.handlerGetViewMarkDetails(markId);

    }
    handlerGetViewMarkDetails(markId) {

        const classObject = this;

        $.ajax({

            url: "https://dev-api.humhealth.com/StudentManagementSystemAPI/mark/" + markId,

            type: "GET",

            dataType: "json",

            success: function (response) {

                if (response.status === "Success") {

                    classObject.handlerDisplayViewMarkDetails(response.data);

                }
                else {

                    toastr.error("Unable to fetch student mark details.");

                }

            },

            error: function () {

                toastr.error("Get mark details API failed.");

            }

        });

    }
    handlerDisplayViewMarkDetails(mark) {

        const classObject = this;

        // Student Full Name
        const fullName = [
            mark.studentFirstName,
            mark.studentMiddleName,
            mark.studentLastName
        ].filter(Boolean).join(" ");

        // Branch Name
        let branchOfStudy = "";

        switch (mark.studentBranchOfStudy) {

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
                branchOfStudy = mark.studentBranchOfStudy || "-";
                break;

        }

        // Compliance Status
        let complianceStatus = "";

        switch (mark.complianceStatusFlag) {

            case "Y":
                complianceStatus = "Compliant";
                break;

            case "N":
                complianceStatus = "Not Compliant";
                break;

            default:
                complianceStatus = "-";
                break;

        }

        // Student Profile
        $(classObject.selectors.detailsAvatar).text(
            fullName ? fullName.charAt(0).toUpperCase() : "-"
        );

        $(classObject.selectors.detailsStudentName).text(fullName || "-");

        $(classObject.selectors.detailsBranch).text(branchOfStudy);

        // Student Information

        $(classObject.selectors.detailsQuarter).text(mark.quarter || "-");

        // Subject Marks
        $(classObject.selectors.detailsTamil).text(mark.tamilMark ?? "-");

        $(classObject.selectors.detailsEnglish).text(mark.englishMark ?? "-");

        $(classObject.selectors.detailsMaths).text(mark.mathsMark ?? "-");

        $(classObject.selectors.detailsScience).text(mark.scienceMark ?? "-");

        $(classObject.selectors.detailsSocialScience).text(mark.socialScienceMark ?? "-");

        // Total Marks
        $(classObject.selectors.detailsTotal).text(mark.totalMark ?? "-");

        // Compliance
        $(classObject.selectors.detailsCompliance).html(this.forCompliance(complianceStatus));

        // Result
        $(classObject.selectors.detailsResult).html(this.forResult(mark.result) || "-");

    }
    handlerDownloadMarkId(event) {

        const classObject = event.data.classObject;

        const markId = $(event.currentTarget).attr("data-mark-id");
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to Download a Student Mark?",

            height: "300px",
            padding: "1rem",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            reverseButtons: true,
            customClass: {
                popup: "small-swal-popup",
                title: "small-swal-title",
                htmlContainer: "small-swal-text",
                confirmButton: "btn btn-sm btn-primary",
                cancelButton: "btn btn-sm btn-secondary"
            },
            buttonsStyling: false
        }).then((result) => {
            if (result.isConfirmed) {
                classObject.downloadMarkReport(markId);
            }
        });



    }
    downloadMarkReport(markId) {

        if (!markId) {
            toastr.error("Mark ID is missing");
            return;
        }

        $.ajax({
            url: "https://dev-api.humhealth.com/StudentManagementSystemAPI/mark/Report/" + markId,
            type: "GET",
            xhrFields: {
                responseType: "blob"
            },

            success: function (response) {

                const blob = new Blob(
                    [response],
                    { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }
                );

                const downloadUrl = window.URL.createObjectURL(blob);

                const downloadLink = document.createElement("a");
                downloadLink.href = downloadUrl;
                downloadLink.download = "Student_Marks_Report_" + markId + ".xlsx";

                document.body.appendChild(downloadLink);
                downloadLink.click();

                document.body.removeChild(downloadLink);
                window.URL.revokeObjectURL(downloadUrl);

                toastr.success("Marks report downloaded successfully");
            },

            error: function (xhr) {
                console.error("Download Error:", xhr.responseText);
                toastr.error("Unable to download marks report");
            }
        });
    }
    handlerOpenEmailMarkModal(event) {

        const classObject = event.data.classObject;

        const markId = $(event.currentTarget).attr("data-mark-id");
        const studentName = $(event.currentTarget).attr("data-student-name");
        const branch = $(event.currentTarget).attr("data-branch");

        if (!markId) {
            toastr.error("Mark ID is missing");
            return;
        }

        classObject.emailMarkId = markId;

        // Set student information
        $(classObject).find(classObject.selectors.emailStudentName)
            .text(studentName || "Student");

        $(classObject).find(classObject.selectors.emailStudentBranch)
            .text(branch || "");

        // Set avatar initial
        const initial = studentName ? studentName.trim().charAt(0).toUpperCase() : "S";

        $(classObject).find(classObject.selectors.emailAvatar)
            .text(initial);

        // Enable send button
        $(classObject).find(classObject.selectors.emailSendButton)
            .prop("disabled", false)
            .html('<i class="fa-solid fa-envelope me-2"></i>Send Report via Email');

        // Open modal
        $(classObject).find(classObject.selectors.emailModal).modal("show");

    }
    handlerSendMarkReportEmail(event) {

        const classObject = event.data.classObject;

        const markId = classObject.emailMarkId;

        if (!markId) {
            toastr.error("Mark ID is missing");
            return;
        }

        const sendButton = $(classObject).find(classObject.selectors.emailSendButton);

        sendButton.prop("disabled", true)
            .html('<i class="fa-solid fa-spinner fa-spin me-2"></i>Sending...');

        $.ajax({

            url: "https://dev-api.humhealth.com/StudentManagementSystemAPI/mark/mail/" + markId,
            type: "POST",

            success: function (response) {

                toastr.success("Marks report email sent successfully");

                $(classObject).find(classObject.selectors.emailModal)
                    .modal("hide");

                classObject.emailMarkId = null;

            },

            error: function (xhr) {

                console.error("Email Error:", xhr.responseText);

                toastr.error("Unable to send marks report email");

            },

            complete: function () {

                sendButton.prop("disabled", false)
                    .html('<i class="fa-solid fa-envelope me-2"></i>Send Report via Email');

            }

        });

    }
    handlerDownloadStudentMarkReport(event) {

        const classObject = event.data.classObject;

        const studentId = $(event.currentTarget).attr("data-student-id");

        const quarter = $(event.currentTarget).attr("data-quarter");

        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to Download a Student Mark Report?",

            height: "300px",
            padding: "1rem",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            reverseButtons: true,
            customClass: {
                popup: "small-swal-popup",
                title: "small-swal-title",
                htmlContainer: "small-swal-text",
                confirmButton: "btn btn-sm btn-primary",
                cancelButton: "btn btn-sm btn-secondary"
            },
            buttonsStyling: false
        }).then((result) => {
            if (result.isConfirmed) {
                classObject.downloadStudentMarkReport(studentId, quarter);
            }
        });

    }
    downloadStudentMarkReport(studentId, quarter) {

        if (!studentId || !quarter) {
            toastr.error("Student ID or Quarter is missing");
            return;
        }

        $.ajax({
            url: `https://dev-api.humhealth.com/StudentManagementSystemAPI/mark/student/report?studentId=${studentId}&quarter=${quarter}`,
            type: "GET",
            xhrFields: {
                responseType: "blob"
            },
            success: function (response) {
                const blob = new Blob([response], {
                    type: "application/pdf"
                });

                const downloadUrl = window.URL.createObjectURL(blob);

                const downloadLink = document.createElement("a");
                downloadLink.href = downloadUrl;
                downloadLink.download = "Student_Marks_Report_" + studentId + "_" + quarter + ".pdf";

                document.body.appendChild(downloadLink);
                downloadLink.click();

                document.body.removeChild(downloadLink);
                window.URL.revokeObjectURL(downloadUrl);

                toastr.success("Student marks PDF downloaded successfully");

            },
            error: function (xhr) {
                console.error("Student Report Download Error:", xhr.responseText);
                toastr.error("Unable to download student marks report");
            }

        });

    }
    handlerOpenTopperModal(event) {

        const classObject = event.data.classObject;

        // Reset filters
        $(classObject).find(classObject.selectors.topperQuarter).val("");
        $(classObject).find(classObject.selectors.topperYear).val("");
        $(classObject).find(classObject.selectors.topperBranch).val("");

        // Hide previous result and message
        $(classObject).find(classObject.selectors.topperResult)
            .removeClass("d-block")
            .addClass("d-none");

        $(classObject).find(classObject.selectors.topperMessage)
            .removeClass("d-block")
            .addClass("d-none")
            .text("");

        // Open modal
        $(classObject).find(classObject.selectors.topperModal).modal("show");

    }
    handlerGetQuarterTopper(event) {

        const classObject = event.data.classObject;

        const quarter = $(classObject).find(classObject.selectors.topperQuarter).val();
        const year = $(classObject).find(classObject.selectors.topperYear).val();
        const branch = $(classObject).find(classObject.selectors.topperBranch).val();

        if (!quarter || !year) {
            toastr.error("Please select Quarter and Year");
            return;
        }

        const selectedQuarter = quarter + "-" + year;

        // Hide previous result
        $(classObject).find(classObject.selectors.topperResult)
            .removeClass("d-block")
            .addClass("d-none");

        $(classObject).find(classObject.selectors.topperMessage)
            .removeClass("d-block")
            .addClass("d-none")
            .text("");

        const params = new URLSearchParams();

        params.append("quarter", selectedQuarter);

        if (branch) {
            params.append("branch", branch);
        }

        const searchButton = $(classObject).find(classObject.selectors.topperSearchButton);

        searchButton.prop("disabled", true)
            .html('<i class="fa-solid fa-spinner fa-spin me-1"></i> Loading...');

        $.ajax({

            url: `https://dev-api.humhealth.com/StudentManagementSystemAPI/mark/topper?${params.toString()}`,

            type: "POST",

            success: function (response) {

                if (response.status === "Success" && response.data) {

                    classObject.handlerDisplayQuarterTopper(response.data);

                } else {

                    classObject.handlerDisplayTopperMessage(
                        "No topper details found for the selected filters."
                    );

                }

            },

            error: function (xhr) {

                console.error("Topper API Error:", xhr.responseText);

                classObject.handlerDisplayTopperMessage(
                    "Unable to retrieve topper details."
                );

            },

            complete: function () {

                searchButton.prop("disabled", false)
                    .html('<i class="fa-solid fa-magnifying-glass me-1"></i> View Topper');

            }

        });

    }
    handlerDisplayQuarterTopper(data) {

        const classObject = this;

        const fullName = [
            data.studentFirstName,
            data.studentMiddleName,
            data.studentLastName
        ].filter(Boolean).join(" ");

        let branch = data.studentBranchOfStudy;

        switch (branch) {

            case "CSCI":
                branch = "Computer Science";
                break;

            case "BIOL":
                branch = "Biology";
                break;

            case "COMM":
                branch = "Commerce";
                break;

            case "ZOOL":
                branch = "Zoology";
                break;

            case "ARTS":
                branch = "Arts";
                break;

            default:
                branch = data.studentBranchOfStudy || "-";
                break;

        }

        let complianceStatus = data.complianceStatusFlag;

        switch (complianceStatus) {

            case "Y":
                complianceStatus = "Compliant";
                break;

            case "N":
                complianceStatus = "Not Compliant";
                break;

            default:
                complianceStatus = "-";
                break;

        }

        // Student information
        $(classObject).find(classObject.selectors.topperAvatar)
            .text(fullName ? fullName.charAt(0).toUpperCase() : "S");

        $(classObject).find(classObject.selectors.topperStudentName)
            .text(fullName || "-");

        $(classObject).find(classObject.selectors.topperStudentId)
            .text(data.studentId || "-");

        $(classObject).find(classObject.selectors.topperStudentBranch)
            .text(branch);

        // Total and result
        $(classObject).find(classObject.selectors.topperTotal)
            .text(data.totalMark ?? "-");

        $(classObject).find(classObject.selectors.topperStatus)
            .text(data.result || complianceStatus);

        // Subject marks
        $(classObject).find(classObject.selectors.topperTamil)
            .text(data.tamilMark ?? "-");

        $(classObject).find(classObject.selectors.topperEnglish)
            .text(data.englishMark ?? "-");

        $(classObject).find(classObject.selectors.topperMaths)
            .text(data.mathsMark ?? "-");

        $(classObject).find(classObject.selectors.topperScience)
            .text(data.scienceMark ?? "-");

        $(classObject).find(classObject.selectors.topperSocialScience)
            .text(data.socialScienceMark ?? "-");

        // Hide message
        $(classObject).find(classObject.selectors.topperMessage)
            .removeClass("d-block")
            .addClass("d-none")
            .text("");

        // Show topper details
        $(classObject).find(classObject.selectors.topperResult)
            .removeClass("d-none")
            .addClass("d-block");

    }
    handlerDisplayTopperMessage(message) {

        const classObject = this;

        // Hide topper details
        $(classObject).find(classObject.selectors.topperResult)
            .removeClass("d-block")
            .addClass("d-none");

        // Show message
        $(classObject).find(classObject.selectors.topperMessage)
            .removeClass("d-none")
            .addClass("d-block")
            .text(message);

    }
    handlerOpenDownloadExcelModal(event) {

        const classObject = event.data.classObject;

        // Reset filters
        $(classObject).find(classObject.selectors.downloadExcelQuarter).val("");
        $(classObject).find(classObject.selectors.downloadExcelYear).val("");
        $(classObject).find(classObject.selectors.downloadExcelBranch).val("");

        // Reset preview
        $(classObject).find(classObject.selectors.downloadExcelPreviewQuarter)
            .text("Select a quarter and year to continue.");

        $(classObject).find(classObject.selectors.downloadExcelPreviewBranch)
            .text("All Branches");

        // Enable download button
        $(classObject).find(classObject.selectors.downloadExcelConfirmButton)
            .prop("disabled", false)
            .html('<i class="fa-solid fa-download me-1"></i> Download Excel Report');

        // Open modal
        $(classObject).find(classObject.selectors.downloadExcelModal).modal("show");

    }
    handlerUpdateDownloadExcelPreview(event) {

        const classObject = event.data.classObject;

        const quarter = $(classObject).find(classObject.selectors.downloadExcelQuarter).val();
        const year = $(classObject).find(classObject.selectors.downloadExcelYear).val();
        const branch = $(classObject).find(classObject.selectors.downloadExcelBranch).val();

        if (quarter && year) {

            $(classObject).find(classObject.selectors.downloadExcelPreviewQuarter)
                .text("Quarter: " + quarter + "-" + year);

        } else {

            $(classObject).find(classObject.selectors.downloadExcelPreviewQuarter)
                .text("Select a quarter and year to continue.");

        }

        const branchText = branch
            ? $(classObject).find(classObject.selectors.downloadExcelBranch + " option:selected").text()
            : "All Branches";

        $(classObject).find(classObject.selectors.downloadExcelPreviewBranch)
            .text(branchText);

    }
    handlerConfirmDownloadExcel(event) {

        const classObject = event.data.classObject;

        const quarter = $(classObject).find(classObject.selectors.downloadExcelQuarter).val();
        const year = $(classObject).find(classObject.selectors.downloadExcelYear).val();
        const branch = $(classObject).find(classObject.selectors.downloadExcelBranch).val();

        if (!quarter || !year) {
            toastr.error("Please select Quarter and Year");
            return;
        }

        const selectedQuarter = quarter + "-" + year;

        classObject.downloadQuarterMarksExcel(selectedQuarter, branch);

    }
    downloadQuarterMarksExcel(quarter, branch) {

        if (!quarter) {
            toastr.error("Quarter is required");
            return;
        }

        const classObject = this;

        const params = new URLSearchParams();

        params.append("quarter", quarter);

        if (branch) {
            params.append("branch", branch);
        }

        const downloadButton = $(classObject).find(classObject.selectors.downloadExcelConfirmButton);

        downloadButton.prop("disabled", true)
            .html('<i class="fa-solid fa-spinner fa-spin me-1"></i> Downloading...');

        $.ajax({

            url: `https://dev-api.humhealth.com/StudentManagementSystemAPI/mark/Report?${params.toString()}`,

            type: "GET",

            xhrFields: {
                responseType: "blob"
            },

            success: function (response) {

                const blob = new Blob([response], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                });

                const downloadUrl = window.URL.createObjectURL(blob);

                const downloadLink = document.createElement("a");

                downloadLink.href = downloadUrl;

                downloadLink.download = "Quarterly_Marks_Report_" + quarter +
                    (branch ? "_" + branch : "") + ".xlsx";

                document.body.appendChild(downloadLink);

                downloadLink.click();

                document.body.removeChild(downloadLink);

                window.URL.revokeObjectURL(downloadUrl);

                toastr.success("Quarterly marks Excel report downloaded successfully");

                $(classObject).find(classObject.selectors.downloadExcelModal)
                    .modal("hide");

            },

            error: function (xhr) {

                console.error("Download Excel Error:", xhr.responseText);

                toastr.error("Unable to download quarterly marks report");

            },

            complete: function () {

                downloadButton.prop("disabled", false)
                    .html('<i class="fa-solid fa-download me-1"></i> Download Excel Report');

            }

        });

    }
    handlerOpenViewStudentQuarterModal(event) {

        const classObject = event.data.classObject;

        // Reset filters
        $(classObject).find(classObject.selectors.viewStudentSelect).val("");
        $(classObject).find(classObject.selectors.viewStudentQuarter).val("");
        $(classObject).find(classObject.selectors.viewStudentYear).val("");

        // Hide previous result
        $(classObject).find(classObject.selectors.viewStudentResult)
            .removeClass("d-block")
            .addClass("d-none");

        // Hide previous message
        $(classObject).find(classObject.selectors.viewStudentMessage)
            .removeClass("d-block")
            .addClass("d-none")
            .text("");

        // Open modal
        $(classObject).find(classObject.selectors.viewStudentQuarterModal)
            .modal("show");

        // Load student list
        classObject.handlerGetViewStudentList();

    }
    handlerGetViewStudentList() {

        const classObject = this;

        const studentSelect = $(classObject).find(
            classObject.selectors.viewStudentSelect
        );

        studentSelect.html('<option value="">Loading Students...</option>');

        $.ajax({

            url: "https://dev-api.humhealth.com/StudentManagementSystemAPI/student/list",

            type: "POST",

            contentType: "application/json",

            data: JSON.stringify({
                draw: 1,
                length: 10,
                start: 0,
                filter: {
                    gender: "",
                    residingStatusFlag: "",
                    activeFlag: "",
                    branchOfStudy: ""
                },
                order: {
                    column: "",
                    type: ""
                },
                search: "",
                searchColumn: ""
            }),

            success: function (response) {

                studentSelect.empty();

                studentSelect.append(
                    '<option value="">Select Student</option>'
                );

                if (response.status === "Success" && response.data) {

                    response.data.forEach(function (student) {

                        const fullName = [
                            student.firstName,
                            student.lastName
                        ].filter(Boolean).join(" ");

                        studentSelect.append(
                            $("<option>", {
                                value: student.studentId,
                                text: fullName
                            })
                        );

                    });

                } else {

                    studentSelect.html(
                        '<option value="">No Students Found</option>'
                    );

                }

            },

            error: function (xhr) {

                console.error("Student List Error:", xhr.responseText);

                studentSelect.html(
                    '<option value="">Unable to Load Students</option>'
                );

                toastr.error("Unable to load student list");

            }

        });

    }
    handlerGetStudentQuarterMarks(event) {

        const classObject = event.data.classObject;

        const studentId = $(classObject).find(
            classObject.selectors.viewStudentSelect
        ).val();

        const quarter = $(classObject).find(
            classObject.selectors.viewStudentQuarter
        ).val();

        const year = $(classObject).find(
            classObject.selectors.viewStudentYear
        ).val();

        if (!studentId || !quarter || !year) {
            toastr.error("Please select Student, Quarter and Year");
            return;
        }

        const selectedQuarter = quarter + "-" + year;

        // Hide previous result and message
        $(classObject).find(classObject.selectors.viewStudentResult)
            .removeClass("d-block")
            .addClass("d-none");

        $(classObject).find(classObject.selectors.viewStudentMessage)
            .removeClass("d-block")
            .addClass("d-none")
            .text("");

        const params = new URLSearchParams();

        params.append("studentId", studentId);
        params.append("quarter", selectedQuarter);

        const searchButton = $(classObject).find(
            classObject.selectors.viewStudentSearchButton
        );

        searchButton.prop("disabled", true)
            .html('<i class="fa-solid fa-spinner fa-spin me-1"></i> Loading...');

        $.ajax({

            url: `https://dev-api.humhealth.com/StudentManagementSystemAPI/mark/byStudent?${params.toString()}`,

            type: "POST",

            success: function (response) {

                if (response.status === "Success" && response.data) {

                    classObject.handlerDisplayStudentQuarterMarks(response.data);

                } else {

                    classObject.handlerDisplayStudentQuarterMessage(
                        "No marks found for the selected student and quarter."
                    );

                }

            },

            error: function (xhr) {

                console.error("Student Quarter Marks Error:", xhr.responseText);

                classObject.handlerDisplayStudentQuarterMessage(
                    "Unable to retrieve student marks."
                );

            },

            complete: function () {

                searchButton.prop("disabled", false)
                    .html('<i class="fa-solid fa-magnifying-glass me-1"></i> View Marks');

            }

        });

    }
    handlerDisplayStudentQuarterMarks(data) {

        const classObject = this;

        const fullName = [
            data.studentFirstName,
            data.studentMiddleName,
            data.studentLastName
        ].filter(Boolean).join(" ");

        let branch = data.studentBranchOfStudy;

        switch (branch) {

            case "CSCI":
                branch = "Computer Science";
                break;

            case "BIOL":
                branch = "Biology";
                break;

            case "COMM":
                branch = "Commerce";
                break;

            case "ZOOL":
                branch = "Zoology";
                break;

            case "ARTS":
                branch = "Arts";
                break;

            default:
                branch = data.studentBranchOfStudy || "-";
                break;

        }

        let compliance = data.complianceStatusFlag;

        switch (compliance) {

            case "Y":
                compliance = "Compliant";
                break;

            case "N":
                compliance = "Not Compliant";
                break;

            default:
                compliance = "-";
                break;

        }

        // Student information
        $(classObject).find(classObject.selectors.viewStudentAvatar)
            .text(fullName ? fullName.charAt(0).toUpperCase() : "S");

        $(classObject).find(classObject.selectors.viewStudentName)
            .text(fullName || "-");

        $(classObject).find(classObject.selectors.viewStudentId)
            .text(data.studentId ?? "-");

        $(classObject).find(classObject.selectors.viewStudentBranch)
            .text(branch);

        $(classObject).find(classObject.selectors.viewStudentResultQuarter)
            .text(data.quarter || "-");

        // Total marks
        $(classObject).find(classObject.selectors.viewStudentTotal)
            .text(data.totalMark ?? "-");

        // Subject marks
        $(classObject).find(classObject.selectors.viewStudentTamil)
            .text(data.tamilMark ?? "-");

        $(classObject).find(classObject.selectors.viewStudentEnglish)
            .text(data.englishMark ?? "-");

        $(classObject).find(classObject.selectors.viewStudentMaths)
            .text(data.mathsMark ?? "-");

        $(classObject).find(classObject.selectors.viewStudentScience)
            .text(data.scienceMark ?? "-");

        $(classObject).find(classObject.selectors.viewStudentSocialScience)
            .text(data.socialScienceMark ?? "-");

        // Compliance and result
        $(classObject).find(classObject.selectors.viewStudentCompliance)
            .text(compliance);

        $(classObject).find(classObject.selectors.viewStudentStatus)
            .text(data.result || "-");

        // Hide message
        $(classObject).find(classObject.selectors.viewStudentMessage)
            .removeClass("d-block")
            .addClass("d-none")
            .text("");

        // Show student marks
        $(classObject).find(classObject.selectors.viewStudentResult)
            .removeClass("d-none")
            .addClass("d-block");

    }
    handlerDisplayStudentQuarterMessage(message) {

        const classObject = this;

        // Hide student result
        $(classObject).find(classObject.selectors.viewStudentResult)
            .removeClass("d-block")
            .addClass("d-none");

        // Show message
        $(classObject).find(classObject.selectors.viewStudentMessage)
            .removeClass("d-none")
            .addClass("d-block")
            .text(message);

    }

    initializeToolTip() {

        new bootstrap.Tooltip(this, {
            selector: '[data-bs-toggle="tooltip"]',
            container: 'body',
            trigger: 'hover focus'
        });

    }
    initializePopOver(button, onConfirm) {

    if (this.activeCancelConfirmation) {
        this.activeCancelConfirmation.dispose();
        this.activeCancelConfirmation = null;
    }

    const popover = new bootstrap.Popover(button, {
        trigger: "manual",
        placement: "top",
        html: true,
        sanitize: false,
        container: "body",
        customClass: "hum-cancel-popover",

        content: `
            <div class="hum-cancel-confirm-content">
                <p>Are you sure you want to cancel editing?</p>

                <div class="hum-cancel-confirm-actions">
                    <button type="button" class="hum-confirm-no">
                        No
                    </button>

                    <button type="button" class="hum-confirm-yes">
                        Yes
                    </button>
                </div>
            </div>
        `
    });

    this.activeCancelConfirmation = popover;

    button.addEventListener("shown.bs.popover", function () {

        const popoverId = button.getAttribute("aria-describedby");
        const popoverElement = document.getElementById(popoverId);

        if (!popoverElement) return;

        popoverElement.querySelector(".hum-confirm-no")
            .addEventListener("click", function () {
                popover.dispose();
            });

        popoverElement.querySelector(".hum-confirm-yes")
            .addEventListener("click", function () {

                popover.dispose();

                if (typeof onConfirm === "function") {
                    onConfirm();
                }

            });

    }, { once: true });

    popover.show();
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

    markEntryFormatRequestData(requestData) {
        this.markEntryFilterRequest = {
            draw: requestData.draw,
            length: requestData.length,
            start: requestData.start,

            markFilter: {
                studentBranchOfStudy: this.markEntryAppliedFilters.studentBranchOfStudy,
                result: this.markEntryAppliedFilters.result,
                quarter: this.currentMarkQuarter,
                subjectName: this.markEntryAppliedFilters.subjectName,
                markComparison: this.markEntryAppliedFilters.markComparison,
                markValue: this.markEntryAppliedFilters.markValue
            },
            order: {
                column: "",
                type: ""
            },
            search: this.markEntryAppliedFilters.search,
            searchColumn: this.markEntryAppliedFilters.searchColumn ? "Fullname" : ""

        }
        return this.markEntryFilterRequest;
    }
    displayMarkEntryList(markResponse, studentResponse) {

        const markEntryDataArray = [];

        if (
            markResponse.status === "Success" &&
            studentResponse.status === "Success"
        ) {

            const markMap = {};

            // Map existing marks using studentId
            for (let mark of markResponse.data || []) {

                markMap[mark.studnetId] = mark;

            }

            let index = 1;

            const hasMarkFilter =
                this.markEntryAppliedFilters.result !== "" ||
                this.markEntryAppliedFilters.subjectName !== "" ||
                this.markEntryAppliedFilters.markComparison !== "";

            const studentsToDisplay = hasMarkFilter
                ? studentResponse.data.filter(student =>
                    markMap[student.studentId]
                )
                : studentResponse.data;

            for (let student of studentsToDisplay) {

                const data = {};

                // Find existing marks for this student
                const res = markMap[student.studentId] || {};

                // Branch conversion
                let branchOfStudy = student.branchOfStudy;

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

                // Compliance conversion
                let complianceStatusFlag = res.complianceStatusFlag;

                switch (complianceStatusFlag) {

                    case "Y":
                        complianceStatusFlag = "Compliant";
                        break;

                    case "N":
                        complianceStatusFlag = "Not Compliant";
                        break;

                    default:
                        complianceStatusFlag = "";
                        break;

                }

                // Student full name
                const fullName = [
                    student.firstName,
                    student.middleName,
                    student.lastName
                ].filter(Boolean).join(" ");

                // Student API details
                data["sno"] = student.sno || index++;
                data["name"] = fullName;
                data["branchOfStudy"] = branchOfStudy;

                // Quarter
                data["quarter"] = this.currentMarkQuarter;

                // Mark API details
                data["tamil"] = this.forTamil(res.tamilMark ?? "-");

                data["english"] = this.forEnglish(res.englishMark ?? "-");

                data["maths"] = this.forMaths(res.mathsMark ?? "-");

                data["science"] = this.forScience(res.scienceMark ?? "-");

                data["socialScience"] = this.forSocialScience(
                    res.socialScienceMark ?? "-"
                );

                data["total"] = res.totalMark ?? "-";

                data["complianceStatusFlag"] = res.markId
                    ? this.forCompliance(complianceStatusFlag)
                    : "-";

                data["result"] = res.markId
                    ? this.forResult(res.result)
                    : "-";

                // Action buttons only when marks already exist
                data["action"] = res.markId
                    ? `<div class="hum-mark-action-group">
                    ${this.forAction(
                        res.markId,
                        student.studentId,
                        this.currentMarkQuarter,
                        fullName,
                        branchOfStudy
                    )}
                   </div>`
                    : "-";

                // Row attributes
                data["markId"] = res.markId || null;

                data["studentId"] = student.studentId;

                markEntryDataArray.push(data);

            }

        }

        return markEntryDataArray;

    }

    forAction(markId, studentId, quarter, studentName, branch) {
        return `

        <!-- View Marks - API 6.3 -->
        <button type="button"
            class="btn btn-sm btn-outline-primary hum-mark-view-btn"
            data-mark-id="${markId}"
               data-bs-toggle="tooltip" 
            title="View Student Marks"
            tabindex="-1">
            <span class="material-symbols-outlined hum-icon-font">
                visibility
            </span>
        </button>

        <!-- Download by Mark ID - API 6.8 -->
        <button type="button"
            class="btn btn-sm btn-outline-success hum-mark-download-id-btn"
            data-mark-id="${markId}"
               data-bs-toggle="tooltip" 
            title="Download Marks Report"
            tabindex="-1">
            <span class="material-symbols-outlined hum-icon-font">
                download
            </span>
        </button>

        <!-- Email Report - API 6.9 -->
        <button type="button"
            class="btn btn-sm btn-outline-danger hum-mark-email-btn"
            data-mark-id="${markId}"
            data-student-name="${studentName}"
            data-branch="${branch}"
               data-bs-toggle="tooltip" 
            title="Email Marks Report"
            tabindex="-1">
            <span class="material-symbols-outlined hum-icon-font">
                mail
            </span>
        </button>

        <!-- Download Student Report - API 6.10 -->
        <button type="button"
            class="btn btn-sm btn-outline-primary hum-mark-student-report-btn"
            data-student-id="${studentId}"
            data-quarter="${quarter}"
               data-bs-toggle="tooltip" 
            title="Download Student Marks Report"
            tabindex="-1">
            <span class="material-symbols-outlined hum-icon-font text-align-center">
                description
            </span>
        </button>
    `;
    }
    forResult(Result) {
        if (Result === "Pass") {
            return `<span class="hum-mark-status-pass hum-mark-status ">Pass</span>`;
        }

        return `<span class="hum-mark-status-fail hum-mark-status ">Fail</span>`;
    }
    forCompliance(complianceStatusFlag) {
        if (complianceStatusFlag === "Compliant") {
            return `<span class="hum-mark-compliance-yes hum-mark-compliance">Compliant</span>`;
        }

        return `<span class="hum-mark-compliance-no hum-mark-compliance ">Not Compliant</span>`;
    }
    forTamil(tamil) {
        return `<input class="hum-edit-in hum_edit_tamil mark-input" disabled value=${tamil}>`
    }
    forEnglish(english) {
        return `<input class="hum-edit-in hum_edit_english mark-input"  disabled value=${english}>`
    }
    forMaths(maths) {
        return `<input class="hum-edit-in hum_edit_maths mark-input"  disabled value=${maths}>`
    }
    forScience(science) {
        return `<input class="hum-edit-in hum_edit_science mark-input"  disabled value=${science}>`
    }
    forSocialScience(social) {
        return `<input class="hum-edit-in hum_edit_social mark-input" disabled value=${social}>`
    }

    handlerYearOption() {

        const today = new Date();

        let curyear = today.getFullYear() + 1;
        let options = "";

        for (let i = 0; i < 7; i++) {
            options += `<option value="${curyear}">${curyear}</option>`;
            curyear -= 1;
        }

        $(this.selectors.filterYear).html(`<option value="">Select Year</option>${options}`);

        $(this.selectors.bulkYear).html(`<option value="">Select Year</option>${options}`);

        $(this).find(this.selectors.topperYear).html(`<option value="">Select Year</option>${options}`);

        $(this).find(this.selectors.downloadExcelYear).html(`<option value="">Select Year</option>${options}`);
        $(this).find(this.selectors.viewStudentYear).html(`<option value="">Select Year</option>${options}`);
    }
    getMarkEntryList() {
        if (this.markEntryDataTable) {

        }
        else {
            this.markEntryDataTable = $(this.selectors.markTable).DataTable(this.markEntryDataTableConfig);
        }
    }
}
customElements.define("hum-mark-entry-temp", HumMarkEntry);