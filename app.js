const express = require("express");
const User = require("./mongo");
const Message = require("./models/message");
const Car = require("./models/addCar");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const app = express();

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

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

app.post("/addCar",async(req,res)=>{
  const { carName, carPrice, carColor, carMileage, carTransmission, carFeatures, imageUrls } = req.body;
  try{
    const newCar = new Car({carName, carPrice, carColor, carMileage, carTransmission, carFeatures, imageUrls})
    await newCar.save();
    res.json({ message: "Car added successfully" });
  }catch (error) {
    console.error("Error Adding Car: ", error);
    res.status(500).json({ error: "Server error" });
  }
})

app.get("/getMessage",(req,res) => {
  Message.find()
  .then(message => res.json(message))
  .catch(err => res.json(err))
})

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

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
