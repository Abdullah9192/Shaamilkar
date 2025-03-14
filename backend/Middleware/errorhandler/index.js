const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.header("Access-Control-Allow-Origin", "*"); // Temporary fix
    res.status(err.status || 500).json({ error: err.message });
  };
  
module.exports = errorHandler;