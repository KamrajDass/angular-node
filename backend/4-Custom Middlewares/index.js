const express = require("express");
const http = require("http");
const path = require("path");
const bodyParser = require("body-parser");
const productRouter = require("./routes/productRouter");
const logger = require("./middlewares/logger");
const rateLimit = require("./middlewares/rateLimiter");
const requestDuration = require("./middlewares/requestDuration");
const checkToken = require("./middlewares/checkToken");
const sanitizeInput = require("./middlewares/sanitizeInput");
const checkContentType = require("./middlewares/checkContentType");

const port = 3000; // You can choose any port number

const app = express();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// Middleware to parse JSON bodies
app.use(express.json());

// Use middlewares
app.use(rateLimit);
app.use(checkContentType);
app.use(logger);
app.use(requestDuration);
app.use(checkToken);
app.use(sanitizeInput);

// Use the products router for routes starting with '/products'
app.use("/products", productRouter);
// Start the server
const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
