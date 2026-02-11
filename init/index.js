const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
require("dotenv").config();   // IMPORTANT

const MONGO_URI = process.env.MONGO_URL;

async function main() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to DB");
}

main()
  .then(() => {
    initDB();
  })
  .catch((err) => {
    console.log(err);
  });

const initDB = async () => {
  await Listing.deleteMany({});
  await Listing.insertMany(initData.data);
  console.log("Data was initialized");
  mongoose.connection.close();
};
