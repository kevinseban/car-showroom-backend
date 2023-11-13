const express = require("express");
const User = require("./models/User");
const Message = require("./models/Message");
const { Car, Color } = require("./models/Car");
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

// Server endpoint Code for Adding a Car from the admin panel.
app.post("/addCar", async (req, res) => {
  const { carName, carPrice, carColor, carMileage, carTransmission, carFeatures, imageUrls, mainImageUrl, isFeatured } = req.body;
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
        isFeatured : isFeatured,
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
// app.get('/cars/allCars', async (req, res) => {
//   try {
//     const allCars = await Car.find().populate('colors');
//     res.json(allCars);
//   } catch (error) {
//     console.error('Error fetching all cars: ', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

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

app.get('/featured', async (req, res) => {
  try {
    const featuredCars = await Car.find({ isFeatured: true });
    res.json(featuredCars);
  } catch (error) {
    console.error('Error fetching featured cars:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Code to get a specific car given id
// app.get('/getCars/:id', async (req, res) => {
//   try {
//     const carId = req.params.id;

//     const car = await Car.findById(carId);

//     if (!car) {
//       return res.status(404).json({ error: 'Car not found' });
//     }

//     res.status(200).json(car);
//   } catch (error) {
//     console.error('Error fetching car details:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// Start the server
app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
