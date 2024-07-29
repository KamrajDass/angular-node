// Import Modules
const http = require("http");
const path = require("path");
const fs = require("fs");
// Create an HTTP server
const port = 3000;
const hostname = "localhost";
const server = http.createServer((req, res) => {
  // Adjust the path to your file
  const filePath = path.join(
    __dirname,
    "public",
    req.url === "/" ? "index.html" : req.url
  );
  // Serve the file
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end(
        "<html><body><h1>Error 404: " +
          req.url +
          " not found</h1></body></html>"
      );
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(content, "utf-8");
    }
  });
});

// Listen on port 3000
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});
