const express = require("express");
const http = require("http");
const morgan = require("morgan");
const port = 3000; // You can choose any port number

const app = express();
// Use morgan middleware with the 'dev' format to see on command line like this GET /about 200 0.897 ms - -
app.use(morgan("dev"));
// Define a route for the root URL
app.get("/", (req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html");
  res.end("<html><body><h1>This is an Express Server</h1></body></html>");
});

// Additional route
app.get("/about", (req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html");
  res.end("<html><body><h1>This is About</h1></body></html>");
});
// Start the server
const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
