const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

const fileToBase64 = (filePath, type) => {
  if (!filePath) return null;

  const filename = path.basename(filePath);
  let folder;
  let mimeType;

  switch (type) {
    case "image":
      folder = "image";
      mimeType = "image/png"; 
      break;
    case "pdf":
      folder = "pdf";
      mimeType = "application/pdf";
      break;
    case "excel":
      folder = "excel";
      mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
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
    return null;
  }
};

const GetSingleApplication = async (req, res) => {
  try {
    const { Id } = req.params;
    const AppIdInt = parseInt(Id, 10);

    const app = await prisma.application.findFirst({
      where: { userId: AppIdInt }, 
      include: {
        installmentPlan: true,
      },
    });

    if (!app) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    const pdfMapping = {
      musawamah: "musawamah.pdf",
      acknowledgement: "acknowledgement.pdf",
      undertaking: "undertaking.pdf",
    };

    const pdfFiles = {
      musawamah: null,
      acknowledgement: null,
      undertaking: null,
    };

    let pdfPaths = app.signaturepdf || [];

    pdfPaths.forEach((file) => {
      const fileName = path.basename(file.trim()); 

      for (const key in pdfMapping) {
        if (fileName.includes(pdfMapping[key].replace(".pdf", ""))) {
          const localFilePath = path.join(__dirname, "../../Uploads/pdf", fileName);
          pdfFiles[key] = fileToBase64(localFilePath, "pdf");
        }
      }
    });

    const Application = {
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
      reviewedAt: app.reviewedAt,
      createdAt: app.createdAt,
      updatedAt: app.updatedAt,
      installmentPlan: app.installmentPlan, 
    };

    res.status(200).json({
      status: 'success',
      message: 'Application fetched successfully',
      statusCode: 200,
      Application,
    });
  } catch (error) {
    console.error("Error fetching application:", error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error. Please try again later.',
      statusCode: 500,
      data: null,
    });
  }
};

module.exports = { GetSingleApplication };