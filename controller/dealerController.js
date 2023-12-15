import {addMatingDogModel,addSellingDogModel} from "../modules/dealermodule.js";
import {CustomerRegModel,addDogForMating} from "../modules/customer.js";


import bcrypt from 'bcrypt';
import jwtsel from 'jsonwebtoken';
import crypto from 'crypto';
import cookieParser from "cookie-parser";
const maxAge = 86400 * 1000;
var SECRET_SEL_KEY = "thisismysellersecretkey";

class DogController {

    static addSellingDog = async (req, res) => {
        var email = req.cookies.customerEmail;
        console.log(email);
        var items = await CustomerRegModel.find({ CEmail: email });
        // console.log("------->",items);
        try {
            var price = parseInt(req.body.dogPrice);
            price = price + 3000;
            var obj = {
                dogPrice: price
            }
            const newDealer = await addSellingDogModel.create({
                userid: items[0]._id,
                DogBreed: req.body.DogBreed,
                DogAge: req.body.DogAge,
                DogColor: req.body.DogColor,
                gender: req.body.gender,
                dogPrice: price,
                breedDescription: req.body.breedDescription,
                DogWeight: req.body.DogWeight,
                DogHeight: req.body.DogHeight,
                avtar: req.file.filename
            });

            await newDealer.save();
            console.log(email);
            console.log("Email3 : " + req.cookies.customerEmail);
            const item1 = await addSellingDogModel.find(({ userid: items[0]._id }));
            console.log("dog list---->"+item1);
            if(item1.length!=0){
                res.render('customer/manageAccount', {customerData:items,sellingDogData: item1,id:"sellingDogList",msg:"" });
            }
            else{
                res.render('customer/manageAccount', {customerData:items,sellingDogData: item1,id:"sellingDogList",msg:"You have not listed any dog for sell if you want to add Click here"});

            }

        } catch (err) {
            console.log('Something went wrong', err);
        }
    }

    static dogadd = async (req, res) => {
        console.log("Email : " + req.cookies.customerEmail);
        const item = await CustomerRegModel.find({ CEmail: req.cookies.customerEmail });
        const item1 = await addSellingDogModel.find(({ userid: item[0]._id }));

        console.log("item1 : " + item[0]._id);
        if (!item) {
            res.render("dealer/Dealer", { item: "", data: "", img: "", newuser: "", founduser: "", email: "", aadharFile: "", msg: "" });
        } else {
            res.render("dealer/Dealer", { item: item1, data: "", img: "", newuser: "", founduser: "", email: "", aadharFile: "", msg: "" });
        }
    }
    static deleteDocById = async (req, res) => {
        try {
            await addSellingDogModel.findByIdAndDelete(req.params.id);
            const item = await CustomerRegModel.find({ CEmail: req.cookies.customerEmail });
            const item1 = await addSellingDogModel.find(({ userid: item[0]._id }));



            // const item = await addSellingDogModel.find();
            res.render("customer/manageAccount", {customerData:"",sellingDogData: item1,id:"sellingDogList",msg:"" });
        } catch (error) {
            console.log("Error : " + error);
        }
    }

    static editDoc = async (req, res) => {
        
        try {
            console.log("esitdoc callll")

            // const item = await CustomerRegModel.find({CEmail:req.cookies.dealer});
            // const item1 = await addSellingDogModel.find(({userid:item[0]._id}));
            const result = await addSellingDogModel.find({_id:req.params.id});
            console.log(result);
            res.render("dealer/dogupdate", { data: result[0] });
        } catch (error) {
            console.log("Error : " + error);
        }
    }
   
 static updateDocById = async (req, res) => {
        try {
            const id = req.params.id;
            const { DogBreed, DogAge, DogColor, DogHeight, DogWeight, breedDescription, gender, dogPrice } = req.body;

            console.log("req body :", req.body);
            const result1 = await addSellingDogModel.findById(req.params.id);
            let fileName = "";
            try {
                console.log("file name : ", req.file.filename);
                fileName = req.file.filename;
            } catch (error) {
                console.log("tyghuij:" + error);
                fileName = result1.avtar;
            }
            console.log("file:", fileName);
            const result = await addSellingDogModel.updateOne({ _id: id }, {
                $set: {
                    DogBreed: DogBreed,
                    DogAge: DogAge,
                    DogColor: DogColor,
                    DogHeight: DogHeight,
                    DogWeight: DogWeight,
                    dogPrice: dogPrice,
                    breedDescription: breedDescription,
                    avtar: fileName,
                    gender: gender
                }
            });
            const item = await CustomerRegModel.find({ CEmail: req.cookies.customerEmail });
            const item1 = await addSellingDogModel.find(({ userid: item[0]._id }));
            console.log("selling dog  : "+item1);
            // const item = await addSellingDogModel.find();
            console.log("result : ", item);
            res.render('customer/manageAccount', {customerData:"",sellingDogData: item1,id:"sellingDogList",msg:""});
        } catch (error) {
            console.log("Error : " + error);
        }
    }
    
}

