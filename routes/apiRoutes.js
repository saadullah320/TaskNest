const express = require('express');
const router = express.Router();
const User = require('../models/users');
const bodyParser = require('body-parser');
const { saveOTP, verifyOTP } = require('../utils/OPT');
const generateOTP = require('../utils/generateOTP');
const transporter = require('../controllers/nodemailer');
const authenticateToken = require('../middlewares/authentication');
const {authtoken} = require('../utils/generateToken');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));


router.get('/check-username', async (req, res) => {
    try {
        const username = req.query.username;
        if (!username || username.trim().length < 3) {
            return res.status(400).json({ available: false });
        }
        const user = await User.findOne({ username: username.trim()});
        res.json({ available: !user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ available: false });
    }
});

router.get('/resend-otp', authenticateToken,async (req, res) => {
    try{
        const user = req.user;
        const email = user.email;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const otp = generateOTP;
        saveOTP(email, otp);

        try {
            await transporter(email, otp);
        } catch (error) {
            console.error('Error sending OTP:', error);
        }
    }catch(err){
        console.error(err);
    }
});

router.get('/send-otp',authenticateToken, async (req, res) => {
    const user = req.user;
    const email = user.email;
    res.render('verify-otp', { email });
});
router.post('/verify-otp' , authenticateToken , (req, res) => {
    const user = req.user;
    const email = user.email;
    const { otp } = req.body;
    if (verifyOTP(email, otp)) {
    const token = authtoken(user);
    res.cookie('authToken', token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 }); // 30 days
    res.json({ message: 'OTP verified successfully' , redirect: '/todolist/' });
    } else {
      res.status(400).json({ error: 'Invalid or expired OTP' });
    }
});

module.exports = router;