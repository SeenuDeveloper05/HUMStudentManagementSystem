
class HumTeacherManagement extends HTMLElement {

    constructor() {
        super();
        const template = document.getElementById("hum_teacher_management");
        this.appendChild(template.content.cloneNode(true));
        this.selectors = {
            teacherTable: ".hum-teacher-table",
            teacherTableBody: "#hum_teacher_table_body",

            addButton: "#hum_teacher_add_button",
            // Filter selectors
            lengthFilter: "#hum_teacher_page_length",
            statusFilter: "#hum_teacher_filter_status",
            searchColumn: "#hum_teacher_filter_search_column",
            searchInput: "#hum_teacher_filter_search",
            applyFilterButton: "#hum_teacher_filter_apply_button",
            resetFilterButton: "#hum_teacher_filter_reset_button",
            filterChanges: "#filter_changes_lable",
            teacherFormFilter:".form_teacher_filter",
            // Add selectors
            addModal: "#hum_teacher_add_modal",
            addTitle: "#modal_title_change",
            addPara: "#modal_para_change",
            addForm: "#hum_teacher_add_form",
            addSaveButton: "#hum_teacher_add_save_button",
            addId: "#hum_teacher_add_id",
            addName: "#hum_teacher_add_name",
            addSpecialty: "#hum_teacher_add_specialty",
            addEmail: "#hum_teacher_add_email",
            createdUserId: "#hum_teacher_created_user_id",
            uniqueEmail: "#unique_Email",
            editModal: "#hum_teacher_edit_modal",
            editForm: "#hum_teacher_edit_form",
            editId: "#hum_teacher_edit_id",
            editName: "#hum_teacher_edit_name",
            editSpecialty: "#hum_teacher_edit_specialty",
            editEmail: "#hum_teacher_edit_email",
            editButton: ".teacher-edit-btn",
            editSaveButton: "#hum_teacher_edit_save_button",
            // View selectors
            viewModal: "#hum_teacher_view_modal",
            viewAvatar: "#hum_teacher_view_avatar",
            viewHeading: "#hum_teacher_view_heading",
            viewSubtitle: "#hum_teacher_view_subtitle",
            viewId: "#hum_teacher_view_id",
            viewName: "#hum_teacher_view_name",
            viewSpecialty: "#hum_teacher_view_specialty",
            viewEmail: "#hum_teacher_view_email",
            viewButton: ".teacher-view-btn",
            // Status selector
            statusButton: ".teacher-status-btn"
        };
        this.teacherDataTable = null;
        // Stores the currently applied filter values, which are sent to the Teacher API.
        this.teacherAppliedFilters = {
            teacherLength: 10,
            teacherActiveFlag: "A",
            search: "",
            searchColumn: "TeacherName"
        };
        this.length = this.teacherAppliedFilters.teacherLength;
        this.teacherDataTableConfig = {
            processing: true,
            serverSide: true,
            pageLength: 10,
            dom:
                't' +
                '<"row align-items-center mt-2 mb-1 px-2"' +
                '<"col-md-6 d-flex align-items-center"i>' +
                '<"col-md-6 d-flex justify-content-md-end hum-custom-pagination"p>' +
                '>',
            ajax: {
                url: "https://dev-api.humhealth.com/StudentManagementSystemAPI/teacher/all",
                type: "POST",
                dataType: "json",
                contentType: "application/json",
                data: requestData => JSON.stringify(this.teacherFormatRequestData(requestData)),
                dataSrc: jsonResponse => this.displayTeacherDataList(jsonResponse)
            },
            columns: [
                { data: "sno", searchable: false, orderable: true, visible: true },
                { data: "name", searchable: false, orderable: false, visible: true },
                { data: "speciality", searchable: false, orderable: false, visible: true },
                { data: "email", searchable: false, orderable: false, visible: true },
                { data: "action", searchable: false, orderable: false, visible: true }
            ],
            columnDefs: [
                { targets: "_all", className: "text-center" }
            ]
        };
    }

    // Initializes the Teacher Management component, loads teacher records, and registers validation, popover, tooltip, and event handlers.
    connectedCallback() {
        try {
            this.getTeacherList();
            this.initializeTeacherValidation();
            this.initializePopOver();
            this.initializeToolTip();
            this.bindAllRequiredEvents();
        } catch (error) {
            console.error("Teacher Management Error:", error);
        }
    }

