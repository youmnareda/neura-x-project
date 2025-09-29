const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    try {
        console.log('Preparing to send email to:', options.email);

        // Create transporter
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
            debug: true,
            logger: true
        });

        // Verify transporter configuration
        await transporter.verify();
        console.log('Transporter verified successfully');

        // Email options
        const mailOptions = {
            from: `"BrainScan" <${process.env.EMAIL_USERNAME}>`,
            to: options.email,
            subject: options.subject,
            text: options.message,
            html: options.message.replace(/\n/g, '<br>') // Convert newlines to HTML breaks
        };

        console.log('Sending email with options:', {
            to: mailOptions.to,
            subject: mailOptions.subject
        });

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', {
            messageId: info.messageId,
            response: info.response
        });
        
        return info;
    } catch (error) {
        console.error('Error sending email:', {
            name: error.name,
            message: error.message,
            code: error.code,
            command: error.command
        });
        throw new Error(`Email could not be sent: ${error.message}`);
    }
};

module.exports = sendEmail;
