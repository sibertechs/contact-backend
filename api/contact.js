const nodemailer = require('nodemailer');

// Export the handler function for Vercel
module.exports = async (req, res) => {
  // Check if the request method is POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const { name, email, phone, message } = req.body;

  // Basic validation (ensure all fields are filled)
  if (!name || !email || !phone || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  // Set up Nodemailer transport
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Use environment variable for your email
      pass: process.env.EMAIL_PASS, // Use environment variable for your app-specific password
    },
  });

  // Email options
  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'sibertechs@gmail.com', // Recipient's email
    subject: 'New Contact Form Submission', 
    text: `You have a new message from your website contact form.\n\n` +
          `Details:\n` +
          `Name: ${name}\n` +
          `Email: ${email}\n` + 
          `Phone: ${phone}\n` +
          `Message: ${message}`,
    replyTo: email,
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully.');
    return res.status(200).json({ success: "Message sent successfully!" });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: "Failed to send message. Please try again later." });
  }
};