const User = require('../models/User');
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

const fetchUserProfile = async (req, res) => {
  try {
    const { username } = req.user;
    const userProfile = await User.findOne({ username });

    if (!userProfile) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    res.json(userProfile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateProfile = async (req, res) => {
  const { name, password, email, phoneNumber } = req.body;
  const userId = req.user.username;

  try {
    const user = await User.findOneAndUpdate(
      { username: userId },
      { $set: { name, password, email, phoneNumber } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const registerUser = async (req, res) => {
  const { username, password, name, email, phoneNumber } = req.body;

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ error: 'Username already in use' });
    }

    const newUser = new User({ username, password, name, email, phoneNumber });
    await newUser.save();

    res.json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const generateToken = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const jwtSecretKey = process.env.JWT_SECRET;
    const token = jwt.sign({ username }, jwtSecretKey, { expiresIn: '1h' });

    res.json({ token, user });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteUsers = async (req, res) => {
  const userId = req.params.id;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { name, username, email, phoneNumber } = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { name, username, email, phoneNumber } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


module.exports = {
  fetchUserProfile,
  updateProfile,
  registerUser,
  generateToken,
  getUsers,
  deleteUsers,
  updateUser,
};
