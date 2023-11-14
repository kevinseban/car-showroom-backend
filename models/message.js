const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://test:1234@cluster0.eu4qzfb.mongodb.net/carDB");

const MessageSchema = new mongoose.Schema({
    messName: String,
    messEmail: String,
    messPhone: String,
    messMessage: String,
},
{
    timestamps: true
})

const Message = mongoose.model("messages", MessageSchema);

module.exports = Message;