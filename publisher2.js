#!/usr/bin/env node
const { Kafka } = require('kafkajs');

// kafka publisher2
const kafka = new Kafka({
    clientId: 'cluster2-publisher',
    brokers: ['localhost:9092'],
});

async function publishMessageFromKafka() {
    const consumer = kafka.consumer({
        groupId: 'cluster2-group',
        allowAutoTopicCreation: false,
    });
    await consumer.connect();
    await consumer.subscribe({ topic: 'cluster2-topic', fromBeginning: false });

    let messageCount = 0;

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            messageCount++;
            const content = message.value.toString();
            console.log(`Cluster 2 received message: ${content} from partition ${partition}, offset ${message.offset}`);
        },
    });

    setInterval(() => {
        console.log(`Cluster 2 received ${messageCount} messages in the last batch`);
        messageCount = 0; // Reset the counter after each interval
    }, 500); // Log the count every half a second
}

publishMessageFromKafka().catch(console.error);

