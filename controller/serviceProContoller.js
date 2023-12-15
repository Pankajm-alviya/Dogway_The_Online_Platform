import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import serviesModel from "../modules/serviceProviderModel.js";
import Randomstring from 'randomstring';
import { transporter } from "../modules/nodeMailer.js"
import mailer from "./mailer.js";
var SECRET_SER_KEY = "thisismyserviceProvidersecretkey";
var userData = {};
var Rotp = "";
class serviceProContollerClass {
    
    static serviceRegistration =async (req,res)=>{
    const { otp } =req.body;
    console.log("otp : " + otp + "req.body :",userData);
    try {
        console.log("reeeeee :== ",req.body);
      const existinguser = await serviesModel.findOne({ email:userData.email });
      console.log("existuser : ",existinguser);
      if (existinguser) {
        res.render("serviceProvider/serviceProRegistration", { loginStatus:true,data:"",msg: "You are already registerd user" });
      }
      else {
        var payload = {};
        if (otp == Rotp) {
          const hashpassword = await bcrypt.hash(userData.password, 10);
          const newUser = await serviesModel.create({
            name:userData.name,
            email:userData.email,
            contact:userData.contact,
            city:userData.city,
            state:userData.state,
            password: hashpassword,
            addharno:userData.addharno,
            pancard:userData.pancard,
            address:userData.address,
            experience:userData.experience,
            prices:{
                grooming:userData.grooming,
                walking:userData.walking,
                training:userData.training,
                dogspa:userData.dogspa
               }
        });


          payload.user=userData;

          const expiryTime = {
            expiresIn: '1d'
          }
          const token = jwt.sign(payload, SECRET_SER_KEY, expiryTime);
          res.cookie('serviceProvider', token, { httpOnly: true, maxAge: 86400 * 1000 });
          res.cookie('ProviderEmail', userData.email, { maxAge: 86400 * 1000 });
          await newUser.save();
          res.render("serviceProvider/serviceProviderHomePage", { loginStatus:true,data:userData,msg:"",id:"" });
        }
        else {
          res.render("partials/notFoundAlertPage", { msg: "Otp does not match", otp: "" });
        }
      }
    }
    catch (err) {
      res.status(400).send(err);
      console.log('Error while registration of serviceProvider controller', err);
    }
}

static verifyemail = async (req, res) => {

  userData = req.body;
  Rotp = Randomstring.generate({
    length: 4,
    charset: 'numeric',
  });

  const mailOptions = {
    from: 'pankajmalviya364@gmail.com',
    to: req.body.email,
    subject: `DogWay The Online Platform🐶`,
    text: `Hello ${req.body.name}\n your one time Password is ${Rotp} enter this otp and register yourself.\nThank You`
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.render('serviceProvider/serviceProRegistration', { loginStatus: false, msg: "Invalid Email Please Enter Right Email Id"});
      console.error(error);
    } else {
      res.render("partials/notFoundAlertPageForSer", {serMsg: "OTP send successfully please check your mail id", });
      console.log(Rotp);
    }
  });
}

