const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middlewares/authMiddleware');

router.get('/profile', verifyToken, userController.fetchUserProfile);
router.put('/profile', verifyToken, userController.updateProfile);
router.post('/register', userController.registerUser);
router.post('/generateToken', userController.generateToken);

module.exports = router;
