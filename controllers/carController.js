const { Car, Color } = require('../models/Car');

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
        mainSrc: mainImageUrl,
        isFeatured: isFeatured,
        colors: [],
      });
    } else {
      if(existingCar.mainSrc == ""){
        existingCar.mainSrc = mainImageUrl;
      }
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

const getFeaturedCars = async (req, res) => {
  try {
    const featuredCars = await Car.find({ isFeatured: true });
    res.json(featuredCars);
  } catch (error) {
    console.error('Error fetching featured cars:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const editCar = async (req, res) => {
  const { id } = req.params;
  try {
    // Find the car by ID
    const car = await Car.findById(id);

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    // Update car properties based on the request body
    car.name = req.body.name || car.name;
    car.price = req.body.price || car.price;
    car.transmission = req.body.transmission || car.transmission;
    car.mileage = req.body.mileage || car.mileage;
    car.features = req.body.features || car.features;
    car.isFeatured = req.body.isFeatured || car.isFeatured;

    // Save the updated car
    const updatedCar = await car.save();

    res.json(updatedCar);
  } catch (error) {
    console.error('Error updating car:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

const deleteCarImage = async (req, res) => {
  try {
    const { id, colorIndex, imageIndex } = req.params;

    const car = await Car.findById(id);

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    const color = car.colors[colorIndex];

    if (!color) {
      return res.status(404).json({ message: 'Color not found' });
    }

    const imageUrlToDelete = color.images[imageIndex];

    // Remove the image URL from the car's data
    color.images.splice(imageIndex, 1);
    // Check if the color has no more images and delete the color if true
    if (color.images.length === 0) {
      car.colors.splice(colorIndex, 1);
    }
    await car.save();
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const deleteMainImage = async(req, res) => {
  try{
    const { id } = req.params;

    const car = await Car.findById(id);

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    car.mainSrc = "";
    
    await car.save();
    
    res.json({ message: 'Main image deleted successfully' });
  } catch (error) {
    console.error('Error deleting main image:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

const addEditCar = async(req, res) => {
  const {carName , colorName, imageUrls, mainImageUrl} = req.body;
  try {
    let existingCar = await Car.findOne({ name: carName });
    if(existingCar.mainSrc == ""){
      existingCar.mainSrc = mainImageUrl;
    }
    let existingColor = existingCar.colors.find((color) => color.name === colorName);
    existingColor.images = [...existingColor.images, ...imageUrls];
    await existingCar.save();
    res.json({ message: "Car updated successfully" });
  } catch (error) {
    console.error("Error Adding Car: ", error);
    res.status(500).json({ error: "Server error" });
  }
}

const searchCars = async (req, res) => {
  try {
    const { searchTerm } = req.params
    const searchResults = await Car.find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } }, // Case-insensitive search for car name
      ],
    });
    res.json(searchResults);
  } catch (error) {
    console.error('Error searching for cars:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  addCar,
  getAllCars,
  deleteCar,
  getCarById,
  getFeaturedCars,
  editCar,
  deleteCarImage,
  deleteMainImage,
  addEditCar,
  searchCars,
};
