const { mongodbClient: client } = require("./client");
var crypto = require("crypto");

exports.insertMany = async function insertMany(stockData, collectionName = "stockData", overwrite = false) {
  try {
    await client.connect();
    const database = client.db("stockdb");
    const collection = database.collection(collectionName);

    await collection.insertMany(stockData, { ordered: false });
  } finally {
  }
};

exports.insert = async function insert(stockData, collectionName = "stockData", overwrite = false) {
  try {
    await client.connect();
    const database = client.db("stockdb");
    const collection = database.collection(collectionName);

    if (!stockData) {
      return;
    }
    const query = { ticker: stockData.ticker, date: stockData.date };
    const result = await collection.findOne(query, { sort: { _id: -1 } });

    if (!result) {
      delete result._id;
      var previousInserted = md5(JSON.stringify(result))
      var currentInsert = md5(JSON.stringify(stockData));
      if (previousInserted === currentInsert) {
        return;
      }
      await collection.insertOne(stockData, { ordered: false }); 
      return;
    }
    if (overwrite) {
      await collection.updateOne({ _id: result._id }, { $set: stockData }, { upsert: true });
      return;
    }

  } finally {
  }
};

function md5(data, digest = "hex") {
  return crypto.createHash("md5").update(data).digest(digest);
}
