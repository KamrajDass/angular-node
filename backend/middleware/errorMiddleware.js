// Error handling middleware
const errorHandler = (err, req, res, next) => {
  // Default to 500 Internal Server Error if status is not set
  const statusCode = err.status || 500;

  // Log the error (optional, for debugging purposes)
  console.error(`Error: ${err.message}`);

  // Set the response status code
  res.status(statusCode);

  // Send a JSON response with the error details
  res.json({
    status: statusCode,
    message: err.message,
    // You can include more details for debugging, such as the stack trace, in development mode
    // stack: process.env.NODE_ENV === 'development' ? err.stack : {}
  });
};
