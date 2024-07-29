// Import a HTTP Module
const http = require("http");

// Create an HTTP server
const port = 3000;
const hostname = "localhost";
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello, World!\n");
});

// Listen on port 3000
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});
