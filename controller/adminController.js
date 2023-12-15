import { messageModel, CustomerRegModel, addDogForMating } from "../modules/customer.js";
import { adminModel, admin, adminMatingModel, adminServiesTimeModel } from "../modules/adminModule.js";
// import { addDogForMating } from "../modules/customer.js";
import { addMatingDogModel, addSellingDogModel, serviesDogModel } from "../modules/dealermodule.js"
import { Order } from "../modules/orderModule.js";
import { transporter } from "../modules/nodeMailer.js"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import randomstring from 'randomstring';
import serviceModel from "../modules/serviceProviderModel.js";
var secret_key = "process.env.ADMIN_SECRET_KEY";
var userdata = {};
var Rotp = "";
var forgetPassotp = "";
var serviceProvider_id="";
class adminController {
    static viewCustomer = async (req, res) => {
        const item = await CustomerRegModel.find();
        console.log(item);
        if (!item) {
            res.render("admin/adminViewCustomer", { item: "" });
        } else {
            res.render("admin/adminViewCustomer", { item: item });
        }
    }
    static addCategory = async (req, res) => {
        try {
            const newMating = await adminModel.create({
                category: req.body.category
            });

            const item = await adminModel.find();

            res.render('admin/adminAddCategory', { item: item });
        }
        catch (err) {
            console.log('Something went wrong', err);
        }
    }
    static viewCategory = async (req, res) => {
        const item = await adminModel.find();
        console.log(item);
        if (!item) {
            res.render("admin/adminAddCategory", { item: "" });
        } else {
            res.render("admin/adminAddCategory", { item: item });
        }
    }
    static deleteCategory = async (req, res) => {
        console.log(req.params.category);
        const item1 = await adminModel.deleteOne({ category: req.params.category });
        const item = await adminModel.find();
        console.log(item);
        if (!item) {
            res.render("admin/adminAddCategory", { item: "" });
        } else {
            res.render("admin/adminAddCategory", { item: item });
        }
    }

    static deleteCustomer = async (req, res) => {
        console.log("123");
        try {
            var CEmail = req.params.CEmail;
            console.log("email : ", CEmail);

            const user = await CustomerRegModel.findOne({ CEmail: CEmail });
            console.log("1", user);
            console.log("user status : " + user.status);
            if (user.status == "Activate") {
                const updateddata = await CustomerRegModel.updateOne({ CEmail: CEmail }, { $set: { status: "Deactivate" } });
                const item = await CustomerRegModel.find();
                console.log("updateddata : ", updateddata);
                res.render("admin/adminViewCustomer", { item: item });
            } else {
                const updateddata1 = await CustomerRegModel.updateOne({ CEmail: CEmail }, { $set: { status: "Activate" } })
                const item = await CustomerRegModel.find();
                console.log("updateddata1 : ", updateddata1);
                res.render("admin/adminViewCustomer", { item: item });
            }
        } catch (error) {
            console.log("error while activate or deactivate account" + error);
        }

    }

    static editCategory = async (req, res) => {
        console.log(req.params.category);
        const result = await adminModel.find({ category: req.params.category });
        console.log(result);
        const item = await adminModel.find();
        console.log(item);
        if (!item) {
            res.render("admin/adminAddCategory", { item: "" });
        } else {
            res.render("admin/adminAddCategory", { result: result[0] });
        }
    }

    static updateCategory = async (req, res) => {
        try {
            const { category } = req.body;
            console.log("req.body :", req.body);
            console.log("req.params.category :", req.params.category)
            const result = await adminModel.updateOne({ category: req.params.category }, {
                $set: {
                    category: category
                }
            });
            const item = await adminModel.find();
            console.log("item : ", item);
            res.render("admin/adminAddCategory", { item: item });

        } catch (error) {
            console.log("Error : " + error);
        }
    }

    static viewServiceProvider = async (req, res) => {
        const item = await serviceModel.find();

        console.log(item);
        if (item) {
            res.render("admin/adminViewServiceProvider", { item: item });
        } else {
            res.render("admin/adminViewServiceProvider", { item: "" });
        }
    }



