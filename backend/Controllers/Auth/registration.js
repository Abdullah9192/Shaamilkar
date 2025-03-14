const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const prisma = require("../../Config/database.js");
const { generateOTP } = require("../../Utils/GenerateOTPSendEmail.js");

let pendingUsers = {};

const createUser = async (req, res) => {
  const { name, email, password, phoneNumber, cnic, role, image, otp } = req.body;

  try {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(200).json({
        status: "error",
        statusCode: 400,
        message: "Invalid email address.",
      });
    }

    if (otp) {
      const tempUser = pendingUsers[email];

      if (!tempUser) {
        return res.status(200).json({ status: "error", statusCode: 400, message: "Provide valid email." });
      }

      if (Date.now() > tempUser.otpExpiry) {
        delete pendingUsers[email];
        return res.status(200).json({ status: "error", statusCode: 400, message: "Expired OTP. Please request a new one." });
      }

      if (String(tempUser.otp) !== String(otp)) {
        console.log(`Stored OTP: ${tempUser.otp}, Received OTP: ${otp}`);
        return res.status(200).json({ status: "error", statusCode: 400, message: "Invalid OTP." });
      }

      const generateUniqueUserId = async () => {
        let id;
        let exists;
        do {
          id = Math.floor(100000000 + Math.random() * 900000000);
          exists = await prisma.user.findUnique({ where: { id } });
        } while (exists);
        return id;
      };

      const user = await prisma.user.create({
        data: {
          id: await generateUniqueUserId(),
          name: tempUser.name,
          email: tempUser.email,
          password: tempUser.password,
          phoneNumber: tempUser.phoneNumber,
          cnic: tempUser.cnic,
          role: tempUser.role,
          image: tempUser.image,
          isVerified: true,
        },
      });

      delete pendingUsers[email];

      return res.status(201).json({
        status: "success",
        statusCode: 201,
        message: "Email verified successfully. You can now log in.",
        user,
      });
    }

    if (!name || typeof name !== "string" || name.length < 3 || name.length > 50) {
      return res.status(200).json({
        status: "error",
        statusCode: 400,
        message: "Invalid name. Name must be between 3 and 50 characters long.",
      });
    }

    if (!password || password.length < 8) {
      return res.status(200).json({
        status: "error",
        statusCode: 400,
        message: "Password must be at least 8 characters long.",
      });
    }

    if (!/^\+\d{1,3}\d{8,12}$/.test(phoneNumber)) {
      return res.status(200).json({
        status: "error",
        statusCode: 400,
        message: "Phone number must include a +, country code (1-3 digits), and a valid local number (8-12 digits).",
      });
    }

    if (!/^\d{13}$/.test(cnic)) {
      return res.status(200).json({
        status: "error",
        statusCode: 400,
        message: "CNIC must be exactly 13 numeric digits.",
      });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    const existingPhoneNo = await prisma.user.findUnique({ where: { phoneNumber } });
    const existingCnic = await prisma.user.findUnique({ where: { cnic } });

    if (existingUser) {
      return res.status(200).json({
        status: "error",
        statusCode: 400,
        message: "Email is already registered.",
      });
    }

    if (existingPhoneNo) {
      return res.status(200).json({
        status: "error",
        statusCode: 400,
        message: "Phone number is already registered.",
      });
    }

    if (existingCnic) {
      return res.status(200).json({
        status: "error",
        statusCode: 400,
        message: "CNIC is already registered.",
      });
    }

    if (pendingUsers[email] && Date.now() > pendingUsers[email].otpExpiry) {
      console.log(`Removing expired OTP for ${email}`);
      delete pendingUsers[email];
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newOtp = generateOTP();
    const otpExpiry = Date.now() + 10 * 60 * 1000;

    pendingUsers[email] = {
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      cnic,
      role: role || "user",
      image,
      otp: newOtp,
      otpExpiry,
    };


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
      subject: "Your OTP Code",
      html: `<p>Dear ${name},</p>
             <p>For security purposes, please use the following One-Time Password (OTP) to complete your login request:</p>
             <p><strong style="font-size: 22px;">OTP: ${newOtp}</strong></p>
             <p>This OTP is valid for 10 minutes. Please do not share it with anyone. If you did not request this OTP, please contact our support team immediately.</p>
             <p>Best regards,<br>Shaamilkar Financial Services<br><a href="https://www.shaamilkar.com">www.shaamilkar.com</a></p>`,
    };
    

    await transporter.sendMail(mailOptions);
    console.log(`OTP sent successfully to ${email}`);

    return res.status(200).json({
      status: "success",
      statusCode: 200,
      message: "OTP sent. Please verify your email.",
    });

  } catch (error) {
    console.error("Error creating user:", error);
    res.status(200).json({
      status: "error",
      message: "Internal server error. Please try again later.",
      statusCode: 500,
    });
  }
};

module.exports = { createUser };
