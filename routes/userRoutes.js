const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middlewares/authMiddleware');

router.get('/profile', verifyToken, userController.fetchUserProfile);
router.put('/profile', verifyToken, userController.updateProfile);
router.post('/register', userController.registerUser);
router.post('/generateToken', userController.generateToken);
router.get('/getAll', userController.getUsers);
router.delete('/delete/:id', userController.deleteUsers);
router.put('/update/:id', userController.updateUser);
router.get('/search/:searchTerm', userController.searchUsers);


module.exports = router;
