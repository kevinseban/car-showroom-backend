// app.js
const express = require("express");
const User = require("./mongo");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", cors(), (req, res) => {
});

app.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (user) {
      res.json("exist");
    } else {
      res.json("notexist");
    }
  } catch (e) {
    res.json("notexist");
  }
});

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  const newUser = new User({
    email: email,
    password: password,
  });

  try {
    const user = await User.findOne({ email: email });

    if (user) {
      res.json("exist");
    } else {
      await newUser.save();
      res.json("notexist");
    }
  } catch (e) {
    res.json("notexists");
  }
});

app.listen(8000, () => {
  console.log("Port connected");
});
