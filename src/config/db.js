const mongoose = require("mongoose");
const chalk = require("chalk");


const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/notes-app";

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI);
        // console.log(
        //     `${chalk.bold.yellow.bgMagenta(
        //         "MongoDB connected successfully"
        //     )}`
        // );
    } catch (error) {
        // console.log(
        //     `${chalk.bold.yellow.bgMagenta(
        //         "MongoDB connection unsuccessful"
        //     )}`
        // );
        console.log(error);
        process.exit(1);
    }
};

module.exports = connectDB;