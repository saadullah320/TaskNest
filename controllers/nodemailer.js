const nodemailer = require("nodemailer");
require('dotenv').config();



const transporter = nodemailer.createTransport({
    service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    
    // async..await is not allowed in global scope, must use a wrapper
    const transport = async function main(email, otp) {
      // send mail with defined transport object
      const info = await transporter.sendMail({
        from: `"TaskNest" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}. It expires in 15 minutes.`
      });
    }


module.exports = transport;