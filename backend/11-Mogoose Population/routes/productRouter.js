const express = require("express");
const bodyParser = require("body-parser");
const productRouter = express.Router();
const Product = require("../models/products");
// const Comment = require("../models/products");
const User = require("../models/user");
const authenticate = require("../authenticate");
// Middleware to parse JSON bodies
productRouter.use(bodyParser.json());

// Route to handle  operations  on all productss
productRouter
  .route("/")
  .get(async (req, res) => {
    // try {
    //   const products = await Product.find().populate("comments.user");
    //   res.status(200).json({
    //     data: products,
    //     message: "All products sent to you!",
    //   });
    // } catch (err) {
    //   res.status(500).json({ error: err.message });
    // }
    try {
      // Get page and limit from query parameters
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      // Calculate the number of documents to skip
      const skip = (page - 1) * limit;

      // Fetch paginated data
      const products = await Product.find()
        .populate("comments.user")
        .skip(skip)
        .limit(limit);

      // Get total count of documents
      const totalProducts = await Product.countDocuments();

      // Calculate total pages
      const totalPages = Math.ceil(totalProducts / limit);

      // Send response
      res.json({
        page,
        limit,
        totalPages,
        totalProducts,
        products,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while fetching products." });
    }
  })
  .post(async (req, res) => {
    try {
      const { name, description, image, category } = req.body;
      const product = new Product({ name, description, image, category });
      console.log("product", product);
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
  .route("/:productId/comments")
  .get(async (req, res) => {
    try {
      const { productId } = req.params;
      const { page = 1, limit = 10 } = req.query;

      // Convert page and limit to integers
      const pageNumber = parseInt(page) || 1;
      const pageSize = parseInt(limit) || 10;

      // Validate pagination parameters
      if (pageNumber <= 0 || pageSize <= 0) {
        return res
          .status(400)
          .json({ message: "Invalid page or limit parameter" });
      }

      // Find the product by ID and populate comments
      const product = await Product.findById(productId)
        .populate({
          path: "comments.user", // Adjust path as needed
          select: "username", // Adjust fields to select as needed
        })
        .exec();

      if (!product) {
        const err = new Error(`Product ${productId} not found`);
        err.status = 404;
        return next(err);
      }

      // Get all comments
      const comments = product.comments;

      // Calculate pagination metadata
      const totalComments = comments.length;
      const totalPages = Math.ceil(totalComments / pageSize);
      const skip = (pageNumber - 1) * pageSize;

      // Paginate comments
      const paginatedComments = comments.slice(skip, skip + pageSize);

      // Respond with paginated comments and metadata
      res.status(200).json({
        page: pageNumber,
        limit: pageSize,
        totalPages,
        totalComments,
        comments: paginatedComments,
      });
    } catch (err) {
      // Handle errors
      next(err);
    }
  })
  .post(authenticate.verifyUser, async (req, res, next) => {
    try {
      // Find the product by ID
      const product = await Product.findById(req.params.productId).exec();

      if (!product) {
        // Product not found
        const err = new Error(`Product ${req.params.productId} not found`);
        err.status = 404;
        return next(err);
      }

      // Create a new comment
      const newComment = {
        rating: req.body.rating,
        comment: req.body.comment,
        user: req.user._id, // Assuming user ID is added by authentication middleware
      };

      // Add the new comment to the product's comments array
      product.comments.push(newComment);

      // Save the updated product
      const updatedProduct = await product.save();

      // Populate the user's details in the comments
      const populatedProduct = await Product.findById(updatedProduct._id)
        .populate("comments.user") // Populate user details
        .exec();

      // Respond with the updated product
      res.status(200).json(populatedProduct);
    } catch (err) {
      // Handle errors
      next(err);
    }
  });

productRouter
  .route("/:productId/comments/:commentId")
  .get(async (req, res, next) => {
    try {
      // Check if commentId is provided
      if (!req.params.commentId) {
        return res.status(403).json({
          message: `PUT operation not supported on /products/${req.params.productId}/comments`,
        });
      }
      console.log("req.params.productId", req.params.productId);

      // Find the product by ID
      const product = await Product.findById(req.params.productId)
        .populate("comments.user") // Populate 'comments.user' for all comments
        .exec();

      console.log("product", product);

      if (!product) {
        // Product not found
        const err = new Error(`Product ${req.params.productId} not found`);
        err.status = 404;
        return next(err);
      }

      // Find the comment by ID
      const comment = product.comments.id(req.params.commentId);

      if (!comment) {
        // Comment not found
        const err = new Error(`Comment ${req.params.commentId} not found`);
        err.status = 404;
        return next(err);
      }

      // // Populate the author's details in the comments
      // const populatedProduct = await Product.findById(updatedProduct._id)
      //   .populate("comments.user") // Adjust 'user' to match your schema field
      //   .exec();

      // Respond with the updated product
      res.status(200).json(comment);
    } catch (err) {
      // Handle errors
      next(err);
    }
  })
  .put(async (req, res, next) => {
    try {
      // Check if commentId is provided
      if (!req.params.commentId) {
        return res.status(403).json({
          message: `PUT operation not supported on /products/${req.params.productId}/comments`,
        });
      }

      console.log("req.params.commentId", req.params.commentId);

      const product = await Product.findById(req.params.productId)
        .populate("comments") // Populate 'comments.user' for all comments
        .exec();

      if (!product) {
        // Product not found
        const err = new Error(`Product ${req.params.productId} not found`);
        err.status = 404;
        return next(err);
      }

      // Find the comment by ID
      const comment = product.comments.id(req.params.commentId);

      if (!comment) {
        // Comment not found
        const err = new Error(`Comment ${req.params.commentId} not found`);
        err.status = 404;
        return next(err);
      }

      // Update the comment
      if (req.body.rating) {
        comment.rating = req.body.rating;
      }
      if (req.body.comment) {
        comment.comment = req.body.comment;
      }

      // Save the updated product
      const updatedProduct = await product.save();

      const updatedProductComment = updatedProduct.comments.id(
        req.params.commentId
      );

      // Populate the author's details in the comments

      // Respond with the updated product
      res.status(200).json(updatedProductComment);
    } catch (err) {
      // Handle errors
      console.log("err", err);
      next(err);
    }
  })
  .delete(authenticate.verifyUser, async (req, res, next) => {
    try {
      const { productId, commentId } = req.params;
      const { user } = req; // Assuming req.user is populated by authentication middleware

      // Find the product by ID and populate comments
      const product = await Product.findById(productId)
        .populate("comments.user") // Populate the 'user' field in comments
        .exec();

      if (!product) {
        const err = new Error(`Product ${productId} not found`);
        err.status = 404;
        return next(err);
      }

      // Find the comment by ID
      const comment = product.comments.id(commentId);

      if (!comment) {
        const err = new Error(`Comment ${commentId} not found`);
        err.status = 404;
        return next(err);
      }

      // Check if the user is the author of the comment
      if (comment.user._id.toString() !== user._id.toString()) {
        return res
          .status(403)
          .json({
            message: "Forbidden: You are not the author of this comment",
          });
      }

      // Remove the comment using $pull operator
      await Product.findByIdAndUpdate(
        productId,
        { $pull: { comments: { _id: commentId } } },
        { new: true } // Option to return the updated document
      );

      // Respond with success message
      res.status(200).json({ message: "Comment deleted successfully" });
    } catch (err) {
      // Handle errors
      next(err);
    }
  });

// Route to get products by category
productRouter.get("/category/:category", async (req, res) => {
  try {
    // Get category from route parameters
    const { category } = req.params;

    // Get page and limit from query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Fetch paginated data for the specified category
    const products = await Product.find({ category }).skip(skip).limit(limit);

    // Get total count of documents for the specified category
    const totalProducts = await Product.countDocuments({ category });

    // Calculate total pages
    const totalPages = Math.ceil(totalProducts / limit);

    // Send response
    res.json({
      category,
      page,
      limit,
      totalPages,
      totalProducts,
      products,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching products." });
  }
});

module.exports = productRouter;

//=================== for post products==================///////

// .post(async (req, res) => {
//   try {
//     // const { name, description } = req.body;
//     // const product = new Product({ name, description });
//     console.log(req.body);
//     req.body.products.forEach(async (element) => {
//       const { name, description, image, category } = element;
//       const product = new Product({ name, description, image, category });
//       await product.save();
//     });
//     //  console.log("product", product);
//     // const result = await product.save();
//     res.status(201).json({
//       data: req.body.products,
//       message: `Products Added Successfully`,
//     });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// })
