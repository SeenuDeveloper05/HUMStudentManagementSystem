class HumStudentManagementRegister extends HTMLElement {
    constructor() {
        super();
        const template = document.getElementById("hum_student_management_register");
        this.appendChild(template.content.cloneNode(true));
        this.selectors = {
            // Student Register Page
            studentRegisterPage: ".hum-student-register",
            studentRegisterTitle: "#hum_student_register_title",
            studentRegisterForm: "#hum_student_register_form",
            studentRegisterBackBtn: "#hum_student_register_back_button",
            // Personal Information
            studentFirstName: "#hum_student_first_name",
            studentMiddleName: "#hum_student_middle_name",
            studentLastName: "#hum_student_last_name",
            studentGender: "#hum_student_gender",
            studentDateOfBirth: "#hum_student_date_of_birth",
            studentId: "#hum_student_id",
            // Academic Information
            studentBranchOfStudy: "#hum_student_branch",
            studentResidingStatus: "#hum_student_residing_status",
            studentActiveStatus: "#hum_student_active_status",
            // Contact Information
            studentPhoneNumber: "#hum_student_phone",
            studentEmail: "#hum_student_email",
            // Emergency Contact
            emergencyContactPersonName: "#hum_student_emergency_name",
            emergencyContactPhoneNumber: "#hum_student_emergency_phone",
            // Address Information
            studentAddressLine1: "#hum_student_address_line1",
            studentAddressLine2: "#hum_student_address_line2",
            studentCity: "#hum_student_city",
            studentState: "#hum_student_state",
            studentCountry: "#hum_student_country",
            studentPostalCode: "#hum_student_postal_code",
            // Form Actions
            cancelButton: "#hum_student_register_cancel",
            saveStudentButton: "#hum_student_register_save",
            smsMainContainer: "#hum_sms_main_layout"
        };
    }

    connectedCallback() {
        try {
            this.bindAllRequiredEvents();
            this.initializeStudentForm();
            this.showCancelConfirmation = this.initializePopOver();
            this.initializeToastr();
            this.initializeDatePicker();
            this.initializeInputMask();
            this.initializeStudentValidation();
        } catch (error) {
            console.log(error);
        }
    }

    bindAllRequiredEvents() {
        $(this)
            .on("click", this.selectors.saveStudentButton, { classObject: this }, this.handlerSaveStudent)
            .on("click", this.selectors.cancelButton, { classObject: this }, this.handlerCancelStudent)
            .on("click", this.selectors.studentRegisterBackBtn, { classObject: this }, this.handlerBackStudent)
            .on("input change", this.selectors.studentRegisterForm + " :input:not([type='hidden'])", { classObject: this }, this.handlerStudentFormInput);
    }

    initializeDatePicker() {
        const classObject = this;
        const datepickerConfig = {
            dateFormat: "d-m-Y",
            allowInput: true
        };
        $(classObject.selectors.studentDateOfBirth).flatpickr(datepickerConfig);
    }

    initializeInputMask() {
        $(this).find(this.selectors.studentPhoneNumber).inputmask("(999)-999-9999", {
            autoUnmask: true
        });
        $(this).find(this.selectors.emergencyContactPhoneNumber).inputmask("(999)-999-9999", {
            autoUnmask: true
        });
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

    initializePopOver() {
        let activeCancelConfirmation = null;
        const disposeActivePopover = () => {
            if (activeCancelConfirmation) {
                const popover = activeCancelConfirmation;
                activeCancelConfirmation = null;
                // Hide and dispose while the original button is still attached
                if (popover._element && popover._element.isConnected) {
                    popover.dispose();
                }
            }
        };
        const showCancelConfirmation = (button, onConfirm) => {
            // Dispose previous confirmation
            disposeActivePopover();
            const popover = new bootstrap.Popover(button, {
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
            activeCancelConfirmation = popover;
            button.addEventListener("shown.bs.popover", function handler() {
                const popoverId = button.getAttribute("aria-describedby");
                const popoverElement = document.getElementById(popoverId);
                if (!popoverElement) return;
                popoverElement.querySelector(".hum-confirm-no")?.addEventListener("click", function () {
                    disposeActivePopover();
                });
                popoverElement.querySelector(".hum-confirm-yes")?.addEventListener("click", function () {
                    // Dispose before executing the confirmation callback
                    disposeActivePopover();
                    if (typeof onConfirm === "function") {
                        onConfirm();
                    }
                });
            }, { once: true });
            popover.show();
        };
        return showCancelConfirmation;
    }

    initializeStudentValidation() {
        $(this).find(this.selectors.studentRegisterForm).validate({
            rules: {
                FirstName: {
                    required: true,
                    minlength: 2,
                    maxlength: 20,
                    lettersonly: true
                },
                LastName: {
                    required: true,
                    minlength: 1,
                    maxlength: 20,
                    lettersonly: true
                },
                gender: {
                    required: true
                },
                dateOfBirth: {
                    required: true
                },
                branchOfStudy: {
                    required: true
                },
                residingStatusFlag: {
                    required: true
                },
                phoneNumber: {
                    required: true,
                    digits: true,
                    minlength: 5,
                    maxlength: 15
                },
                mail: {
                    required: true,
                    validemail: true
                },
                emergencyContactPersonName: {
                    required: true
                },
                emergencyContactPhoneNumber: {
                    required: true,
                    digits: true,
                    minlength: 5,
                    maxlength: 15
                },
                addressLine1: {
                    required: true
                },
                state: {
                    required: true
                },
                country: {
                    required: true
                },
                postalCode: {
                    required: true
                }
            },
            messages: {
                FirstName: {
                    required: "Please enter first name.",
                    minlength: "First name must contain at least 2 characters.",
                    lettersonly: "Please enter letters only"
                },
                LastName: {
                    required: "Please enter last name.",
                    minlength: "Last name must contain at least 1 characters.",
                    lettersonly: "Please enter letters only"
                },
                gender: {
                    required: "Please select gender."
                },
                dateOfBirth: {
                    required: "Please select date of birth."
                },
                branchOfStudy: {
                    required: "Please select department."
                },
                residingStatusFlag: {
                    required: "Please select residence."
                },
                phoneNumber: {
                    required: "Please enter phone number.",
                    digits: "Please enter numbers only.",
                    minlength: "Phone number must contain 10 digits.",
                    maxlength: "Phone number must contain only 10 digits."
                },
                mail: {
                    required: "Please enter email address.",
                    validemail: "Please enter a valid email address."
                },
                emergencyContactPersonName: {
                    required: "Please enter emergency contact person name."
                },
                emergencyContactPhoneNumber: {
                    required: "Please enter emergency contact phone number.",
                    digits: "Please enter numbers only.",
                    minlength: "Emergency contact number must contain 10 digits.",
                    maxlength: "Emergency contact number must contain only 10 digits."
                },
                addressLine1: {
                    required: "Please enter address line 1."
                },
                state: {
                    required: "Please enter state."
                },
                country: {
                    required: "Please enter country."
                },
                postalCode: {
                    required: "Please enter postal code."
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

    handlerStudentFormInput(event) {
        const classObject = event.data.classObject;
        const form = $(classObject).find(classObject.selectors.studentRegisterForm);
        const hasValue = form.find(":input:not([type='hidden'])").not(classObject.selectors.studentActiveStatus).toArray().some(element => String($(element).val() || "").trim() !== "");
        form.find(classObject.selectors.saveStudentButton).prop("disabled", !hasValue);
    }

    handlerBackStudent(event) {
        event.preventDefault();
        const classObject = event.data.classObject;
        $(classObject.selectors.smsMainContainer).html("<hum-student-management-filtertable></hum-student-management-filtertable>");
    }

    handlerSaveStudent(event) {
        event.preventDefault();
        const classObject = event.data.classObject;
        const studentForm = $(classObject).find(classObject.selectors.studentRegisterForm)[0];
        if (!$(studentForm).valid()) {
            return;
        }
        // const studentId = $(classObject).find(classObject.selectors.studentId).val()
        classObject.initializeStudentForm();
        classObject.saveStudent();
    }

    saveStudent() {
        const classObject = this;
        const studentData = {
            studentId: $(this).find(this.selectors.studentId).val() || null,
            firstName: $(this).find(this.selectors.studentFirstName).val().trim(),
            middleName: $(this).find(this.selectors.studentMiddleName).val().trim(),
            lastName: $(this).find(this.selectors.studentLastName).val().trim(),
            gender: $(this).find(this.selectors.studentGender).val(),
            dateOfBirth: $(this).find(this.selectors.studentDateOfBirth).val().trim(),
            branchOfStudy: $(this).find(this.selectors.studentBranchOfStudy).val(),
            residingStatusFlag: $(this).find(this.selectors.studentResidingStatus).val(),
            phoneNumber: $(this).find(this.selectors.studentPhoneNumber).val().trim(),
            mail: $(this).find(this.selectors.studentEmail).val().trim(),
            emergencyContactPersonName: $(this).find(this.selectors.emergencyContactPersonName).val().trim(),
            emergencyContactPhoneNumber: $(this).find(this.selectors.emergencyContactPhoneNumber).val().trim(),
            addressLine1: $(this).find(this.selectors.studentAddressLine1).val().trim(),
            addressLine2: $(this).find(this.selectors.studentAddressLine2).val().trim(),
            city: $(this).find(this.selectors.studentCity).val().trim(),
            state: $(this).find(this.selectors.studentState).val().trim(),
            country: $(this).find(this.selectors.studentCountry).val().trim(),
            postalCode: $(this).find(this.selectors.studentPostalCode).val().trim(),
            activeStatusFlag: $(this).find(this.selectors.studentActiveStatus).val(),
            teacherId: 6
        };
        $.ajax({
            url: "https://dev-api.humhealth.com/StudentManagementSystemAPI/student/saveOrUpdate",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(studentData),
            success: function (response) {
                if (response.status === "Success") {
                    toastr.success(response.data);
                    $(classObject.selectors.smsMainContainer).html("<hum-student-management-filtertable></hum-student-management-filtertable>");
                } else {
                    toastr.error(response.data);
                }
            },
            error: function (xhr) {
                console.error("Save Student Error:", xhr.responseText);
                toastr.error("Unable to save student. Please check the entered details.");
            }
        });
    }

    handlerCancelStudent(event) {
        event.preventDefault();
        const classObject = event.data.classObject;
        const cancelButton = event.currentTarget;
        classObject.showCancelConfirmation(cancelButton, function () {
            $(classObject.selectors.smsMainContainer).html("<hum-student-management-filtertable></hum-student-management-filtertable>");
        });
    }

    // edit student
    initializeStudentForm() {
        const classObject = this;
        const studentId = $(this).attr("student-id");
        $(this).find(this.selectors.saveStudentButton).prop("disabled", true);
        if (studentId) {
            $(classObject).find(classObject.selectors.studentRegisterTitle).text("Edit Student");
            $(classObject).find(classObject.selectors.saveStudentButton).text("Update Student");
            this.getStudentById(studentId);
        } else {
            $(this).find(this.selectors.studentRegisterTitle).text("Register Student");
            $(this).find(this.selectors.saveStudentButton).text("Save Student");
        }
    }

    // Logic for Edit student
    getStudentById(studentId) {
        const classObject = this;
        $.ajax({
            url: "https://dev-api.humhealth.com/StudentManagementSystemAPI/student/" + studentId,
            type: "GET",
            dataType: "json",
            success: function (response) {
                if (response.status === "Success") {
                    const student = response.data;
                    $(classObject).find(classObject.selectors.studentId).val(student.studentId);
                    $(classObject).find(classObject.selectors.studentFirstName).val(student.firstName || "");
                    $(classObject).find(classObject.selectors.studentMiddleName).val(student.middleName || "");
                    $(classObject).find(classObject.selectors.studentLastName).val(student.lastName || "");
                    $(classObject).find(classObject.selectors.studentGender).val(student.gender || "");
                    $(classObject).find(classObject.selectors.studentDateOfBirth).val(student.dateOfBirth || "");
                    $(classObject).find(classObject.selectors.studentBranchOfStudy).val(student.branchOfStudy || "");
                    $(classObject).find(classObject.selectors.studentResidingStatus).val(student.residingStatusFlag || "");
                    $(classObject).find(classObject.selectors.studentTeacherId).val(student.teacherId ?? "");
                    // console.log(student.teacherId);
                    $(classObject).find(classObject.selectors.studentActiveStatus).val(student.activeStatusFlag || "A");
                    $(classObject).find(classObject.selectors.studentPhoneNumber).val(student.phoneNumber || "");
                    $(classObject).find(classObject.selectors.studentEmail).val(student.mail || "");
                    $(classObject).find(classObject.selectors.emergencyContactPersonName).val(student.emergencyContactPersonName || "");
                    $(classObject).find(classObject.selectors.emergencyContactPhoneNumber).val(student.emergencyContactPhoneNumber || "");
                    $(classObject).find(classObject.selectors.studentAddressLine1).val(student.addressLine1 || "");
                    $(classObject).find(classObject.selectors.studentAddressLine2).val(student.addressLine2 || "");
                    $(classObject).find(classObject.selectors.studentCity).val(student.city || "");
                    $(classObject).find(classObject.selectors.studentState).val(student.state || "");
                    $(classObject).find(classObject.selectors.studentCountry).val(student.country || "");
                    $(classObject).find(classObject.selectors.studentPostalCode).val(student.postalCode || "");
                    $(classObject).find(classObject.selectors.saveStudentButton).prop("disabled", false);
                } else {
                    toastr.error(response.data);
                }
            },
            error: function (xhr) {
                console.error("Get Student Error:", xhr.responseText);
                toastr.error("Unable to retrieve student details.");
            }
        });
    }

}

customElements.define("hum-student-management-register", HumStudentManagementRegister);