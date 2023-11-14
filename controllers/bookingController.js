const booking = require('../models/booking');

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

module.exports = {newBooking};