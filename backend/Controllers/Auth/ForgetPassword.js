const bcrypt = require("bcrypt");
const prisma = require("../../Config/database.js");
const { generateOTP, sendEmail } = require("../../Utils/GenerateOTPSendEmail.js");

const requestOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(200).json({ status: "error",statusCode: 400, message: "Email not found." });

    const newOtp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({ where: { email }, data: { otp: newOtp, otpExpiry, otpVerified: false } });
    await sendEmail(email, newOtp ,user.name);

    res.status(200).json({ status: "success", statusCode: 200,  message: "OTP sent to your email." });
  } catch (error) {
    res.status(200).json({ status: "error", statusCode: 500,message: "Server error, try again later." });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(200).json({ status: "error",statusCode: 400, message: "Invalid email." });

    if (!user.otp || user.otpExpiry < new Date()) {
      await prisma.user.update({ where: { email }, data: { otp: null, otpExpiry: null } });
      return res.status(200).json({ status: "error", statusCode: 400,message: "OTP expired. Request a new one." });
    }

    if (String(user.otp) !== String(otp)) {
      return res.status(200).json({ status: "error",statusCode: 400, message: "Invalid OTP." });
    }

    await prisma.user.update({ where: { email }, data: { otpVerified: true, otp: null, otpExpiry: null } });

    res.status(200).json({ status: "success",statusCode: 200, message: "OTP verified successfully." });
  } catch (error) {
    res.status(200).json({ status: "error",statusCode: 500, message: "Server error, try again later." });
  }
};

const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(200).json({ status: "error",statusCode: 400, message: "Invalid email." });

    if (!user.otpVerified) return res.status(200).json({ status: "error",statusCode: 400, message: "OTP not verified." });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({ where: { email }, data: { password: hashedPassword, otpVerified: false } });

    res.status(200).json({ status: "success",statusCode: 200, message: "Password reset successful." });
  } catch (error) {
    res.status(200).json({ status: "error",statusCode: 500, message: "Server error, try again later." });
  }
};

module.exports = { requestOtp, verifyOtp, resetPassword };
