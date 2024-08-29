const { fetchStockData, processStockData } = require('./fetchData');
const { sendToKafka } = require('./producer');
const { insertMany, insert } = require('./saveDataDB');
const { kafka } = require("./client");
require("dotenv").config();

async function main() {
    const apiResponse = await fetchStockData();

    if (apiResponse) {
        const stockData = processStockData(apiResponse);

        await sendToKafka(stockData);
        //await insertMany(stockData);
    }
}

setInterval(() => {
  // consumer.connect().then(() => {});
  main().then(() => {
      console.log('Data processing completed!');
      //consumer.disconnect().then(() => {});

  }).catch(console.error);
}, 10000);

