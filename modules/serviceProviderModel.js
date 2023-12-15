import mongoose from "mongoose";

const srviesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    contact: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    addharno: {
        type: Number,
        required: true
    },
    pancard: {
        type: String,
        require: true,
        trim: true
    },
    address: {
        type: String,
        require: true,
        trim: true
    },
    city:{
        type: String,
        require: true,
        trim: true
    },
    state:{
        type: String,
        require: true,
        trim: true
    },
    experience: {
        type: String,
        require: true,
        trim: true
    },
    password: {
        type: String,
        require: true,
        trim: true
    },
    prices:{
        type: Object,
    }, 
     status:{
        type: String,
        default:"Activate"
    }
    
})

const serviesModel = mongoose.model("serviceProvider", srviesSchema,"serviceProvider");
export default serviesModel;