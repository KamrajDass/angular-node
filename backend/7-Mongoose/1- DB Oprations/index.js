const mongoose = require("mongoose");

const Product = require("./models/products");

const url = "mongodb://localhost:27017/testDB";

// Connect to MongoDB
mongoose
  .connect(url)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB:", err));

async function main() {
  try {
    // Create (Insert) Operation
    const product = new Product({
      name: "Dell Laptop",
      price: 290,
    });

    await product.save();
    console.log("Product Created:", product);

    // Read
    const allProducts = await Product.find();
    console.log("All Products:", allProducts);

    // Read
    const singleProduct = await Product.findOne({ name: "Dell Laptop" });
    console.log("Found Product:", singleProduct);

    // Update
    await Product.updateOne({ name: "Dell Laptop" }, { $set: { price: 400 } });
    console.log("Product Updated");

    // Verify Update
    const updatedProduct = await Product.findOne({ name: "Dell Laptop" });
    console.log("Updated Product:", updatedProduct);

    // Delete
    await Product.deleteOne({ name: "Dell Laptop" });
    console.log("Product Deleted");

    // Verify Deletion
    const remainingProducts = await Product.find();
    console.log("Remaining Products:", remainingProducts);
  } catch (err) {
    console.error(err);
  } finally {
    // Close the client connection
    mongoose.connection.close().then(() => {
      console.log("Disconnected from MongoDB");
    });
  }
}

// Run the main function
main();
