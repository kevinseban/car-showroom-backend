const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
const messageRouter = require('./routes/messageRoutes');
const userRouter = require('./routes/userRoutes');
const carRouter = require('./routes/carRoutes');

dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/user",userRouter);
app.use("/",messageRouter);
app.use("/cars",carRouter);

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
