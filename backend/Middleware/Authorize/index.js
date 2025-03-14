const authorize = (requiredRoles) => {
    return (req, res, next) => {
      const userRole = req.user.role; 

      const hasAccess = requiredRoles.includes(userRole);
  
      if (!hasAccess) {
        return res.status(200).json({
          status: 'error',
          message: 'Forbidden: You do not have the required role.',
          statusCode: 403,
        });
      }
  
      next();
    };
  };
  
  module.exports = { authorize };
  