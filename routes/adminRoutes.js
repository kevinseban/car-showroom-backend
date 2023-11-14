const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const verifyToken = require('../middlewares/authMiddleware');

router.get('/profile', verifyToken, adminController.fetchAdminProfile);
router.post('/generateToken', adminController.generateToken);

module.exports = router;
