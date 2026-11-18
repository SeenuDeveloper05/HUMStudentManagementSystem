class HumTeacherManagement extends HTMLElement {

    constructor() {
        super();

        const template = document.getElementById("hum_teacher_management");

        this.appendChild(
            template.content.cloneNode(true)
        );

        this.selectors = {
            teacherTable: ".hum-teacher-table",
            teacherTableBody: "#hum_teacher_table_body",

            addButton: "#hum_teacher_add_button",

            // Filter selectors
            statusFilter: "#hum_teacher_filter_status",
            searchColumn: "#hum_teacher_filter_search_column",
            searchInput: "#hum_teacher_filter_search",
            applyFilterButton: "#hum_teacher_filter_apply_button",
            resetFilterButton: "#hum_teacher_filter_reset_button",

            // Add selectors
            addModal: "#hum_teacher_add_modal",
            addForm: "#hum_teacher_add_form",
            addSaveButton: "#hum_teacher_add_save_button",
            addName: "#hum_teacher_add_name",
            addSpecialty: "#hum_teacher_add_specialty",
            addEmail: "#hum_teacher_add_email",
            createdUserId: "#hum_teacher_created_user_id",

            // Edit selectors
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

        // Filters are applied only after clicking Apply.
        this.teacherAppliedFilters = {
            teacherActiveFlag: "A",
            search: "",
            searchColumn: "TeacherName"
        };

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

                data: (requestData) => {
                    return JSON.stringify(
                        this.teacherFormatRequestData(requestData)
                    );
                },

                dataSrc: (jsonResponse) => {
                    return this.displayTeacherDataList(jsonResponse);
                }
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
                    data: "speciality",
                    searchable: false,
                    orderable: false,
                    visible: true
                },
                {
                    data: "email",
                    searchable: false,
                    orderable: false,
                    visible: true
                },
                {
                    data: "action",
                    searchable: false,
                    orderable: false,
                    visible: true
                }
            ],

            columnDefs: [
                {
                    targets: "_all",
                    className: "text-center"
                }
            ]
        };
    }


    connectedCallback() {
        try {
            this.getTeacherList();
            this.initializeTeacherValidation();
            this.initializeToolTip();
            this.bindAllRequiredEvents();

        } catch (error) {
            console.error("Teacher Management Error:", error);
        }
    }


    // Bind all required events
    bindAllRequiredEvents() {

        $(this).on(
            "click",
            this.selectors.addButton,
            { classObject: this },
            this.handlerAddTeacherClick
        );

        $(this).on(
            "click",
            this.selectors.addSaveButton,
            { classObject: this },
            this.handlerAddTeacherSubmit
        );

        $(this).on(
            "click",
            this.selectors.viewButton,
            { classObject: this },
            this.handlerViewTeacherClick
        );

        $(this).on(
            "click",
            this.selectors.editButton,
            { classObject: this },
            this.handlerEditTeacherClick
        );

        $(this).on(
            "click",
            this.selectors.editSaveButton,
            { classObject: this },
            this.handlerEditTeacherSubmit
        );

        // Apply filters
        $(this).on(
            "click",
            this.selectors.applyFilterButton,
            { classObject: this },
            this.handlerApplyTeacherFilter
        );

        // Reset filters
        $(this).on(
            "click",
            this.selectors.resetFilterButton,
            { classObject: this },
            this.handlerResetTeacherFilter
        );

        // Change Active/Inactive status
        $(this).on(
            "click",
            this.selectors.statusButton,
            { classObject: this },
            this.handlerTeacherStatusClick
        );
    }

   initializeToolTip() {
    new bootstrap.Tooltip(this, {
        selector: '[data-bs-toggle="tooltip"]',
        container: 'body',
        trigger: 'hover focus'
    });
  }


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
        rules: {
            teacherName: {
                required: true,
                minlength: 3
            },
            teacherSpecialty: {
                required: true
            },
            teacherEmail: {
                required: true,
                email: true
            }
        },
        messages: {
            teacherName: {
                required: "Please enter teacher name.",
                minlength: "Name must contain at least 3 characters."
            },
            teacherSpecialty: {
                required: "Please enter specialty."
            },
            teacherEmail: {
                required: "Please enter email address.",
                email: "Please enter a valid email address."
            }
        },
        errorClass: "text-danger",
        errorElement: "small"
    });

    // Edit Teacher Validation
    $(self).find(self.selectors.editForm).validate({
        rules: {
            teacherName: {
                required: true,
                minlength: 3
            },
            teacherSpecialty: {
                required: true
            },
            teacherEmail: {
                required: true,
                email: true
            }
        },
        messages: {
            teacherName: {
                required: "Please enter teacher name.",
                minlength: "Name must contain at least 3 characters."
            },
            teacherSpecialty: {
                required: "Please enter specialty."
            },
            teacherEmail: {
                required: "Please enter email address.",
                email: "Please enter a valid email address."
            }
        },
        errorClass: "text-danger",
        errorElement: "small"
    });
}


    // Apply filter button click
    handlerApplyTeacherFilter(event) {

        const classObject = event.data.classObject;

        classObject.teacherAppliedFilters = {
            teacherActiveFlag: $(classObject).find(classObject.selectors.statusFilter).val()||"A" ,

            search: $(classObject).find(classObject.selectors.searchInput).val().trim(),

            searchColumn: $(classObject).find(classObject.selectors.searchColumn).val() || "TeacherName"
        };

        // Reload the table from the first page with applied filters.
        classObject.teacherDataTable.page.len(10).draw(true);
    }


    // Reset filter button click
    handlerResetTeacherFilter(event) {

        const classObject = event.data.classObject;

        $(classObject).find(classObject.selectors.statusFilter).val("A");

        $(classObject).find(classObject.selectors.searchColumn).val("TeacherName");

        $(classObject).find(classObject.selectors.searchInput).val("");

        classObject.teacherAppliedFilters = {
            teacherActiveFlag: "A",
            search: "",
            searchColumn: "TeacherName"
        };

        // Reload the unfiltered list.
        classObject.teacherDataTable.page.len(10).draw(true);
    }


    // Format DataTables request for the Teacher API
    teacherFormatRequestData(requestData) {
           
        return {
            draw: requestData.draw,
            length: requestData.length,
            start: requestData.start,

            teacherFilter: {
                teacherActiveFlag:
                    this.teacherAppliedFilters.teacherActiveFlag
            },

            order: {
                column: "sno",
                type: "desc"
            },

            search:this.teacherAppliedFilters.search ,

            searchColumn:
                this.teacherAppliedFilters.searchColumn
        };
    }


    // Add Teacher button click
    handlerAddTeacherClick(event) {

        const classObject = event.data.classObject;

        const addForm = $(classObject).find(classObject.selectors.addForm)[0];

        if (addForm) {
            addForm.reset();
        }

        $(classObject).find(classObject.selectors.addModal).modal("show");
    }


    // Add Teacher form submit
    handlerAddTeacherSubmit(event) {

        event.preventDefault();

        const classObject = event.data.classObject;

        classObject.saveTeacher();
    }


    // Save Teacher
    saveTeacher() {

        const classObject = this;

        const addForm = $(this).find(this.selectors.addForm);
         if (!addForm.valid()) {
            toastr.warning("Please fill in all required fields.");
            return;
        }

        const teacherData = {
            teacherId: null,

            teacherName: $(this).find(classObject.selectors.addName).val().trim(),

            teacherSpecialty: $(this)
                .find(classObject.selectors.addSpecialty) .val().trim(),

            teacherEmail: $(this)
                .find(classObject.selectors.addEmail) .val().trim(),

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

                    $(classObject) .find(classObject.selectors.addModal).modal("hide");

                    $(classObject) .find(classObject.selectors.addForm)[0] .reset();

              $(classObject) .find(classObject.selectors.addForm).validate().resetForm();

                    // Reload the table after saving.
                    classObject.teacherDataTable.page.len(10).draw(true);

                } else {
                    toastr.error(response.data);
                }
            },

            error: function (xhr) {

                console.error(
                    "Save Teacher Error:",
                    xhr.responseText
                );

                toastr.error("Unable to save teacher. Please try again.");
            }
        });
    }


    // View Teacher button click
    handlerViewTeacherClick(event) {

        const classObject = event.data.classObject;

        const teacherId = $(event.currentTarget)
            .data("teacher-id");

        classObject.viewTeacher(teacherId);
    }


    // Edit Teacher button click
    handlerEditTeacherClick(event) {

        const classObject = event.data.classObject;

        const teacherId = $(event.currentTarget)
            .data("teacher-id");

        classObject.editTeacher(teacherId);
    }


    // Edit Teacher form submit
    handlerEditTeacherSubmit(event) {

        event.preventDefault();

        const classObject = event.data.classObject;

        classObject.updateTeacher();
    }


    // Active/Inactive status button click
    handlerTeacherStatusClick(event) {

        const classObject = event.data.classObject;

        const teacherId = $(event.currentTarget)
            .data("teacher-id");

       
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


    // View Teacher
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

                console.error(
                    "View Teacher Error:",
                    xhr.responseText
                );

                toastr.error("Unable to load teacher details.");
            }
        });
    }


    // Get Teacher details for Edit
    editTeacher(teacherId) {

        const classObject = this;

        $.ajax({
            url: "https://dev-api.humhealth.com/StudentManagementSystemAPI/teacher/" + teacherId,
            type: "GET",
            dataType: "json",

            success: function (response) {

                if (response.status === "Success") {

                    const teacher = response.data;

                    $(classObject).find(classObject.selectors.editId).val(teacher.teacherId);

                    $(classObject).find(classObject.selectors.editName).val(teacher.teacherName);

                    $(classObject) .find(classObject.selectors.editSpecialty).val(teacher.teacherSpecialty);

                    $(classObject).find(classObject.selectors.editEmail) .val(teacher.teacherEmail);

                    $(classObject).find(classObject.selectors.editModal).modal("show");

                } else {
                    toastr.error(response.data);
                }
            },

            error: function (xhr) {

                console.error(
                    "Get Teacher Error:",
                    xhr.responseText
                );

                toastr.error("Unable to load teacher details.");
            }
        });
    }


    // Update Teacher
    updateTeacher() {

        const classObject = this;

        const editForm = $(this).find(this.selectors.editForm);

    if (!editForm.valid()) {
        toastr.warning("Please correct the highlighted fields.");
        return;
    }

        const teacherData = {
            teacherId: Number($(this) .find(classObject.selectors.editId).val()),

            teacherName: $(this).find(classObject.selectors.editName).val().trim(),

            teacherSpecialty: $(this).find(classObject.selectors.editSpecialty).val().trim(),

            teacherEmail: $(this).find(classObject.selectors.editEmail).val().trim(),

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

                    $(classObject).find(classObject.selectors.editModal).modal("hide");

                    $(classObject).find(classObject.selectors.editForm)[0] .reset();

                    $(classObject).find(classObject.selectors.editForm).validate().resetForm();

                    // Reload the table after updating.
                    classObject.teacherDataTable.page.len(10).draw(true);

                } else {
                    toastr.error(response.data);
                }
            },

            error: function (xhr) {

                console.error(
                    "Update Teacher Error:",
                    xhr.responseText
                );

                toastr.error("Unable to update teacher. Please check the entered details.");
            }
        });
    }


    // Change Teacher Active/Inactive status
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
                   classObject.teacherDataTable.page.len(10).draw(true);

                } else {
                    toastr.error(response.data);
                }
            },

            error: function (xhr) {

                console.error(
                    "Change Teacher Status Error:",
                    xhr.responseText
                );

                toastr.error(
                    "Unable to change teacher status. Please try again."
                );
            }
        });
    }


    // Format API response for DataTables
    displayTeacherDataList(response) {

        const teacherdataArray = [];

        if (response.status === "Success") {

            let index = 1;

            for (let res of response.data) {

                const data = {};

                data["sno"] = index++;
                data["name"] = res.teacherName;
                data["speciality"] = res.teacherSpecialty;
                data["email"] = res.teacherEmail;

                data["action"] = this.forAction(
                    res.teacherId,
                    res.teacherActiveFlag
                );

                teacherdataArray.push(data);
            }
        }

        return teacherdataArray;
    }


    // Create View, Edit and Active/Inactive buttons
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



    // Initialize DataTable
    getTeacherList() {

        if (!this.teacherDataTable) {

            this.teacherDataTable = $(this)
                .find(this.selectors.teacherTable)
                .DataTable(this.teacherDataTableConfig);
        }
    }
}

customElements.define(
    "hum-teacher-management",
    HumTeacherManagement
);