const express = require("express");
const bodyParser = require("body-parser");
const productRouter = express.Router();
const Product = require("../models/products");
// Middleware to parse JSON bodies
productRouter.use(bodyParser.json());

// Route to handle  operations  on all productss
productRouter
  .route("/")
  .get(async (req, res) => {
    try {
      const products = await Product.find();
      res.status(200).json({
        data: products,
        message: "All products sent to you!",
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  })
  .post(async (req, res) => {
    try {
      const product = new Product(req.body);
      const result = await product.save();
      res.status(201).json({
        data: result,
        message: `Product Added Successfully`,
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /products");
  })
  .delete(async (req, res) => {
    try {
      const result = await Product.deleteMany({});
      res.json({
        data: result,
        message: "Deleted all the products",
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

// Route to handle operations on a specific product
productRouter
  .route("/:productId")
  .get(async (req, res) => {
    try {
      const product = await Product.findById(req.params.productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(200).json({
        data: product,
        message: `Product sent to you!`,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  })
  .post((req, res) => {
    res.statusCode = 403;
    res.end(
      `POST operation not supported on /products/${req.params.productId}`
    );
  })
  .put(async (req, res) => {
    try {
      const product = await Product.findByIdAndUpdate(
        req.params.productId,
        req.body,
        { new: true, runValidators: true }
      );
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(200).json({
        data: product,
        message: `Update product sent to you!`,
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  })
  .delete(async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(200).json({
        message: `Product deleted Successfully!`,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

module.exports = productRouter;
