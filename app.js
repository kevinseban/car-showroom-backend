const express = require("express");
const User = require("./mongo");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const app = express();

// Load environment variables from the .env file
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Generate JWT token
app.post("/user/generateToken", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username: username });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const jwtSecretKey = process.env.JWT_SECRET;
    const token = jwt.sign({ username }, jwtSecretKey, { expiresIn: "1h" });

    res.json({ token, user });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Server error" });
  }
});

// Protect routes using JWT
app.get("/user/profile", (req, res) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const jwtSecretKey = process.env.JWT_SECRET;
  jwt.verify(token, jwtSecretKey, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    res.json({ message: "Protected route", user });
  });
});

app.listen(8000, () => {
  console.log("Port connected");
});
