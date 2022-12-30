const mongoose = require("mongoose");
require("dotenv").config();
const {newDate} = require("#utils/newDate.js")

// Variables
const DB = process.env.DB;
const DB_URL = process.env.DB_URL;

// connection to database
module.exports = async () => {
  const connectionParams = {
    useNewUrlParser: true,
  };
  try {
    await mongoose.connect(DB_URL, connectionParams);
    console.log(`connected to ${DB} database   Date: ${newDate()}`);
  } catch (error) {
    console.log(error);
  }
};
