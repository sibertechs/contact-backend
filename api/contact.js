require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();

// CORS configuration
app.use(cors({
    origin: '*',
    methods: ['POST', 'OPTIONS', 'GET'], // Added GET for health check
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Pre-flight requests
app.options('*', cors()); // Handle OPTIONS for all routes

// Health check endpoint (moved up)
app.get('/api/health', (req, res) => {
    return res.status(200).json({ status: 'OK' });
});

// Main contact endpoint
app.post('/api/contact', async (req, res) => {
    try {
        console.log('Received request:', req.body);
        
        const { name, email, phone, message } = req.body;

        if (!name || !email || !phone || !message) {
            console.log('Validation failed:', { name, email, phone, message });
            return res.status(400).json({
                success: false,
                error: 'All fields are required'
            });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'sibertechs@gmail.com',
            subject: 'New Contact Form Submission',
            text: `
                Name: ${name}
                Email: ${email}
                Phone: ${phone}
                Message: ${message}
            `,
            replyTo: email
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');

        return res.status(200).json({
            success: true,
            message: 'Message sent successfully!'
        });

    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({
            success: false,
            error: 'Server error. Please try again later.'
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Global error:', err);
    return res.status(500).json({
        success: false,
        error: 'An unexpected error occurred'
    });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log('Email User:', process.env.EMAIL_USER);
    });
}

// Export the Express app
module.exports = app;