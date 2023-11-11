const express = require("express");
const User = require("./mongo");
const Message = require("./models/message");
const { Car, Color } = require("./models/addCar");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const app = express();
const { storage } = require('./firebase');
const path = require('path');


dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


//Server Endpoint Code to Register a new User.
app.post("/user/register", async (req, res) => {
  const { username, password, name, email, phoneNumber } = req.body;

  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ error: "Username already in use" });
    }

    // If the username is not in use, create a new user
    const newUser = new User({ username, password, name, email, phoneNumber });
    await newUser.save();

    res.json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Server error" });
  }
});

//Server Endpoint Code to generate session token..
app.post("/user/generateToken", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const jwtSecretKey = process.env.JWT_SECRET;
    const token = jwt.sign({ username }, jwtSecretKey, { expiresIn: "1h" });

    res.json({ token, user });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

//Server Endpoint Code Take a message Us request from frontend Contact Us and save it in MongoDb.messages.
app.post("/message",async(req,res)=>{
  const { messName, messEmail, messPhone, messMessage } = req.body;
  try{
    const newMess = new Message({messName, messEmail, messPhone, messMessage})
    await newMess.save();
    res.json({ message: "Message sent successfully" });
  }catch (error) {
    console.error("Error sending message: ", error);
    res.status(500).json({ error: "Server error" });
  }
})

//Server Endpoint Code to Return all complaints from mongoDB.messages to frontend admin panel.
app.get("/getMessage",(req,res) => {
  Message.find()
  .then(message => res.json(message))
  .catch(err => res.json(err))
})

//Server Endpoint Code to delete a message from mongoDB.messages.
app.post("/deleteMessage" , async(req,res) => {
  try{
    const messid = req.query.messid;
    await Message.deleteOne(
      {_id:messid}
    );
    res.send("deleted");
  }catch(error) {
    console.log(error);
  }
})

//Server endpoint Code for Adding a Car from the admin panel.
app.post("/addCar",async(req,res)=>{
  const { carName, carPrice, carColor, carMileage, carTransmission, carFeatures, imageUrls } = req.body;
  try {
    // Check if a car with the given name exists
    let existingCar = await Car.findOne({ name: carName });

    if (!existingCar) {
      // If the car doesn't exist -> create a new car
      existingCar = new Car({
        name: carName,
        price: carPrice,
        transmission: carTransmission,
        mileage: carMileage,
        features: carFeatures,
        colors: [],
      });
    }

    // Check if the color exists for the existing car
    let existingColor = existingCar.colors.find((color) => color.name === carColor);

    if (!existingColor) {
      // If the color doesn't exist -> create a new color
      existingColor = new Color({
        name: carColor,
        images: imageUrls,
      });

      // Add the new color to the existing car
      existingCar.colors.push(existingColor);
    }

    // Add the new image URLs to the existing color
    existingColor.images = [...existingColor.images, ...imageUrls];

    // Save 
    await existingCar.save();

    res.json({ message: "Car updated successfully" });
  }catch (error) {
    console.error("Error Adding Car: ", error);
    res.status(500).json({ error: "Server error" });
  }
})

//Code to return all Cars in the databse to show in the adminpanel.
app.get('/cars/allCars', async (req, res) => {
  try {
    const allCars = await Car.find().populate('colors');
    res.json(allCars);
  } catch (error) {
    console.error('Error fetching all cars: ', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
