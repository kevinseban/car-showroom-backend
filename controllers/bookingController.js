const booking = require('../models/Booking');

const newBooking = async (req, res) => {
  const { name, email, Username, Usercity, Userstate, Userpin, Dealername, Dealercity, Dealerstate, Carname, Carcolor, phone } = req.body;

  try {
    const newbooking = new booking({ name, email, Username, Usercity, Userstate, Userpin, Dealername, Dealercity, Dealerstate, Carname, Carcolor, phone });
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

module.exports = { newBooking, getBookings, deleteBooking };
