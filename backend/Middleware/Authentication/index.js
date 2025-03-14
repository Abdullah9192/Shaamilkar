const jwt = require("jsonwebtoken");
const prisma = require("../../Config/database.js");
const authenticate = async (req, res, next) => {
  // const cookies = req.cookies;
  // if(!cookies) return res.status(401).json({status: 'error', message: 'UnAurthorized - No Cookies Found', statusCode: 401,})
  // const token = req.cookies.accessToken;
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized - Token Not Found in Request",
      statusCode: 401,
    });
  }
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(200).json({
      status: "error",
      message: "Unaurthorized - Token Not Found in Request",
      statusCode: 401,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return regenerateAccessToken(req, res);
    }

    return res.status(200).json({
      status: "error",
      message: "UnAurthorized - Token Verification Failed",
      statusCode: 401,
    });
  }
};

const regenerateAccessToken = (req, res) => {
  const { userId } = req.user;
  if (!userId) {
    return res.status(200).json({
      status: "error",
      message: "User ID missing in token.",
      statusCode: 401,
    });
  }
  prisma.user
    .findUnique({ where: { id: userId } })
    .then((user) => {
      if (!user) {
        return res.status(200).json({
          status: "error",
          message: "User not found.",
          statusCode: 404,
        });
      }

      const newAccessToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: 450000 }
      );

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 450000,
        path: "/",
      });

      return res.json({
        message: "Token refreshed",
        accessToken: newAccessToken,
      });
    })
    .catch(() => {
      console.error("Error during logout:", error);
      return res.status(200).json({
        status: "error",
        message: "Internal server error. Please try again later.",
        statusCode: 500,
      });
    });
};

module.exports = { authenticate, regenerateAccessToken };
