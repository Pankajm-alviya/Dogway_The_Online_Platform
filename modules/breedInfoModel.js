import mongoose from "mongoose";

const breedInfoSchema = new mongoose.Schema({
      breedName: {
            type: String,
            required: true,
            trim: true
      },
      lifeExpectancy: {
            type: String,
            required: true,
            trim: true
      },
      training: {
            type: String,
            required: true,
            trim: true
      },
      litterSize: {
            type: String,
            required: true,
            trim: true
      },
      dogSize: {
            type: String,
            required: true,
            trim: true
      },
      wheight: {
            type: String,
            required: true,
            trim: true
      },
      Maintenance: {
            type: String,
            required: true,
            trim: true
      },
      avtar: {
            type: String,
            required: true
      },
      maintenance: {
            type: String,
            required: true,
            trim: true
      },
      shedding: {
            type: String,
            required: true,
            trim: true
      },
      trainability: {
            type: String,
            required: true,
            trim: true
      },
      personality: {
            type: String,
            required: true,
            trim: true
      },
      Goodfor: {
            type: String,
            required: true,
            trim: true
      }
})
const breedInfoModel = mongoose.model("breedInfoModel", breedInfoSchema, "breedInformation")
export default breedInfoModel;