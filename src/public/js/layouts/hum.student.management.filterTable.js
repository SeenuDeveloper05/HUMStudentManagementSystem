
class HumStudentManagementFiltertable extends HTMLElement {
    constructor() {
        super();
        const template = document.getElementById("hum_student_management_filtertable");
        this.appendChild(template.content.cloneNode(true));
        this.selectors = {
            studentManagementPage: ".hum-student-page",
            addStudentButton: "#hum_student_add_btn",
            searchColumn: "#hum_student_search_column",
            searchInput: "#hum_student_search_input",
            departmentFilter: "#hum_student_department_filter",
            genderFilter: "#hum_student_gender_filter",
            residenceFilter: "#hum_student_residence_filter",
            statusFilter: "#hum_student_status_filter",
            lengthFilter: "#hum_student_page_length",
            studentFormFilter:".form_student_filter",
            studentTable: "#hum_student_table",
            studentTableBody: "#hum_student_table_body",
            studentRecordCount: "#hum_student_record_count",
            studentPagination: "#hum_student_pagination",
            previousPageButton: "#hum_student_previous_page",
            nextPageButton: "#hum_student_next_page",
            smsMainContainer: "#hum_sms_main_layout",
            studentRegisterTitle: "#hum_student_register_title",
            studentViewButton: ".hum-student-view-btn",
            studentEditButton: ".hum-student-edit-btn",
            studentStatusButton: ".hum-student-status-btn"
        };
        this.studentDataTable = null;
        this.studentDataTableConfig = {
            order: [0, 'asc'],
            processing: true,
            serverSide: true,
            length: 10,
            searching: false,
            dom: 't' + '<"row align-items-center mt-2 mb-1 px-2"' + '<"col-md-6 d-flex align-items-center"i>' + '<"col-md-6 d-flex justify-content-md-end hum-custom-pagination"p>' + '>',
            ajax: {
                url: "https://dev-api.humhealth.com/StudentManagementSystemAPI/student/list",
                type: "POST",
                dataType: "json",
                contentType: "application/json",
                data: requestData => JSON.stringify(this.studentFormatRequestData(requestData)),
                dataSrc: jsonResponse => this.displayStudentDataList(jsonResponse)
            },
            columns: [
                { data: "sno", searchable: false, orderable: true, visible: true },
                { data: "name", searchable: false, orderable: false, visible: true },
                { data: "branchOfStudy", searchable: false, orderable: false, visible: true },
                { data: "gender", searchable: false, orderable: false, visible: true },
                { data: "residingStatusFlag", searchable: false, orderable: false, visible: true },
                { data: "phoneNumber", searchable: false, orderable: false, visible: true },
                { data: "email", searchable: false, orderable: false, visible: true },
                { data: "activeStatusFlag", searchable: false, orderable: false, visible: true },
                { data: "action", searchable: false, orderable: false, visible: true }
            ],
            columnDefs: [
                { targets: "_all", className: "text-center" }
            ]
        };  
    }

    // Initializes the Student Management page by registering events, tooltips, notifications, and loading student records.
    connectedCallback() {
        try {
            this.bindAllRequiredEvents();
            this.initializeToolTip();
            this.initializeToastr();
            this.getStudentList();
        }
        catch (error) {
            console.log(error);
        }
    }

    // Registers delegated event handlers for student registration, searching, filtering, viewing, editing, and status changes.
    bindAllRequiredEvents() {
        $(this)
            .on("click", this.selectors.addStudentButton, { classObject: this }, this.handlerAddStudentBtn)
            .on("input", this.selectors.searchInput, { classObject: this }, this.handlerStudentSearch)
            .on("change", this.selectors.searchColumn, { classObject: this }, this.handlerStudentSearch)
            .on("change", this.selectors.studentFormFilter, { classObject: this }, this.handlerStudentFilter)
            .on("click", this.selectors.studentViewButton, { classObject: this }, this.handlerViewStudentClick)
            .on("click", this.selectors.studentEditButton, { classObject: this }, this.handlerEditStudentClick)
            .on("click", this.selectors.studentStatusButton, { classObject: this }, this.handlerStatusStudentClick);
    }

    // Initializes Bootstrap tooltips for dynamically generated elements when the user hovers over them.
    initializeToolTip() {
        $(this).on("mouseenter", '[data-bs-toggle="tooltip"]', function () {
            if (!bootstrap.Tooltip.getInstance(this)) {
                new bootstrap.Tooltip(this, {
                    container: 'body',
                    trigger: 'hover focus'
                });
            }
        });
    }

