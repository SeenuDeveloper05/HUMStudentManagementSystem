
class HumSidebar extends HTMLElement {

    constructor() {
        super();

        const template = document.getElementById("hum_sidebar");

      

        this.appendChild(
            template.content.cloneNode(true)
        );

        this.selectors = {
            sideBar: ".side-bar",
            sidebarLink: ".sidebar-link",
            smsMainContainer:"#hum_sms_main_layout"
        };
    }

    connectedCallback() {
        this.bindAllRequiredEvents();
    }

    bindAllRequiredEvents() {
        $(this).on(
            "mouseenter",
            this.selectors.sideBar,
            { classObject: this },
            this.handlerSidebarMouseEnter
        );

        $(this).on(
            "mouseleave",
            this.selectors.sideBar,
            { classObject: this },
            this.handlerSidebarMouseLeave
        );

        $(this).on(
            "click",
            this.selectors.sidebarLink,
            { classObject: this },
            this.handlerSidebarClick
        );


    }

    handlerSidebarMouseEnter(event) {
        const classObject = event.data.classObject;

        $(classObject)
            .find(classObject.selectors.sideBar)
            .addClass("expanded");
    }

    handlerSidebarMouseLeave(event) {
        const classObject = event.data.classObject;

        $(classObject)
            .find(classObject.selectors.sideBar)
            .removeClass("expanded");
    }

    handlerSidebarClick(event) {
        event.preventDefault();

        const classObject = event.data.classObject;
        const clickedLink = event.currentTarget;
        
        $(classObject)
            .find(classObject.selectors.sidebarLink)
            .removeClass("active")
            .removeAttr("aria-current");

        $(clickedLink)
            .addClass("active")
            .attr("aria-current", "page");

            const selectedPage=$(clickedLink).attr("data-page");

            switch(selectedPage){
       
                case "teacher":
                      $( classObject.selectors.smsMainContainer).html("<hum-teacher-management></hum-teacher-management>" );
                break;

                 case "student":
                    $( classObject.selectors.smsMainContainer).html("<hum-student-management-filterTable></hum-student-management-filterTable>");
                    break;

                 case "attendance":
                    $( classObject.selectors.smsMainContainer).html("<hum-daily-attendance></hum-daily-attendance>");
                    break;

                case "holiday":
                      $( classObject.selectors.smsMainContainer).html("<hum-holiday-management></hum-holiday-management>");
                      break;

                case "attendance_report":
                     $( classObject.selectors.smsMainContainer).html("<hum-quarterly-attendance-temp></hum-quarterly-attendance-temp>");
                     break;

                case "mark_entry":
                    $( classObject.selectors.smsMainContainer).html("<hum-mark-entry-temp></hum-mark-entry-temp>");
                    break;

                default:
                      $(classObject.selectors.smsMainContainer).html("<hum-sms-dashboard></hum-sms-dashboard>");
                     
            }

    }


}


    customElements.define("hum-sidebar", HumSidebar);

