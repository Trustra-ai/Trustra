
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Root route redirects to the registration page
app.get('/', (req, res) => {
    res.redirect('/frontend/index.html');
});

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

app.post('/send-verification', (req, res) => {
    const { email } = req.body;

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: process.env.EMAIL_SUBJECT || 'Verify your Trustra account',
        text: `Hi, thank you for registering at Trustra! Please verify your email address.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).send('Failed to send email.');
        }
        console.log('Email sent:', info.response);
        res.status(200).send('Verification email sent!');
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
