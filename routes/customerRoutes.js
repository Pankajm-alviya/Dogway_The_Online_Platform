import express from 'express';
import jwt from 'jsonwebtoken'
import { addSellingDogModel,addMatingDogModel } from "../modules/dealermodule.js";
import {SECRET_KEY } from '../controller/customerController.js';
import serviesProrcontoller from "../controller/serviceProContoller.js";
import customerController from "../controller/customerController.js";
import authUserController from "../controller/authUserController.js";
import breedInfoModel from "../modules/breedInfoModel.js";
import { CustomerRegModel } from '../modules/customer.js';
import upload from '../middleware/upload.js';

const router = express.Router();


router.get('/', authUserController.authenticateCustomer, (req, res) => {
 res.render("customer/CustomerMainPage", { loginStatus: true, customerEmail: "", msg: "", })
});

router.get('/dogseriverbookpage', (req, res) => {
  const token = req.cookies.customer;
  if (token) {
    jwt.verify(token, SECRET_KEY, (err, payload) => {
      if (err)
        res.json({ message: "Error Occured while dealing with Token during verify" });
      else {
        var data = req.cookies.customerEmail;
        res.render("customer/dogseriverbook", { loginStatus: true, data: data, payload: payload,msg:"" })
      }
    })
  }
  else {
    console.log("Entery customer route page token else part")
    res.render("customer/dogseriverbook", { loginStatus: false, data: "", payload: "",msg:"you are not login please login first for booking" })
  }

});
router.get('/dogmating/:id', async(req, res) => {
  var _id = req.params.id;
  var matingdogDealer = await addMatingDogModel.find({_id:_id});
  var _id = matingdogDealer[0]._id;
  const token = req.cookies.customer;
  if (token) {
    jwt.verify(token, SECRET_KEY, (err, payload) => {
      if (err)
        res.json({ message: "Error Occured while dealing with Token during verify" });
      else {
        var data = req.cookies.customerEmail;
        res.render("customer/dogmatingbook", { loginStatus: true, data: data, payload: payload, matingdogDealer:matingdogDealer,msg:""})
      }
    })
  }
  else {
    // console.log(data);
    console.log("Entery customer route page token else part")
    res.render("customer/dogmatingbook", { loginStatus: false, data: "", payload: "" ,matingdogDealer:"",msg:"You are not login please first login then try"})
  }

});
router.get('/Contact', (req, res) => {
  const token = req.cookies.customer;
  if (token) {
    jwt.verify(token, SECRET_KEY, (err, payload) => {
      if (err)
        res.json({ message: "Error Occured while dealing with Token during verify" });
      else {
        res.render("customer/Contact", { loginStatus: true,msg:"" })
      }
    })
  }
  else {
    console.log("Entery customer route page token else part")
    res.render("customer/Contact", { loginStatus: false })
  }

});
router.get('/Service', (req, res) => {
  const token = req.cookies.customer;
  if (token) {
    jwt.verify(token, SECRET_KEY, (err, payload) => {
      if (err)
        res.json({ message: "Error Occured while dealing with Token during verify" });
      else {
        res.render("customer/Service", { loginStatus: true })
      }
    })
  }
  else {
    console.log("Entery customer route page token else part")
    res.render("customer/Service", { loginStatus: false })
  }
});
router.get('/Faq', (req, res) => {
  const token = req.cookies.customer;
  if (token) {
    jwt.verify(token, SECRET_KEY, (err, payload) => {
      if (err)
        res.json({ message: "Error Occured while dealing with Token during verify" });
      else {
        res.render("customer/Faq", { loginStatus: true })
      }
    })
  }
  else {
    console.log("Entery customer route page token else part")
    res.render("customer/Faq", { loginStatus: false })
  }
});

