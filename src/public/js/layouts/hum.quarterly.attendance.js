class HumQuarterlyAttendance extends HTMLElement{
    constructor(){
        super();
        const template=document.getElementById("hum_quarterly_attendance_temp");

        this.appendChild(template.content.cloneNode(true));

        
this.selectors = {
    // Filter Section
    filterQuarter: "#hum_quarterly_filter_quarter",
    filterYear: "#hum_quarterly_filter_year",
    filterCompliance: "#hum_quarterly_filter_compliance",
    filterBranch: "#hum_quarterly_filter_branch",
    filterStudent: "#hum_quarterly_filter_student",
    filterLength:"#hum_quarter_page_length",
   applyFilterButton: "#hum_quarterly_filter_apply_button",
   resetFilterButton: "#hum_quarterly_filter_reset_button",
   filterChanges:"#filter_changes_lable",

    // Table
    attendanceTable: "#hum_quarterly_attendance_table",
    tableBody: "#hum_quarterly_table_body",

    // Pagination
    recordInfo: "#hum_quarterly_record_info",
    pageLength: "#hum_quarterly_page_length",
    pagination: "#hum_quarterly_pagination",

    // View Details Modal
    detailsModal: "#hum_quarterly_details_modal",
    detailsAvatar: "#hum_quarterly_details_avatar",
    detailsStudentName: "#hum_quarterly_details_student_name",
    detailsBranch: "#hum_quarterly_details_branch",
    detailsQuarter: "#hum_quarterly_details_quarter",
    detailsCompliance: "#hum_quarterly_details_compliance",
    detailsWorkingDays: "#hum_quarterly_details_working_days",
    detailsPresentDays: "#hum_quarterly_details_present_days",
    detailsAbsentDays: "#hum_quarterly_details_absent_days",
    detailsEacDays: "#hum_quarterly_details_eac_days",
    detailsSickDays: "#hum_quarterly_details_sick_days",

    // Download Excel Modal
    downloadModal: "#hum_quarterly_download_modal",
    downloadExcelImage: "#hum_quarterly_download_excel_image",
    downloadDescription: "#hum_quarterly_download_description",
    downloadQuarter: "#hum_quarterly_download_quarter",
    downloadBtn:"#hum_quarterly_download_confirm_button",

    // Email Modal
    emailModal: "#hum_quarterly_email_modal",
    emailAvatar: "#hum_quarterly_email_avatar",
    emailStudentName: "#hum_quarterly_email_student_name",
    emailBranch: "#hum_quarterly_email_branch",
    emailRecipient: "#hum_quarterly_email_recipient",
    emailReportInfo: "#hum_quarterly_email_report_info",
    emailBtn:"#hum_quarterly_email_send_button",

    // Action Button
    viewAction:".hum-quarterly-view-btn",
    downloadAction:".hum-quarterly-download-btn",
    mailAction:".hum-quarterly-mail-btn"
};
    this.quarterlyAttendanceDataTable = null;
    // const fullName="";
    // Filters are applied only after clicking Apply.
this.quarterlyAppliedFilters = {
     length: 10,
    quarter: null,
    complianceReportFilter: "",
    studentBranchOfStudy: "",
    search: "",
    searchColumn: "Fullname"
};

    this.quarterlyAttendanceDataTableConfig={
         processing:true,
         serverSide:true,
         pageLength:10,
         searching: true,
          dom:
             't' +
             '<"row align-items-center mt-2 mb-1 px-2"' +
             '<"col-md-6 d-flex align-items-center"i>' +
             '<"col-md-6 d-flex justify-content-md-end hum-custom-pagination"p>' +
             '>', 
            
            ajax:{
                url:"https://dev-api.humhealth.com/StudentManagementSystemAPI/attendanceReport/list",
                type:"POST",
                dataType:"json",
                contentType:"application/json",

                data:(requestData)=>{
                    return JSON.stringify(this.quarterlyAttendanceFormatRequestData(requestData))
                },
                dataSrc:(jsonResponse)=>{
                    return this.displayQuarterlyAttendanceList(jsonResponse);
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

           data: "quarter",
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
             data: "presentDays",
            searchable: false,
            orderable: false,
            visible: true
         },
         {
           data: "absentDays",
            searchable: false,
            orderable: false,
            visible: true
         },
         {
            data: "ecaLeaves",
            searchable: false,
            orderable: false,
            visible: true
         },
         {
            data: "sickLeaves",
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
            data: "action",
            searchable: false,
            orderable: false,
            visible: true
          }

        ],

        columnDefs:[
            {
                targets:"_all",
                className:"text-center"
            }
        ]
    };
    }
    connectedCallback(){
        try{
            this.handlerYearOption();
           this.bindAllRequiredEvents();
           this.initializeToolTip();
           this.initializeToastr();
         this.getQuarterlyAttendanceList();
        }catch(error){

        }
    }
     bindAllRequiredEvents(){
      $(this)
      .on("click",this.selectors.viewAction,{classObject:this},this.handlerViewQuarterlyClick)
      .on("click",this.selectors.downloadAction,{classObject:this},this.handlerDownloadQuarterlyClick)
      .on("click",this.selectors.mailAction,{classObject:this},this.handlerMailQuarterlyClick)
 
    .on("click",this.selectors.downloadBtn,{classObject:this},this.handlerDownloadQuarterlySubmit)
    .on("click",this.selectors.emailBtn,{classObject:this},this.handlerMailQuarterlySubmit)
    // Apply filters
   .on("click",this.selectors.applyFilterButton,{classObject: this},this.handlerApplyQuarterlyFilter)
    // Reset filters
   .on("click", this.selectors.resetFilterButton,{classObject: this},this.handlerResetQuarterlyFilter)
   // Reset button visibility
   .on(
            "input change",
            [
                this.selectors.filterQuarter,
                this.selectors.filterYear,
                this.selectors.filterCompliance,
                this.selectors.filterBranch,
                this.selectors.filterStudent,
                this.selectors.filterLength
            ].join(","),
            { classObject: this },
            this.handlerQuarterlyResetVisibility
);
   // Page length
//    .on("change", this.selectors.filterLength,{classObject: this},this.handlerQuarterlyLengthChange)
}

initializeToolTip() {

    new bootstrap.Tooltip(this, {
        selector: '[data-bs-toggle="tooltip"]',
        container: 'body',
        trigger: 'hover focus'
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

handlerApplyQuarterlyFilter(event) {

    const classObject = event.data.classObject;

    const length = Number($(classObject).find(classObject.selectors.filterLength).val()) || 10;

    const quarter = $(classObject)
        .find(classObject.selectors.filterQuarter).val();

    const year = $(classObject).find(classObject.selectors.filterYear).val();

    const compliance = $(classObject)
        .find(classObject.selectors.filterCompliance).val();

    classObject.quarterlyAppliedFilters = {
        length: length,
        quarter: (quarter && year) ? quarter + "-" + year : null,
        complianceReportFilter: compliance || "",
        studentBranchOfStudy: $(classObject)
            .find(classObject.selectors.filterBranch).val() || "",
        search: $(classObject)
            .find(classObject.selectors.filterStudent).val().trim(),
        searchColumn: "Fullname"
    };

    classObject.quarterlyAttendanceDataTable.page.len(length).draw(true);
}


// Reset Quarterly Filters
handlerResetQuarterlyFilter(event) {

    const classObject = event.data.classObject;

    $(classObject).find(classObject.selectors.filterQuarter).val("");
  $(classObject).find(classObject.selectors.filterYear).val(String(new Date().getFullYear()));
    $(classObject).find(classObject.selectors.filterCompliance).val("");
    $(classObject).find(classObject.selectors.filterBranch).val("");
    $(classObject).find(classObject.selectors.filterStudent).val("");
    $(classObject).find(classObject.selectors.filterLength).val(10);

    classObject.quarterlyAppliedFilters = {
        length: 10,
        quarter: null,
        complianceReportFilter: "",
        studentBranchOfStudy: "",
        search: "",
        searchColumn: "Fullname"
    };

    const length = Number(
        $(classObject).find(classObject.selectors.filterLength).val()
    ) || 10;

    classObject.quarterlyAttendanceDataTable.page.len(length).draw(true);

    // Hide reset button
    $(classObject.selectors.resetFilterButton).addClass("d-none");
}

handlerQuarterlyResetVisibility(event) {

    const classObject = event.data.classObject;
    const today = new Date();
    const defaultYear = String(today.getFullYear());
    const quarter = $(classObject.selectors.filterQuarter).val() || "";
    const year = $(classObject.selectors.filterYear).val() || "";
    const compliance = $(classObject.selectors.filterCompliance).val() || "";
    const branch = $(classObject.selectors.filterBranch).val() || "";
    const student = $(classObject.selectors.filterStudent).val().trim();
    const length = Number($(classObject.selectors.filterLength).val()) || 10;

    if (
        quarter !== "" ||
        year !== defaultYear ||
        compliance !== "" ||
        branch !== "" ||
        student !== "" ||
        length !== 10
    ) {
        $(classObject.selectors.resetFilterButton).removeClass("d-none");
         $(classObject).find(classObject.selectors.filterChanges).text(" Filter conditions changed, Click submit.");
    }
    else {
        $(classObject.selectors.resetFilterButton).addClass("d-none");
         $(classObject).find(classObject.selectors.filterChanges).text("");
    }
}
// Page length dropdown change
// handlerQuarterlyLengthChange(event){
//     const classObject = event.data.classObject;
//     const length = Number($(event.currentTarget).val()) || 50;

//     classObject.quarterlyAttendanceDataTable.page.len(length).draw(true);
// }

    handlerViewQuarterlyClick(event){
        const classObject =event.data.classObject;
        const quarterlyId = $(event.currentTarget).attr("data-quarterly-id");
        const fullName=$(event.currentTarget).attr("data-quarterly-name");

        classObject.viewQuarterly(quarterlyId,fullName);
    }
    handlerDownloadQuarterlyClick(event){
        const classObject =event.data.classObject;
        const quarterlyId = $(event.currentTarget).attr("data-quarterly-id");
        const fullName=$(event.currentTarget).attr("data-quarterly-name");
        classObject.downloadQuarterly(quarterlyId,fullName);
    }
    handlerDownloadQuarterlySubmit(event){
         const classObject =event.data.classObject;
        const quarterlyId = $(event.currentTarget).attr("data-quarterly-id");
        classObject.downloadQuarterlySubmit(quarterlyId);
    }
    handlerMailQuarterlyClick(event){
      const classObject =event.data.classObject;
        const quarterlyId = $(event.currentTarget).attr("data-quarterly-id");
        const fullName=$(event.currentTarget).attr("data-quarterly-name");

        classObject.mailQuarterly(quarterlyId,fullName);
    }
      handlerMailQuarterlySubmit(event){
         const classObject =event.data.classObject;
        const quarterlyId = $(event.currentTarget).attr("data-quarterly-id");
        classObject.mailQuarterlySubmit(quarterlyId);
    }

    viewQuarterly(quarterlyId,fullName){
        const classObject=this;
        $.ajax({
             url:"https://dev-api.humhealth.com/StudentManagementSystemAPI/attendanceReport/"+quarterlyId,
             type:"GET",
             dataType:"json",

             success:function(response){
                if(response.status ==="Success"){
                    const quarterly = response.data;
                    const firstLetter= quarterly.studentFirstName.trim().charAt(0).toUpperCase();
                   let branchOfStudy = quarterly.studentBranchOfStudy;

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

              let complianceStatusFlag = quarterly.attendanceComplianceStatusFlag;
             switch(complianceStatusFlag){
                case "Y":
                 complianceStatusFlag="Compliant";
                 break;
                 case "N":
                  complianceStatusFlag="Not Compliant";
                  break;      
                  default:
                  complianceStatusFlag="";
                  break;
              }

                    $(classObject).find(classObject.selectors.detailsAvatar).text(firstLetter);
                    $(classObject).find(classObject.selectors.detailsStudentName).text(fullName);
                    $(classObject).find(classObject.selectors.detailsBranch).text(branchOfStudy);
                    $(classObject).find(classObject.selectors.detailsQuarter).text(quarterly.quarterAndYear);
                    $(classObject).find(classObject.selectors.detailsCompliance).html(classObject.forCompliance(complianceStatusFlag));
                    $(classObject).find(classObject.selectors.detailsWorkingDays).text(quarterly.totalSchoolWorkingDays);
                    $(classObject).find(classObject.selectors.detailsPresentDays).text(quarterly.totalDaysOfPresent);
                    $(classObject).find(classObject.selectors.detailsAbsentDays).text(quarterly.totalDaysOfAbsents);
                    $(classObject).find(classObject.selectors.detailsEacDays).text(quarterly.totalApprovedActivitiesPermissionDays);
                    $(classObject).find(classObject.selectors.detailsSickDays).text(quarterly.totalApprovedSickDays);
                    $(classObject).find(classObject.selectors.detailsModal).modal("show");
                }
                else{
                    toastr.error(response.data);
                }
             },
             error:function(error){
                console.error(error.responseText);
                toastr.error("Unable to load quarterly details")
             }
        })

    }
    downloadQuarterly(quarterlyId,fullName){
         const classObject=this;
        
          $.ajax({
            url:"https://dev-api.humhealth.com/StudentManagementSystemAPI/attendanceReport/"+quarterlyId,
            type:"GET",
            dataType:"json",

            success:function(response){
                if(response.status==="Success"){
                  const quarterly = response.data;
 
              $(classObject).find(classObject.selectors.downloadDescription) .text((fullName || "").toUpperCase());
               $(classObject).find(classObject.selectors.downloadQuarter).text(quarterly.quarterAndYear || "")
               $(classObject).find(classObject.selectors.downloadBtn).attr("data-quarterly-id", quarterlyId);
               $(classObject).find(classObject.selectors.downloadModal).modal("show");

                }
            },
            error:function(error){
            console.error(error);
            toastr.error("Unable to load quarterly details")
            }
            
          })
          
      }

downloadQuarterlySubmit(quarterlyId){
    const classObject =this;
    if(!quarterlyId){
        toastr.error("Quarterly ID is missing");
        return;
    }

    $.ajax({
        url:"https://dev-api.humhealth.com/StudentManagementSystemAPI/attendanceReport/Report/"+quarterlyId,
        type:"GET",
        xhrFields:{
            responseType:"blob"
        },

        success:function(response){

            const blob = new Blob(
                [response],
                {type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}
            );

            const downloadUrl = window.URL.createObjectURL(blob);

            const downloadLink = document.createElement("a");
            downloadLink.href = downloadUrl;
            downloadLink.download = "Quarterly_Attendance_Report_"+quarterlyId+".xlsx";

            document.body.appendChild(downloadLink);
            downloadLink.click();

            document.body.removeChild(downloadLink);
            window.URL.revokeObjectURL(downloadUrl);

            toastr.success("Excel report downloaded successfully");
             $(classObject).find(classObject.selectors.downloadModal).modal("hide");
        },

        error:function(xhr){
            console.error("Download Error:", xhr.responseText);
            toastr.error("Unable to download Excel report");
        }
    });
}

      mailQuarterly(quarterlyId,fullName){
          const classObject=this;
                $.ajax({
            url:"https://dev-api.humhealth.com/StudentManagementSystemAPI/attendanceReport/"+quarterlyId,
            type:"GET",
            dataType:"json",

            success:function(response){
                if(response.status==="Success"){
                  const quarterly = response.data;
                  const firstLetter= quarterly.studentFirstName.trim().charAt(0).toUpperCase();
             let branchOfStudy = quarterly.studentBranchOfStudy;

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
                $(classObject).find(classObject.selectors.emailAvatar) .text(firstLetter);
              $(classObject).find(classObject.selectors.emailStudentName) .text((fullName || "").toUpperCase());
               $(classObject).find(classObject.selectors.emailBranch).text(branchOfStudy|| "")
               $(classObject).find(classObject.selectors.emailBtn).attr("data-quarterly-id", quarterlyId);
               $(classObject).find(classObject.selectors.emailModal).modal("show");

                }
            },
            error:function(error){
            console.error(error);
            toastr.error("Unable to load quarterly details")
            }
            
          })
        
     }
     mailQuarterlySubmit(quarterlyId){
        const classObject=this;
         if(!quarterlyId){
        toastr.error("Quarterly ID is missing");
        return;
    }

    $.ajax({
        url:"https://dev-api.humhealth.com/StudentManagementSystemAPI/attendanceReport/mail/"+quarterlyId,
        type:"POST",
         dataType:"json",

         success:function(response){
           if(response.status==="Success"){
             toastr.success(response.data);
              $(classObject).find(classObject.selectors.emailModal).modal("hide");

           }
            else{
                console.error(response.data);
            }
         },
          error:function(error){
            toastr.error(error)
           }
     });
     }

quarterlyAttendanceFormatRequestData(requestData) {

    this.quarterlyAttendanceFilterRequest = {
        draw: requestData.draw,
        length: Number($(this).find(this.selectors.filterLength).val()) || requestData.length || 10,
        start: requestData.start,

        attendanceReportFilter: {
            quarter: this.quarterlyAppliedFilters.quarter,
           complianceStatusFlag:
                this.quarterlyAppliedFilters.complianceReportFilter,
            studentBranchOfStudy:
                this.quarterlyAppliedFilters.studentBranchOfStudy
        },

        order: {
            column: "",
            type: ""
        },

        search: this.quarterlyAppliedFilters.search,
        searchColumn: this.quarterlyAppliedFilters.searchColumn
    };

    console.log("Quarterly API Request:",
        this.quarterlyAttendanceFilterRequest);

    return this.quarterlyAttendanceFilterRequest;
}
     displayQuarterlyAttendanceList(response){
        const quarterlyAttendanceDataArray=[];
        if(response.status ==="Success"){
            let index=1;
            for(let res of response.data){
                const data={};
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

              let complianceStatusFlag = res.attendanceComplianceStatusFlag;
             switch(complianceStatusFlag){
                case "Y":
                 complianceStatusFlag="Compliant";
                 break;
                 case "N":
                  complianceStatusFlag="Not Compliant";
                  break;      
                  default:
                  complianceStatusFlag="";
                  break;
              }
             const fullName =[
                res.studentFirstName,
                res.studentMiddleName,
                res.studentLastName
               ].filter(Boolean).join(" ");
               data["sno"]= index++;
               data["name"]=fullName
               data["branchOfStudy"]= branchOfStudy;
               data["quarter"]=res.quarterAndYear;
               data["totalWorkingDays"]=res.totalSchoolWorkingDays;
               data["presentDays"]=res.totalDaysOfPresent;
               data["absentDays"]=res.totalDaysOfAbsents;
               data["ecaLeaves"]=res.totalApprovedActivitiesPermissionDays;
               data["sickLeaves"]=res.totalApprovedSickDays;
               data["complianceStatusFlag"]=this.forCompliance(complianceStatusFlag);
               data["action"] = this.forAction(res.quarterlyId,fullName);
               quarterlyAttendanceDataArray.push(data);
            }
        }

        return  quarterlyAttendanceDataArray;
     }
      forAction(quarterlyId,fullname){
        return`
              <button type="button"
            class="btn btn-sm btn-outline-primary hum-quarterly-view-btn"
            data-quarterly-id="${quarterlyId}"
            data-quarterly-name="${fullname}"
               data-bs-toggle="tooltip" 
            title="View Quarterly Attendance">
            <span class="material-symbols-outlined d-flex text-center hum-icon-font ">visibility</span>
          </button>

          <button type="button"
            class="btn btn-sm btn-outline-success hum-quarterly-download-btn"
            data-quarterly-id="${quarterlyId}"
            data-quarterly-name="${fullname}"
               data-bs-toggle="tooltip" 
            title="Download Quarterly Report">
            <span class="material-symbols-outlined d-flex text-center hum-icon-font ">download</span>
          </button> 

         <button type="button"
            class="btn btn-sm btn-outline-danger hum-quarterly-mail-btn"
            data-quarterly-id="${quarterlyId}"
            data-quarterly-name="${fullname}"
               data-bs-toggle="tooltip" 
            title="mail Quarterly Attendance">
            <span class="material-symbols-outlined d-flex text-center hum-icon-font ">mail</span>
          </button> 

         
        `
      }
          forCompliance(complianceStatusFlag){
        if(complianceStatusFlag === "Compliant"){
            return `<span class="hum-quarterly-status-compliant hum-quarterly-status">Compliant</span>`;
        }

        return `<span class="hum-quarterly-status-noncompliant  hum-quarterly-status">Not Compliant</span>`;
    }
      handlerYearOption() {
        
     const today = new Date();

        let curyear = today.getFullYear() ;
        let options = "";

        for (let i = 0; i < 7; i++) {
            options += `<option value="${curyear}">${curyear}</option>`;
            curyear -= 1;
        }

        $(this.selectors.filterYear).html(options);
    }

    getQuarterlyAttendanceList(){
        if(this.quarterlyAttendanceDataTable){

        }
        else{
            this.quarterlyAttendanceDataTable=$(this.selectors.attendanceTable).DataTable(this.quarterlyAttendanceDataTableConfig)
        }
    }

}
customElements.define("hum-quarterly-attendance-temp",HumQuarterlyAttendance);
