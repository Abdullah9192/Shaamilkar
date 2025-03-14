const crypto = require("crypto");
const nodemailer = require("nodemailer");

const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString(); 
};

const sendEmail = async (email, otp , name) => {
  let transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,  
    port: process.env.MAIL_PORT || 465, 
    secure: true, 
    auth: {
      user: process.env.MAIL_USER, 
      pass: process.env.MAIL_PASSWORD, 
    },
  });

  let mailOptions = {
    from: '"Shaamilkar" <testing@shaamilkar.com>', 
    to: email,
    subject: "Reset Your Password – Shaamilkar Financial Services",
    html: `<p>Dear ${name},</p>
  
           <p>We received a request to reset your password for your Shaamilkar Financial Services account. Use the One-Time Password (OTP) below to proceed with resetting your password:</p>
           <p><strong style="font-size: 18px;">OTP: ${otp}</strong></p>
           <p>This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
           <p>If you did not request a password reset, please ignore this email or contact our support team immediately.</p>
           <p>Best regards,<br>Shaamilkar Financial Services<br><a href="https://www.shaamilkar.com">www.shaamilkar.com</a></p>`,
  };
  

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent successfully to ${email}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};



module.exports = { generateOTP, sendEmail };
