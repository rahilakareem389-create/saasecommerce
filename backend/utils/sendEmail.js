const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    // Create a transporter using Gmail with port 587
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // upgrade later with STARTTLS
      auth: {
        user: process.env.EMAIL_USER || 'wordpressrahila@gmail.com',
        pass: process.env.EMAIL_PASS || 'your_app_password_here', // The user must replace this in .env
      },
    });

    // Email options
    const mailOptions = {
      from: `"SaaSCommerce Alerts" <${process.env.EMAIL_USER || 'wordpressrahila@gmail.com'}>`,
      to: options.email,
      subject: options.subject,
      html: options.html,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = sendEmail;
