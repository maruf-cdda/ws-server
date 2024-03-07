const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", function connection(ws) {
  console.log("Client connected");

  ws.on("message", function incoming(message) {
    console.log("Received: %s", message);
    // Echo the received message back to the client
    ws.send(`You sent: ${message}`);
  });

  ws.on("close", function close() {
    console.log("Client disconnected");
  });
});

// Function to send a notification to all connected clients
function sendNotification() {
  console.log("Sending notification");
  if (wss.clients.size > 0) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        const data = {
          title: "Notification",
          body: "This is a notification from the server",
        };
        client.send(JSON.stringify(data));
      }
    });
  }
}

// Send notification every 10 seconds
setInterval(sendNotification, 10000);

server.listen(3000, function () {
  console.log("Server is listening on http://localhost:3000");
});