    // Registers delegated click, input, and change events for Teacher Management actions and form interactions.
    bindAllRequiredEvents() {
        $(this)
            .on("click", this.selectors.addButton, { classObject: this }, this.handlerAddTeacherClick)
            .on("click", this.selectors.addSaveButton, { classObject: this }, this.handlerAddTeacherSubmit)
            .on("click", this.selectors.viewButton, { classObject: this }, this.handlerViewTeacherClick)
            .on("click", this.selectors.editButton, { classObject: this }, this.handlerEditTeacherClick)
            .on("click", this.selectors.applyFilterButton, { classObject: this }, this.handlerApplyTeacherFilter)
            .on("click", this.selectors.resetFilterButton, { classObject: this }, this.handlerResetTeacherFilter)
            .on("click", this.selectors.statusButton, { classObject: this }, this.handlerTeacherStatusClick)
            .on("input", this.selectors.teacherFormFilter,{ classObject: this }, this.disableReset)
            .on("input change", this.selectors.addForm, { classObject: this }, this.handlerAddFormInput);
    }

    // Initializes Bootstrap tooltips for dynamically displayed Teacher Management elements.
    initializeToolTip() {
        new bootstrap.Tooltip(this, {
            selector: '[data-bs-toggle="tooltip"]',
            container: 'body',
            trigger: 'hover focus'
        });
    }

