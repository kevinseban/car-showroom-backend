const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');

router.post('/add', carController.addCar);
router.get('/all', carController.getAllCars);
router.get('/featured', carController.getFeaturedCars);
router.post('/delete', carController.deleteCar);
router.get('/:id', carController.getCarById);

module.exports = router;
