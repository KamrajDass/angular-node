const checkContentType = (req, res, next) => {
  const contentType = req.headers["content-type"];
  if (contentType !== "application/json") {
    return res
      .status(400)
      .send(
        "Server requires application/json content type your conent-type is " +
          contentType
      );
  }
  // Attach some data to req object
  console.log("checkContentType Middleware");

  req.customData = { contentType };
  next();
};

module.exports = checkContentType;
