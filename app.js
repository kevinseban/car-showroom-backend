const express = require("express");
const User = require("./mongo");
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

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
