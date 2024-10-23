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

  // Set up Nodemailer transport
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'sibertechnologies1@gmail.com', // Your Gmail address
      pass: 'nuyd xjgx flqf rqgj', // App-specific password for Gmail
    },
  });

  // Email options
  let mailOptions = {
    from: 'sibertechnologies1@gmail.com', // Sender's email (your Gmail address)
    to: 'sibertechs@gmail.com', // Recipient's email (your email)
    subject: 'New Contact Form Submission', // Subject of the email
    text: `You have a new message from your website contact form.\n\n` +
          `Details:\n` +
          `Name: ${name}\n` +
          `Email: ${email}\n` + // Include user's email in the message body
          `Phone: ${phone}\n` +
          `Message: ${message}`, // Include user's message in the body
    replyTo: email, // Reply-To set to the user's email
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
