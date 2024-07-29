const requestDuration = (req, res, next) => {
  const start = process.hrtime();

  res.on("finish", () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const duration = seconds * 1000 + nanoseconds / 1e6;
    console.log(`Request to took ${duration.toFixed(2)}ms`);
  });

  next();
};

module.exports = requestDuration;
