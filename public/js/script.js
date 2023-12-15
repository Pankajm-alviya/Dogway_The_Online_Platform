function customervalidation() {
            var login_Cemail = document.getElementById("login_Cemail").value;
            var login_Cpass = document.getElementById("login_Cpass").value;
            var error = false;
            if (login_Cemail.trim() === "") {
                document.getElementById("login_Cemail").value = "";
                document.getElementById("login_Cemail").placeholder = "Please enter your email.";
                error = true;
            }
            else {
                var reg = /^[0-9A-Za-z_]+@[a-z]+\.[a-z]{2,3}$/;
                if (reg.test(login_Cemail)) {
                    document.getElementById("login_Cemail").placeholder = "Valid";
                    // return false;
                } else {
                    document.getElementById("login_Cemail").value = "";
                    document.getElementById("login_Cemail").placeholder = "Invalid email format";
                    error = true;
                }
            }

            if (login_Cpass.trim() === "") {
                document.getElementById("login_Cpass").value = "";
                document.getElementById("login_Cpass").placeholder = "Please enter your password.";

                error = true;
            }else {
                var reg = /^(?=.+?[0-9])(?=.+?[A-Z])(?=.+?[a-z])(?=.+?[~!@#$%^&*()_+]).{8}$/;
                if (reg.test(login_Cpass)) {
                    document.getElementById("login_Cpass").placeholder = "Valid";
                    // return false;
                } else {
                    document.getElementById("login_Cpass").value = "";
                    document.getElementById("login_Cpass").placeholder = "Invalid Password format";
                    error = true;
                }
            }
            if (!error) {
                alert("Login successful!");
            }
        }