const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const { MongoClient } = require("mongodb"); // Import MongoClient from mongodb

const uri =
  "mongodb+srv://marufcdda:lcaL52eXMydKnVcQ@cluster0.jnpt1on.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: "1", // Assuming ServerApiVersion is a string
    strict: true,
    deprecationErrors: true,
  },
});

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", function connection(ws) {
  console.log("Client connected");

  ws.on("message", async function incoming(message) {
    try {
      const db = client.db("emoto_bazar");
      const collection = db.collection("cart");

      // Assuming message is the data you receive from the client
      const data = JSON.parse(message); // Parse the incoming message
      const result = await collection.insertOne(data); // Insert the data into the collection

      // After inserting the data, immediately send the current data of the collection to the client
      const allData = await collection.find({}).toArray();
      ws.send(JSON.stringify(allData));

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

// Function to send a notification to all connected clients
function sendNotification() {
  console.log("Sending notification");
  if (wss.clients.size > 0) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        const data = {
          action: {
            deleteCookie: ["maruf"],
          },
          notifications: [
            {
              id: "1",
              type: "message",
              content: "You Created a new project.",
              timestamp: "2024-03-10T12:00:00Z",
              seen: false,
            },
            {
              id: "2",
              type: "alert",
              content: "Your subscription...",
              timestamp: "2024-03-09T15:30:00Z",
              seen: true,
            },
            {
              id: "5",
              type: "message",
              content: "You have a new message..",
              timestamp: "2024-03-08T09:00:00Z",
              seen: false,
            },
            {
              id: "6",
              type: "alert",
              content: "Your subscription is expiring soon.",
              timestamp: "2024-03-07T11:45:00Z",
              seen: false,
            },
            {
              id: "7",
              type: "message",
              content: "You have a new message..",
              timestamp: "2024-03-06T14:00:00Z",
              seen: true,
            },
          ],
          cart: [
            {
              id: "1",
              name: "Product 1",
              price: 100,
              quantity: 2,
            },
            {
              id: "2",
              name: "Product 2",
              price: 200,
              quantity: 1,
            },
            {
              id: "3",
              name: "Product 3",
              price: 300,
              quantity: 1,
            },
          ],
        };
        client.send(JSON.stringify(data));
      }
    });
  }
}

// Send notification every 10 seconds
setInterval(sendNotification, 60000);

server.listen(1591, function () {
  console.log("Server is listening on http://localhost:1591");
});
