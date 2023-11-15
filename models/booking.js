const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://test:1234@cluster0.eu4qzfb.mongodb.net/carDB")

const bookingSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true
  },
  Username: {
    type: String,
    required: true,
  },
  Userstate: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  Usercity: {
    type: String,
    required: true
  },
  Userpin: {
    type: String,
    required: true
  },
  Dealername: {
    type: String,
    required: true
  },
  Dealercity: {
    type: String,
    required: true
  },
  Dealerstate: {
    type: String,
    required: true
  },
  Carname: {
    type: String,
    required: true
  },
  Carcolor: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const booking = mongoose.model("booking", bookingSchema);

module.exports = booking;