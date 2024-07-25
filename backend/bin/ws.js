const WebSocket = require("ws"); // Import ws library
const conectWS = (server) => {
  // Create a WebSocket server

  const wss = new WebSocket.Server({ server });
  const mySet = new Set();

  const connections = [
    {
      matchId: 252525,
      connections: ["ws", "ws", "ws"],
    },
  ];

  function sendData() {
    // while (mySet.size > 0) {
    //   mySet.forEach((value) => {
    //     value.send(`Broadcast666: ${Math.random()}`);
    //   });
    // }

    Redis.Subscribe("**", (channel, data) => {
      var matchid = channel;
      connections
        .map((x) => x.matchId == matchid)
        .forEach(x.connections, (xx) => {
          xx.send(data);
        });
    });
  }

  // Handle WebSocket connections
  wss.on("connection", (ws) => {
    console.log("New WebSocket client connected");
    //const parsedUrl = url.parse(request.url, true);
    // const queryParams = parsedUrl.query;
    // mySet.add(ws);
    //key value pair..
    // sendData();
    ws.on("message", (message) => {
      console.log("Received:", message);

      // Broadcast the message to all connected clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(`Broadcast: ${message}`);
        }
      });
    });

    ws.on("close", () => {
      console.log("WebSocket client disconnected");
      mySet.delete(ws);
    });
  });
};

module.exports = conectWS;
