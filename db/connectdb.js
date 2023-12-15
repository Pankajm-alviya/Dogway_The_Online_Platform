import mongoose from "mongoose";

const connectDB = async (DATABASES_URL) => {
    try {
        const DB_OPTIONS = {
            dbName: "Dogway",
        };
        // await mongoose.connect(DATABASES_URL, DB_OPTIONS);
         await mongoose.connect("mongodb+srv://pankajjmalviya:uOA5eIY7yDFTvpWp@cluster0.qmc8ogi.mongodb.net/Dogway");
       console.log("Connected successfully..!!");
    } catch (err) {
        console.error(err);
    }
};

export default connectDB;