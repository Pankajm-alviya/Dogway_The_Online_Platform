import mongoose from "mongoose";

const addSellingDogSchema = new mongoose.Schema({
    DogBreed: {
        type: String,
        required: true,
        trim: true
    },
    DogAge: {
        type: String,
        required: true,
        trim: true
    },
    DogColor: {
        type: String,
        required: true,
        trim: true
    },
    DogHeight: {
        type: String,
        required: true,
        trim: true
    },
    DogWeight: {
        type: String,
        require: true,
        trim: true
    },
    breedDescription: {
        type: String,
        required: true,
        trim: true
    },
    dogPrice: {
        type: Number,
        required: true,
        trim: true
    },
    gender: {
        type: String,
        required: true,
        trim: true
    },
    avtar: {
        type: String
    },
    userid: {
        type: Object,
    },
    status:{
        type:String,
        default:"Available"
    }
});
const addSellingDogModel = mongoose.model("sellingDogs", addSellingDogSchema,'sellingDogs');


const addMatingDogSchema = new mongoose.Schema({
    dogname: {
        type: String,
        required: true,
        trim: true
    },

    dogBreed: {
        type: String,
        required: true,
        trim: true
    },
    breedDescription: {
        type: String,
        required: true,
        trim: true
    },
    gender: {
        type: String,
        required: true,
        trim: true
    },
    avtar: {
        type: String
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    price:{
        type: Number,
        required: true,
        trim: true
    },
    userid: {
        type: Object,
    }
})

const addMatingDogModel = mongoose.model('matingDogs', addMatingDogSchema,'matingDogs');


const ServiesDogSchema = new mongoose.Schema({
    dogName: {
        type: String,
        required: true,
        trim: true
    },

    age: {
        type: String,
        required: true,
        trim: true
    },
    breed: {
        type: String,
        required: true,
        trim: true
    },
    // servicestype: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },
    // userid: {
    //     type: Object,
    // },
    customerName:{
        type:String,
        required:true
    },
    customerEmail:{
        type:String,
        required:true
    },
    customerContact:{
        type:String,
        required:true
    },
    serviceProvider_id:{
        type:String,
        default:"na"
      }
});

const serviesDogModel = mongoose.model('ServiesDogDeatils', ServiesDogSchema,'serviesDogDeatil');

// const sellerRegistrationSchema = new mongoose.Schema({

//     SellerName:{
//         type:String,required:true,trim:true
//     },
//     SellerContactNo:{
//         type:Number,required:true
//     },
//     SellerEmail:{
//         type:String,required:true,trim:true
//     },
//     // SellerCity:{
//     //     type:String,required:true
//     // },
//     SellerState:{
//         type:String,require:true,trim:true
//     },
//     SellerCountry:{
//         type:String,require:true,trim:true
//     },
//     SellerPassword:{
//         type:String,require:true,trim:true
//     },
//     shopName:{
//         type:String,require:true,trim:true
//     },
//     SellerAddress:{
//         type:String,require:true,trim:true
//     },
//     gstin:{
//         type:String,require:true,trim:true
//     },
//     Addharno:{
//         type:String,require:true,trim:true
//     },
//     RollId:{
//         type:Number,
//         default:102
//     },
// })
// const sellerRegistrationModel = mongoose.model("sellerservies",sellerRegistrationSchema);

// export { addMatingDogModel,sellerRegistrationModel,addSellingDogModel};
export { addMatingDogModel, addSellingDogModel,serviesDogModel };