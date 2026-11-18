
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
            username: "#hum_logged_in_username"
        };
    }

    connectedCallback() {
        this.initializeNavbar();
        this.bindAllRequiredEvents();
    }

    initializeNavbar() {
        this.setPageTitle();
        this.loadLoggedInUser();
    }

    setPageTitle() {
        const activeLink = $(".sidebar-link.active");

        const pageTitle = activeLink
            .find(".sidebar-label")
            .text()
            .trim() || "Dashboard";

        $(this)
            .find(this.selectors.navTitle)
            .text(pageTitle);
    }

    bindAllRequiredEvents() {
        $(document).on("click", ".sidebar-link", () => {
            this.setPageTitle();
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
}

customElements.define("hum-navbar", HumNavbar);
