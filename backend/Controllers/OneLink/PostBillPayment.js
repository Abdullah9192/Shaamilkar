const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

const billPayment = async (req, res) => {
    try {
        const { username, password } = req.headers;
        let {
            consumer_number,
            tran_auth_id,
            transaction_amount,
            tran_date,
            tran_time,
            bank_mnemonic,
            reserved
        } = req.body;

        const user = await prisma.onelinkAuth.findUnique({ where: { username } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ response_Code: "04", message: "Invalid username or password" });
        }

        const actualConsumerNumber = parseInt(consumer_number.substring(6), 10);

        const installmentPlans = await prisma.installmentPlan.findMany({
            include: { application: true }
        });

        let installmentPlan = null;
        let installmentIndex = -1;

        for (const plan of installmentPlans) {
        
            const installmentsArray = Array.isArray(plan.installments) 
                ? plan.installments 
                : Object.values(plan.installments || {});

            installmentIndex = installmentsArray.findIndex(inst => inst.consumerNumber === actualConsumerNumber);
            if (installmentIndex !== -1) {
                installmentPlan = plan;
                installmentPlan.installments = installmentsArray; 
                break;
            }
        }

        if (!installmentPlan) {
            return res.status(404).json({ response_Code: "01", message: "Consumer Number does not exist" });
        }

        const installment = installmentPlan.installments[installmentIndex];

        const existingTransaction = await prisma.transactionHistory.findUnique({
            where: { TransAuthId: tran_auth_id }
        });

        if (existingTransaction) {
            return res.status(400).json({ response_Code: "03", message: "Duplicate Transaction" });
        }


        installment.amountPaid = transaction_amount;
        installment.datePaid = tran_date;
        installment.transAuthId = tran_auth_id;
        installment.status = "P"; 

        await prisma.$transaction(async (prisma) => {
    
            await prisma.installmentPlan.update({
                where: { id: installmentPlan.id },
                data: {
                    installments: installmentPlan.installments
                }
            });

            await prisma.transactionHistory.create({
                data: {
                    TransAuthId: tran_auth_id,
                    consumerNumber: actualConsumerNumber.toString(),
                    TransactionAmount: transaction_amount,
                    TranDate: tran_date,
                    TranTime: tran_time,
                    BankMnemonic: bank_mnemonic,
                    Reserved: reserved
                }
            });
        });

        const identificationParameter = installmentPlan.application 
            ? installmentPlan.application.firstName.trim() 
            : "Unknown";

        return res.status(200).json({
            response_Code: "00",
            Identification_parameter: identificationParameter,
            reserved: reserved
        });

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ response_Code: "02", message: "Unknown Error / Bad Transaction" });
    }
};

module.exports = { billPayment };