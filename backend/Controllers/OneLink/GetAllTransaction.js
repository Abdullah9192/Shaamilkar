const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAllTransactions = async (req, res) => {
    try {
        const transactions = await prisma.transactionHistory.findMany();
        if (transactions.length > 0) {
            return res.status(200).json({
              status: 'success',
              message: 'Transactions fetched successfully.',
              statusCode: 200, 
              transactions,
            });
          } else {
            return res.status(200).json({
              status: 'error',
              message: 'No Transactions found.',
              statusCode: 404
            });
          }
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(200).json({
          status: 'error',
          message: 'Internal server error. Please try again later.',
          statusCode: 500, 
          data: null,
        });
    }
};

const getSingleTransaction = async (req, res) => {
    try {
        const { transAuthId } = req.params;

        const transaction = await prisma.transactionHistory.findUnique({
            where: { TransAuthId: transAuthId }
        });

        if (!transaction) {
            return res.status(404).json({ response_Code: "01", message: "Transaction not found" });
        }

        const actualConsumerNumber = parseInt(transaction.consumerNumber.substring(6), 10);

        const installmentPlans = await prisma.installmentPlan.findMany({
            include: { application: true }
        });

        let username = "Unknown";

        for (const plan of installmentPlans) {
            const installmentsArray = Array.isArray(plan.installments) 
                ? plan.installments 
                : Object.values(plan.installments || {});

            const installment = installmentsArray.find(inst => inst.consumerNumber === actualConsumerNumber);

            if (installment && plan.application) {
                username = plan.application.firstName.trim();
                break;
            }
        }

        return res.status(200).json({
            response_Code: "00",
            transaction,
            username
        });

    } catch (error) {
        console.error("Error fetching transaction:", error);
        return res.status(500).json({ response_Code: "02", message: "Error fetching transaction" });
    }
};

module.exports = { getAllTransactions, getSingleTransaction };
