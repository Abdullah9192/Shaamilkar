const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const { generateAccessToken } = require("../../Utils/GerateToken.js");

const prisma = new PrismaClient();

const login = async (req, res) => {
  console.log(req.body);
  const { email, password, phoneNumber, cnic } = req.body;

  try {
    let user;
    if (email) {
      user = await prisma.user.findUnique({
        where: { email },
      });
    } else if (phoneNumber) {
      user = await prisma.user.findUnique({
        where: { phoneNumber },
      });
    } else if (cnic) {
      user = await prisma.user.findUnique({
        where: { cnic },
      });
    }

    if (!user) {
      return res.status(200).json({
        status: "error",
        message: "User not found.",
        statusCode: 404,
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        status: "error",
        message: "Your email is not verified. Please check your email and verify your account using the OTP sent to you.",
        statusCode: 403,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(200).json({
        status: "error",
        message: "Invalid credentials.",
        statusCode: 401,
      });
    }

    const accessToken = generateAccessToken(user);

    res.cookie("accessToken", accessToken, {
      httpOnly: false,
      secure: "development",
      sameSite: "none",
      maxAge: 3600000,
      path: "/",
    });

    return res.status(200).json({
      status: "success",
      message: "Login successfully.",
      statusCode: 200,
      accessToken,
      user,
    });
  } catch (error) {
    return res.status(200).json({
      status: "error",
      message: "Internal server error.",
      statusCode: 500,
    });
  }
};

module.exports = {
  login,
};
