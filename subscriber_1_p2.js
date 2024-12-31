#!/usr/bin/env node
const { Kafka } = require('kafkajs');
const emojiTypeToCount = 'happy'; // This subscriber listens only for 'happy' emojis
const topic = 'cluster2-topic';  // Cluster 1 topic

const kafka = new Kafka({
    clientId: 'emoji-subscriber',
    brokers: ['localhost:9092'],
});

const consumer = kafka.consumer({ groupId: `${topic}-group-${emojiTypeToCount}` });

let emojiCount = 0;

// count the occurances of each emoji, here for 'happy'
async function run() {
    await consumer.connect();
    
    await consumer.subscribe({ topic, fromBeginning: false });

    await consumer.run({
        eachMessage: async ({ message }) => {
            const data = JSON.parse(message.value.toString());

            if (data.emoji_type === emojiTypeToCount) {
                emojiCount++;
                console.log(`Count for ${emojiTypeToCount} in ${topic}: ${emojiCount}`);
            }
        },
    });
}

run().catch(console.error);