    // Disposes all initialized tooltips and removes their associated DOM references from the Student Management component.
    disposeAllToolTips() {
        $(this).find('[data-bs-toggle="tooltip"]').each(function () {
            const tooltip = bootstrap.Tooltip.getInstance(this);
            if (tooltip) {
                tooltip.dispose();
            }
            const tooltipId = this.getAttribute("aria-describedby");
            if (tooltipId) {
                document.getElementById(tooltipId)?.remove();
            }
        });
    }

    // Cleans up initialized tooltips and their references when the Student Management component is removed from the DOM.
    disconnectedCallback() {
        // Dispose tooltips attached to dynamically generated buttons
        $(this).find('[data-bs-toggle="tooltip"]').each(function () {
            const tooltip = bootstrap.Tooltip.getInstance(this);
            if (tooltip) {
                tooltip.hide();
                tooltip.dispose();
            }
            // Remove any remaining tooltip reference
            const tooltipId = this.getAttribute("aria-describedby");
            if (tooltipId) {
                document.getElementById(tooltipId)?.remove();
            }
        });
        // Dispose delegated tooltip instance on custom element
        const tooltipInstance = bootstrap.Tooltip.getInstance(this);
        if (tooltipInstance) {
            tooltipInstance.hide();
            tooltipInstance.dispose();
        }
    }

    // Configures Toastr notification settings for displaying success and error messages.
    initializeToastr() {
        toastr.options = {
            closeButton: true,
            progressBar: true,
            positionClass: "toast-top-center",
            timeOut: 3000,
            preventDuplicates: true
        };
    }

    // Navigates to the Student Registration page when the Add Student button is clicked.
    handlerAddStudentBtn(event) {
        event.preventDefault();
        const classObject = event.data.classObject;
        $(classObject.selectors.smsMainContainer).html("<hum-student-management-register></hum-student-management-register>");
    }

    // Reloads the student DataTable using the selected page length when the search input or search column changes.
    handlerStudentSearch(event) {
        const classObject = event.data.classObject;
            classObject.getStudentList();
    }

    // Applies the selected student filter values by refreshing the DataTable with the current page length.
    handlerStudentFilter(event) {
        const classObject = event.data.classObject;
           classObject.getStudentList();
    }

    // Navigates to the selected student's profile page using the student ID from the clicked View button.
    // View Student Button
    handlerViewStudentClick(event) {
        const classObject = event.data.classObject;
        const studentId = $(event.currentTarget).data("student-id");
        $(classObject.selectors.smsMainContainer).html(`<hum-student-management-profile student-id="${studentId}"></hum-student-management-profile>`);
    }

    // Navigates to the Student Registration page with the selected student ID to load the student's details for editing.
    handlerEditStudentClick(event) {
        const classObject = event.data.classObject;
        const studentId = $(event.currentTarget).data("student-id");
        $(classObject.selectors.smsMainContainer).html(`<hum-student-management-register student-id="${studentId}"></hum-student-management-register>`);
    }

