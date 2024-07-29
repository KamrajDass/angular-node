const express = require("express");
const http = require("http");
const morgan = require("morgan");
const path = require("path");
const port = 3000; // You can choose any port number

const app = express();
// Use morgan middleware with the 'dev' format to see on command line like this GET /about 200 0.897 ms - -
app.use(morgan("dev"));
// Set the view engine to EJS
app.set("view engine", "ejs");
// Set the views directory (optional, default is './views')
// This is where your EJS templates will be located
app.set("views", path.join(__dirname, "views"));

// Define a route for the home page
app.get("/", (req, res) => {
  res.render("index", { title: "Home Page", message: "Welcome to our site!" });
});

// Define a route for the About page
app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Us",
    message: "Learn more about us here.",
  });
});
// Start the server
const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
