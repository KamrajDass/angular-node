const express = require("express");
const http = require("http");
const morgan = require("morgan");
const path = require("path");
const port = 3000; // You can choose any port number

const app = express();
// Use morgan middleware with the 'dev' format to see on command line like this GET /about 200 0.897 ms - -
app.use(morgan("dev"));
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Define route for the About page
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "about.html"));
});
// Start the server
const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