    static deleteServiceProvider = async (req, res) => {
        console.log("123");
        try {
            var email = req.params.email;
            console.log("email1 : ", email);

            const user = await serviceModel.findOne({ email: email });
            console.log("1", user);
            console.log("user status : " + user.status);
            if (user.status == "Activate") {
                const updateddata = await serviceModel.updateOne({ email: email }, { $set: { status: "Deactivate" } });
                const item = await serviceModel.find();
                console.log("updateddata : ", updateddata);
                res.render("admin/adminViewServiceProvider", { item: item });
            }
            else {
                const updateddata1 = await serviceModel.updateOne({ email: email }, { $set: { status: "Activate" } })
                const item = await serviceModel.find();
                console.log("updateddata1 : ", updateddata1);
                res.render("admin/adminViewServiceProvider", { item: item });
            }
        } catch (error) {
            console.log("error while activate or deactivate account" + error);
        }
    }

    static viewProduct = async (req, res) => {
        const item = await addSellingDogModel.find();
        if (!item) {
            res.render("admin/adminViewProduct", { item: "" });
        } else {
            res.render("admin/adminViewProduct", { item: item });
        }
    }

    static deleteDocById = async (req, res) => {
        try {
            await addSellingDogModel.findByIdAndDelete(req.params.id);
            const item = await dealerModel.find();
            res.render("admin/adminViewProduct", { item: item });
        } catch (error) {
            console.log("Error : " + error);
        }
    }

    static viewMessage = async (req, res) => {
        const item = await messageModel.find();
        console.log(item);
        if (!item) {
            res.render("admin/adminMessage", { item: "" });
        } else {
            res.render("admin/adminMessage", { item: item });
        }
    }

