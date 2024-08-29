const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const app = express();
const { formatDate } = require("./utils.js");
const port = process.env.PORT || 3000;
const broadCastTime = process.env.BROADCAST_TIME || 10000;
// MongoDB connection
const client = new MongoClient(process.env.MONGODB, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
var collection, realtimeCollection;

client.connect().then(() => {
  const database = client.db("stockdb");
  collection = database.collection("stockData");
  realtimeCollection = database.collection("realtimeStockData");
});

app.use(express.json());

app.get("/stocks/realtime", async (req, res) => {
  try {
    const realTimeData = await realtimeCollection
      .find()
      .sort({ date: -1 })
      .toArray();
    res.json(realTimeData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch real-time stock data" });
  }
});


app.get("/stocks/history", async (req, res) => {
  const { startDate, endDate, ticker } = req.query;

  try {
    const start = formatDate(startDate);
    const end = formatDate(endDate);

    if (isNaN(Date.parse(start)) || isNaN(Date.parse(end))) {
      return res.status(400).json({ error: "Invalid date format, format date must in YYYY-MM-DD" });
    }

    if (new Date(start) > new Date(end)) {
      return res.status(400).json({ error: "startDate must be before endDate" });
    }

    const query = {
      date: { $gte: start, $lte: end },
      ...(ticker && { ticker }),
    };

    const historicalData = await collection.find(query).toArray();
    res.json(historicalData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch historical stock data" });
  }
});

app.post("/stocks", async (req, res) => {
  try {
    const newStockData = req.body;
    const result = await collection.insertOne(newStockData);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to create stock data" });
  }
});

app.put("/stocks/:id", async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const result = await collection.updateOne(
      { _id: id },
      { $set: updatedData }
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to update stock data" });
  }
});

app.delete("/stocks/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await collection.deleteOne({ _id: id });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete stock data" });
  }
});

// WebSocket Setup
const server = http.createServer(app);
const wss = new WebSocket.Server({
  verifyClient: async (info, done) => {
    if (info.req.headers["x-account"] != "StockTraders") {
      return done(false, 401, "Unauthorized");
    }
    done(info.req);
  },
  server,
});

wss.on("connection", (ws) => {
  console.log("New client connected");

  const broadcastStockData = async () => {
    const realTimeData = await realtimeCollection.find().sort({ date: -1 }).toArray();
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(realTimeData));
      }
    });
  };

  setInterval(broadcastStockData, broadCastTime);

  ws.on("close", () => {
    console.log("Client disconnected");
  });
  ws.on("message", (message) => {
    try {
      const { startDate, endDate, ticker } = JSON.parse(message);
      const start = formatDate(startDate);
      const end = formatDate(endDate);

      if (isNaN(Date.parse(start)) || isNaN(Date.parse(end))) {
        return ws.send({ error: "Invalid date format, format date must in YYYY-MM-DD" });
      }
  
      if (new Date(start) > new Date(end)) {
        return ws.send({ error: "startDate must be before endDate" });
      }
      // Construct the query object
      const query = {
        date: { $gte: start, $lte: end }, // Use the datetime field for comparison
        ...(ticker && { ticker }), // Include ticker in the query if provided
      };

      collection
        .find(query)
        .toArray()
        .then((historicalData) => {
          ws.send(JSON.stringify(historicalData));
        });
    } catch (error) {
      ws.send(
        JSON.stringify({ error: "Failed to fetch historical stock data" })
      );
    }
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
