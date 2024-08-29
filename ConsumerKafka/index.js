const { insertMany, insert } = require('./saveDataDB');
const { kafka } = require("./client");
require("dotenv").config();
const group = process.argv[2] || "group1";
console.log("Connecting to group: ", group);
const admin = kafka.admin();
// const consumer = kafka.consumer({ groupId: group });
// consumer.connect().then(() => {
//   consumer.subscribe({ topics: [process.env.TOPIC_NAME], fromBeginning: true }).then(() => {});
//   initConsumer().then(() => {
//     console.log('Consumer is running!');
//   }).catch(console.error); 
// });

async function initConsumer() {
  const consumer = kafka.consumer({ groupId: group, heartbeatInterval: 2000 });
  await consumer.connect();
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await consumer.subscribe({ topics: [process.env.TOPIC_NAME], fromBeginning: true });
  
  // var allTopics = await admin.listTopics()
  // console.log("All Topics", allTopics);

  await consumer.run({
    // eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
    //   insert(JSON.parse(message.value.toString()));
    // },
    eachBatch: async ({ batch, resolveOffset, heartbeat, isRunning, isStale }) => {
      for (let message of batch.messages) {
        let json = JSON.parse(message.value.toString());
        await insert(json);
        await insert(json, "realtimeStockData", true);
        
        await heartbeat();
      }
      // commit
      await resolveOffset(batch.highWatermark);

      let currentOffset = parseInt(batch.messages[batch.messages.length - 1].offset);
      let highWatermark = parseInt(batch.highWatermark) - 1;
      if (currentOffset === highWatermark) {
        //await consumer.disconnect();
        //console.log(`Consumer is disconnected!, Distance offset ${highWatermark - currentOffset}`);
      }
    }
  });
}
 


initConsumer().then(() => {
  console.log('Consumer is running!');
}).catch(console.error); 
setInterval(() => {
  
}, 10000);