    static adminLoginController = async (request, response) => {
        const { email, password } = request.body;
        console.log(password);
        try {
            var expireTime = { expiresIn: '1d' };
            var token = jwt.sign({ _id: email }, secret_key, expireTime);

            if (!token)
                response.render("error", { message: "Error while generating token inside admin login" });
            response.cookie('admin_jwt_token', token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
            var adminObj = await admin.findOne({ _id: email });
            console.log(adminObj);
            var adminPassword = adminObj.password;
            console.log(adminPassword);
            var status = await bcrypt.compare(password, adminPassword);
            if (status) {
                const orders = await Order.find({})
                    .populate({
                        path: 'user_id',
                        model: 'customerRegData',
                    })
                    .exec();

                if (!orders) {
                    return res.status(404).send('No orders found');
                }

                const productPromises = [];

                orders.forEach((order) => {
                    order.products.forEach((product1) => {
                        console.log("1", product1.product_id);
                        const productPromise = addSellingDogModel.find({ _id: product1.product_id });
                        productPromises.push(productPromise);
                    });
                });
                const productDetailsArray = await Promise.all(productPromises);

                const productsWithDetails = orders.map((order, index) => {
                    return {
                        ...order.toObject(),
                        productDetails: productDetailsArray.slice(index, index + order.products.length),
                    };
                });

                console.log("hello", productsWithDetails);
                console.log("5", productsWithDetails[0].productDetails);
                response.render("admin/adminDashboard", { adminemail: "", usersOrder: productsWithDetails });
            } else {
                response.render("admin/adminLogin", { message: "Error while Login" });
            }
        } catch (err) {
            console.log("Error in admin login controller : " + err);
        }
    }
    static adminLogoutController = (request, response) => {
        response.clearCookie('admin_jwt_token');
        response.render("admin/adminLogin", { message: "Successfully Logout" });
    };
    //  admin view Mating dog add message to customer
    static adminViewMatingDog = async (request, response) => {
        var result = await addDogForMating.find();
        console.log(result);
        if (!result) {
            response.render("admin/adminViewMatingDog", { result: "" });
        } else {
            response.render("admin/adminViewMatingDog", { result: result });
        }
    }

    static adminViewServiesDog = async (req, response) => {
        var result = await serviesDogModel.find();
        console.log(result);
        if (!result) {
            response.render("admin/adminViewServesDog", { result: "" });
        } else {
            response.render("admin/adminViewServesDog", { result: result });
        }
    }
    static adminViewServiesProvider = async (req, res) => {
        var customer_email = req.params.customerEmail;
        console.log("customer email adminViewServiesProvider : "+customer_email)
        try {
            var serviesProviderList = await serviceModel.find();
            res.render("admin/ViewSevieProvider", { serviesProviderList: serviesProviderList, customer_email: customer_email });
        } catch (error) {
            res.render("admin/adminViewServesDog", { result: "" });
            console.log("Error : " + error);
        }
    }
  
    static provideTimeAndDate = async (req, res) => {
        var customer_email = req.params.customer_email;
         serviceProvider_id = req.params.serviceProvider_id;
        
        console.log("Customer email : "+customer_email);
        console.log("servies provider id : "+serviceProvider_id);
        try {
            res.render("admin/provideTimeForCustomer", { customer_email: customer_email,serviceProvider_id:serviceProvider_id });
        } catch (error) {
            res.render("admin/adminViewServesDog", { result: "" });
        }
    }

    static EmailMassageSendCustomerController = async (req, res) => {
        try {
            const newMating = await adminMatingModel.create({
                Timeformating: req.body.Timeformating,
                customerEmail: req.body.customerEmail
            });
            console.log(newMating);
            const item = await CustomerRegModel.find({ CEmail: req.body.customerEmail });

            console.log("item data is  : " + item);
            // email code

            const mailOptions = {
                from: 'pankajmalviya364@gmail.com',
                to: req.body.customerEmail,
                subject: `DogWay The Online Platform🐶`,
                text: `Hello ${item[0].CName}\n you can bring your dog for mating at ${req.body.Timeformating}.\nThank You☺`
            };
            transporter.sendMail(mailOptions, async (error, info) => {
                if (error) {
                    console.log("mail not send ")
                    var result = await addDogForMating.find();
                    res.render('admin/adminViewMatingDog', { loginStatus: false, msg: "error while deling with send massagge for customer", otp: "", result: result });
                    console.error(error);
                } else {
                    console.log("mail send susefullyy");
                    var result = await addDogForMating.find();
                    res.render("admin/adminViewMatingDog", { loginStatus: false, msg: "", otp: "send massage sucesfully", result: result });
                    //   console.log(Rotp);
                }
            });

            //   res.render("admin/adminViewMatingDog", { loginStatus: false,msg: "", otp: "send massage sucesfully" ,result:result});
        }
        catch (err) {
            console.log('Something went wrong', err);
        }
    }

    static EmailMassageSendCustomerForserves = async (req, res) => {
        var email = " ";
        try {
            const newMating = await adminServiesTimeModel.create({
                timeforservies: req.body.timeforservies,
                dateforServies: req.body.dateforServies,
                email: req.body.email,
            });
            const servicePro = await serviesDogModel.updateOne({customerEmail:req.body.email},{$set:{
                serviceProvider_id:req.body.serviceProvider_id,
            }});
            // console.log("email djfhd : "+req.body.email);
            console.log("req.body.email  : "+req.body.email);
            console.log(newMating);
            // const item = await CustomerRegModel.find({CEmail:req.cookie.CEmail});

            // console.log("item data is servies provider : "+item);
            // email code

            const mailOptions = {
                from: 'pankajmalviya364@gmail.com',
                to: req.body.email,
                subject: `DogWay The Online Platform🐶`,
                text: `Hello you can bring your dog for servies at ${req.body.timeforservies} And ${req.body.dateforServies} date. \nThank You☺`
            };
            transporter.sendMail(mailOptions, async (error, info) => {
                if (error) {
                    console.log("mail not send ");
                    var result = await serviesDogModel.find();
                    console.log(result);
                    res.render("admin/adminViewServesDog", { result: result });
                    console.error(error);
                } else {
                    console.log("mail send susefullyy");
                    var result = await serviesDogModel.find();
                    console.log(result);
                    res.render("admin/adminViewServesDog", { result: result });
                    //   console.log(Rotp);
                }
            });

            // res.render('admin/adminAddCategory', { item: item });
        }
        catch (err) {
            console.log('Something went wrong', err);
        }

    }
    static EmailMassageSendCustomerController = async (req, res) => {
        // var customerEmail="";
        // var Timeformating="";
        try {
            const newMating = await adminMatingModel.create({
                Timeformating: req.body.Timeformating,
                customerEmail: req.body.customerEmail
            });
            console.log(newMating);
            const item = await CustomerRegModel.find({ CEmail: req.body.customerEmail });

            console.log("item data is  : " + item);
            // email code

            const mailOptions = {
                from: 'pankajmalviya364@gmail.com',
                to: req.body.customerEmail,
                subject: `DogWay The Online Platform🐶`,
                text: `Hello ${item[0].CName}\n you can bring your dog for mating at ${req.body.Timeformating}.\nThank You☺`
            };
            transporter.sendMail(mailOptions, async (error, info) => {
                if (error) {
                    console.log("mail not send ")
                    res.render("admin/adminViewMatingDog", { result: result });
                } else {
                    console.log("mail send susefullyy");
                    var result = await addDogForMating.find();
                    res.render("admin/adminViewMatingDog", { result: result });                    //   console.log(Rotp);
                }
            });

            // res.render('admin/adminAddCategory', { item: item });
        }
        catch (err) {
            console.log('Something went wrong', err);
        }
    }

    static adminViewOrderController = async (req, res) => {
        try {
            const orders = await Order.find({})
                .populate({
                    path: 'user_id',
                    model: 'customerRegData',
                })
                .exec();

            if (!orders) {
                return res.status(404).send('No orders found');
            }

            const productPromises = [];

            orders.forEach((order) => {
                order.products.forEach((product1) => {
                    console.log("1", product1.product_id);
                    const productPromise = addSellingDogModel.find({ _id: product1.product_id });
                    productPromises.push(productPromise);
                });
            });
            const productDetailsArray = await Promise.all(productPromises);

            const productsWithDetails = orders.map((order, index) => {
                return {
                    ...order.toObject(),
                    productDetails: productDetailsArray.slice(index, index + order.products.length),
                };
            });

            console.log("hello", productsWithDetails);
            console.log("5", productsWithDetails[0].productDetails);
            res.render("admin/adminDashboard", { adminemail: "", usersOrder: productsWithDetails });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    };
    static sendMessage = async (req, res) => {
        console.log(req.params.email);
        console.log(req.body.adminMessage);
         var message =await messageModel.updateOne(
             { email: req.params.email },
             { $set: { adminMessage: req.body.adminMessage } })
             console.log("meaag",message);
 
         const item = await messageModel.find();
         res.render("admin/adminMessage", { item: item });
       }
    // forget password 
    static forgetPasspwrdFrom = async (req, res) => {
        try {
            res.render("admin/frogetPasswordFrom");
        } catch (error) {
            console.log("admin forget passsword from time error : ");
            res.render("admin/adminLogin");
        }
    }
    static matchDataAdminEmailController = async (req, res) => {
        // const {email} = req.body;
        try {
            console.log("kjbddwg : " + req.body.adminemail);
            var admindata = await admin.findOne({ _id: req.body.adminemail });
            console.log("admin data : ", admindata);
            if (admindata) {
                forgetPassotp = randomstring.generate({
                    length: 4,
                    charset: 'numeric',
                });
                console.log("otp : " + forgetPassotp);
                // console.log("adnr jd jkdc j : ",admindata);
                const mailOptions = {
                    from: 'jtichouhan@gmail.com',
                    to: req.body.adminemail,
                    subject: `DogWay The Online Platform`,
                    text: `Hello  Admin \n your one time Password is ${forgetPassotp} enter this opt and register yourself.\nThank You`
                };
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        res.render('customer/CustomerMainPage', { loginStatus: false, msg: "Invalid Email Please Enter Right Email Id", forgetPassotp: "" });
                        console.error(error);
                    } else {
                        console.log(admindata);
                        console.log(admindata._id);
                        console.log(Rotp);
                        res.render("partials/adminfrogetpasswordNot", { msg: "", admin_id: admindata._id, forgetPassotp: "OTP send successfully please check your mail id" });
                    }
                });
            }

            else {
                res.render("admin/frogetPasswordFrom", { loginStatus: false, customerEmail: "", msg: "password not matched please enter right password for login" });
            }

        } catch (error) {
            console.log("error in mating admin email")
        }
    }
    static confirmPassword = async (req, res) => {
        console.log("admi email : " + req.body.admin_id);
        console.log("confirm-password", req.body.admin_id);

        var admindata = await admin.findOne({ _id: req.body.admin_id });
        // console.log(admindata);
        var { otp } = req.body;
        console.log("chaek otp : " + otp);
        console.log(forgetPassotp);
        if (otp == forgetPassotp) {
            console.log(admindata);
            console.log(admindata._id);
            res.render("admin/confirm_passAdmin", { admin_id: admindata._id });
        } else {
            res.render("partials/forgetpassword", { msg: "Otp does not match", otp: "" });
        }
    }
    static adminsetfrogetpasswordcontroller = async (req, res) => {
        console.log("foget password............")
        try {
            console.log(req.body);
            const { password, admin_id } = req.body;

            console.log("admin password : ", password);
            console.log("admin_id : ", admin_id)

            const hashedPassword = await bcrypt.hash(password, 10);
            console.log(hashedPassword);
            const updatedData = await admin.findOneAndUpdate(
                { _id: admin_id },
                { $set: { password: hashedPassword } }
            );
                console.log("password update sucesfully");
            res.render('admin/adminLogin');
        } catch (error) {
            console.log("Error" + error);
            res.render('admin/adminLogin');

        }

    }

}




export default adminController;
export { secret_key };