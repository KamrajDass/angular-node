const express = require("express");
const bodyParser = require("body-parser");
const productRouter = express.Router();
const Product = require("../models/products");
const Comment = require("../models/products");
const User = require("../models/user");
const authenticate = require("../authenticate");
// Middleware to parse JSON bodies
productRouter.use(bodyParser.json());

// Route to handle  operations  on all productss
productRouter
  .route("/")
  .get(async (req, res) => {
    try {
      console.log("verifyUser", authenticate.verifyUser);
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

productRouter
  .post("/:productId/comments", async (req, res) => {
    try {
      const product = await Product.findById(productId)
        .populate({
          path: "comments",
          populate: {
            path: "user",
            model: "User",
          },
        })
        .exec();

      if (product) {
        console.log("Product with populated comments and users:", product);
        res.status(201).json({
          success: true,
          message: "Product with populated comments and users",
          product: product,
        });
      } else {
        console.log("Product not found");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  })
  // POST route to add a comment to a product
  .post("/:productId/comments", async (req, res) => {
    const { comment, rating, username } = req.body;

    // Input validation
    if (!comment) {
      return res
        .status(400)
        .json({ success: false, message: "Comment and userId are required" });
    }

    try {
      // Check if product exists
      console.log("req.params.productId", req.params.productId);
      const product = await Product.findById(req.params.productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      // Check if user exists
      const user = await User.findOne({ username });
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      console.log("user", user);
      // Create a new comment
      const commentData = new Comment({
        comment,
        rating,
        user: user._id,
      });

      console.log("commentResult", commentData);

      // Save the comment
      let commentResult = await commentData.save();

      // Associate the comment with the product
      product.comments.push(commentResult._id);
      await product.save();

      res.status(201).json({
        success: true,
        message: "Comment added successfully",
        commentResult,
      });
    } catch (error) {
      console.error("Error posting comment:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });

module.exports = productRouter;
