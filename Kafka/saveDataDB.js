const { mongodbClient: client } = require("./client");
var crypto = require("crypto");

exports.insertMany = async function insertMany(stockData) {
  try {
    await client.connect();
    const database = client.db("stockdb");
    const collection = database.collection("stockData");

    await collection.insertMany(stockData, { ordered: false });
  } finally {
  }
};

exports.insert = async function insert(stockData) {
  try {
    await client.connect();
    const database = client.db("stockdb");
    const collection = database.collection("stockData");

    if (!stockData) {
      return;
    }
    const query = { ticker: stockData.ticker, date: stockData.date };
    const result = await collection.findOne(query, { sort: { _id: -1 } });

    if (result) {
      delete result._id;
      
      var previousInserted = crypto
        .createHash("md5")
        .update(JSON.stringify(result))
        .digest("hex");
      var currentInsert = crypto
        .createHash("md5")
        .update(JSON.stringify(stockData))
        .digest("hex");
      
      if (previousInserted === currentInsert) {
        return;
      }
    }
    await collection.insertOne(stockData, { ordered: false });
  } finally {
  }
};
