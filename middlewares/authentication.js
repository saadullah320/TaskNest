const jwt = require('jsonwebtoken');
const User = require('../models/users');
require('dotenv').config();

const authenticateToken = async (req, res, next) => {
    const cookie = req.cookies;
    const token = cookie.token;
    if(!token){
        return res.redirect('/users/');
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if(!user){
            return res.redirect('/users/');
        }
        req.user = user;
        next();
    }catch(err){
        console.error(err);
        return res.redirect('/users/');
    }
};

module.exports = authenticateToken;