    // Displays a confirmation dialog and changes the selected student's active/inactive status after confirmation.
    handlerStatusStudentClick(event) {
        const classObject = event.data.classObject;
        const studentId = $(event.currentTarget).data("student-id");
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to change the student status?",
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
                classObject.studentStatusChange(studentId);
            }
        });
    }

    // Sends a request to the Student Status API to activate or deactivate the selected student and handles the response.
    studentStatusChange(studentId) {
        const classObject = this;
        $.ajax({
            url: "https://dev-api.humhealth.com/StudentManagementSystemAPI/student/activateOrDeactivate/" + studentId,
            type: "POST",
            dataType: "json",
            success: function (response) {
                if (response.status === "Success") {
                    $(classObject.selectors.smsMainContainer).html(`<hum-student-management-filterTable "></hum-student-management-filterTable>`);
                } else {
                    toastr.error(response.data);
                }
            },
            error: function (xhr) {
                console.error(xhr.responseText);
            }
        });
    }

    // Formats DataTables pagination, student filter values, and search criteria into the request structure required by the Student API.
    studentFormatRequestData(requestData) {
        const classObject = this;
        const orderByColumnIndex = requestData.order?.[0]?.column ?? 0;
        const orderByType = requestData.order?.[0]?.dir ?? "asc";
        const orderByColumn = requestData.columns?.[orderByColumnIndex]?.data ?? "sno";

        this.studentFilterRequest = {
            draw: requestData.draw,
            length: Number($(classObject.selectors.lengthFilter).val()) || 10,
            start: requestData.start,
            filter: {
                gender: $(classObject.selectors.genderFilter).val() || "",
                residingStatusFlag: $(classObject.selectors.residenceFilter).val() || "",
                activeFlag: $(classObject.selectors.statusFilter).val() || "A",
                branchOfStudy: $(classObject.selectors.departmentFilter).val() || ""
            },
            order: {
                column: orderByColumn,
                type: orderByType
            },
            search: $(classObject.selectors.searchInput).val() || "",
            searchColumn: $(classObject.selectors.searchColumn).val() || ""
        };
        return this.studentFilterRequest;
    }

    // Converts the Student API response into DataTable rows and formats department, residence, gender, and status values for display.
    displayStudentDataList(response) {
        const studentDataArray = [];
        if (response.status === "Success") {
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
                let residing = res.residingStatusFlag;
                switch (residing) {
                    case "D":
                        residing = "Day Scholar";
                        break;
                    case "H":
                        residing = "Hosteller";
                        break;
                    default:
                        residing = "";
                        break;
                }
                let activeFlag = res.activeStatusFlag;
                switch (activeFlag) {
                    case "A":
                        activeFlag = "Active";
                        break;
                    case "I":
                        activeFlag = "Inactive";
                        break;
                    default:
                        activeFlag = "";
                        break;
                }
                let studentGender = res.gender;
                switch (studentGender) {
                    case "MALE":
                        studentGender = "Male";
                        break;
                    case "FEMA":
                        studentGender = "Female";
                        break;
                    default:
                        studentGender = "";
                        break;
                }
                data["sno"] = res.sno;
                data["name"] = [res.firstName, res.middleName, res.lastName].filter(Boolean).join(" ");
                data["branchOfStudy"] = branchOfStudy;
                data["gender"] = studentGender;
                data["residingStatusFlag"] = residing;
                data["phoneNumber"] = res.phoneNumber;
                data["email"] = res.mail;
                data["activeStatusFlag"] = this.forActive(activeFlag);
                data["action"] = this.forAction(res.studentId, res.activeStatusFlag);
                studentDataArray.push(data);
            }
        }
        return studentDataArray;
    }

    // Generates View, Edit, and Active/Inactive action buttons with the corresponding icons and student ID for each table row.
    forAction(studentId, activeStatusFlag) {
        const statusIcon = activeStatusFlag === "I" ? "person_check" : "person_off";
        const statusTitle = activeStatusFlag === "I" ? "Active" : "Deactive";
        const statusClass = activeStatusFlag === "I" ? "btn btn-sm btn-outline-success" : "btn btn-sm btn-outline-danger";
        return `
        <button type="button"
            class="btn btn-sm btn-outline-primary hum-student-view-btn"
            data-student-id="${studentId}"
            data-bs-toggle="tooltip"
            title="View Student">
            <span class="material-symbols-outlined d-flex text-center hum-icon-font">visibility</span>
        </button>
        <button type="button"
            class="btn btn-sm btn-outline-secondary hum-student-edit-btn"
            data-student-id="${studentId}"
            data-bs-toggle="tooltip"
            title="Edit Student">
            <span class="material-symbols-outlined d-flex text-center hum-icon-font">edit</span>
        </button>
        <button type="button"
            class="btn btn-sm ${statusClass} hum-student-status-btn"
            data-student-id="${studentId}"
            data-status="${activeStatusFlag}"
            data-bs-toggle="tooltip"
            title="${statusTitle}">
            <span class="material-symbols-outlined d-flex text-center hum-icon-font">${statusIcon}</span>
        </button>
    `;
    }

    // Returns the appropriate HTML status label based on whether the student is active or inactive.
    forActive(activeFlag) {
        if (activeFlag === "Active") {
            return `<span class="student-status-active student-status">Active</span>`;
        }
        return `<span class="student-status-inactive student-status">Inactive</span>`;
    }

    // Initializes the Student DataTable if it has not already been created.
    getStudentList() {
        $(this).find("table").addClass("d-none")
        if (this.studentDataTable) {
         const length = Number($(this.selectors.lengthFilter).val()) || 10;
           this.studentDataTable.page.len(length).draw(true);
        }
        else {
            this.studentDataTable = $(this.selectors.studentTable).DataTable(this.studentDataTableConfig);
        }
        $(this).find("table").removeClass("d-none")
    }
}
customElements.define("hum-student-management-filtertable", HumStudentManagementFiltertable);
