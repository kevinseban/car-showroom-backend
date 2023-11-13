const {Car, Color} = require('../models/Car');

const addCar = async (req, res) => {
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
};

const getAllCars = async (req, res) => {
  try {
    const allCars = await Car.find().populate('colors');
    res.json(allCars);
  } catch (error) {
    console.error('Error fetching all cars: ', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteCar = async (req, res) => {
  try {
    const carid = req.query.carid;
    await Car.deleteOne({ _id: carid });
    res.send("deleted");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};

const getCarById = async (req, res) => {
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
};

module.exports = {
  addCar,
  getAllCars,
  deleteCar,
  getCarById,
};
