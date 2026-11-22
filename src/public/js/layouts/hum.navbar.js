
class HumNavbar extends HTMLElement {
    constructor() {
        super();

        const template = document.getElementById("hum_navbar");

        this.appendChild(
            template.content.cloneNode(true)
        );
         
      
        this.selectors = {
            navTitle: "#hum_nav_bread",
            profileAvatar: "#hum_nav_profile_avatar",
            username: "#hum_logged_in_username",
            search:"#hum_nav_global_search",
            searchClear:"#hum_nav_search_clear",
            logout:"#hum_nav_logout",
             smsMainContainer: "#hum_sms_main_layout"
        };
    }

    connectedCallback() {
        this.initializeNavbar();
        this.handlerAutoComplete();
        this.bindAllRequiredEvents();
    }

    initializeNavbar() {
        this.setPageTitle();
        this.loadLoggedInUser();
    }

    setPageTitle() {
        const activeLink = $(".sidebar-link.active");

        const pageTitle = activeLink.find(".sidebar-label").text().trim() || "Dashboard";

        $(this).find(this.selectors.navTitle).text(pageTitle);
    }

    bindAllRequiredEvents() {
        $(document).on("click", ".sidebar-link", () => {
            this.setPageTitle();
        });
        $(this).on("click",this.selectors.logout,{classObject:this},this.handlerLogout)
               .on("click",this.selectors.searchClear,{classObject:this},this.handlerSearchClear)
    }
     handlerSearchClear(event){
        const classObject=event.data.classObject
       $(classObject).find(classObject.selectors.search).val("");
     }
     handlerLogout(){
        Swal.fire({
     title: "Are you sure?",
    text: "Do you want to logout",
   
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
         window.location.href = "index.html";
    }
});
       
          

     }
    loadLoggedInUser() {
        const loggedInUser = JSON.parse(
            localStorage.getItem("hum_logged_in_user") || "{}"
        );

        const username = loggedInUser.username || "User";

        $(this)
            .find(this.selectors.profileAvatar)
            .text(username.charAt(0).toUpperCase());

        $(this)
            .find(this.selectors.username)
            .contents()
            .first()
            .replaceWith(document.createTextNode(username));
    }
  handlerAutoComplete(){

      $(this.selectors.search).autocomplete({
                  minLength:3,
                  source:this.searchStudentName,
                  select: (event,ui) => this.setInputFieldValuesAfterSelection(event,ui),
                  appendTo:$("#hum_nav_global_search").parent('div')
      })
  }
  
    searchStudentName=function(autoCompleteReq ,autoCompleteResponse){
                 function capitalizeFirstLetter(str){
                  if(!str){
                    return "";
                  }else{
                    return str.charAt(0).toUpperCase() + str.slice(1);
                  }
             }
             
               $.ajax({
                    url:"https://dev-api.humhealth.com/StudentManagementSystemAPI/student/list",
                    type:"POST",
                    dataType:"json",
                    contentType:"application/json",

                     data: JSON.stringify({
                              draw: 1,
                              length: 10,
                              start: 0,
                          filter: {
                                   gender: "",
                                  residingStatusFlag: "",
                                  activeFlag: "A",
                                  branchOfStudy: ""
                              },
                             order: {
                                 column : "",
                                   type : ""
                            },
                            search: capitalizeFirstLetter(autoCompleteReq.term),
                             searchColumn: "Fullname"
                         }),
                         
                         success:function(res){
                             if(res.status ==="Success"){
                                if(res.data.length !== 0){
                             autoCompleteResponse(res.data.map((student)=>{
                               const{studentId,firstName,middleName,lastName,branchOfStudy}=student;
                               const fullName=[firstName,middleName,lastName].filter(Boolean).join(" ");
                                let studentOfStudy = branchOfStudy;

                             switch (studentOfStudy) {
                                 case "CSCI":
                              studentOfStudy = "Computer Science";
                    break;

                case "BIOL":
                    studentOfStudy = "Biology";
                    break;

                case "COMM":
                    studentOfStudy = "Commerce";
                    break;

                case "ZOOL":
                    studentOfStudy = "Zoology";
                    break;

                case "ARTS":
                    studentOfStudy = "Arts";
                    break;

                default:
                    studentOfStudy = "";
                    break;
            }
                               return {
                                id:studentId,
                                value:`${fullName}`,
                                label: `${fullName}(${studentOfStudy})`,
                               }
                                
                             }));
                        
                             }else{
                                autoCompleteResponse([{id: null, value: `No member found`, label: null}]);
                             }
                           }
                         },
                        error:function(error){
                            console.error(error)
                        }
                         
                     });
            
                    }
                setInputFieldValuesAfterSelection(event,ui){
                          const studentId = ui.item.id;           

                           if (!studentId) {
                             event.preventDefault();
                            return false;
                        }

                          $(this.selectors.smsMainContainer).html(
                               `<hum-student-management-profile student-id="${studentId}"></hum-student-management-profile>`
                             );
                }
   
   }

customElements.define("hum-navbar", HumNavbar);
