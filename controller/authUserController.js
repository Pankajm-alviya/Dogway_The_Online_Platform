import jwt from 'jsonwebtoken';
import {SECRET_KEY } from './customerController.js';
import {SECRET_SEL_KEY } from './dealerController.js';
import {SECRET_SER_KEY} from './serviceProContoller.js';
import {secret_key} from './adminController.js';
// import {jwtad,SECRET_AD_KEY} from './adminController.js';
import { addSellingDogModel } from "../modules/dealermodule.js";

class authControllerClass {



static authenticateCustomer = (request,response,next)=>{
    console.log("Entryyyyyyy in auth");
    var token = request.cookies.customer;
    if(!token)
        response.render("customer/CustomerMainPage",{loginStatus:false,customerEmail: "", msg: "", });
    else{    
        jwt.verify(token,SECRET_KEY,(err,payload)=>{
            if(err)
                response.render("customer/CustomerMainPage",{loginStatus:false,customerEmail: "", msg: "", });
            else{
                console.log("Entryyyyyyy in payload");
                request.payload = payload;
                next();
            }    
        });
    }    
}
static authenticateProvider = (request,response,next)=>{
    console.log("Entryyyyyyy in auth");
    var token = request.cookies.serviceProvider;
    if(!token)
        response.render("serviceProvider/serviceProLogin",{loginStatus:false,data: "", msg: "", });
    else{    
        jwt.verify(token,SECRET_SER_KEY,(err,payload)=>{
            if(err)
                response.render("serviceProvider/serviceProLogin",{loginStatus:false,customerEmail: "", msg: "", });
            else{
                console.log("Entryyyyyyy in payload");
                request.serviceProviderPayload = payload;
                next();
            }    
        });
    }    
}
static authenticateAdmin = (request,response,next)=>{
    console.log("Entryyyyyyy in auth");
    var token = request.cookies.admin_jwt_token;
    console.log(token)
    if(!token)
        response.render("admin/adminLogin",{loginStatus:false,data: "", msg: "", });
    else{    
        jwt.verify(token,secret_key,(err,payload)=>{
            if(err)
                response.render("admin/adminLogin",{loginStatus:false,data: "", msg: "", });
            else{
                console.log("Entryyyyyyy in payload");
                request.adminPayload = payload;
                next();
            }    
        });
    }    
}

    static authenticateUser = (request, response, next) => {
        var roll = request.params.roll;
        var token = "";
        if (roll == "customer") {
            token = request.cookies.customer;
            if (!token) {
                response.json({ message: "Error Occured while dealing with Token inside authenticateJWT" });
            }

            jwt.verify(token, SECRET_KEY, (err, payload) => {
                if (err)
                    response.json({ message: "Error Occured while dealing with Token during verify" });
                else {
                    request.payload = payload;
                    console.log("Token cookie2", token);
                    next();
                }
            });

        }
        else if (roll == "seller") {
            token = request.cookies.seller;
            if (!token) {
                response.json({ message: "Error Occured while dealing with Token inside authenticateJWT" });
            }

            jwtsel.verify(token, SECRET_SEL_KEY, (err, payload) => {
                if (err)
                    response.json({ message: "Error Occured while dealing with Token during verify" });
                else {
                    request.payload = payload;
                    console.log("payload sller :", request.payload);
                    console.log("Token cookie2", token);
                    next();
                }
            });

        }
        else if (roll == "serviceProvider") {
            token = request.cookies.serviceProvider;
            if (!token) {
                response.json({ message: "Error Occured while dealing with Token inside authenticateJWT" });
            }

            jwtser.verify(token, SECRET_SER_KEY, (err, payload) => {
                if (err)
                    response.json({ message: "Error Occured while dealing with Token during verify" });
                else {
                    request.payload = payload;
                    console.log("Token cookie2", token);
                    next();
                }
            });

        }
        else if (roll == "admin") {
            token = request.cookies.serviceProvider;
            if (!token) {
                response.json({ message: "Error Occured while dealing with Token inside authenticateJWT" });
            }

            jwtad.verify(token, SECRET_AD_KEY, (err, payload) => {
                if (err)
                    response.json({ message: "Error Occured while dealing with Token during verify" });
                else {
                    request.payload = payload;
                    console.log("Token cookie2", token);
                    next();
                }
            });

        }


    }

    static authorizeUser = async (request, response, next) => {

        try {
            if (request.payload.user.RollId == 101) {
                response.render("customer/CustomerMainPage", { loginStatus: true, customerEmail: "", msg: "" ,founduser:request.payload.user,newuser:""});
            }
            else if (request.payload.user.RollId == 100) {
                response.render("admin/", { email: request.payload.email, aadharFile: request.payload.aadharFile });
            }
            else if (request.payload.user.RollId == 102) {
                const item = await addSellingDogModel.find();
                response.render('dealer/Dealer', { img: "", item: item, data: "", newuser: "", founduser: request.payload.user });

            }
        } catch (err) {
            console.log("authorizeUser controller catch Error :" + err);

        }

    }
}
export default authControllerClass;