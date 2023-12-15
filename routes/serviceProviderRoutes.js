import express, { Router } from "express";
import serviceProController from "../controller/serviceProContoller.js";
import authControllerClass from "../controller/authUserController.js";
import serviceProviderModel from "../modules/serviceProviderModel.js";
const router=express.Router();

router.use(express.static('public'));

router.get("/",authControllerClass.authenticateProvider,async (req,res)=>{
     try{
           const user=await serviceProviderModel.findOne({email:req.cookies.ProviderEmail});
           console.log(user);
           res.render("serviceProvider/serviceProviderHomePage",{loginStatus:true,id:"",msg:"",data:user});
      }catch(err){
            console.log("catch error :"+err);
            res.render("serviceProvider/serviceProLogin",{loginStatus:false,msg:"Somthing wents wrong please re-login"});

      }
})
router.get("/serviceProRegistration",(req,res)=>{
res.render("serviceProvider/serviceProRegistration",{loginStatus:false,msg:"",data:""});
})
router.post("/serviceRegistration",serviceProController.serviceRegistration);
router.post("/serviceProLoginCheck",serviceProController.serviceProLoginCheck);
router.get("/serviceHomePage/:option?", serviceProController.serviceHomePage);
router.post("/updateServiceProviderProfile", serviceProController.updateServiceProviderProfile);
router.post("/resetPassword/:email", serviceProController.resetPassword);

router.post('/serviceData', serviceProController.verifyemail)
router.post('/checkOtp', serviceProController.serviceRegistration);

router.get("/serviceProviderLogout",(req,res)=>{
      res.clearCookie("serviceProvider")
      res.clearCookie("ProviderEmail")
      res.render("serviceProvider/serviceProLogin",{loginStatus:false,msg:"successfully logout"})

});

export default router;