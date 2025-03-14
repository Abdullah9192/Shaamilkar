const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const DeleteApplication = async (req, res) => {
  const id = req.params.id;
  const AppIdInt = parseInt(id, 10);

  try {
    const application = await prisma.application.findUnique({
      where: { id: AppIdInt },
      include: {
        installmentPlan: true,
      },
    });

    if (!application) {
      return res.status(200).json({
        status: 'error',
        message: 'No application found with the provided ID.',
        statusCode: 404,
      });
    }

    if (application.installmentPlan) {
      await prisma.installmentPlan.delete({
        where: { id: application.installmentPlan.id },
      });
    }

    await prisma.application.delete({
      where: { id: AppIdInt },
    });

    return res.status(200).json({
      status: 'success',
      message: 'Application, installment plan, and related payments deleted successfully.',
      statusCode: 200,
    });
  } catch (error) {
    console.error('Error deleting application:', error);

    if (error.code === 'P2003') {
      return res.status(200).json({
        status: 'error',
        message: 'Foreign key constraint violation. Related records could not be deleted.',
        statusCode: 400,
      });
    }

    return res.status(500).json({
      status: 'error',
      message: 'Internal server error. Please try again later.',
      statusCode: 500,
      data: null,
    });
  }
};

module.exports = { DeleteApplication };