const express = require('express');
const router = express.Router();
const User = require('../models/users');
const bcrypt = require('bcrypt');
const {generateToken, authtoken } = require('../utils/generateToken');
const hashPassword = require('../utils/passwordencryption');
const { saveOTP, verifyOTP } = require('../utils/OPT');
const generateOTP = require('../utils/generateOTP');
const transporter = require('../controllers/nodemailer');
const authlogin = require('../middlewares/authlogin');

router.get('/', async (req, res) => {
    res.render('Loginpage');
});


router.post('/login', authlogin, async (req, res) => {
  const { userdata, password } = req.body;
    try{
        let user = await User.findOne({ name: userdata });
        if(user === null){
            // If user is not found by username, try to find by email
            user =  await User.findOne({ email: userdata });
        }
        if(user){
            const isMatch = await bcrypt.compare(password, user.password);
            if(isMatch){
                if(req.customData.Login === false){
                    const token = generateToken(user);
                    res.cookie('token', token);
                    const otp = generateOTP;
                    saveOTP(user.email, otp);
                    try {
                        await transporter(user.email, otp);
                    } catch (error) {
                        console.error('Error sending OTP:', error);
                        return res.redirect('/users/');
                    }
                    req.flash('success', 'OTP sent successfully');
                    return res.redirect('/api/send-otp');
                } else {
                    const token = generateToken(user);
                    res.cookie('token', token);
                return res.redirect('/todolist/');
            }

            }else{
                req.flash('loginerrors', 'Invalid credentials');
                return res.redirect('/users/');
            }
        }else{
            req.flash('loginerrors', 'Invalid credentials');
            return res.redirect('/users/');
        }
    }catch(err){
            console.error(err);
            req.flash('loginerrors', 'Invalid credentials');
            return res.status(500).redirect('/users/');
        }
}
);

router.post('/register',async (req, res) => {
    res.clearCookie('authToken', 'token'); // Clear the token cookie
    const {name, username, email, password } = req.body;
    if(!name || !username || !email || !password) {
        req.flash('registererrors', 'Please fill all fields');
        return res.redirect('/users/');
    }
    let user = await User.findOne({email});
        if(user) {
            req.flash('registererrors', 'User with this email already exists');
            return res.redirect('/users/');
        } else {
            user = await User.findOne({ username });
            if (user) {
                req.flash('registererrors', 'Please use a different username');
                return res.redirect('/users/');
            }
            try{
                const hashedPassword = await hashPassword(password);
                const newUser = new User({
                    name,
                    username,
                    email,
                    password: hashedPassword
                });
                req.flash('success', 'User registered successfully');
                const otp = generateOTP;
                saveOTP(email, otp);
                try {
                    await transporter(email, otp);
                } catch (error) {
                    console.error('Error sending OTP:', error);
                    res.status(500).json({ error: 'Failed to send OTP' });
                }
                await newUser.save();
                const registeredUser = await User.findOne({ email });
                const token = generateToken(registeredUser);
                res.cookie('token', token);
                res.redirect('/api/send-otp');
            }catch(err) {
                console.error(err);
                req.flash('registererrors', 'An error occurred during registration');
                res.redirect('/users/');
            }
        }
});



module.exports = router;