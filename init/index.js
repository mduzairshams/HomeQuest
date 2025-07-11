const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");


main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: '68656d69f6d3d9df9ee23e66',
    geometry: {
      type: 'Point',
      coordinates: [0, 0], // Default coordinates, can be updated as needed
    },
  })) 
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();