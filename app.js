const express = require("express");
const User = require("./models/user");
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

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

// Server Endpoint Code to fetch user profile.
app.get('/user/profile', verifyToken, async (req, res) => {
  try {
    // Fetch user details from the decoded token
    const { username } = req.user;

    // Use the username to retrieve the user profile from the database
    const userProfile = await User.findOne({ username });

    if (!userProfile) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    // Send the user profile in the response
    res.json(userProfile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Endpoint to update user profile
app.put('/user/profile', verifyToken, async (req, res) => {
  const { name, password, email, phoneNumber } = req.body;
  const userId = req.user.username; // Assuming the username is the unique identifier

  try {
    // Find the user by their username (you may need to adjust based on your user model)
    const user = await User.findOneAndUpdate(
      { username: userId },
      { $set: { name, password, email, phoneNumber } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Server Endpoint Code to Register a new User.
app.post("/user/register", async (req, res) => {
  const { username, password, name, email, phoneNumber } = req.body;

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ error: "Username already in use" });
    }

    const newUser = new User({ username, password, name, email, phoneNumber });
    await newUser.save();

    res.json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Server Endpoint Code to generate session token.
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

// Server Endpoint Code to take a message from frontend Contact Us and save it in MongoDB.messages.
app.post("/message", async (req, res) => {
  const { messName, messEmail, messPhone, messMessage } = req.body;
  try {
    const newMess = new Message({ messName, messEmail, messPhone, messMessage });
    await newMess.save();
    res.json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending message: ", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Server Endpoint Code to Return all complaints from MongoDB.messages to frontend admin panel.
app.get("/getMessage", (req, res) => {
  Message.find()
    .then(message => res.json(message))
    .catch(err => res.status(500).json({ error: "Server error" }));
});

// Server Endpoint Code to delete a message from MongoDB.messages.
app.post("/deleteMessage", async (req, res) => {
  try {
    const messid = req.query.messid;
    await Message.deleteOne({ _id: messid });
    res.send("deleted");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Server endpoint Code for Adding a Car from the admin panel.
app.post("/addCar", async (req, res) => {
  const { carName, carPrice, carColor, carMileage, carTransmission, carFeatures, imageUrls, mainImageUrl } = req.body;
  console.log(mainImageUrl)
  try {
    let existingCar = await Car.findOne({ name: carName });

    if (!existingCar) {
      existingCar = new Car({
        name: carName,
        price: carPrice,
        transmission: carTransmission,
        mileage: carMileage,
        features: carFeatures,
        mainSrc : mainImageUrl,
        colors: [],
      });
    }

    let existingColor = existingCar.colors.find((color) => color.name === carColor);

    if (!existingColor) {
      existingColor = new Color({
        name: carColor,
        images: imageUrls,
      });

      existingCar.colors.push(existingColor);
    }

    existingColor.images = [...existingColor.images, ...imageUrls];

    await existingCar.save();

    res.json({ message: "Car updated successfully" });
  } catch (error) {
    console.error("Error Adding Car: ", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Code to return all Cars in the database to show in the admin panel.
app.get('/cars/allCars', async (req, res) => {
  try {
    const allCars = await Car.find().populate('colors');
    res.json(allCars);
  } catch (error) {
    console.error('Error fetching all cars: ', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Code to delete Cars.
app.post("/deleteCar", async (req, res) => {
  try {
    const carid = req.query.carid;
    await Car.deleteOne({ _id: carid });
    res.send("deleted");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Code to get a specific car given id
app.get('/getCars/:id', async (req, res) => {
  try {
    const carId = req.params.id;

    const car = await Car.findById(carId);

    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }

    res.status(200).json(car);
  } catch (error) {
    console.error('Error fetching car details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
