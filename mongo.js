const mongoose = require("mongoose")
mongoose.connect("mongodb+srv://test:1234@cluster0.eu4qzfb.mongodb.net/carDB")
.then(()=>{
    console.log("MongoDB connected");
})
.catch(()=>{
    console.log("Failed");
})

const newSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const collection = mongoose.model("login-data",newSchema)

module.exports=collection