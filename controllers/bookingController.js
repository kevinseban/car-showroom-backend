const booking = require('../models/Booking');

const newBooking = async (req, res) => {
  const { name, email, username, address, pincode, carname, carcolor, phone } = req.body;

  try {
    const newbooking = new booking({ name, email, username, address, pincode, carname, carcolor, phone });
    await newbooking.save();

    res.json({ message: "Booked successfully" });
  } catch (error) {
    console.error("Error booking:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const getBookings = async (req, res) => {
  try {
    const bookings = await booking.find();
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const deleteBooking = async (req, res) => {
  const bookingId = req.params.id;

  try {
    const deletedBooking = await booking.findByIdAndDelete(bookingId);

    if (!deletedBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const searchBookingsByTerm = async (req, res) => {
  try {
    const { searchTerm } = req.params;
    const regex = new RegExp(searchTerm, 'i');

    const searchResults = await booking.find({
      $or: [
        { name: regex },
        { email: regex },
        { username: regex },
        { address: regex },
        { pincode: regex },
        { carname: regex },
        { carcolor: regex },
        { phone: regex },
      ],
    });

    res.json(searchResults);
  } catch (error) {
    console.error('Error searching for bookings by term:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const searchBookingsByDate = async (req, res) => {
  try {
    const { bookingDate } = req.params;
    const istStartDate = new Date(`${bookingDate}T00:00:00.000+05:30`);
    const istEndDate = new Date(`${bookingDate}T23:59:59.999+05:30`);

    const searchResults = await booking.find({
      createdAt: { $gte: istStartDate, $lt: istEndDate },
    });

    res.json(searchResults);
  } catch (error) {
    console.error('Error searching for bookings by date:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getBookingByUsername = async (req, res) => {
  try {
    const { username } = req.params;

    const bookingResult = await booking.find({ username: username });

    if (!bookingResult || bookingResult.length === 0) {
      return res.status(404).json({ error: 'Booking not found for the given username' });
    }

    res.json(bookingResult);
  } catch (error) {
    console.error('Error fetching booking by username:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { 
  newBooking, 
  getBookings, 
  deleteBooking, 
  searchBookingsByTerm, 
  searchBookingsByDate,
  getBookingByUsername 
};
