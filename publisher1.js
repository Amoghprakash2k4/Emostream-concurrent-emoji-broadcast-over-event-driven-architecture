#!/usr/bin/env node
const { Kafka } = require('kafkajs');

// kafka publisher1
const kafka = new Kafka({
    clientId: 'cluster1-publisher',
    brokers: ['localhost:9092'],
});

async function publishMessageFromKafka() {
    const consumer = kafka.consumer({
        groupId: 'cluster1-group',
        allowAutoTopicCreation: false,
    });
    await consumer.connect();
    await consumer.subscribe({ topic: 'cluster1-topic', fromBeginning: false });

    let messageCount = 0;

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            messageCount++;
            const content = message.value.toString();
            console.log(`Cluster 1 received message: ${content} from partition ${partition}, offset ${message.offset}`);
        },
    });

    setInterval(() => {
        console.log(`Cluster 1 received ${messageCount} messages in the last batch`);
        messageCount = 0; // Reset the counter after each interval
    }, 500); // Log the count every half a second
}

publishMessageFromKafka().catch(console.error);

