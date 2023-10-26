const dotenv = require('dotenv')
const nodemailer = require("nodemailer")
const hbs = require('nodemailer-express-handlebars')
const path = require('path');

// Email config Logic
exports.transporter =nodemailer.createTransport({
    service:'gmail',
    host:process.env.EMAIL_HOST,
    port:process.env.EMAIL_PORT,
    secure:false,
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
});

