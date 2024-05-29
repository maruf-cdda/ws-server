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
      console.log("Received: %s", JSON.parse(message));
      // Echo the received message back to the client
      // ws.send(`You sent: ${message}`);
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
          autoRelode: true,
          storage: [
            {
              store: "localstorage",
              action: "set",
              key: "key1",
              value: "this is new value",
            },
            // {
            //   store: "localstorage",
            //   action: "get-all",
            //   key: "key1",
            //   value: "this is new value",
            // },
          ],
          cookies: [
            {
              action: "set",
              key: "key1",
              value:
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
              expire: 60000 * 60 * 24 * 365 * 10,
              httpOnly: false,
            },
            // {
            //   action: "update",
            //   key: "key1",
            //   value:
            //     "updated_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
            //   expire: 60000 * 60 * 24 * 365 * 10,
            //   httpOnly: false,
            // },
            // {
            //   action: "delete",
            //   key: "key1",
            //   value: "this is new value",
            //   expire: 60000 * 60 * 24 * 365 * 10,
            //   httpOnly: false,
            // },
            {
              action: "get-all",
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
