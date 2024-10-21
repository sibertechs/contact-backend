const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to handle CORS and parse JSON bodies
app.use(cors());
app.use(bodyParser.json());

// POST route to handle contact form submission
app.post('/contact', (req, res) => {
  const { name, email, phone, message } = req.body;

  // Basic validation (ensure all fields are filled)
  if (!name || !email || !phone || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  // Set up nodemailer transport (Gmail example, but you can use other services)
  let transporter = nodemailer.createTransport({
    service: 'gmail', // Use your preferred email service
    auth: {
      user: 'sibertechnologies1@gmail.com', // Replace with your email address
      pass: 'zgpk qntq cbwd bfqp',    // Replace with your email password or app-specific password
    },
  });

  // Email options
  let mailOptions = {
    from: email, // Senders' email (the user's email from the form)
    to: 'sibertechs@gmail.com', // Recipient's email (where you want to receive the form data)
    subject: 'New Contact Form Submission', // Email subject
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`, // Email body
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error); // Log the error for debugging
      return res.status(500).json({ error: "Failed to send message. Please try again later." });
    } else {
      console.log('Email sent: ' + info.response);
      return res.status(200).json({ success: "Message sent successfully!" });
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});