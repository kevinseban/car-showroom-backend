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
  username: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  pincode: {
    type: String,
    required: true
  },
  carname: {
    type: String,
    required: true
  },
  carcolor: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const booking = mongoose.model("booking", bookingSchema);

module.exports = booking;