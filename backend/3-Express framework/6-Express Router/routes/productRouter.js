const express = require("express");
const bodyParser = require("body-parser");

const productRouter = express.Router();

// Middleware to parse JSON bodies
productRouter.use(bodyParser.json());

// Middleware for common headers and status codes
productRouter.all((req, res, next) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  next();
});

// Route to handle operations on all products
productRouter
  .route("/")
  .get((req, res) => {
    res.end("Will send all the products to you!!");
  })
  .post((req, res) => {
    res.end(
      `Will add the product ${req.body.name} with details: ${req.body.description}`
    );
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /products");
  })
  .delete((req, res) => {
    res.end("Deleting all the products");
  });

// Route to handle operations on a specific product
productRouter
  .route("/:productId")
  .get((req, res) => {
    res.end(
      `Will send the details of the product: ${req.params.productId} to you!!`
    );
  })
  .post((req, res) => {
    res.statusCode = 403;
    res.end(
      `POST operation not supported on /products/${req.params.productId}`
    );
  })
  .put((req, res) => {
    res.write(`Updating the product: ${req.params.productId}\n`);
    res.end(
      `Will update the product with name: ${req.body.name} and details: ${req.body.description}`
    );
  })
  .delete((req, res) => {
    res.end(`Deleting product: ${req.params.productId}`);
  });

module.exports = productRouter;
