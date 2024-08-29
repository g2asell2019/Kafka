const { Kafka } = require("kafkajs");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

exports.kafka = new Kafka({
  clientId: "kafka-app",
  connectionTimeout: 30000,
  requestTimeout: 65000,
  brokers: [process.env.BROKER_URL],
});

const uri = process.env.MONGODB;
exports.mongodbClient = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});