    // Initializes a reusable confirmation popover for cancelling forms and handles Yes/No actions.
    initializePopOver() {
        let activeCancelButton = null;
        // Common Cancel Popover
        $(document).on("click", ".hum-confirm-cancel", function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            activeCancelButton = this;
            bootstrap.Popover.getInstance(this)?.dispose();
            const popover = new bootstrap.Popover(this, {
                trigger: "manual",
                placement: "top",
                html: true,
                sanitize: false,
                container: "body",
                customClass: "hum-cancel-popover",
                content: `
                <div class="hum-cancel-confirm-content">
                    <p>Are you sure you want to cancel this form?</p>
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
            popover.show();
        });
        // No button
        $(document).on("click", ".hum-confirm-no", function () {
            if (activeCancelButton) {
                bootstrap.Popover.getInstance(activeCancelButton)?.dispose();
                activeCancelButton = null;
            }
        });
        // Yes button
        $(document).on("click", ".hum-confirm-yes", function () {
            if (!activeCancelButton) return;
            const modalElement = activeCancelButton.closest(".modal");
            bootstrap.Popover.getInstance(activeCancelButton)?.dispose();
            activeCancelButton = null;
            if (modalElement) {
                bootstrap.Modal.getOrCreateInstance(modalElement).hide();
            }
        });
    }

    // Configures Toastr notifications and jQuery validation rules and error messages for the Add Teacher form.
    initializeTeacherValidation() {
        toastr.options = {
            closeButton: true,
            progressBar: true,
            positionClass: "toast-top-center",
            timeOut: 2000,
            preventDuplicates: true
        };
        const self = this;
        // Add Teacher Validation
        $(self).find(self.selectors.addForm).validate({
            ignore: [],
            rules: {
                teacherName: {
                    required: true,
                    minlength: 3,
                    lettersonly: true
                },
                teacherSpecialty: {
                    required: true,
                    lettersonly: true
                },
                teacherEmail: {
                    required: true,
                    validemail: true
                },
                unique_email_add: {
                    // required:true,
                    min: 1
                }
            },
            messages: {
                teacherName: {
                    required: "Please enter teacher name.",
                    minlength: "Name must contain at least 3 characters.",
                    lettersonly: "Please enter letters only"
                },
                teacherSpecialty: {
                    required: "Please enter specialty.",
                    lettersonly: "Please enter letters only"
                },
                teacherEmail: {
                    required: "Please enter email address.",
                    validemail: "Please enter a valid email address."
                }
            },
            errorPlacement: function (error, element) {
                error.css("color", "red");
                if (element.closest(".input-group").length) {
                    error.insertAfter(element.closest(".input-group"));
                } else {
                    error.insertAfter(element);
                }
            }
        });
    }

    // Applies the selected page length, teacher status, and search criteria only when the Apply Filter button is clicked.
    handlerApplyTeacherFilter(event) {
        const classObject = event.data.classObject;
        classObject.length = Number($(classObject).find(classObject.selectors.lengthFilter).val()) || 10;
        classObject.teacherAppliedFilters = {
            teacherLength: classObject.length,
            teacherActiveFlag: $(classObject).find(classObject.selectors.statusFilter).val() || "A",
            search: $(classObject).find(classObject.selectors.searchInput).val().trim(),
            searchColumn: $(classObject).find(classObject.selectors.searchColumn).val() || "TeacherName"
        };
         $(classObject).find(classObject.selectors.filterChanges).text("");
        classObject.getTeacherList();
    }

    // Displays the reset option and filter-change message whenever the user modifies a filter field.
    disableReset(event) {
        const classObject = event.data.classObject;
        $(classObject).find(classObject.selectors.resetFilterButton).removeClass("d-none");
        $(classObject).find(classObject.selectors.filterChanges).text(" Filter conditions changed, Click submit.");
    }

    // Resets all filter fields to their default values and reloads the complete active teacher list.
    handlerResetTeacherFilter(event) {
        const classObject = event.data.classObject;
        classObject.length = 10;
        $(classObject).find(classObject.selectors.lengthFilter).val("10");
        $(classObject).find(classObject.selectors.statusFilter).val("A");
        $(classObject).find(classObject.selectors.searchColumn).val("TeacherName");
        $(classObject).find(classObject.selectors.searchInput).val("");
        classObject.teacherAppliedFilters = {
            teacherLength: 10,
            teacherActiveFlag: "A",
            search: "",
            searchColumn: "TeacherName"
        };
        // Reload the unfiltered list.
        classObject.getTeacherList();
        $(classObject).find(classObject.selectors.resetFilterButton).addClass("d-none");
         $(classObject).find(classObject.selectors.filterChanges).text("");
    }

    // Enables or disables the Add Teacher save button based on whether at least one visible input field contains a value.
    handlerAddFormInput(event) {
        const classObject = event.data.classObject;
        const form = $(classObject).find(classObject.selectors.addForm);
        const hasValue = form.find("input:not([type='hidden'])").toArray().some(element => $(element).val().trim() !== "");
        form.find(classObject.selectors.addSaveButton).prop("disabled", !hasValue);
    }

    // Converts DataTables pagination and the currently applied teacher filters into the request format required by the Teacher API.
    teacherFormatRequestData(requestData) {
              const orderByColumnIndex = requestData.order?.[0]?.column ?? 0;
        const orderByType = requestData.order?.[0]?.dir ?? "asc";
        const orderByColumn = requestData.columns?.[orderByColumnIndex]?.data ?? "sno";
        return {
            draw: requestData.draw,
            length: this.teacherAppliedFilters.teacherLength,
            start: requestData.start,
            teacherFilter: {
                teacherActiveFlag:
                    this.teacherAppliedFilters.teacherActiveFlag
            },
            order: {
                column: orderByColumn,
                type: orderByType
            },
            search: this.teacherAppliedFilters.search,
            searchColumn: this.teacherAppliedFilters.searchColumn
        };
    }

    // Opens the Add Teacher modal after resetting the form and clearing previous validation errors.
    handlerAddTeacherClick(event) {
        const classObject = event.data.classObject;
        const addForm = $(classObject).find(classObject.selectors.addForm)[0];
        if (addForm) {
            addForm.reset();
            const validator = $(addForm).validate();
            validator.resetForm();
            // Remove validation error styles
            $(addForm).find(".is-invalid").removeClass("is-invalid");
            $(addForm).find(".error").removeClass("error");
        }
        $(classObject).find(classObject.selectors.addModal).modal("show");
    }

    // Prevents the default submit action and calls the saveTeacher method to process the Add Teacher form.
    handlerAddTeacherSubmit(event) {
        event.preventDefault();
        const classObject = event.data.classObject;
        classObject.saveTeacher();
    }

    // Validates the teacher form and sends teacher details to the Save API for creating or updating a teacher record.
    saveTeacher() {
        $("#unique_email_add").val("1");
        if ($("#hum_teacher_add_form").valid()) {
            const classObject = this;
            const addForm = $(this).find(this.selectors.addForm);
            const teacherData = {
                teacherId: $(this).find(classObject.selectors.addId).val() || null,
                teacherName: $(this).find(classObject.selectors.addName).val().trim(),
                teacherSpecialty: $(this).find(classObject.selectors.addSpecialty).val().trim(),
                teacherEmail: $(this).find(classObject.selectors.addEmail).val().trim(),
                teacherCreatedUserId: 1
            };
            $.ajax({
                url: "https://dev-api.humhealth.com/StudentManagementSystemAPI/teacher/save",
                type: "POST",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify(teacherData),
                success: function (response) {
                    if (response.status === "Success") {
                        toastr.success(response.data);
                        $(classObject).find(classObject.selectors.addModal).modal("hide");
                        $(classObject).find(classObject.selectors.addForm)[0].reset();
                        $(classObject).find(classObject.selectors.addForm).validate().resetForm();
                        // Reload the table after saving.
                        classObject.getTeacherList();
                    } else {
                        if (response.data === "Duplicate Email found") {
                            $("#unique_email_add").rules("add", {
                                messages: {
                                    min: "Email already exsist"
                                }
                            });
                            $("#unique_email_add").val(0);
                            $("#hum_teacher_add_form").valid();
                        }
                        else {
                            toastr.error(response.data);
                        }
                    }
                },
                error: function (xhr) {
                    console.error("Save Teacher Error:", xhr.responseText);
                    toastr.error("Unable to save teacher. Please try again.");
                }
            });
        }
    }

    // Retrieves the selected teacher ID from the clicked View button and opens the teacher details modal.
    handlerViewTeacherClick(event) {
        const classObject = event.data.classObject;
        const teacherId = $(event.currentTarget).data("teacher-id");
        classObject.viewTeacher(teacherId);
    }

    // Retrieves the selected teacher ID, loads its details for editing, and updates the modal title and save button text.
    handlerEditTeacherClick(event) {
        const classObject = event.data.classObject;
        const teacherId = $(event.currentTarget).attr("data-teacher-id");
        classObject.editTeacher(teacherId);
        $(classObject).find(classObject.selectors.addTitle).text("Edit Teacher");
        $(classObject).find(classObject.selectors.addpara).text("Enter the details below to add a new teacher");
        $(classObject).find(classObject.selectors.addSaveButton).text("Update");
    }

    // Displays a confirmation dialog and changes the selected teacher's active/inactive status after confirmation.
    handlerTeacherStatusClick(event) {
        const classObject = event.data.classObject;
        const teacherId = $(event.currentTarget).data("teacher-id");
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to change the teacher status?",
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
                classObject.changeTeacherStatus(teacherId);
            }
        });
    }

    // Fetches the selected teacher's details from the API and displays them in the View Teacher modal.
    viewTeacher(teacherId) {
        const classObject = this;
        $.ajax({
            url: "https://dev-api.humhealth.com/StudentManagementSystemAPI/teacher/" + teacherId,
            type: "GET",
            dataType: "json",
            success: function (response) {
                if (response.status === "Success") {
                    const teacher = response.data;
                    const firstLetter = teacher.teacherName.trim().charAt(0).toUpperCase();
                    $(classObject).find(classObject.selectors.viewAvatar).text(firstLetter);
                    $(classObject).find(classObject.selectors.viewHeading).text(teacher.teacherName);
                    $(classObject).find(classObject.selectors.viewSubtitle).text(teacher.teacherSpecialty);
                    $(classObject).find(classObject.selectors.viewId).text(teacher.teacherId);
                    $(classObject).find(classObject.selectors.viewName).text(teacher.teacherName);
                    $(classObject).find(classObject.selectors.viewSpecialty).text(teacher.teacherSpecialty);
                    $(classObject).find(classObject.selectors.viewEmail).text(teacher.teacherEmail);
                    $(classObject).find(classObject.selectors.viewModal).modal("show");
                } else {
                    toastr.error(response.data);
                }
            },
            error: function (xhr) {
                console.error("View Teacher Error:", xhr.responseText);
                toastr.error("Unable to load teacher details.");
            }
        });
    }

    // Fetches the selected teacher's existing details from the API and fills the form fields in the Edit Teacher modal.
    editTeacher(teacherId) {
        const classObject = this;
        $.ajax({
            url: "https://dev-api.humhealth.com/StudentManagementSystemAPI/teacher/" + teacherId,
            type: "GET",
            dataType: "json",
            success: function (response) {
                if (response.status === "Success") {
                    const teacher = response.data;
                    $(classObject).find(classObject.selectors.addId).val(teacher.teacherId);
                    $(classObject).find(classObject.selectors.addName).val(teacher.teacherName);
                    $(classObject).find(classObject.selectors.addSpecialty).val(teacher.teacherSpecialty);
                    $(classObject).find(classObject.selectors.addEmail).val(teacher.teacherEmail);
                    $(classObject).find(classObject.selectors.addModal).modal("show");
                } else {
                    toastr.error(response.data);
                }
            },
            error: function (xhr) {
                console.error("Get Teacher Error:", xhr.responseText);
                toastr.error("Unable to load teacher details.");
            }
        });
    }

    // Calls the Teacher Status API to toggle the selected teacher's active/inactive status and refreshes the table on success.
    changeTeacherStatus(teacherId) {
        const classObject = this;
        $.ajax({
            url: "https://dev-api.humhealth.com/StudentManagementSystemAPI/teacher/isactive/" + teacherId,
            type: "GET",
            dataType: "json",
            success: function (response) {
                if (response.status === "Success") {
                    toastr.success("Successfully Changed");
                    // Reload without resetting the current page.
                    classObject.getTeacherList();
                } else {
                    toastr.error(response.data);
                }
            },
            error: function (xhr) {
                console.error("Change Teacher Status Error:", xhr.responseText);
                toastr.error(
                    "Unable to change teacher status. Please try again."
                );
            }
        });
    }

    // Converts the Teacher API response into the row data structure required by DataTables.
    displayTeacherDataList(response) {
        const teacherdataArray = [];
        if (response.status === "Success") {
            for (let res of response.data) {
                const data = {};
                data["sno"] = res.sno;
                data["name"] = res.teacherName;
                data["speciality"] = res.teacherSpecialty;
                data["email"] = res.teacherEmail;
                data["action"] = this.forAction(res.teacherId, res.teacherActiveFlag);
                teacherdataArray.push(data);
            }
        }
        return teacherdataArray;
    }

    // Generates the View, Edit, and Active/Inactive action buttons with the appropriate icons and status information for each teacher.
    forAction(teacherId, teacherActiveFlag) {
        const statusIcon =
            teacherActiveFlag === "A"
                ? "person_check"
                : "person_off";
        const statusTitle =
            teacherActiveFlag === "A"
                ? "Active"
                : "Inactive";
        const statusClass =
            teacherActiveFlag === "A"
                ? "btn btn-sm btn-outline-success"
                : "btn btn-sm btn-outline-danger";
        return `
            <button
                type="button"
                class="btn btn-sm btn-outline-primary teacher-view-btn"
                data-bs-toggle="tooltip"
                data-teacher-id="${teacherId}"
                title="View Teacher">
                <span class="material-symbols-outlined d-flex align-item-center hum-icon-font">
                    visibility
                </span>
            </button>
            <button
                type="button"
                class="btn btn-sm btn-outline-secondary teacher-edit-btn"
                data-teacher-id="${teacherId}"
                data-bs-toggle="tooltip"
                title="Edit Teacher">
                <span class="material-symbols-outlined d-flex align-item-center hum-icon-font">
                    edit_square
                </span>
            </button>
            <button
                type="button"
                class="${statusClass} teacher-status-btn"
                data-teacher-id="${teacherId}"
                data-status="${teacherActiveFlag}"
                data-bs-toggle="tooltip"
                title="${statusTitle}">
                <span class="material-symbols-outlined d-flex align-item-center hum-icon-font">
                    ${statusIcon}
                </span>
            </button>
        `;
    }

    // Initializes the server-side DataTable on first load and reloads it with the selected page length on subsequent calls.
    getTeacherList() {
        if (!this.teacherDataTable) {
            this.teacherDataTable = $(this).find(this.selectors.teacherTable).DataTable(this.teacherDataTableConfig);
        }
        else{
            this.teacherDataTable.page.len(this.length).draw(true);
        }
    }
}

customElements.define("hum-teacher-management", HumTeacherManagement);
