const express = require('express');
const router = express.Router();
const { googleLogin, getMe } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/google', googleLogin);
router.get('/me', protect, getMe);

module.exports = router;
