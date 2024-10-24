require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();

// CORS configuration - be more permissive for troubleshooting
app.use(cors({
    origin: '*', // Allow all origins temporarily
    methods: ['POST', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Options pre-flight request
app.options('/api/contact', cors());

// Main contact endpoint
app.post('/api/contact', async (req, res) => {
    try {
        // Log incoming request
        console.log('Received request:', req.body);

        const { name, email, phone, message } = req.body;

        // Validate input
        if (!name || !email || !phone || !message) {
            console.log('Validation failed:', { name, email, phone, message });
            return res.status(400).json({
                success: false,
                error: 'All fields are required'
            });
        }

        // Configure transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false // Only use this in development
            }
        });

        // Email options
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

        // Send email
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

// Basic health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Global error:', err);
    res.status(500).json({
        success: false,
        error: 'An unexpected error occurred'
    });
});

// Export for Vercel
module.exports = app;

// Local development server
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log('Email User:', process.env.EMAIL_USER); // Log email config
    });
}