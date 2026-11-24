class HumStudentManagementProfile extends HTMLElement {
    constructor() {
        super();
        const template = document.getElementById("hum_student_profile");
        this.appendChild(template.content.cloneNode(true));
        this.selectors = {
            headerId: "#hum_student_profile_header_id",
            headerName: "#hum_student_profile_header_name",
            headerSeparator: "#hum_student_profile_header_separator",
            backButton: "#hum_student_profile_back_button",
            editButton: "#hum_student_profile_edit_button",
            avatar: "#hum_student_profile_avatar",
            studentName: "#hum_student_profile_name",
            studentId: "#hum_student_profile_student_id",
            status: "#hum_student_profile_status",
            firstName: "#hum_student_profile_first_name",
            middleName: "#hum_student_profile_middle_name",
            lastName: "#hum_student_profile_last_name",
            gender: "#hum_student_profile_gender",
            dateOfBirth: "#hum_student_profile_dob",
            branch: "#hum_student_profile_branch",
            residence: "#hum_student_profile_residence",
            academicStatus: "#hum_student_profile_academic_status",
            teacherId: "#hum_student_profile_teacher_id",
            phone: "#hum_student_profile_phone",
            email: "#hum_student_profile_email",
            emergencyName: "#hum_student_profile_emergency_name",
            emergencyPhone: "#hum_student_profile_emergency_phone",
            address1: "#hum_student_profile_address1",
            address2: "#hum_student_profile_address2",
            city: "#hum_student_profile_city",
            state: "#hum_student_profile_state",
            country: "#hum_student_profile_country",
            postalCode: "#hum_student_profile_postal_code",
            profileImageInput: "#hum_student_profile_image_input",
            uploadImageBtn: "#hum_student_profile_upload_image_button",
            deleteImageBtn: "#hum_student_profile_delete_image_button",
            profileImageView: "#hum_sms_student_image-view",
            profileImageModalView: "#hum_student_profile_modal_image",
            studentProfileImageOpen: "#hum_student_profile_image_modal",
            smsMainContainer: "#hum_sms_main_layout"
        };
    }

    connectedCallback() {
        try {
            this.bindAllRequiredEvents();
            this.initializeStudentIdView();
        } catch (error) {
            console.log(error);
        }
    }

    bindAllRequiredEvents() {
        $(this)
            .on("click", this.selectors.backButton, { classObject: this }, this.handlerBackButton)
            // .on("click", this.selectors.editButton, { classObject: this }, this.handlerEditStudentClick)
            .on("click", this.selectors.uploadImageBtn, { classObject: this }, this.handlerUploadStudentClick)
            .on("change", this.selectors.profileImageInput, { classObject: this }, this.handlerProfileImageChange)
            .on("click", this.selectors.profileImageView, { classObject: this }, this.handlerProfileImageView)
            .on("click", this.selectors.deleteImageBtn, { classObject: this }, this.handlerDeleteStudentClick);
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

    // Back to Student
    handlerBackButton(event) {
        const classObject = event.data.classObject;
        $(classObject.selectors.smsMainContainer).html("<hum-student-management-filtertable></hum-student-management-filtertable>");
    }

    handlerUploadStudentClick(event) {
        event.preventDefault();
        const classObject = event.data.classObject;
        $(classObject).find(classObject.selectors.profileImageInput).trigger("click");
    }

    handlerProfileImageChange(event) {
        const classObject = event.data.classObject;
        const imageInput = event.currentTarget;
        if (imageInput.files.length === 0) {
            return;
        }
        classObject.uploadStudentProfileImage(imageInput.files[0]);
    }

    handlerProfileImageView(event) {
        event.preventDefault();
        const classObject = event.data.classObject;
        const clickedImage = event.currentTarget;
        const imageSrc = $(clickedImage).attr("src");
        $(classObject).find(classObject.selectors.profileImageModalView).attr("src", imageSrc);
        $(classObject).find(classObject.selectors.profileImageModal)[0];
        $(classObject).find(classObject.selectors.studentProfileImageOpen).modal("show");
    }

    handlerDeleteStudentClick(event) {
        event.preventDefault();
        const classObject = event.data.classObject;
        const studentId = $(classObject).attr("student-id");
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to delete the student profile?",
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
                classObject.deleteStudentImage(studentId);
            }
        });
    }

    deleteStudentImage(student) {
        const self = this;
        $.ajax({
            url: "https://dev-api.humhealth.com/StudentManagementSystemAPI/student/profile/delete/" + student,
            type: "POST",
            dataType: "json",
            success: function (response) {
                if (response.status === "Success") {
                    const avatar = $(self).find(self.selectors.avatar);
                    avatar.find("img").remove();
                    const studentName = $(self).find(self.selectors.studentName).text().trim();
                    const firstLetter = studentName ? studentName.charAt(0).toUpperCase() : "?";
                    $(self).find(self.selectors.avatar).text(firstLetter);
                } else {
                    toastr.error(response.data);
                }
            },
            error: function (xhr) {
                const message = xhr.responseText;
                toastr.error(message);
            }
        });
    }

    initializeStudentIdView() {
        const currentStudentId = $(this).attr("student-id");
        if (currentStudentId) {
            this.viewStudent(currentStudentId);
        }
    }

    // View Student
    viewStudent(studentId) {
        const SELF = this;
        $.ajax({
            url: "https://dev-api.humhealth.com/StudentManagementSystemAPI/student/" + studentId,
            type: "GET",
            dataType: "json",
            success: function (response) {
                if (response.status === "Success") {
                    const student = response.data;
                    SELF.viewStudentDetails(student);
                } else {
                    toastr.error(response.data);
                }
            },
            error: function (xhr) {
                console.error("View Student Error:", xhr.responseText);
                toastr.error("Unable to load student details.");
            }
        });
    }

    // View Student
    viewStudentDetails(student) {
        const fullName = [student.firstName, student.middleName, student.lastName].filter(Boolean).join(" ");
        // Branch comparison
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
        // Residence comparison
        let residing = student.residingStatusFlag;
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
        // Active status comparison
        let activeFlag = student.activeStatusFlag;
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
        // Gender comparison
        let gender = student.gender;
        switch (gender) {
            case "MALE":
                gender = "Male";
                break;
            case "FEMA":
                gender = "Female";
                break;
            default:
                gender = "";
                break;
        }
        // Student heading
        $(this).find(this.selectors.headerId).text(student.studentId);
        $(this).find(this.selectors.headerName).text(fullName);
        $(this).find(this.selectors.headerSeparator).prop("hidden", !fullName);
        // Student summary
        const firstLetter = fullName ? fullName.charAt(0).toUpperCase() : "?";
        $(this).find(this.selectors.avatar).text(firstLetter);
        this.getStudentProfile(student.studentId);
        $(this).find(this.selectors.studentName).text(fullName || "-");
        $(this).find(this.selectors.status).text(activeFlag || "-");
        // Personal information
        $(this).find(this.selectors.firstName).text(student.firstName || "-");
        $(this).find(this.selectors.middleName).text(student.middleName || "-");
        $(this).find(this.selectors.lastName).text(student.lastName || "-");
        $(this).find(this.selectors.gender).text(gender || "-");
        $(this).find(this.selectors.dateOfBirth).text(student.dateOfBirth || "-");
        // Academic information
        $(this).find(this.selectors.branch).text(branchOfStudy || "-");
        $(this).find(this.selectors.residence).text(residing || "-");
        $(this).find(this.selectors.academicStatus).text(activeFlag || "-");
        $(this).find(this.selectors.teacherId).text(student.teacherId ?? "-");
        // Contact details
        $(this).find(this.selectors.phone).text(student.phoneNumber || "-");
        $(this).find(this.selectors.email).text(student.mail || "-");
        // Emergency contact
        $(this).find(this.selectors.emergencyName).text(student.emergencyContactPersonName || "-");
        $(this).find(this.selectors.emergencyPhone).text(student.emergencyContactPhoneNumber || "-");
        // Address
        $(this).find(this.selectors.address1).text(student.addressLine1 || "-");
        $(this).find(this.selectors.address2).text(student.addressLine2 || "-");
        $(this).find(this.selectors.city).text(student.city || "-");
        $(this).find(this.selectors.state).text(student.state || "-");
        $(this).find(this.selectors.country).text(student.country || "-");
        $(this).find(this.selectors.postalCode).text(student.postalCode || "-");
    }

    getStudentProfile(studentId) {
        const SELF = this;
        $.ajax({
            url: "https://dev-api.humhealth.com/StudentManagementSystemAPI/student/profile/view/" + studentId,
            type: "POST",
            dataType: "json",
            success: function (response) {
                const studentImageData = response.data;
                if (studentImageData) {
                    const imageUrl = SELF.changebase64toBlob(studentImageData.file);
                    console.log(imageUrl);
                    $(SELF).find(SELF.selectors.avatar).html(`<img src="${imageUrl}" alt="" class=" student-image" id="hum_sms_student_image-view">`);
                }
            }
        });
    }

    changebase64toBlob(base64) {
        const base64Data = base64.split(",")[1] || base64;
        const f = atob(base64Data);
        const a = new Array(f.length);
        for (let index = 0; index < a.length; index++) {
            a[index] = f.charCodeAt(index);
        }
        const arr = new Uint8Array(a);
        const ui = new Blob([arr], { type: "image/jpeg" });
        return URL.createObjectURL(ui);
    }

    uploadStudentProfileImage(profileImage) {
        const classObject = this;
        const studentId = $(this).attr("student-id");
        const teacherId = 6;
        if (!studentId) {
            toastr.error("Student ID not Found");
            return;
        }
        const formData = new FormData();
        formData.append("studentId", studentId);
        formData.append("teacherId", teacherId);
        formData.append("profileImage", profileImage);
        $.ajax({
            url: "https://dev-api.humhealth.com/StudentManagementSystemAPI/student/profile/uploadOrEdit",
            type: "POST",
            data: formData,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (response) {
                if (response.status === "Success") {
                    toastr.success(response.data);
                    classObject.viewStudent(studentId);
                }
            },
            error: function (error) {
                const message = error.responseText;
                toastr.error(message);
            }
        });
    }
}

customElements.define("hum-student-management-profile", HumStudentManagementProfile);