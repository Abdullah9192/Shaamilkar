const bcrypt = require("bcrypt");
const prisma = require("../../Config/database.js");

const updateUser = async (req, res) => {
  const { Id } = req.params;
  const AppIdInt = parseInt(Id, 10);
  const { id }  = AppIdInt;
  const { name, password, image } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(200).json({
        status: "error",
        message: "No user found with the provided ID.",
        statusCode: 404,
      });
    }

    let updatedData = { name, image };

    if (password) {
      if (password.length < 8) {
        return res.status(200).json({
          status: "error",
          message: "Password must be at least 8 characters long.",
          statusCode: 400,
        });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedData.password = hashedPassword;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updatedData,
    });

    return res.status(200).json({
      status: "success",
      message: "User updated successfully.",
      statusCode: 200,
      updatedUser,
    });
  } catch (error) {
    console.error("Error in updating user:", error);
    res.status(200).json({
      status: "error",
      message: "Internal server error. Please try again later.",
      statusCode: 500,
      data: null,
    });
  }
};

module.exports = {
  updateUser,
};
