const cookie = require( 'cookie');
const prisma = require( '../../Config/database.js');

const deleteUser = async (req, res) => {
  const { Id } = req.params;
  const AppIdInt = parseInt(Id, 10);
  const id   = AppIdInt;
  
    try {
      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (user) {
        await prisma.user.delete({
          where: { id },
        });

        res.setHeader(
          'Set-Cookie',
          cookie.serialize('accessToken', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            expires: new Date(0),
            path: '/',
          })
        );
  
        return res.status(200).json({
          status: 'success',
          message: 'User deleted successfully',
          statusCode: 200,
          data: user.name,
        });
      } else {
        return res.status(200).json({
          status: 'error',
          message: 'No user found with the provided ID',
          statusCode: 404,
        });
      }
    } catch (error) {
      res.status(200).json({
        status: 'error',
        message: 'Internal server error. Please try again later',
        statusCode: 500,
        data: null,
      });
    }
  };
  
module.exports = {
    deleteUser
}