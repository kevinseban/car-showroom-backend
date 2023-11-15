const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.post('/newBooking', bookingController.newBooking);
router.get('/getBookings', bookingController.getBookings);
router.delete('/deleteBooking/:id', bookingController.deleteBooking);

module.exports = router;
