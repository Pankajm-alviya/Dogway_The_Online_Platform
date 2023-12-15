import mongoose from "mongoose";
const adminSchema = new mongoose.Schema({
    category:{
        type: String,
        required: true,
        trim: true
    }
});

const adminModel = mongoose.model("category", adminSchema);
const adminMatingSchema = new mongoose.Schema({
    Timeformating:{
        type: String,
        required: true,
        trim: true
    },
    customerEmail:{
        type:String,
        required:true,
        trim:true
    }
});
const adminMatingModel = mongoose.model("MatingTimeProvideadmin", adminMatingSchema);


const adminseviesTimeSchema = new mongoose.Schema({
    timeforservies:{
        type: String,
        required: true,
        trim: true
    },
    dateforServies:{
        type:String,
        required:true,
        trim:true
    },
    email : {
        type:String,
        required:true,
        trim:true
    }
});
const adminServiesTimeModel = mongoose.model("ServiesTimeSedule", adminseviesTimeSchema,"ServiesTimeSedule");

var adminLoginSchema = mongoose.Schema({
    _id : {
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});

const admin =  mongoose.model('adminModel',adminLoginSchema,'admin');
export {adminModel,admin,adminMatingModel,adminServiesTimeModel};

