#!/usr/bin/env node
const { Kafka } = require('kafkajs');
const emojiTypeToCount = 'angry'; // This subscriber listens only for 'angry' emojis
const topic = 'cluster2-topic';  // Cluster 1 topic

const kafka = new Kafka({
    clientId: 'emoji-subscriber',
    brokers: ['localhost:9092'],
});

const consumer = kafka.consumer({ groupId: `${topic}-group-${emojiTypeToCount}` });

let emojiCount = 0;

// count the occurrences of each emoji, here for 'angry'
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

