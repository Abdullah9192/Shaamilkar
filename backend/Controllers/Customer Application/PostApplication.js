const multer = require("multer");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "Uploads/image/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

const generateUniqueApplicationId = async () => {
  let id;
  let exists;
  do {
    id = Math.floor(100000000 + Math.random() * 900000000);
    exists = await prisma.application.findUnique({
      where: { id },
    });
  } while (exists);
  return id;
};

const generateUniqueInstallmentPlanId = async () => {
  let id;
  let exists;
  do {
    id = Math.floor(100000000 + Math.random() * 900000000); // Generate a random ID
    exists = await prisma.installmentPlan.findUnique({
      where: { id },
    });
  } while (exists);
  return id;
};

const generateUniqueConsumerNumber = async (existingConsumerNumbers = []) => {
  let consumerNumber;
  let exists = true;

  while (exists) {
    consumerNumber = Math.floor(100000000 + Math.random() * 900000000).toString();
    exists = existingConsumerNumbers.includes(parseInt(consumerNumber, 10));
  }

  return consumerNumber;
};

const createApplication = async (req, res) => {
  try {
    const formData = req.body;
    console.log("formdata:", formData);
    console.log("Received installmentPlan:", req.body.installmentPlan);

    const data = typeof formData === "string" ? JSON.parse(formData) : formData;

    const {
      userId,
      firstName,
      middleName,
      lastName,
      fatherName,
      husbandName,
      gender,
      dateOfBirth,
      mobileNumber,
      cnic,
      email,
      currentAddress,
      city,
      livingSince,
      residenceType,
      jobTitle,
      occupation,
      occupationStatus,
      organizationName,
      organizationAddress,
      workingSince,
      phoneOffice,
      earningPerMonth,
      referenceInfo,
      creditscore,
      loanofficerattachments,
      creditofficerattachments,
      product,
      installmentPlan: installmentPlanString, 
    } = data;

    const installmentPlan =
      typeof installmentPlanString === "string"
        ? JSON.parse(installmentPlanString)
        : installmentPlanString;

    if (
      !userId ||
      !firstName ||
      !lastName ||
      !gender ||
      !dateOfBirth ||
      !mobileNumber ||
      !cnic ||
      !email ||
      !currentAddress ||
      !city ||
      !livingSince ||
      !residenceType ||
      !occupationStatus ||
      !referenceInfo ||
      !product ||
      !installmentPlan ||
      !installmentPlan.productName 
    ) {
      return res.status(200).json({
        status: "error",
        message:
          "All fields are mandatory, including installment plan details and productName.",
        statusCode: 400,
      });
    }

    const userIdInt = parseInt(userId, 10);

    const userExists = await prisma.user.findUnique({
      where: { id: userIdInt },
    });

    if (!userExists) {
      return res.status(200).json({
        status: "error",
        message: "User does not exist.",
        statusCode: 404,
      });
    }

    const existingApplication = await prisma.application.findFirst({
      where: { userId: userIdInt },
    });

    if (existingApplication) {
      return res.status(200).json({
        status: "error",
        message: "An application already exists for this user.",
        statusCode: 409,
      });
    }

    const BASE_URL = "https://api-shamilkar.enaam.pk";
    const getFileUrl = (file) => `${BASE_URL}/Uploads/image/${file.filename}`;

    const cnicFrontPhotoPath = getFileUrl(req.files?.cnicFrontPhoto?.[0]);
    const cnicBackPhotoPath = getFileUrl(req.files?.cnicBackPhoto?.[0]);
    const sixMonthBankStatementPath = getFileUrl(
      req.files?.sixMonthBankStatement?.[0]
    );
    const lastPaySlipPath = getFileUrl(req.files?.lastPaySlip?.[0]);
    const utilityBillPath = getFileUrl(req.files?.utilityBill?.[0]);

    const parsedReferenceInfo = Array.isArray(referenceInfo)
      ? referenceInfo
      : JSON.parse(referenceInfo || "[]");
    const parsedLoanOfficerAttachments = loanofficerattachments
      ? JSON.parse(loanofficerattachments)
      : [];
    const parsedproducts = product ? JSON.parse(product) : [];
    const parsedCreditOfficerAttachments = creditofficerattachments
      ? JSON.parse(creditofficerattachments)
      : [];

    const {
      productName,
      originalPrice,
      downPayment,
      selectedPlan,
      installments,
      remainingAmount,
    } = installmentPlan;

    const existingConsumerNumbers = installments
      .map((installment) => installment.consumerNumber)
      .filter((num) => num !== undefined && num !== null);

    const installmentsWithConsumerNumber = await Promise.all(
      installments.map(async (installment) => {
        const consumerNumber = await generateUniqueConsumerNumber(existingConsumerNumbers);
        existingConsumerNumbers.push(parseInt(consumerNumber, 10)); 
        return {
          ...installment,
          consumerNumber: parseInt(consumerNumber, 10),
        };
      })
    );

    const [application, newInstallmentPlan] = await prisma.$transaction(
      async (prisma) => {
        const applicationId = await generateUniqueApplicationId();
        const application = await prisma.application.create({
          data: {
            id: applicationId,
            userId: userIdInt,
            firstName,
            middleName,
            lastName,
            fatherName,
            husbandName,
            gender,
            dateOfBirth,
            mobileNumber,
            cnic,
            cnicFrontPhoto: cnicFrontPhotoPath,
            cnicBackPhoto: cnicBackPhotoPath,
            email,
            currentAddress,
            city,
            livingSince,
            residenceType,
            jobTitle,
            occupation,
            occupationStatus,
            organizationName,
            organizationAddress,
            workingSince,
            phoneOffice,
            earningPerMonth: parseFloat(earningPerMonth),
            sixMonthBankStatement: sixMonthBankStatementPath,
            lastPaySlip: lastPaySlipPath,
            utilityBill: utilityBillPath,
            referenceInfo: parsedReferenceInfo,
            product: parsedproducts,
            forwardedtocm: false,
            creditscore,
            creditofficerattachments: parsedCreditOfficerAttachments,
            loanofficerattachments: parsedLoanOfficerAttachments,
            signaturepdf: [],
          },
        });

        const installmentPlanId = await generateUniqueInstallmentPlanId();
        const newInstallmentPlan = await prisma.installmentPlan.create({
          data: {
            id: installmentPlanId,
            applicationId: application.id, 
            productName,
            originalPrice,
            downPayment,
            remainingAmount,
            selectedPlan,
            installments: installmentsWithConsumerNumber, 
          },
        });

        return [application, newInstallmentPlan];
      }
    );

    return res.status(201).json({
      status: "success",
      message: "Application and installment plan created successfully.",
      statusCode: 201,
      application,
      newInstallmentPlan,
    });
  } catch (error) {
    console.error("Error:", error);

    if (error.code === "P2003") {
      return res.status(200).json({
        status: "error",
        message: "Invalid userId. The user does not exist.",
        statusCode: 400,
      });
    }

    return res.status(200).json({
      status: "error",
      message: "Internal server error. Please try again later.",
      statusCode: 500,
      data: null,
    });
  }
};

module.exports = {
  upload,
  createApplication,
};