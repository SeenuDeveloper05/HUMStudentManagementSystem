const HumLoginPage = function (){
   const self = this;
 
     this.selectors ={
        loginForm:"#hum_login_form",
        username:"#hum_login_username",
        password:"#hum_login_password",
        loginButton:"#hum_login_submit",
        togglePassword: "#hum_toggle_password"
     };
    //  this.users=[
    //     { username: "Admin1", password: "Humworld@1" },
    //     { username: "Seenu123", password: "Humworld@1" },
    //     { username: "Kamal345", password: "Humworld@1" }
    //  ];


     this.initializeValidator =function (){
        $(self.selectors.loginForm).validate({
           
           rules:{
              hum_login_username:{
                required:true,
                  // lettersonly: true
              },
              hum_login_password:{
                required: true
              }
           },
           messages:{
            hum_login_username:{
                required:"Please enter your username",
                  // lettersonly: "Please enter letters only"
            },
            hum_login_password:{
                 required: "Please enter your password"
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
     };

      this.bindAllRequiredEvents = function (){
        $(self.selectors.loginButton).on("click",self.handleLogin);
        $(self.selectors.togglePassword).on("click",self.togglePassword);
      };


  this.handleLogin = function () {

    const form = $(self.selectors.loginForm);

    const username = $(self.selectors.username).val().trim();
    const password = $(self.selectors.password).val();

    // Clear previous error message
   

    const users = JSON.parse(
        localStorage.getItem("hum-users") || "[]"
    );

    const loggedInUser = users.find(function (user) {

        return user.username === username &&
               user.password === password;

    });

    if (loggedInUser) {

        localStorage.setItem(
            "hum_logged_in_user",
            JSON.stringify({
                username: loggedInUser.username
            })
        );

        Swal.fire({
            icon: "success",
            title: "Login Successful!",
            text: "Welcome, " + loggedInUser.username,
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true

        }).then(() => {

            window.location.href = "dasboard.html";

        });

    } else {
         if(username&&password){
                 $("#hum_login_error").text(
            "Invalid Credentials"
        );
         }else{
                       $("#hum_login_error").text("");
         }
         return;     
            
    }

};

        this.togglePassword= function() {
         const passwordInput=$(self.selectors.password);
         const eyeIcon=$(self.selectors.togglePassword).find("span");

          if(passwordInput.attr("type")=== "password"){
              passwordInput.attr("type", "text");
              eyeIcon.text("visibility_off");
          }
          else{
               passwordInput.attr("type", "password");
               eyeIcon.text("visibility");
          }

        };
     

    this.initialize = function () {
        self.initializeValidator();
        self.bindAllRequiredEvents();
    };
}

const humLoginPage =new HumLoginPage();
humLoginPage.initialize();
