import mongoose, { Mongoose } from "mongoose";

const customerSchema = new mongoose.Schema({
    CName: {
        type: String,
        required: true,
        trim: true
    },
    CContact: {
        type: Number,
        required: true
    },
    CEmail: {
        type: String,
        required: true,
        trim: true
    },
    CCity: {
        type: String,
        required: true,
        trim: true
    },
    CState: {
        type: String,
        require: true,
        trim: true
    },
    CPassword: {
        type: String,
        require: true,
        trim: true
    },
    RollId: {
        type: Number,
        default: 101
    },
    status:{
        type: String,
        default:"Activate"
    }
});

const addmatingdogSehdulSchema = new mongoose.Schema({
    matingDate: {
        type: Date,
        required: true
    },
    // matingtime: {
    //     type: String,
    //     required: true
    // },
    address: {
        type: String,
        required: true
    },
    matingdog_id : {
        type:String,
        required:true
    },
    dealerdogBreed:{
        type:String,
        required:true
    },
    dealerdogGender:{
        type:String,
        required:true
    },
    vaccination:{
        type:String,
        required:true
    },
    dogBehaviour : {
        type:String,
        required:true
    },
    customerEmail_id:{
        type:String,
        required:true
    },
    contactno:{
        type :Number,
        require:true
    },
    CustomerdogBreed :{
        type:String,
        required:true
    },
    CustomerDogGender:{
        type:String,
        required:true
    }
});

const messageSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        trim: true
    },
    subject:{
        type:String,
        required:true,
        trim:true
    },
    message:{
        type:String,
        required:true,
        trim:true
    },
    adminMessage:{
        type:String,
        default:"NA",
        trim:true
    }
})

const messageModel = mongoose.model("message", messageSchema,"Message");
const addDogForMating = mongoose.model("matingdogforshedule",addmatingdogSehdulSchema,"matingdogforshedule")
const CustomerRegModel = mongoose.model("customerRegData", customerSchema, 'customerRegData');
export { CustomerRegModel,addDogForMating,messageModel};