import { CustomerRegModel, addDogForMating, messageModel } from "../modules/customer.js";
import { addMatingDogModel, addSellingDogModel, serviesDogModel } from "../modules/dealermodule.js"
import { transporter } from "../modules/nodeMailer.js"
import breedInfoModel from "../modules/breedInfoModel.js";
import authUserController from "./authUserController.js";
import { Cart } from "../modules/cartModule.js"
import { Order } from "../modules/orderModule.js"
import bcrypt from 'bcrypt';
import randomstring from 'randomstring';
import jwt from 'jsonwebtoken';
import stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

const { STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY } = process.env;
const stripeInstance = stripe(STRIPE_SECRET_KEY);
const maxAge = 10 * 24 * 60 * 60;
var SECRET_KEY = "thisismycustomersecretkey";

var userdata = {};
var Rotp = "";
var forgetPassotp = "";
class customerController {

  static customerReg = async (req, res) => {
    const { CName, CEmail, CContact, CCity, CState, CCountry, CPassword } = userdata;
    const { otp } = req.body;

    console.log("otp : " + otp + "req.body :", req.body);
    try {
      const existinguser = await CustomerRegModel.findOne({ CEmail: CEmail });
      if (existinguser) {
        console.log("entry in if ");
        res.render("customer/CustomerMainPage", { loginStatus: true, customerEmail: "", msg: "You are already registerd user" });
      }
      else {
        console.log("entry in else");
        var payload = {};
        if (otp == Rotp) {
          console.log("enter otp match");
          const hashpassword = await bcrypt.hash(CPassword, 10);
          const newUser = await CustomerRegModel.create({
            CName: CName,
            CEmail: CEmail,
            CContact: CContact,
            CCity: CCity,
            CState: CState,
            CCountry: CCountry,
            CPassword: hashpassword
          });
          payload.user = userdata;

          const expiryTime = {
            expiresIn: '1d'
          }
          const token = jwt.sign(payload, SECRET_KEY, expiryTime);
          res.cookie('customer', token, { httpOnly: true, maxAge: 86400 * 1000 });
          res.cookie('customerEmail', CEmail, { maxAge: 86400 * 1000 });
          res.cookie('user', existinguser, { maxAge: 86400 * 1000 });

          await newUser.save();
          res.render("customer/CustomerMainPage", { loginStatus: true, customerEmail: CEmail, msg: "" });
        }
        else {
          res.render("partials/notFoundAlertPage", { msg: "Otp does not match", otp: "" });
        }
      }
    }
    catch (err) {
      res.status(400).send(err);
      console.log('something went wrong', err);
    }
  }

