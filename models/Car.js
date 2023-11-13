const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://test:1234@cluster0.eu4qzfb.mongodb.net/carDB");

const colorSchema = new mongoose.Schema({
  name: String,
  images: [String],
});

const CarSchema = new mongoose.Schema({
  name: String,
  price: String,
  mainSrc : String,
  colors: [colorSchema],
  transmission: String,
  mileage: String,
  features: [String],
  isFeatured : Boolean,
});

const Car = mongoose.model("cars", CarSchema);
const Color = mongoose.model("colors", colorSchema);

module.exports = {
  Car,
  Color,
};