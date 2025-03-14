const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  try {
    const {
      productName,
      originalPrice,
      downPayment,
      remainingAmount,
      createdAt,
      installments,
    } = req.body;

    // Create Installment Plan
    const installmentPlan = await prisma.installmentPlan.create({
      data: {
        productName,
        originalPrice: parseFloat(originalPrice),
        downPayment: parseFloat(downPayment),
        remainingAmount: parseFloat(remainingAmount),
        createdAt: new Date(createdAt),
        payments: {
          create: installments.map((installmentData) => ({
            installmentNo: installmentData.installmentNo,
            amount: parseFloat(installmentData.amount), // Ensure numeric type
            dueDate: new Date(installmentData.dueDate),
            status: installmentData.status,
          })),
        },
      },
    });

    res.status(201).json({
      message: "Installment plan saved successfully",
      installmentPlan,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save installment data" });
  }
});

router.get("/getAll", async (req, res) => {
  try {
    const installmentPlans = await prisma.installmentPlan.findMany({
      include: {
        payments: true, 
      },
    });

    res.status(200).json(installmentPlans);
  } catch (error) {
    console.error("Error fetching installment plans:", error);
    res.status(500).json({ error: "Failed to fetch installment plans" });
  }
});

// Get a single installment plan by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const installmentPlan = await prisma.installmentPlan.findUnique({
      where: { id },
      include: {
        payments: true, 
      },
    });

    if (!installmentPlan) {
      return res.status(404).json({ error: "Installment plan not found" });
    }

    res.status(200).json(installmentPlan);
  } catch (error) {
    console.error("Error fetching installment plan:", error);
    res.status(500).json({ error: "Failed to fetch installment plan" });
  }
});

router.get("/payment/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const installmentPayment = await prisma.installmentPlanPayment.findUnique({
      where: { id },
    });

    if (!installmentPayment) {
      return res.status(404).json({ error: "Installment payment not found" });
    }

    res.status(200).json(installmentPayment);
  } catch (error) {
    console.error("Error fetching installment payment:", error);
    res.status(500).json({ error: "Failed to fetch installment payment" });
  }
});

module.exports = router;