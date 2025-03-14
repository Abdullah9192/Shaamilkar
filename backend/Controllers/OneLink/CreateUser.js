const bcrypt = require("bcrypt");
const prisma = require("../../Config/database.js");

const createUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    if (
      !username ||
      typeof username !== "string" ||
      username.length < 6 ||
      username.length > 60
    ) {
      return res.status(200).json({
        status: "error",
        message: "Invalid name. Name must be between 6 and 60 characters long.",
        statusCode: 400,
      });
    }

    if (!password || password.length < 8 || password.length > 60) {
      return res.status(200).json({
        status: "error",
        message: "Password must be at least 8 characters long and at most 60 characters long.",
        statusCode: 400,
      });
    }

    const existingUser = await prisma.OnelinkAuth.findUnique({
      where: { username },
    });

    if (existingUser) {
      return res.status(200).json({
        status: "error",
        message: "OneLink User is already registered.",
        statusCode: 400,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.OnelinkAuth.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    return res.status(201).json({
      status: "success",
      message: "OneLink User created successfully.",
      statusCode: 201,
      user,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(200).json({
      status: "error",
      message: "Internal server error. Please try again later.",
      statusCode: 500,
      data: null,
    });
  }
};

module.exports = {
  createUser,
};
