const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", function connection(ws) {
  console.log("Client connected");

  ws.on("message", async function incoming(message) {
    try {
      console.log("Received: %s", message);
      // Echo the received message back to the client
      ws.send(`You sent: ${message}`);
    } catch (error) {
      console.error("Error processing message:", error);
    }
  });

  ws.on("close", function close() {
    console.log("Client disconnected");
  });
});

// Function to send a command to all connected clients
function sendAction() {
  console.log("Sending action");
  if (wss.clients.size > 0) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        const data = {
          storage: [
            {
              store: "sessionstorage",
              action: "set",
              key: "key1",
              value: "this is new value",
            },
          ],
          cookie: [
            {
              action: "set",
              key: "key1",
              value: "this is new value",
            },
          ],
        };
        client.send(JSON.stringify(data));
      }
    });
  }
}

// Send notification every 10 seconds
setInterval(sendAction, 6000);

server.listen(1591, function () {
  console.log("Server is listening on http://localhost:1591");
});
