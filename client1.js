#!/usr/bin/env node
const axios = require('axios');
const API_ENDPOINT = 'http://localhost:3000/emoji';

const emojis = ['happy','sad','angry','party-popper'];

function getrandemoji() {
    return emojis[Math.floor(Math.random()*emojis.length)];
}

function sendEmojiRequest(user_id){
    const payload={
        user_id:user_id,
        emoji_type:getrandemoji(),
        timestamp:new Date().toISOString(),
    };
    axios.post(API_ENDPOINT, payload)
        .then(response => console.log(`Client ${user_id} Status: ${response.status}`, response.data))
        .catch(error => console.error('Error:',error.message));
}
setInterval(() =>sendEmojiRequest('user1'),10);

