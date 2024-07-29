const express = require("express");
const bodyParser = require("body-parser");

const productRouter = express.Router();
const fs = require("fs");
const path = require("path");

// Middleware to parse JSON bodies
productRouter.use(bodyParser.json());

// Path to the JSON file
const dbPath = path.join(__dirname, "../DB/db.json");
// Helper function to read from JSON file
const readFromFile = () => {
  if (!fs.existsSync(dbPath)) {
    return [];
  }
  const data = fs.readFileSync(dbPath);
  return JSON.parse(data);
};

// Helper function to write to JSON file
const writeToFile = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

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
    const data = readFromFile();
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json({
      data: data,
      message: "All products sent to you!",
    });
  })
  .post((req, res) => {
    const { name, description } = req.body;
    const data = readFromFile();
    const product = { id: data.length + 1, name, description };
    data.push(product);
    writeToFile(data);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json({
      data: data,
      message: `Adding the product ${req.body.name} with details: ${req.body.description}`,
    });
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /products");
  })
  .delete((req, res) => {
    writeToFile([]); // Write an empty array to the file
    const data = readFromFile();
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json({
      data: data,
      message: "Deleted all the products",
    });
  });

// Route to handle operations on a specific product
productRouter
  .route("/:productId")
  .get((req, res) => {
    const id = parseInt(req.params.productId);
    const data = readFromFile();
    const product = data.find((item) => item.id === id);
    if (product) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({
        data: product,
        message: `Sending details of product ID: ${req.params.productId} to you!`,
      });
    } else {
      res.statusCode = 404;
      res.setHeader("Content-Type", "application/json");
      res.json({ message: "Product not found!" });
    }
  })
  .post((req, res) => {
    res.statusCode = 403;
    res.end(
      `POST operation not supported on /products/${req.params.productId}`
    );
  })
  .put((req, res) => {
    const id = parseInt(req.params.productId);
    const { name, description } = req.body;
    const data = readFromFile();
    const index = data.findIndex((item) => item.id === id);
    if (index !== -1) {
      data[index] = { id, name, description };
      writeToFile(data);
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({
        data: data[index],
        message: `Product is Updated with '${name}' and details: ${description}`,
      });
    } else {
      res.statusCode = 404;
      res.setHeader("Content-Type", "application/json");
      res.json({ message: "Product not found!" });
    }
  })
  .delete((req, res) => {
    const id = parseInt(req.params.productId);
    const data = readFromFile();
    const index = data.findIndex((item) => item.id === id);
    if (index !== -1) {
      data.splice(index, 1);
      writeToFile(data);
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({
        data: data,
        message: `Product is deleted with ID: ${id}`,
      });
    } else {
      res.statusCode = 404;
      res.setHeader("Content-Type", "application/json");
      res.json({ message: "Product not found!" });
    }
  });

module.exports = productRouter;
