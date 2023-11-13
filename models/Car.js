const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://test:1234@cluster0.eu4qzfb.mongodb.net/carDB");

const colorSchema = new mongoose.Schema({
  name: String,
  images: [String],
});

const CarSchema = new mongoose.Schema({
  name: String,
  price: Number,
  colors: [colorSchema],
  transmission: String,
  mileage: Number,
  features: [String],
});

const Car = mongoose.model("cars", CarSchema);
const Color = mongoose.model("colors", colorSchema);

module.exports = {
  Car,
  Color,
};