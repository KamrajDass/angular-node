const express = require("express");
const bodyParser = require("body-parser");
const productRouter = express.Router();
// Middleware to parse JSON bodies
productRouter.use(bodyParser.json());

// Base URL for the external API
const apiUrl = "https://fakestoreapi.com/products";

// common function to fetch data from the external API
const fetchFromAPI = async (url, method = "GET", body = null) => {
  const options = { method };
  if (body) {
    options.body = JSON.stringify(body);
    options.headers = { "Content-Type": "application/json" };
  }
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
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
  .get(async (req, res) => {
    try {
      const data = await fetchFromAPI(apiUrl);
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({
        data: data,
        message: "All products sent to you!",
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  })
  .post(async (req, res) => {
    try {
      const newProduct = req.body;
      const product = await fetchFromAPI(apiUrl, "POST", newProduct);
      res.statusCode = 201;
      res.setHeader("Content-Type", "application/json");
      res.json({
        data: product,
        message: `Note: The API ${apiUrl} may not support creating new products`,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /products");
  })
  .delete(async (req, res) => {
    try {
      let data = await fetchFromAPI(`${apiUrl}`, "DELETE");
      res.statusCode = 204;
      res.setHeader("Content-Type", "application/json");
      // this code will run if this api allow to delete the products
      res.json({
        data: data,
        message: `Note: The API ${apiUrl} may not support deleting all the products`,
      });
    } catch (error) {
      res.status(500).json({
        message: `Note: The API ${apiUrl} may not support deleting all the products`,
        error: error.message,
      });
    }
  });

// Route to handle operations on a specific product
productRouter
  .route("/:productId")
  .get(async (req, res) => {
    const id = req.params.productId;
    try {
      const product = await fetchFromAPI(`${apiUrl}/${id}`);
      if (product) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({
          data: product,
          message: `Sending details of product ID: ${req.params.productId} to you!`,
        });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  })
  .post((req, res) => {
    res.statusCode = 403;
    res.end(
      `POST operation not supported on /products/${req.params.productId}`
    );
  })
  .put(async (req, res) => {
    const id = req.params.productId;
    const updatedProduct = req.body;
    try {
      const product = await fetchFromAPI(
        `${apiUrl}/${id}`,
        "PUT",
        updatedProduct
      );
      res.statusCode = 403;
      res.setHeader("Content-Type", "application/json");
      res.json({
        data: product,
        message: `Note: The API ${apiUrl} may not support updating products`,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  })
  .delete(async (req, res) => {
    const id = req.params.productId;
    try {
      const product = await fetchFromAPI(`${apiUrl}/${id}`, "DELETE");
      // this code will run if this api allow to delete the products
      res.statusCode = 204;
      res.setHeader("Content-Type", "application/json");
      res.json({
        data: product,
        message: `Note: The API ${apiUrl} may not support to delete this product`,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

module.exports = productRouter;
