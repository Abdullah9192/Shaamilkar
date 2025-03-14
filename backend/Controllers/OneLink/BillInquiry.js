const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

const parseDate = (dateString) => {
    if (!dateString || dateString.length !== 8) return null;

    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);

    return new Date(`${year}-${month}-${day}`);
};

const billinquiry = async (req, res) => {
    try {
        const { username, password } = req.headers;
        const { consumer_number, bank_mnemonic, reserved } = req.body;
        const Consumer_Number = parseInt(consumer_number, 10);

        const user = await prisma.onelinkAuth.findUnique({ where: { username } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ response_Code: "01", message: "Invalid username or password" });
        }

        const installmentPlans = await prisma.installmentPlan.findMany({
            include: { application: true }
        });

        let installmentPlan = null;
        let installmentIndex = -1;

        for (const plan of installmentPlans) {
            let installmentsArray = plan.installments;
            if (!Array.isArray(installmentsArray)) {
                console.error(`Installments is not an array for plan ID ${plan.id}:`, installmentsArray);
                continue;
            }

            installmentIndex = installmentsArray.findIndex(inst => inst.consumerNumber === Consumer_Number);
            if (installmentIndex !== -1) {
                installmentPlan = plan;
                break;
            }
        }

        if (!installmentPlan) {
            return res.status(404).json({ response_Code: "01", message: "Invalid consumer number" });
        }

        installmentPlan.installments[installmentIndex].bankMnemonic = bank_mnemonic;
        installmentPlan.installments[installmentIndex].reserved = reserved;

        await prisma.installmentPlan.update({
            where: { id: installmentPlan.id },
            data: { installments: installmentPlan.installments } 
        });

        const installment = installmentPlan.installments[installmentIndex];


        const response = {
            response_Code: "00",
            consumer_Detail: installmentPlan.application ? installmentPlan.application.firstName.trim() : "Unknown",
            due_date: new Date(installment.dueDate).toISOString().split("T")[0],
            amount_within_dueDate: installment.amountWithInDueDate 
                ? `-${installment.amountWithInDueDate.toString().padStart(12, "0")}00` 
                : "              ",
            amount_after_dueDate: installment.amountAfterDueDate 
                ? `+${installment.amountAfterDueDate.toString().padStart(12, "0")}00` 
                : "              ",
                date_paid: installment.status === "P" 
                ? (installment.datePaid ? parseDate(installment.datePaid)?.toISOString().split("T")[0] || "        " : "        ") 
                : "        ",
            amount_paid: installment.status === "P" 
                ? (installment.amountPaid ? installment.amountPaid.toString().padStart(12, "0") + "00" : "              ") 
                : "              ",
            tran_auth_Id: installment.status === "P" 
                ? (installment.transAuthId ? installment.transAuthId.toString().padStart(6, "0") : "      ") 
                : "      ",
            Billing_Status: installment.status,
            reserved: installment.reserved
        };


        return res.status(200).json(response);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ response_Code: "03", message: "Unknown Error/Bad Transaction" });
    }
};

module.exports = { billinquiry };

