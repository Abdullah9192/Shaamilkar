const { PrismaClient } = require("@prisma/client");
const nodemailer = require("nodemailer"); 
const multer = require("multer");
const prisma = new PrismaClient();
const fs = require("fs");
const path = require("path");
const BASE_URL = "https://api-shamilkar.enaam.pk";

const ensureDirectoryExistence = (filePath) => {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
};

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (
    file.fieldname === "creditscore" &&
    !file.originalname.match(/\.(xls|xlsx)$/)
  ) {
    return cb(
      new Error("Only Excel files are allowed for creditscore!"),
      false
    );
  }
  if (
    file.fieldname === "signaturepdf" &&
    !file.originalname.match(/\.(pdf)$/)
  ) {
    return cb(new Error("Only PDF files are allowed for signaturepdf!"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
}).fields([
  { name: "creditscore", maxCount: 1 },
  { name: "loanofficerattachments", maxCount: 3 },
  { name: "creditofficerattachments", maxCount: 3 },
  { name: "signaturepdf", maxCount: 1 }, 
]);

const sendApprovalEmail = async (email) => {
  try {
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
      subject: "Congratulations! Your Application Has Been Approved",
      text: `Dear Customer,

We are pleased to inform you that your application has been Approved

Kindly access your portal for next steps!

Thank you for choosing Shaamilkar Financial Services!

Best regards,
Shaamilkar Financial Services
www.shaamilkar.com`
    };

    await transporter.sendMail(mailOptions);
    console.log("📧 Approval email sent to:", email);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};


const updateApplication = async (req, res) => {
  try {
    console.log("body", req.body);
    console.log("files", req.files);

    const { Id } = req.params;
    const id = parseInt(Id, 10);

    if (!id) {
      return res.status(400).json({
        status: "error",
        message: "applicationId is mandatory.",
        statusCode: 400,
      });
    }

    let { status, loanofficerattachments, creditofficerattachments } = req.body;
    let updateData = {};

    if (req.files && req.files["creditscore"]?.length > 0) {
      const creditscoreFile = req.files["creditscore"][0];
      const filePath = `Uploads/excel/${Date.now()}-${
        creditscoreFile.originalname
      }`;
      ensureDirectoryExistence(filePath);
      fs.writeFileSync(filePath, creditscoreFile.buffer);
      updateData.creditscore = `${BASE_URL}/${filePath}`;
    }

    if (req.files && req.files["signaturepdf"]?.length > 0) {
      const pdfFile = req.files["signaturepdf"][0];
      const cleanFilename = pdfFile.originalname
        .replace(/\s+/g, "_")
        .replace(/[^\w.-]/g, "");
      const filename = `${id || "unknown"}-${cleanFilename}`;
      const filePath = `Uploads/pdf/${filename}`;
      ensureDirectoryExistence(filePath);
      fs.writeFileSync(filePath, pdfFile.buffer); 
      const uploadedPDFUrl = `${BASE_URL}/${filePath}`;

      const existingApplication = await prisma.application.findUnique({
        where: { id },
      });
      let existingPDFs = existingApplication?.signaturepdf || [];

      if (!Array.isArray(existingPDFs)) existingPDFs = [];

      updateData.signaturepdf = [...existingPDFs, uploadedPDFUrl];
      console.log(updateData.signaturepdf, "updateData.signaturepdf");
    }

    if (loanofficerattachments) {
      const existingApplication = await prisma.application.findUnique({
        where: { id },
      });
      let existingLoanFiles = existingApplication?.loanofficerattachments || [];

      const notes = loanofficerattachments.filter(
        (item) => typeof item === "string"
      );
      const files =
        req.files && req.files["loanofficerattachments"]
          ? req.files["loanofficerattachments"]
          : [];

      const uploadedLoanFiles = files.map((file) => {
        const timestamp = Date.now();
        const filename = `${timestamp}-${file.originalname}`;
        const filePath = `Uploads/excel/${filename}`;
        ensureDirectoryExistence(filePath);
        fs.writeFileSync(filePath, file.buffer);
        return `${BASE_URL}/${filePath}`;
      });

      updateData.loanofficerattachments = [
        ...existingLoanFiles,
        ...notes,
        ...uploadedLoanFiles,
      ];
    }

    if (creditofficerattachments) {
      const existingApplication = await prisma.application.findUnique({
        where: { id },
      });
      let existingCreditFiles =
        existingApplication?.creditofficerattachments || [];

      const notes = creditofficerattachments.filter(
        (item) => typeof item === "string"
      );
      const files =
        req.files && req.files["creditofficerattachments"]
          ? req.files["creditofficerattachments"]
          : [];

      const uploadedCreditFiles = files.map((file) => {
        const timestamp = Date.now();
        const filename = `${timestamp}-${file.originalname}`;
        const filePath = `Uploads/excel/${filename}`;
        ensureDirectoryExistence(filePath);
        fs.writeFileSync(filePath, file.buffer);
        return `${BASE_URL}/${filePath}`;
      });

      updateData.creditofficerattachments = [
        ...existingCreditFiles,
        ...notes,
        ...uploadedCreditFiles,
      ];
    }

    if (status) updateData.status = status || "Pending";
    if (req.body.forwardedtocm !== undefined) {
      updateData.forwardedtocm = req.body.forwardedtocm;
    }

    updateData.updatedAt = new Date();

    const updatedApplication = await prisma.application.update({
      where: { id },
      data: updateData,
    });

    if (status === "Approved") {
      const application = await prisma.application.findUnique({
        where: { id },
        select: { userId: true },
      });

      if (application?.userId) {
        const user = await prisma.user.findUnique({
          where: { id: application.userId },
          select: { email: true },
        });

        if (user?.email) {
          await sendApprovalEmail(user.email);
        }
      }
    }

    return res.status(200).json({
      status: "success",
      message: "Application updated successfully.",
      statusCode: 200,
      updatedApplication,
    });
  } catch (error) {
    console.error("Error updating application:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error. Please try again later.",
      statusCode: 500,
      data: null,
    });
  }
};

module.exports = {
  updateApplication,
  upload,
};
