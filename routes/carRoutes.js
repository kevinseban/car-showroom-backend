const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');

router.post('/add', carController.addCar);
router.get('/all', carController.getAllCars);
router.get('/:id', carController.getCarById);
router.post('/delete', carController.deleteCar);

module.exports = router;
