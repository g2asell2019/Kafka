const { kafka } = require("./client");

async function init() {
  const admin = kafka.admin();
  console.log("Admin Connecting....");
  admin.connect();
  console.log("Admin Connect success..");

  console.log("creating topics ...[]")
  await admin.createTopics({
    topics: [{ topic: "driver-updates", numPartitions: 2 }],
  });
  console.log("Topic Creation Successful..[driver-updates] ");

  console.log("Disconnecting Admin..");
  await admin.disconnect();
}

init();
