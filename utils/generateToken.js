const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (user) => {
  // Generate a JWT token with user ID and email
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET);
};

const authtoken = (user) => {
  return jwt.sign({ userId: user._id }, process.env.OTP_SECRET, { expiresIn: '30d' });
};

// Export the function for use in other files
module.exports = {generateToken, authtoken};
