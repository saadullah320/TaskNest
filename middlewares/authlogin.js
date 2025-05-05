const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware to verify JWT
const verifyToken = async (req, res, next) => {
  const token = req.cookies.authToken;
  if (!token) {
    req.customData = { Login: false }; 
    next();
}else{
  jwt.verify(token, process.env.OTP_SECRET, (err, user) => {
    req.customData = { Login: true }; 
    if (err) return res.status(403).send('Invalid Token');
    req.user = user;
    next();
  });
}
};

module.exports = verifyToken;