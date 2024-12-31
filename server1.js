#!/usr/bin/env node
const express = require('express');
const { Kafka, logLevel } = require('kafkajs');
const app = express();
const PORT = 3000;

app.use(express.json());

// this below is the Kafka setup
const kafka = new Kafka({
    clientId: 'emoji-service',
    brokers: ['localhost:9092'],
    logLevel: logLevel.WARN,
});
 // this one is to Track the cluster index for round-robin distribution
const producer = kafka.producer();
let messageBuffer = { cluster1: [], cluster2: [], cluster3: [] };
let clusterIndex = 0;

// kafka producer initialization
async function initKafkaProducer() {
    try {
        await producer.connect();
        console.log('Kafka producer connected');
    } catch (error) {
        console.error('Error connecting Kafka producer:', error);
    }
}

initKafkaProducer();

// one below is API endpoint to receive emoji data
app.post('/emoji', (req, res) => {
    const { user_id, emoji_type, timestamp } = req.body;

    // Round-robin cluster topic selection
    const clusterTopic = `cluster${(clusterIndex % 3) + 1}`;  // cluster1, cluster2, cluster3
    clusterIndex = (clusterIndex + 1) % 3;

    // Adding message to respective cluster buffer
    messageBuffer[clusterTopic].push({
        value: JSON.stringify({ user_id, emoji_type, timestamp }),
    });

    console.log(`Buffered emoji data from ${user_id}: ${emoji_type} at ${timestamp} for ${clusterTopic}`);
    res.status(200).json({ message: `Emoji received and buffered for ${clusterTopic}` });
});

// Function to flush buffered messages to Kafka every 500 milliseconds
setInterval(async () => {
    try {
        const clusterMessages = Object.keys(messageBuffer).map(cluster => {
            return {
                topic: `${cluster}-topic`, // Corresponding Kafka topic is taken
                messages: messageBuffer[cluster].splice(0), // Flush all messages in the buffer
            };
        }).filter(group => group.messages.length > 0);  // Only include non-empty topics

        if (clusterMessages.length > 0) {
            // Send messages to the respective publishers
            const result = await producer.sendBatch({ topicMessages: clusterMessages });
            console.log(`Sent ${result.length} batches to Kafka`);

            // Logging the number of batches sent to each publisher to check if sent and recieved are the same
            clusterMessages.forEach(group => {
                console.log(`${group.topic} sent ${group.messages.length} messages`);
            });
        }

        // Resetting the buffer after sending
        messageBuffer = { cluster1: [], cluster2: [], cluster3: [] };

    } catch (error) {
        console.error('Error sending batch to Kafka:', error);
    }
}, 500);

// Listen for termination signals to clean up resources. This one is for cleaning up the buffer resources
process.on('SIGINT', async () => {
    console.log('Server shutting down, clearing buffer and disconnecting producer...');
    messageBuffer = { cluster1: [], cluster2: [], cluster3: [] }; // Clear buffer
    await producer.disconnect(); // Disconnect the Kafka producer
    process.exit(0);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

