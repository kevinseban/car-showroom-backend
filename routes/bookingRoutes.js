const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.post('/newBooking',bookingController.newBooking);

module.exports = router;