const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    // Create a transporter using Gmail
    const transporter = nodemailer.createTransport({
      host: '142.251.127.108', // Hardcoded IPv4 to completely bypass Railway IPv6 ENETUNREACH bug
      port: 465,
      secure: true, 
      tls: { servername: 'smtp.gmail.com' }, // Required for SSL certificate validation
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
      auth: {
        user: process.env.EMAIL_USER || 'wordpressrahila@gmail.com',
        pass: process.env.EMAIL_PASS || 'your_app_password_here',
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
