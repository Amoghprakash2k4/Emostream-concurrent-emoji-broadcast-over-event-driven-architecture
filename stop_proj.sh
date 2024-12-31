#!/bin/bash

# Stop Kafka and Zookeeper services
echo "Stopping Kafka and Zookeeper services..."
sudo systemctl stop kafka
sudo systemctl stop zookeeper
echo "Zookeeper and Kafka services stopped."

# Kill all subscriber, producer, server, and client processes
echo "Killing all running components..."

# Kill subscribers
pkill -f subscriber_1_p1.js
pkill -f subscriber_2_p1.js
pkill -f subscriber_3_p1.js
pkill -f subscriber_4_p1.js
pkill -f subscriber_1_p2.js
pkill -f subscriber_2_p2.js
pkill -f subscriber_3_p2.js
pkill -f subscriber_4_p2.js
pkill -f subscriber_1_p3.js
pkill -f subscriber_2_p3.js
pkill -f subscriber_3_p3.js
pkill -f subscriber_4_p3.js

# Kill producers
pkill -f publisher1.js
pkill -f publisher2.js
pkill -f publisher3.js

# Kill the server
pkill -f server1.js

# Kill clients
pkill -f client1.js
pkill -f client2.js
pkill -f client3.js

echo "All components stopped successfully."