static serviceProLoginCheck= async (req, res, next) => {
    try {
      var { email,password } = req.body;
      var existuser = await serviesModel.findOne({ email: email });
      console.log(existuser);
      if (!existuser) {
        res.render("serviceProvider/serviceProLogin",{ loginStatus: false, msg: "password not matched please enter right password for login" });
      }
      else {
        var payload = {};
        const bool = await bcrypt.compare(password, existuser.password);
        if (bool) {
          payload.user = existuser;
          console.log("exitin user: --->" + existuser);

          const expiryTime = {
            expiresIn: '1d'
          }
          const token = jwt.sign(payload, SECRET_SER_KEY, expiryTime);
          res.cookie('serviceProvider', token, { httpOnly: true, maxAge: 86400 * 1000 });
          res.cookie('ProviderEmail', email, { maxAge: 86400 * 1000 });
          res.render('serviceProvider/serviceProviderHomePage', { loginStatus: true, data:existuser, msg:"",id:"" });

        }
        else {
          res.render("serviceProvider/serviceProLogin",{ loginStatus: false,msg: "password not matched please enter right password for login" });
        }
      }
    } catch (err) {
      console.log("Error :" + err);
    }
  }

  static serviceHomePage = async (req, res) => {
    try {
      let option = req.params.option;
      console.log("id:" + option);
      const token = req.cookies.serviceProvider;
      jwt.verify(token, SECRET_SER_KEY, async (err, decode) => {
        try {
          if (err) {
            console.log("Error occure when verify customer token");
          }
          else {
            var existuser = await serviesModel.findOne({ email: decode.user.email });
            // const sellingDogData = await addSellingDogModel.find(({ userid: existuser._id }));
            // const matingDogData = await addMatingDogModel.find(({ userid: existuser._id }));

            // console.log("existuser:=", existuser);
            // console.log("item1:=", sellingDogData);
            // console.log("item:=", matingDogData);


            if (option) {
              if (option == "sellingDogList") {
                if (sellingDogData.length) {
                  console.log("not equal:-" + sellingDogData.length);
                  res.render('customer/manageAccount', { customerData: existuser, sellingDogData: sellingDogData, id: "sellingDogList", msg: "" });
                }
                else {
                  console.log("equal:-" + sellingDogData.length);
                  res.render('customer/manageAccount', { customerData: existuser, sellingDogData: sellingDogData, id: "sellingDogList", msg: `You have not listed any dog for sell if you want to add Click here` });
                }

              } else if (option == "matingDogList") {
                if (matingDogData.length != 0) {
                  res.render('customer/manageAccount', { customerData: existuser, matingDogData: matingDogData, id: "matingDogList", msgMating: "" });
                }
                else {
                  res.render('serviceProvider/serviceProviderHomePage', { customerData: existuser, matingDogData: matingDogData, id: "matingDogList", msgMating: "You have not listed any dog for Mating if you want to add your dog for mating Click on the button" });

                }
              }
              console.log("decode payloade :---->", decode.user.email);
              res.render("serviceProvider/serviceProviderHomePage", { data: existuser,id:option, msg: "" });
            } else {
              console.log("decode payloade under :", decode.user);
              res.render("serviceProvider/serviceProviderHomePage", { data: existuser,id:"", msg:"You have not listed any dog for sell if you want to add Click here" });
            }

          }
        } catch (err) {
          console.log(err);

        }
      })
    }
    catch (err) {
      console.log(err);

    }
  }

  static updateServiceProviderProfile = async (req, res) => {
    try {

     console.log(req.body);
      const result = await serviesModel.updateOne({ email: req.body.email }, {
        $set: {
            name: req.body.name,
            email: req.body.email,
            contact: req.body.contact,
            city: req.body.city,
            state: req.body.state,
            password: hashpassword,
            addharno:req.body.addharno,
            pancard:req.body.pancard,
            address:req.body.address,
            experience:req.body.experience,
            prices:{
                grooming:req.body.grooming,
                walking:req.body.walking,
                training:req.body.training,
                dogspa:req.body.dogspa
               }
        }
      });
      console.log("update successfully");
      res.render("serviceProvider/serviceProviderHomePage", { data:req.body, id: "", msg: "update successfully" });

    } catch (error) {
      console.log("Error while update : " + error);
    }


  }

  static resetPassword = async (req, res) => {
    const { currentPassword, confirmPassword, } = req.body;
    const email = req.params.email;
    console.log(email);
    var existuser = {};
    try {
      existuser = await serviesModel.findOne({ email: email });
      console.log(existuser);

      let check = await bcrypt.compare(currentPassword, existuser.password);
      console.log("check pass:" + check+" "+currentPassword);

      if (check) {
        // if(currentPassword===existuser.password){
        const hashpassword = await bcrypt.hash(confirmPassword, 10);
        const result = await serviesModel.updateOne({ email: email }, {
          $set: {
            password: hashpassword,
            // password:confirmPassword
          }
        });
        console.log("update successfully");
        res.render("serviceProvider/serviceProviderHomePage", { data:existuser, id: "changepassword", msg: "Password reset successfully" });
      } else {
        res.render("serviceProvider/serviceProviderHomePage", { data:existuser, id: "changepassword", msg: "Invalid password please enter valid old password" });
      }
    } catch (error) {
      console.log("Error while reset password : " + error);
      res.render("serviceProvider/serviceProviderHomePage", { data:existuser, id: "changepassword", msg: "Password Not reset Because of some technical error" });
    }
  }

}
export {SECRET_SER_KEY};
export default serviceProContollerClass;