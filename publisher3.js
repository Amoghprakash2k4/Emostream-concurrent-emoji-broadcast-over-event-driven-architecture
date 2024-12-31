#!/usr/bin/env node
const { Kafka } = require('kafkajs');

// kafka publisher3
const kafka = new Kafka({
    clientId: 'cluster3-publisher',
    brokers: ['localhost:9092'],
});

async function publishMessageFromKafka() {
    const consumer = kafka.consumer({
        groupId: 'cluster3-group',
        allowAutoTopicCreation: false,
    });
    await consumer.connect();
    await consumer.subscribe({ topic: 'cluster3-topic', fromBeginning: false });

    let messageCount = 0;

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            messageCount++;
            const content = message.value.toString();
            console.log(`Cluster 3 received message: ${content} from partition ${partition}, offset ${message.offset}`);
        },
    });

    setInterval(() => {
        console.log(`Cluster 3 received ${messageCount} messages in the last batch`);
        messageCount = 0; // Reset the counter after each interval
    }, 500); // Log the count every half a second
}

publishMessageFromKafka().catch(console.error);

