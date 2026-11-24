class HumFooter extends HTMLElement{
     constructor(){
        super();
         const template = document.getElementById("hum_footer");
        this.appendChild(template.content.cloneNode(true));
     }
}
  customElements.define("hum-footer", HumFooter);
