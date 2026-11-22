class HumStudentManagementFiltertable extends HTMLElement{

    constructor(){
       super();

       const template =document.getElementById("hum_student_management_filtertable");

       this.appendChild(
         template.content.cloneNode(true)
       );

 this.selectors = {
    studentManagementPage: ".hum-student-page",

    addStudentButton: "#hum_student_add_btn",

    searchColumn: "#hum_student_search_column",
    searchInput: "#hum_student_search_input",

    departmentFilter: "#hum_student_department_filter",
    genderFilter: "#hum_student_gender_filter",
    residenceFilter: "#hum_student_residence_filter",
    statusFilter: "#hum_student_status_filter",

    studentTable: "#hum_student_table",
    studentTableBody: "#hum_student_table_body",

    studentRecordCount: "#hum_student_record_count",
    studentPagination: "#hum_student_pagination",
    previousPageButton: "#hum_student_previous_page",
    nextPageButton: "#hum_student_next_page",
     smsMainContainer:"#hum_sms_main_layout",
     
     studentRegisterTitle:"#hum_student_register_title",
     studentViewButton: ".hum-student-view-btn",
     studentEditButton: ".hum-student-edit-btn",
     studentStatusButton: ".hum-student-status-btn"
}
      this.studentDataTable = null;

      this.studentDataTableConfig={
            processing:true,
            serverSide:true,
            pageLength:10,

            searching: false,

    dom:
    't' +
    '<"row align-items-center mt-2 mb-1 px-2"' +
        '<"col-md-6 d-flex align-items-center"i>' +
        '<"col-md-6 d-flex justify-content-md-end hum-custom-pagination"p>' +
    '>',

            ajax:{
                url:"https://dev-api.humhealth.com/StudentManagementSystemAPI/student/list",
                type:"POST",
                dataType:"json",
               contentType: "application/json",

                data:(requestData)=>{
                   return JSON.stringify(
                    this.studentFormatRequestData(requestData)
                   );
                },


                dataSrc: (jsonResponse)=>{
                  return this.displayStudentDataList(jsonResponse);
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
            data: "branchOfStudy",
            searchable: false,
            orderable: false,
            visible: true
        },
        {
            data: "gender",
            searchable: false,
            orderable: false,
            visible: true
        },
        {
            data: "residingStatusFlag",
            searchable: false,
            orderable: false,
            visible: true
        },
        {
            data: "phoneNumber",
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
            data: "activeStatusFlag",
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
      columnDefs:[
        
         { 
          targets: "_all",
            className:"text-center"
         }
      ]
      };

    }
      connectedCallback(){
        try{
                this.bindAllRequiredEvents();
                this.initializeToolTip();
                this.initializeToastr();
        this.getStudentList();
        }
        catch(error){
           console.log(error);
        }
      
      }  

      bindAllRequiredEvents(){
        $(this).on("click",
            this.selectors.addStudentButton,
            {classObject: this },
              this.handlerAddStudentBtn
        );
        $(this).on("input",
          this.selectors.searchInput,
          {classObject:this},
          this.handlerStudentSearch
        );
        $(this).on("change",
          this.selectors.searchColumn,
          {classObject:this},
          this.handlerStudentSearch
        );

        $(this).on("change",
          [
             this.selectors.departmentFilter,
             this.selectors.genderFilter,
             this.selectors.residenceFilter,
             this.selectors.statusFilter
          ].join(","),
          {classObject:this},
          this.handlerStudentFilter
        );

        $(this).on(
          "click",
          this.selectors.studentViewButton,
          { classObject: this },
          this.handlerViewStudentClick
   );
      $(this).on(
        "click",
        this.selectors.studentEditButton,
        {classObject:this},
        this.handlerEditStudentClick
      );
      $(this).on("click",
        this.selectors.studentStatusButton,
        {classObject:this},
        this.handlerStatusStudentClick
      ) ;

      }

initializeToolTip() {

    new bootstrap.Tooltip(this, {
        selector: '[data-bs-toggle="tooltip"]',
        container: 'body',
        trigger: 'hover focus'
    });

}
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
  
 initializeToastr() {
    toastr.options = {
        closeButton: true,
        progressBar: true,
        positionClass: "toast-top-center",
        timeOut: 3000,
        preventDuplicates: true
    };
}

      handlerAddStudentBtn(event){
        event.preventDefault();
        const classObject = event.data.classObject;
        $(classObject.selectors.smsMainContainer).html("<hum-student-management-register></hum-student-management-register>")

      }

      handlerStudentSearch(event){
           const classObject = event.data.classObject;

          classObject.studentDataTable.page.len(10).draw(true);
      }

      handlerStudentFilter(event){
           const classObject = event.data.classObject;
           classObject.studentDataTable.page.len(10).draw(true);
      }

      // View Student Button
   handlerViewStudentClick(event) {
    const classObject = event.data.classObject;

     const studentId = $(event.currentTarget).data("student-id");

    $(classObject.selectors.smsMainContainer).html(
        `<hum-student-management-profile student-id="${studentId}"></hum-student-management-profile>`
    );
}

    handlerEditStudentClick(event){
     const classObject = event.data.classObject;

     const studentId= $(event.currentTarget).data("student-id");

     $(classObject.selectors.smsMainContainer).html(
      `<hum-student-management-register student-id="${studentId}"></hum-student-management-register>`
     );
    }

   handlerStatusStudentClick(event){
     const classObject = event.data.classObject;

     const studentId= $(event.currentTarget).data("student-id");

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

      studentStatusChange(studentId){
         const classObject=this;

         $.ajax({
           url:"https://dev-api.humhealth.com/StudentManagementSystemAPI/student/activateOrDeactivate/"+studentId,
           type:"POST",
           dataType:"json",

           success:function(response){
             if(response.status === "Success"){

                $(classObject.selectors.smsMainContainer).html(
            `<hum-student-management-filterTable "></hum-student-management-filterTable>`
     );
               
             } else{
                  toastr.error(response.data)
             }

      
           },
           
            error:function(xhr){
               console.error(xhr.responseText);
            }
            
         })
      }

      studentFormatRequestData(requestData){
        const classObject =this;

        this.studentFilterRequest ={
           draw: requestData.draw,
           length:requestData.length,
           start:requestData.start,

           filter: {
            gender: $(classObject.selectors.genderFilter).val() || "",
            residingStatusFlag: $(classObject.selectors.residenceFilter).val() || "",
            activeFlag:$(classObject.selectors.statusFilter).val() || "A",
            branchOfStudy: $(classObject.selectors.departmentFilter).val() || ""
        },

        order:{
          column:"",
          type:""
        },

        search:$(classObject.selectors.searchInput).val()||"",
        searchColumn:$(classObject.selectors.searchColumn).val()||""

        };

         return this.studentFilterRequest;
      }

      displayStudentDataList(response){
        const studentDataArray =[];
        if(response.status === "Success"){
              let index=1;
           for(const res of response.data){
              const data={};
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
             let residing= res.residingStatusFlag
             switch(residing){
               case "D":
                residing ="Day Scholar";
                break;
                case "H":
                  residing="Hosteller";
                  break;
                default:
                  residing="";
                  break;
             }

             let activeFlag= res.activeStatusFlag;
              switch(activeFlag){
                case "A":
                 activeFlag="Active";
                 break;
                 case "I":
                  activeFlag="Inactive";
                  break;      
                  default:
                  activeFlag="";
                  break;
              }
              let studentGender = res.gender;

                   switch(studentGender){
                case "MALE":
                 studentGender="Male";
                 break;
                 case "FEMA":
                  studentGender="Female";
                  break;      
                  default:
                  studentGender="";
                  break;
              }
              data["sno"]=index++;
              data["name"]=[
                res.firstName,
                res.middleName,
                res.lastName
              ].filter(Boolean).join(" ");
              
              data["branchOfStudy"]= branchOfStudy;
              data["gender"]=studentGender;
              data["residingStatusFlag"]=residing;
              data["phoneNumber"] = res.phoneNumber;
              data["email"]= res.mail;
              data["activeStatusFlag"]= this.forActive(activeFlag);
              data["action"] = this.forAction(res.studentId, res.activeStatusFlag);
              studentDataArray.push(data);
           }
            
        }
         return studentDataArray;
      }

     
forAction(studentId, activeStatusFlag) {

    const statusIcon = activeStatusFlag === "A"
        ? "person_check"
        : "person_off";

    const statusTitle = activeStatusFlag === "A"
        ? "Active"
        : "Inactive";
    const statusClass = activeStatusFlag ==="A"
          ?"btn btn-sm btn-outline-success"
          :"btn btn-sm btn-outline-danger"

    return `
        <button type="button"
            class="btn btn-sm btn-outline-primary hum-student-view-btn"
            data-student-id="${studentId}"
               data-bs-toggle="tooltip" 
            title="View Student">
            <span class="material-symbols-outlined d-flex text-center hum-icon-font ">visibility</span>
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
    forActive(activeFlag){
        if(activeFlag === "Active"){
            return `<span class="student-status-active student-status">Active</span>`;
        }

        return `<span class="student-status-inactive student-status">Inactive</span>`;
    }
  getStudentList(){
    if(this.studentDataTable){

    }
    else{
       this.studentDataTable=$(this.selectors.studentTable).DataTable(this.studentDataTableConfig);
    }
  }

}
  customElements.define("hum-student-management-filtertable",HumStudentManagementFiltertable);
