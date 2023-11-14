const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://test:1234@cluster0.eu4qzfb.mongodb.net/carDB")

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const Admin = mongoose.model("admins", adminSchema);

module.exports = Admin;