  static verifyemail = async (req, res) => {

    userdata = req.body;
    console.log("userdata in email", userdata);
    console.log("name in email" + req.body.CName);
    console.log("OTP controller Runned", userdata);
    Rotp = randomstring.generate({
      length: 4,
      charset: 'numeric',
    });

    const mailOptions = {
      from: 'pankajmalviya364@gmail.com',
      to: req.body.CEmail,
      subject: `DogWay The Online Platform🐶`,
      text: `Hello ${req.body.CName}\n your one time Password is ${Rotp} enter this otp and register yourself.\nThank You☺`
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        res.render('customer/CustomerMainPage', { loginStatus: false, msg: "Invalid Email Please Enter Right Email Id", otp: "" });
        console.error(error);
      } else {
        res.render("partials/notFoundAlertPage", { msg: "", otp: "OTP send successfully please check your mail id" });
        console.log(Rotp);
      }
    });
  }


  static getLoginInfo = async (req, res, next) => {
    try {
      var { CEmail, CPassword } = req.body;
      var existuser = await CustomerRegModel.findOne({ CEmail: CEmail });
      if (!existuser) {
        res.render('customer/CustomerMainPage', { loginStatus: false, customerEmail: "", msg: "Email not exist in our record firstly you register then try agin Thankyou." });
      }
      else {
        var payload = {};
        const bool = await bcrypt.compare(CPassword, existuser.CPassword);
        if (bool) {
          payload.user = existuser;
          console.log("exitin user: --->" + existuser);

          const expiryTime = {
            expiresIn: '1d'
          }
          const token = jwt.sign(payload, SECRET_KEY, expiryTime);
          res.cookie('customer', token, { httpOnly: true, maxAge: 86400 * 1000 });
          res.cookie('customerEmail', CEmail, { maxAge: 86400 * 1000 });
          res.cookie('user', existuser, { httpOnly: true, maxAge: 86400 * 1000 });
          res.redirect("/authCustomer/customer");
        }
        else {
          res.render("customer/CustomerMainPage", { loginStatus: false, customerEmail: "", msg: "password not matched please enter right password for login" });
        }
      }
    } catch (err) {
      console.log("Error :" + err);
    }
  }

  // forget password start
  static forgetpasscheakotp = async (req, res) => {
    // var customerData  = "";
    console.log("forget controller");
    try {
      // console.log("dfcgvhbjnkml,",req.body.Cemail);
      // const Cemail = req.body.Cemail;
      var customerData = await CustomerRegModel.findOne({ CEmail: req.body.CEmail });
      console.log(customerData);
      if (customerData) {
        forgetPassotp = randomstring.generate({
          length: 4,
          charset: 'numeric',
        });


        const mailOptions = {
          from: 'pankajmalviya364@gmail.com',
          to: req.body.CEmail,
          subject: `DogWay The Online Platform🐶`,
          text: `Hello ${customerData.CName}\n your one time Password is ${forgetPassotp} enter this otp for reset your password.\nThank You☺`
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            res.render('customer/CustomerMainPage', { loginStatus: false, msg: "Invalid Email Please Enter Right Email Id", forgetPassotp: "" });
            console.error(error);
          } else {
            console.log(customerData);
            console.log(customerData._id);
            console.log(Rotp);
            res.render("partials/forgetpassword", { msg: "", customer_id: customerData._id, forgetPassotp: "OTP send successfully please check your mail id" });
          }
        });

      } else {
        res.render("customer/CustomerMainPage", { loginStatus: false, customerEmail: "", msg: "password not matched please enter right password for login" });
      }

    } catch (error) {
      console.log("Error : " + error);
    }
  }


  static forgetpassword = async (req, res) => {
    console.log("confirm-password");
    var userData = await CustomerRegModel.findOne({ _id: req.body.customer_id });
    console.log(userData);
    var { otp } = req.body;
    console.log("chaek otp : " + otp);
    console.log(forgetPassotp);
    if (otp == forgetPassotp) {
      console.log(userData);
      console.log(userData._id);
      res.render("customer/confirm_pass", { user_id: userData._id });
    } else {
      res.render("partials/forgetpassword", { msg: "Otp does not match", otp: "" });
    }
  }

  static forgetupdatepass = async (request, response) => {
    console.log("foget password............")
    try {
      console.log(request.body);
      const { CPassword, user_id } = request.body;

      console.log("customer password : ", CPassword);
      console.log("Customwr _id : ", user_id)

      const hashedPassword = await bcrypt.hash(CPassword, 10);
      console.log(hashedPassword);
      const updatedData = await CustomerRegModel.findOneAndUpdate(
        { _id: user_id },
        { $set: { CPassword: hashedPassword } }
      );

      const existuser = await CustomerRegModel.findOne({ _id: user_id });
      const payload = {
        user: existuser
      }
      const expiryTime = {
        expiresIn: '1d'
      }


      //  alert("****** password updated successfully you can login ******")
      const token = jwt.sign(payload, SECRET_KEY, expiryTime);
      response.cookie('customer', token, { httpOnly: true, maxAge: 86400 * 1000 });
      response.cookie('customerEmail', existuser.CEmail, { maxAge: 86400 * 1000 });
      response.render('customer/CustomerMainPage', { loginStatus: true, customerEmail: existuser, msg: "" });
    } catch (error) {
      console.log("Error" + error);
    }

  }
  // forget password end

  static dogMating = async (req, res) => {
    let token = req.cookies.customer;
    var item = await addMatingDogModel.find();
    console.log("item :", item);
    if (token) {
      jwt.verify(token, SECRET_KEY, (err, payload) => {
        if (err)
          res.json({ message: "Error Occured while dealing with Token during verify" });
        else {
          if (item.length == 0) {
            res.render("customer/Mating", { loginStatus: true, item: item, msg: "Sorry that time No Dog Available for mating try letter." });
          } else {
            res.render("customer/Mating", { loginStatus: true, item: item, msg: "" });
          }
        }
      })
    }
    else {
      console.log("Entry customer route page token else part")
      // res.render("customer/Mating", { loginStatus: false, item:item, msg: "" })
      if (item.length == 0) {
        res.render("customer/Mating", { loginStatus: false, item: item, msg: "Sorry that time No Dog Available for mating try letter." });
      } else {
        res.render("customer/Mating", { loginStatus: false, item: item, msg: "" });
      }
    }
  }

  static getProfileInfo = async (req, res) => {

    const token = req.cookies.customer;

    console.log("Contoller token :--->" + token);
  }
  static manageAccount = async (req, res) => {
    try {
      let option = req.params.option;
      console.log("id:" + option);
      const token = req.cookies.customer;
      var existuser = {};
      jwt.verify(token, SECRET_KEY, async (err, decode) => {
        try {
          if (err) {
            console.log("Error occure when verify customer token");
          }
          else {
            existuser = await CustomerRegModel.findOne({ CEmail: decode.user.CEmail });
            const sellingDogData = await addSellingDogModel.find(({ userid: existuser._id }));
            const matingDogData = await addMatingDogModel.find(({ userid: existuser._id }));

            console.log("existuser:=", existuser);
            console.log("item1:=", sellingDogData);
            console.log("item:=", matingDogData);


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
              }

              else if (option == "matingDogList") {
                if (matingDogData.length != 0) {
                  res.render('customer/manageAccount', { customerData: existuser, matingDogData: matingDogData, id: "matingDogList", msgMating: "" });
                }
                else {
                  res.render('customer/manageAccount', { customerData: existuser, matingDogData: matingDogData, id: "matingDogList", msgMating: "You have not listed any dog for Mating if you want to add your dog for mating Click on the button" });
                }
              }

              else if (option == "yourOrder") {
                try {
                  const cart = await Cart.findOne({ user_id: existuser._id });
                  console.log("cart data :", cart);

                  if (cart) {
                    const productIds = cart.products.map(product => product.product_id);
                    const productsInCart = await addSellingDogModel.find({ _id: { $in: productIds } });
                    res.render('customer/manageAccount', { item: productsInCart, msg: "", id: "yourOrder", customerData: existuser });
                  }
                  else {
                    res.render('customer/manageAccount', { item: [], msg: "Empty....! you are not order any dog", id: "yourOrder", customerData: existuser }); // Cart is empty
                  }
                } catch (err) {
                  console.error(err);
                  res.render('customer/manageAccount', { customerdata: existuser, id: "yourOrder", msg: "some technical issue please try after some time" }); // Cart is empty

                }
              }
              else {
                console.log("decode payloade :---->", decode.user.CEmail);
                res.render("customer/manageAccount", { customerData: existuser, item: [], id: option, msg: "" });
              }

            } else {
              console.log("decode payloade under :", decode.user);
              res.render("customer/manageAccount", { customerData: existuser, item: [], id: "", msg: "You have not listed any dog for sell if you want to add Click here" });
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

  static updateCustomerProfile = async (req, res) => {
    try {

      const { CName, CEmail, CContact, CCity, CState } = req.body;
      console.log(req.body);
      const result = await CustomerRegModel.updateOne({ CEmail: CEmail }, {
        $set: {
          CName: CName,
          CEmail: CEmail,
          CContact: CContact,
          CCity: CCity,
          CState: CState
        }
      });
      console.log("update successfully");
      res.render("customer/manageAccount", { customerData: req.body, id: "", msg: "update successfully" });

    } catch (error) {
      console.log("Error while update : " + error);
    }


  }

  static resetPassword = async (req, res) => {
    const { currentPassword, confirmPassword, } = req.body;
    const email = req.params.email;
    var existuser = {};
    console.log(email);
    console.log(confirmPassword);

    try {
      existuser = await CustomerRegModel.findOne({ CEmail: email });
      let check = await bcrypt.compare(currentPassword, existuser.CPassword);
      console.log("check pass:" + check);

      if (check) {
        const hashpassword = await bcrypt.hash(confirmPassword, 10);
        const result = await CustomerRegModel.updateOne({ CEmail: email }, {
          $set: {
            CPassword: hashpassword,
          }
        });
        console.log("update successfully");

        res.render("customer/manageAccount", { customerData: existuser, id: "changepassword", msg: "Password reset successfully" });

      } else {
        res.render("customer/manageAccount", { customerData: existuser, id: "changepassword", msg: "Invalid password please enter valid old password" });
      }
    } catch (error) {
      console.log("Error while reset password : " + error);
      res.render("customer/manageAccount", { customerData: existuser, id: "changepassword", msg: "Password Not reset Because of some technical error" });
    }
  }


  static addServiesDog = async (req, res) => {
    var email = req.cookies.customerEmail;
    var items = await CustomerRegModel.find({ CEmail: email });
    console.log("------->", items);
    try {

      const newDealer = await serviesDogModel.create({
        // userid: items[0]._id,
        customerName: items[0].CName,
        customerEmail: items[0].CEmail,
        customerContact: items[0].CContact,
        dogName: req.body.dogName,
        age: req.body.age,
        breed: req.body.breed,
        // servicestype: req.body.servicestype,

      });
      console.log("dog add susefully")
      await newDealer.save();
      res.render("customer/Service", { loginStatus: true })

    } catch (err) {
      console.log('Something went wrong', err);
    }
  }

  static dogaddformating = async (req, res) => {
    var customerdata = await CustomerRegModel.find({ CEmail: req.body.customerEmail_id });
    console.log("req.body.customerEmail_id",req.body.customerEmail_id);
    var contactno = customerdata[0].CContact;
    try {
     
      const newDealer = await addDogForMating.create({
        matingdog_id: req.body.matingdog_id,
        dealerdogBreed: req.body.dealerdogBreed,
        dealerdogGender: req.body.dealerdogGender,
        matingDate: req.body.matingDate,
        vaccination: req.body.vaccination,
        dogBehaviour: req.body.dogBehaviour,
        address: req.body.address,
        contactno: contactno,
        CustomerdogBreed: req.body.CustomerdogBreed,
        CustomerDogGender: req.body.CustomerDogGender,
        customerEmail_id: req.body.customerEmail_id
      });
     
      console.log("Mating dog add successfully")
      await newDealer.save();
      var item = await addMatingDogModel.find();
      try {
        stripeInstance.customers.create({
          email: req.body.stripeEmail,
          source: req.body.stripeToken,
        })
          .then(async (customer) => {
            return await stripeInstance.paymentIntents.create({
              amount: parseInt(req.body.amount),
              currency: 'INR',
              payment_method_types: ['card'],
              customer: customer.id,
            });
          })
          .then((charge) => {
            console.log('charge ', charge);
            res.render("customer/paysuccess");
          })
          .catch((err) => {
            console.log('error', err);
            res.redirect("failure");
          });
      } catch (error) {
        console.log(error.message);
      }
    } catch (err) {
      console.log('Something went wrong', err);
    }

  }
  static serachByBreedInfo = async (req, res) => {
    const token = req.cookies.customer;
    try {
      const search = req.query.search || "";

      const regex = new RegExp(search, "i");

      const query = { DogBreed: regex };

      const item = await dealerModel.find(query);

      if (token) {
        if (item.length === 0) {
          res.render("customer/Breed", { loginStatus: true, item: "", msg: "Sorry, no dogs available for mating at this time. Please try again later.", successMsg: "" });
        } else {
          res.render("customer/Breed", { loginStatus: true, item: item, msg: "", successMsg: "" });
        }
      } else {
        if (item.length === 0) {
          res.render("customer/Breed", { loginStatus: false, item: "", msg: "Sorry, no dogs available for mating at this time. Please try again later.", successMsg: "" });
        } else {
          res.render("customer/Breed", { loginStatus: false, item: item, msg: "", successMsg: "" });
        }
      }
    } catch (error) {
      console.error('Error: ' + error);
    }
  }

  static breedInfoSet = async (req, res) => {
    console.log("Entryyyyyyy in breedInfo controler dealer");
    try {
      console.log("data breed:=", req.body)
      const breedInfoAdded = await breedInfoModel.create({
        breedName: req.body.breedName,
        lifeExpectancy: req.body.lifeExpectancy,
        training: req.body.training,
        litterSize: req.body.litterSize,
        dogSize: req.body.dogSize,
        wheight: req.body.wheight,
        Maintenance: req.body.Maintenance,
        avtar: req.file.filename,
        maintenance: req.body.maintenance,
        shedding: req.body.shedding,
        trainability: req.body.trainability,
        personality: req.body.personality,
        Goodfor: req.body.Goodfor

      });

      await breedInfoAdded.save();
      const item1 = await breedInfoModel.find();
      console.log("item1 breed information" + item1);
      if (item1.length != 0) {
        res.render('customer/Breed', { loginStatus: true, breedInfo: item1, msg: "", successMsg: "" });
      }
      else {
        res.render('customer/Breed', { loginStatus: true, breedInfo: item1, msg: "Sorry that time No breed information have included try after some time thankyou", });

      }
    } catch (err) {
      console.log('Something went wrong', err);
    }

  }
  static specificBreeddetailsSearch = async (req, res) => {
    try {
      console.log("Entryyyyyyy in specificBreeddetailsSearch controler  dealer");
      let breedName = req.params.breedName;

      const item1 = await breedInfoModel.findOne({ breedName: breedName });
      const DogList = await addSellingDogModel.find({ DogBreed: breedName });
      console.log("doglist :====", DogList);
      if (item1) {
        if (DogList.length != 0) {
          console.log("Entry in if specificBreeddetailsSearch controler  dealer");
          res.render('customer/bookSellingDog', { loginStatus: true, breedobj: item1, DogList: DogList, msg: "" });
        }
        else {
          console.log("Entry in if specificBreeddetailsSearch controler  dealer");
          res.render('customer/bookSellingDog', { loginStatus: true, breedobj: item1, DogList: DogList, msg: "Sorry! this time no dog available for this breed try after some time or choose another breed thankyou." });
        }

      }
      else {
        console.log("Entry in else specificBreeddetailsSearch controler  dealer");
        res.render('customer/bookSellingDog', { loginStatus: true, breedobj: item1, DogList: DogList, msg: "Sorry! Page Not Found Try after Some time." });

      }
    } catch (err) {
      console.log('Something went wrong catch specificBreeddetailsSearch customerController ', err);
    }

  }
  static breedInformationPage = async (req, res) => {
    console.log("Entryyyyyyy in specificBreeddetailsSearch controler  dealer");
    const breedName = req.params.breedName;
    try {
      console.log("breedName under infor:", breedName);
      const item1 = await breedInfoModel.findOne({ breedName: breedName });
      console.log("item1 breed information" + item1);
      if (item1) {
        res.render("customer/breedInformationPage", { loginStatus: true, breedObj: item1, msg: "" });
      }
      else {
        res.render("customer/breedInformationPage", { loginStatus: true, breedObj: item1, msg: "Sorry Page Not Found try Afer Some time." });
      }

    } catch (err) {
      console.log('Something went wrong catch breedInformationPage customerController ', err);
    }
  }

  static addtocart = async (req, res) => {
    var user = req.cookies.user;
    var id = user._id;
    const cart = await Cart.find({ user_id: id });
    let flag = false;
    if (cart.length != 0) {
      for (let i = 0; i < cart[0].products.length; i++) {
        if (cart[0].products[i].product_id == req.params.id) {
          flag = true;
          break;
        }
      }

      if (flag) {
        res.render("customer/Breed", { loginStatus: true, breedInfo: "", msg: "The selected dog is already added in your cart.", successMsg: " " });

      } else {
        cart[0].products[cart[0].products.length] = {
          product_id: req.params.id
        }
        await cart[0].save();
      }
    } else {
      console.log("cart created");
      try {
        const result = await Cart.create({
          user_id: id,
          products: [
            {
              product_id: req.params.id
            }
          ]
        });
        await result.save();
      } catch (err) {
        console.log(err)
      }
    }
    const item = await breedInfoModel.find();
    if (item.length != 0) {
      res.render("customer/Breed", { loginStatus: true, breedInfo: item, msg: "", successMsg: "" });
    }
    else {
      res.render("customer/Breed", { loginStatus: false, breedInfo: item, msg: "sorry you have no item in cart", successMsg: "" });

    }

  }


  static cartShow = async (req, res) => {
    const user = req.cookies.user;
    const userId = user._id;
    console.log(userId);

    try {
      // Find the user's cart
      const cart = await Cart.findOne({ user_id: userId });

      if (cart) {
        const productIds = cart.products.map(product => product.product_id);
        // console.log(productIds);
        // Fetch product details from the "products" collection
        const productsInCart = await addSellingDogModel.find({ _id: { $in: productIds } });

        // Now you have an array of product details to display in the cart
        //   console.log("hello cart");
        //   console.log(productsInCart)
        res.render('customer/cart', { item: productsInCart, msg: "", id: "cart" });
      } else {
        res.render('customer/cart', { item: [], msg: "Empty Cart", id: "cart" }); // Cart is empty
      }
    } catch (err) {
      // Handle errors
      console.error(err);
      res.status(500).send('An error occurred');
    }
  };

  static deleteProduct = async (req, res) => {
    const user = req.cookies.user;
    const userId = user._id;
    const productIdToDelete = req.params._id; // Get the product ID to delete from the request
    console.log(productIdToDelete);
    try {
      // Find the user's cart
      const cart = await Cart.findOne({ user_id: userId });

      if (cart) {
        // Filter out the product to delete from the cart's products array
        cart.products = cart.products.filter(
          (product) => product.product_id.toString() !== productIdToDelete
        );

        // Save the updated cart
        await cart.save();

        res.redirect('/cart'); // Redirect to the cart page or any other desired page
      } else {
        res.status(404).send('Cart not found for the user');
      }
    } catch (err) {
      // Handle errors
      console.error(err);
      res.status(500).send('An error occurred');
    }
  }

  static placeOrder = async (req, res) => {
    const user = req.cookies.user;
    const userId = user._id;
    console.log(userId);
    try {
      const cart = await Cart.findOne({ user_id: userId });
      console.log(cart);

      if (cart) {
        let totalOrderTotal = 0;
        const orderedProducts = [];
        var productIdToOrder;
        for (const productInCart of cart.products) {
          const productIdToOrder = productInCart.product_id;
          console.log(productIdToOrder);
          const product1 = await addSellingDogModel.findById(productIdToOrder);
          console.log(product1); 8
          const productPrice = product1.dogPrice;
          const orderTotal = productPrice;

          orderedProducts.push({
            product_id: productIdToOrder
          });

          totalOrderTotal += orderTotal;

        }

        const order = new Order({
          user_id: userId,
          products: orderedProducts,
          orderTotal: totalOrderTotal
        });

        await order.save();
        const productIdsToDelete = orderedProducts.map((product) => product.product_id);
        // await addSellingDogModel.deleteMany({ _id: { $in: productIdsToDelete } });
        var name = await addSellingDogModel.updateMany(
          { _id: { $in: productIdsToDelete } },
          { $set: { status: 'Sold' } }
        );
        console.log(name);

        cart.products = cart.products.filter((product) => !productIdsToDelete.includes(product.product_id));
        await cart.save();
        var customer = await CustomerRegModel.findOne({ _id: userId })
        console.log(customer);
        res.render("customer/address", { orderID: order._id });

        // const cart1 = await Cart.findOne({ user_id: userId });

        // if (cart1) {
        //   const productIds = cart1.products.map(product => product.product_id);
        //   const productsInCart = await addSellingDogModel.find({ _id: { $in: productIds } });
        //   res.render('customer/cart', { item: productsInCart });
        // } else {
        //   res.render('customer/cart', { item: [] });
        // }
      } else {
        res.status(404).send('Cart not found for the user');
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('An error occurred');
    }
  };

  static message = async (req, res) => {
    var messages = await messageModel.create({
      name: req.body.name,
      email: req.body.email,
      subject: req.body.subject,
      message: req.body.message
    })
    console.log(messages)
    res.render('customer/Contact', { loginStatus: true, msg: "Message Send Successfully" });
  }

  static messageDetails = async (req, res) => {
    try {
      var messages = await messageModel.create({
        name: req.body.name,
        email: req.body.email,
        subject: req.body.subject,
        message: req.body.message
      })
      console.log(messages);
      const item1 = await breedInfoModel.find();

      res.render('customer/Breed', { loginStatus: true, msg: "", successMsg: "Messege Successfully sent", breedInfo: item1 });
    }
    catch (err) {
      res.render('customer/Breed', { loginStatus: true, msg: " facing some technical issuse please relogin or try later ", breedInfo: item1, successMsg: "" });
    }
  }

  static address = async (req, res, next) => {
    const user = req.cookies.user;
    const userId = user._id;
    try {
      const orderId = req.params.orderID; // Get the product ID from the request params
      const { name, lastName, mobile, pinCode, state, address, city } =
        req.body;
      console.log(orderId);
      // const order = await Order.findById(orderId);
      const order = await Order.findOneAndUpdate(
        { _id: orderId },
        {
          name: name,
          lastName: lastName,
          mobile: mobile,
          pinCode: pinCode,
          address: address,
          state: state,
          city: city,
          orderStatus: "confirm",
        },
        { new: true }
      );
      console.log(order);
      await order.save();
      console.log(order);
      next();
    } catch (err) {
      console.log(err);
    }
  };

  static orderDetails = async (req, res) => {
    console.log("1234");
    try {
      const orderId = req.params.orderID;
      console.log(orderId);
      const order = await Order.findById(orderId);
      console.log(order);
      if (!order) {
        return res.status(404).send('Order not found');
      }

      const productsWithDetails = await Promise.all(
        order.products.map(async (product1) => {
          console.log(product1);
          const productDetails = await addSellingDogModel.findById(product1.product_id);
          console.log(productDetails);
          return {
            ...product1.toObject(),
            productDetails,
          };
        })
      );
      res.render('customer/bill.ejs', { order, productsWithDetails, key: STRIPE_PUBLISHABLE_KEY });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  };

  static customersOrder = async (req, res) => {
    const item = await addSellingDogModel.find({});
    if (!item) {
      res.render("admin/adminViewProduct", { item: "" });
    } else {
      res.render("admin/adminViewProduct", { item: item });
    }
  }

  static paymentdetailsController = async (req, res) => {
    console.log("paymentdetailsController");
    try {
      stripeInstance.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken,
      })
        .then(async (customer) => {
          return await stripeInstance.paymentIntents.create({
            amount: parseInt(req.body.amount),
            currency: 'INR',
            payment_method_types: ['card'],
            customer: customer.id,
          });
        })
        .then((charge) => {
          console.log('charge ', charge);
          res.render("customer/paysuccess");
        })
        .catch((err) => {
          console.log('error', err);
          res.redirect("failure");
        });
    } catch (error) {
      console.log(error.message);
    }

  }
  static successController = async (req, res) => {

    try {
      res.render("customer/paysuccess");
    } catch (error) {
      console.log(error.message)
    }

  }

};

export { SECRET_KEY };
export default customerController;