router.get('/forget', (req, res) => {
  const token = req.cookies.customer;
  if (token) {
    jwt.verify(token, SECRET_KEY, (err, payload) => {
      if (err)
        res.json({ message: "Error Occured while dealing with Token during verify" });
      else {
        res.render("customer/login", { loginStatus: true })
      }
    })
  }
  else {
    console.log("Entery customer route page token else part")
    res.render("customer/login", { loginStatus: false })
  }

});




router.get('/BookSellingDog', (req, res) => {
  res.render('customer/bookSellingDog');
});


router.post('/customerData', customerController.verifyemail)
router.post('/checkOtp', customerController.customerReg);

router.post("/customerLogin", customerController.getLoginInfo);
router.get("/authCustomer/:roll", authUserController.authenticateUser, authUserController.authorizeUser);

router.get('/Mating', customerController.dogMating);
router.post("/updateCustomerProfile", customerController.updateCustomerProfile);
router.get("/manageAccount/:option?", customerController.manageAccount);
router.post("/resetPassword/:email", customerController.resetPassword);
router.post("/addDogServer", customerController.addServiesDog)
router.post("/forgot-password", customerController.forgetpasscheakotp);
router.post('/confirm-password', customerController.forgetpassword);
router.post("/forgot-updatepassword", customerController.forgetupdatepass);
router.post("/adddogmating", customerController.dogaddformating)
router.get("/serachByBreed", customerController.serachByBreedInfo)

router.get('/Breed',async (req, res) => {
   const item1= await breedInfoModel.find();
  const token = req.cookies.customer;
  if (token) {
    jwt.verify(token, SECRET_KEY, async (err, payload) => {
      if (err)
        res.json({ message: "Error Occured while dealing with Token during verify" });
      else {
        console.log("item1" + item1);
        if (item1.length != 0) {
        res.render('customer/Breed', { loginStatus: true, breedInfo: item1, msg: "",successMsg:"" });
        } 
        else {
        res.render('customer/Breed', { loginStatus: true, breedInfo: item1, msg: "Sorry that time No breed information have included try after some time thankyou",successMsg:"" });
         }
        
      }
    })
  }
  else {
    console.log("Entery customer route page token else part :",item1)
    res.render("customer/Breed",{ loginStatus: false,breedInfo:item1,msg:"",successMsg:"" })
  }
  
});


router.post("/breedInfoSet", authUserController.authenticateCustomer, upload, customerController.breedInfoSet);
router.get("/bookSellingDog/:breedName", customerController.specificBreeddetailsSearch)
router.get("/breedInformationPage/:breedName",customerController.breedInformationPage)


router.get('/customerLogout', (request, response) => {
  response.clearCookie('customer');
  response.clearCookie('customerEmail');
  response.render('customer/CustomerMainPage', { loginStatus: false, customerEmail: "", msg: "" });

});
router.get('/addtocart/:id',(req,res,next)=>{
  const token = req.cookies.customer;
  if (token) {
    jwt.verify(token, SECRET_KEY, (err, payload) => {
      if (err)
       res.render("customer/CustomerMainPage",{ loginStatus: false,breedInfo:"",msg:"Sorry some technical issue please once login again to resolve this problem Thankyou" })
      else {
       next()
      }
    })
  }
  else {
    console.log("Entery customer route page token else part")
    res.render("customer/CustomerMainPage",{ loginStatus: false,breedInfo:"",msg:"you need to login first for booking any dog" })
  }
},customerController.addtocart);

router.get("/cart",customerController.cartShow);
router.get("/cartremove:_id",customerController.deleteProduct);
router.get('/placeOrder', customerController.placeOrder);
router.post('/placeOrder', customerController.placeOrder);
router.post('/message',customerController.message);
router.post('/messageDetails',customerController.messageDetails);
router.post('/address/:orderID', customerController.address, customerController.orderDetails);
router.post('/payment',customerController.paymentdetailsController);
router.get('/success',customerController.successController);

router.get('/paysuccess', (req, res) => {
  res.render('customer/paysuccess');
});
export default router;


