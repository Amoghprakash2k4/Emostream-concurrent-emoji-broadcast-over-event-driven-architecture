#!/bin/bash

# Start Kafka and Zookeeper services
echo "Starting Zookeeper and Kafka services..."
sudo systemctl start zookeeper
sudo systemctl start kafka
echo "Zookeeper and Kafka services started."

# Allow some time for Kafka and Zookeeper to initialize
sleep 10

# Open new terminals to start subscribers
gnome-terminal --tab --title="Subscriber 1" -- bash -c "echo 'Starting Subscriber 1...'; ./subscriber_1_p1.js; exec bash"
gnome-terminal --tab --title="Subscriber 2" -- bash -c "echo 'Starting Subscriber 2...'; ./subscriber_2_p1.js; exec bash"
gnome-terminal --tab --title="Subscriber 3" -- bash -c "echo 'Starting Subscriber 3...'; ./subscriber_3_p1.js; exec bash"
gnome-terminal --tab --title="Subscriber 4" -- bash -c "echo 'Starting Subscriber 4...'; ./subscriber_4_p1.js; exec bash"
gnome-terminal --tab --title="Subscriber 5" -- bash -c "echo 'Starting Subscriber 5...'; ./subscriber_1_p2.js; exec bash"
gnome-terminal --tab --title="Subscriber 6" -- bash -c "echo 'Starting Subscriber 6...'; ./subscriber_2_p2.js; exec bash"
gnome-terminal --tab --title="Subscriber 7" -- bash -c "echo 'Starting Subscriber 7...'; ./subscriber_3_p2.js; exec bash"
gnome-terminal --tab --title="Subscriber 8" -- bash -c "echo 'Starting Subscriber 8...'; ./subscriber_4_p2.js; exec bash"
gnome-terminal --tab --title="Subscriber 9" -- bash -c "echo 'Starting Subscriber 9...'; ./subscriber_1_p3.js; exec bash"
gnome-terminal --tab --title="Subscriber 10" -- bash -c "echo 'Starting Subscriber 10...'; ./subscriber_2_p3.js; exec bash"
gnome-terminal --tab --title="Subscriber 11" -- bash -c "echo 'Starting Subscriber 11...'; ./subscriber_3_p3.js; exec bash"
gnome-terminal --tab --title="Subscriber 12" -- bash -c "echo 'Starting Subscriber 12...'; ./subscriber_4_p3.js; exec bash"
# Add more subscribers if needed

# Allow some time for subscribers to initialize
sleep 2

# Open new terminals to start producers
gnome-terminal --tab --title="Producer 1" -- bash -c "echo 'Starting Producer 1...'; ./publisher1.js; exec bash"
gnome-terminal --tab --title="Producer 2" -- bash -c "echo 'Starting Producer 2...'; ./publisher2.js; exec bash"
gnome-terminal --tab --title="Producer 3" -- bash -c "echo 'Starting Producer 3...'; ./publisher3.js; exec bash"
# Add more producers if needed

# Allow some time for producers to initialize
sleep 2

# Open terminal to start the server
gnome-terminal --tab --title="Server1" -- bash -c "echo 'Starting Server...'; ./server1.js; exec bash"

# Open terminals to start clients
gnome-terminal --tab --title="Client 1" -- bash -c "echo 'Starting Client 1...'; ./client1.js; exec bash"
gnome-terminal --tab --title="Client 2" -- bash -c "echo 'Starting Client 2...'; ./client2.js; exec bash"
gnome-terminal --tab --title="Client 3" -- bash -c "echo 'Starting Client 3...'; ./client3.js; exec bash"

echo "All services and components started successfully."

