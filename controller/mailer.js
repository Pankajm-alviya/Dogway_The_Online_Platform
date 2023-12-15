import nodemailer from "nodemailer";



var mailer = function(email,callback){
    Rotp = randomstring.generate({
        length: 4,
        charset: 'numeric',
      });
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "pankajmalviya364@gmail.com",
          pass: "vbru ihsb pheq tgqj",
        },
        secure: true,
    });
    const mailOptions = {
        from: 'pankajmalviya364@gmail.com',
        to: email,
        subject: `DogWay The Online Platform🐶`,
        text: `Hello ${req.body.CName}\n Your One Time Password Is ${Rotp} Enter This Otp And Register Yourself.\nThank You`
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          res.render('serviceProvider/serviceProRegistration', { loginStatus: false, msg: "Invalid Email Please Enter Right Email Id", otp: "" });
          console.error(error);
        } else {
          res.render("partials/notFoundAlertPage", { msg: "", otpService: "OTP send successfully please check your mail id" });
          console.log(Rotp);
          callback(info);
        }
      });
    
    }
    

export default mailer;