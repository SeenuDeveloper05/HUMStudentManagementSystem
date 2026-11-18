const SMSDashboardPage = function(){
    const self = this;

    this.selectors={
        smsTemplatesContainer : "#hum_sms_templates_container",
        smsSideBar : "#hum_sms_sidebar_layout",
        smsHeaderContainer : "#hum_sms_header_layout",
        smsMainContainer : "#hum_sms_main_layout",
        smsFooterContainer:"#hum_sms_footer_layout"
    }

    this.templateFile = "../../../../templates/templates.html";
    
    this.initializeLoadTemplate = function(){
        $(self.selectors.smsTemplatesContainer).load(self.templateFile, self.loadTemplate);
    }

    this.loadTemplate = function(){
        $(self.selectors.smsSideBar).html("<hum-sidebar></hum-sidebar>");

             $(self.selectors.smsHeaderContainer).html('<hum-navbar></hum-navbar>');

                $(self.selectors.smsMainContainer).html("<hum-sms-dashboard></hum-sms-dashboard>");

         $(self.selectors.smsFooterContainer).html("<hum-footer></hum-footer>")

    
    }
}

const smsDashboardPage = new SMSDashboardPage();
smsDashboardPage.initializeLoadTemplate();

