const Admin = require('../models/Admin');
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

const fetchAdminProfile = async (req, res) => {
    try {
      const { username } = req.user; 
      const adminProfile = await Admin.findOne({ username });
  
      if (!adminProfile) {
        return res.status(404).json({ error: 'Admin profile not found' });
      }
  
      res.json(adminProfile);
    } catch (error) {
      console.error('Error fetching admin profile:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };

  const generateToken = async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const admin = await Admin.findOne({ username });
  
      if (!admin || admin.password !== password) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      const jwtSecretKey = process.env.JWT_SECRET;
      const token = jwt.sign({ username }, jwtSecretKey, { expiresIn: '1h' });
      res.json({ token, user: admin }); 
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  module.exports = {
    fetchAdminProfile,
    generateToken,
  };