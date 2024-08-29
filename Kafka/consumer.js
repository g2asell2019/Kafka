const { kafka } = require("./client");

const group = process.argv[2];

const admin = kafka.admin();

async function init() {
  const consumer = kafka.consumer({ groupId: group });
  await consumer.connect();
  var allTopics = await admin.listTopics()
  console.log("All Topics", allTopics);
  await consumer.subscribe({ topics: ["driver-updates"], fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
      console.log(
        `${group}--> [${topic}]: Part:${partition}: ${message.value.toString()}  `
      );
    },
  });
}
init();
