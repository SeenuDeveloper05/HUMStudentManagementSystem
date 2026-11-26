// Allow only alphabets and spaces
$.validator.addMethod("lettersonly", function (value, element) {
    return this.optional(element) || /^[a-zA-Z\s]+$/.test(value);
}, "Please enter letters only");

$.validator.addMethod("validemail", function (value, element) {
    return this.optional(element) || /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
}, "Please enter a valid email address.");

$.validator.addMethod("validMobile", function (value, element) {
    return this.optional(element) || /^[6-9][0-9]{9}$/.test(value);
}, "Mobile Phone is invalid.");