const express = require("express");
const http = require("http");
const morgan = require("morgan");
const path = require("path");
const bodyParser = require("body-parser");
const port = 3000; // You can choose any port number

const app = express();
// Use morgan middleware with the 'dev' format to see on command line like this GET /about 200 0.897 ms - -
app.use(morgan("dev"));
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to handle common headers and status codes
app.all("/products", (req, res, next) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  next();
});

// Route to get all products
app.get("/products", (req, res) => {
  res.end("Will send all the products to you!!");
});

// Route to add a new product
app.post("/products", (req, res) => {
  const { name, description } = req.body;
  res.end(`Will add the product ${name} with details: ${description}`);
});

// Route to update all products (not supported)
app.put("/products", (req, res) => {
  res.statusCode = 403;
  res.end("PUT operation not supported on /products");
});

// Route to delete all products
app.delete("/products", (req, res) => {
  res.end("Deleting all the products");
});

// Route to get a specific product by ID
app.get("/products/:productId", (req, res) => {
  const { productId } = req.params;
  res.end(`Will send the details of the product: ${productId} to you!!`);
});

// Route to add a product with a specific ID (not supported)
app.post("/products/:productId", (req, res) => {
  const { productId } = req.params;
  res.statusCode = 403;
  res.end(`POST operation not supported on /products/${productId}`);
});

// Route to update a specific product by ID
app.put("/products/:productId", (req, res) => {
  const { productId } = req.params;
  const { name, description } = req.body;
  res.write(`Updating the product: ${productId}\n`);
  res.end(`Will update the product: ${name} with details: ${description}`);
});

// Route to delete a specific product by ID
app.delete("/products/:productId", (req, res) => {
  const { productId } = req.params;
  res.end(`Deleting product: ${productId}`);
});
// Start the server
const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