class MatingController {
    static addDogForMating = async (req, res) => {
        var email = req.cookies.customerEmail;
        // console.log("request boday : "+req.body);
        var items = await CustomerRegModel.find({ CEmail: email });
        try {
            const newMating = await addMatingDogModel.create({
                userid: items[0]._id,
                dogname: req.body.dogname,
                dogBreed: req.body.dogBreed,
                breedDescription: req.body.breedDescription,
                gender: req.body.gender,
                avtar: req.file.filename,
                price: req.body.price,
                location: req.body.location
            });
            await newMating.save();
            const item1 = await addMatingDogModel.find(({ userid: items[0]._id }));
            console.log(item1);
            if(item1.length!=0){
                res.render('customer/manageAccount', {customerData:items,matingDogData: item1,id:"matingDogList",msgMating:""});
            }
            else{
                res.render('customer/manageAccount', {customerData:items,matingDogData: item1,id:"matingDogList",msgMating:"You have not listed any dog for Mating if you want to add your dog for mating Click on the button"});

            }

        }
        catch (err) {
            console.log('Something went wrong', err);
        }
    }

    static dogMating = async (req, res) => {
        console.log("Email1 : " + req.cookies.customerEmail);
        const item = await CustomerRegModel.find({ CEmail: req.cookies.customerEmail });
        const item1 = await addMatingDogModel.find(({ userid: item[0]._id }));
        console.log(item1);
        if (!item1) {
            res.render('customer/manageAccount', {customerData:"",matingDogData: item1,id:"matingDogList",msgMating:""});
        } else {
            res.render("dealer/dealarmating", { img: '', item: item1, data: "", newuser: "", founduser: "", email: "", aadharFile: "", msg: "" });
        }
    }

    static deleteDocById = async (req, res) => {
        try {
            await addMatingDogModel.findByIdAndDelete(req.params.id);
            const item = await CustomerRegModel.find({ CEmail: req.cookies.customerEmail });
            const item1 = await addMatingDogModel.find(({ userid: item[0]._id }));

            res.render('customer/manageAccount', {customerData:"",matingDogData: item1,id:"matingDogList",msgMating:""});
        } catch (error) {
            console.error('Error: ' + error);
        }
    }
    static fetchMatingaDogData = async (req, res) => {
        
        try {
            // const item = await CustomerRegModel.find({CEmail:req.cookies.dealer});
            // const item1 = await addSellingDogModel.find(({userid:item[0]._id}));
            const result = await addMatingDogModel.findOne({_id:req.params.id});
            console.log(result);
            res.render("customer/editMatingDog",{ dogUpdateData: result});
        } catch (error) {
            console.log("Error while edit matingDog in dealer route : " + error);
        }
    }
    static updateDogForMating = async (req, res) => {
        
    try {
        const id = req.params.id;
        console.log("req body :", req.body);
        const result1 = await addMatingDogModel.findById(req.params.id);
        let fileName = "";
        try {
            console.log("file name : ", req.file.filename);
            fileName = req.file.filename;
        } catch (error) {
            console.log("tyghuij:" + error);
            fileName = result1.avtar;
        }
        console.log("file:", fileName);
        const result = await addMatingDogModel.updateOne({ _id: id }, {
            $set: {
                dogname:req.body.dogname,
                dogBreed:req.body.dogBreed,
                breedDescription:req.body.breedDescription,
                gender:req.body.gender,
                avtar:fileName,
                location:req.body.location
            }
            
        });
        const item = await CustomerRegModel.find({ CEmail: req.cookies.customerEmail });
        const item1 = await addMatingDogModel.find(({ userid: item[0]._id }));

        
        console.log("result : ", item);
        res.render('customer/manageAccount', {customerData:item,matingDogData: item1,id:"matingDogList",msgMating:""});
    } catch (error) {
        console.log("Error while update mating dog details in dealer controller: " + error);
    }
}
   
}
export { jwtsel, SECRET_SEL_KEY };
export { DogController, MatingController};

