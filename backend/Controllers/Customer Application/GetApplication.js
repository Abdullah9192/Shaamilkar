const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

const fileToBase64 = (filePath, type) => {
  if (!filePath) return null;

  const filename = path.basename(filePath);
  const extension = path.extname(filePath).toLowerCase().replace(".", "");

  let folder, mimeType;
  switch (extension) {
    case "png":
      folder = "image";
      mimeType = "image/png";
      break;
    case "jpg":
    case "jpeg":
      folder = "image";
      mimeType = "image/jpeg";
      break;
    case "gif":
      folder = "image";
      mimeType = "image/gif";
      break;
    case "pdf":
      folder = "pdf";
      mimeType = "application/pdf";
      break;
    case "xls":
      folder = "excel";
      mimeType = "application/vnd.ms-excel";
      break;
    case "xlsx":
      folder = "excel";
      mimeType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      break;
    default:
      return null;
  }

  const fullFilePath = path.join(__dirname, "../../Uploads", folder, filename);

  if (!fs.existsSync(fullFilePath)) {
    return null;
  }

  try {
    const fileBuffer = fs.readFileSync(fullFilePath);
    const base64String = fileBuffer.toString("base64");

    return `data:${mimeType};base64,${base64String}`;
  } catch (error) {
    console.error(`❌ Error reading file ${filename}:`, error);
    return null;
  }
};

const GetApplication = async (req, res) => {
  try {
    const applications = await prisma.application.findMany({
      include: {
        installmentPlan: true, 
      },
    });

    const Applications = applications.map((app) => {
      const pdfFiles = {
        musawamah: null,
        acknowledgement: null,
        undertaking: null,
      };

      const pdfPaths = app.signaturepdf || [];
      pdfPaths.forEach((file) => {
        const fileName = path.basename(file.trim());
        if (fileName.includes("musawamah")) {
          pdfFiles.musawamah = fileToBase64(file, "pdf");
        } else if (fileName.includes("acknowledgement")) {
          pdfFiles.acknowledgement = fileToBase64(file, "pdf");
        } else if (fileName.includes("undertaking")) {
          pdfFiles.undertaking = fileToBase64(file, "pdf");
        }
      });

      return {
        id: app.id,
        userId: app.userId,
        firstName: app.firstName,
        middleName: app.middleName,
        lastName: app.lastName,
        product: app.product,
        fatherName: app.fatherName,
        husbandName: app.husbandName,
        gender: app.gender,
        dateOfBirth: app.dateOfBirth,
        mobileNumber: app.mobileNumber,
        cnic: app.cnic,
        cnicFrontPhoto: fileToBase64(app.cnicFrontPhoto, "image"),
        cnicBackPhoto: fileToBase64(app.cnicBackPhoto, "image"),
        email: app.email,
        currentAddress: app.currentAddress,
        city: app.city,
        livingSince: app.livingSince,
        residenceType: app.residenceType,
        jobTitle: app.jobTitle,
        occupation: app.occupation,
        occupationStatus: app.occupationStatus,
        organizationName: app.organizationName,
        organizationAddress: app.organizationAddress,
        workingSince: app.workingSince,
        phoneOffice: app.phoneOffice,
        earningPerMonth: app.earningPerMonth,
        sixMonthBankStatement: fileToBase64(app.sixMonthBankStatement, "image"),
        lastPaySlip: fileToBase64(app.lastPaySlip, "image"),
        utilityBill: fileToBase64(app.utilityBill, "image"),
        referenceInfo: app.referenceInfo,
        status: app.status,
        creditscore: fileToBase64(app.creditscore, "excel"),
        loanofficerattachments: app.loanofficerattachments,
        creditofficerattachments: app.creditofficerattachments,
        forwardedtocm: app.forwardedtocm,
        signaturepdf: pdfFiles,
        installmentPlan: app.installmentPlan, 
        reviewedAt: app.reviewedAt,
        createdAt: app.createdAt,
        updatedAt: app.updatedAt,
      };
    });

    res.status(200).json({
      status: "success",
      message: "Applications fetched successfully",
      statusCode: 200,
      Applications,
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(200).json({
      status: "error",
      message: "Internal server error. Please try again later.",
      statusCode: 500,
      data: null,
    });
  }
};

module.exports = {
  GetApplication,
};
