require('dotenv').config();
const nodemailer=require('nodemailer');

var transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD
    }
});

module.exports=transporter;