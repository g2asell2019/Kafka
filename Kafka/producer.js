const { kafka } = require("./client");
const producer = kafka.producer();

exports.sendToKafka = async function sendToKafka(stockData) {
    
    await producer.connect();
    const admin = kafka.admin();
    try {
        var allTopics = await admin.listTopics()
        if(allTopics.indexOf('stock-data') === -1){
            await admin.createTopics({
                topics: [{ topic: "stock-data", numPartitions: 2 }],
            });
        }
    } catch (error) {
        await admin.createTopics({
            topics: [{ topic: "stock-data", numPartitions: 2 }],
        });
    }
    
   
    await producer.send({
        topic: 'stock-data',
        messages: stockData.map(data => ({
            value: JSON.stringify(data)
        }))
    });

    await producer.disconnect();
}
