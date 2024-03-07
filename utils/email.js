const nodemailer = require('nodemailer');
const sendEmail = async (option) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Define email options
  const emailOptions = {
    from: {
      name: 'Handiwork',
      address: 'support@handiwork.com',
    },
    to: option.email,
    subject: option.subject,
    text: option.message,
  };

  try {
    // Send the email
    const info = await transporter.sendMail(emailOptions);
    console.log('Email sent successfully:', info.response, info.envelope);
  } catch (error) {
    return console.error('Error sending email:', error);
  }
};

module.exports = sendEmail;
