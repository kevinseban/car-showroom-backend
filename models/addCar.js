const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://test:1234@cluster0.eu4qzfb.mongodb.net/carDB");

const addCarSchema = new mongoose.Schema({
    carName:    String,
    carPrice:   String,
    carColor:   String,
    carMileage: String,
    carTransmission:    String,
    carFeatures:{
        type:   Array
    },
    imageUrls:{
        type:   Array
    }
})

const Car = mongoose.model("cars", addCarSchema);

module.exports = Car;