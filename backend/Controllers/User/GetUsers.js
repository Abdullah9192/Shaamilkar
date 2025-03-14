const prisma = require( '../../Config/database.js');

const getAllUsers = async (req, res) => {
    try {
      const users = await prisma.user.findMany();
      if (users.length > 0) {
        return res.status(200).json({
          status: 'success',
          message: 'Users fetched successfully.',
          statusCode: 200, 
          users,
        });
      } else {
        return res.status(200).json({
          status: 'error',
          message: 'No users found.',
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

module.exports = {
    getAllUsers
}