// pubnubService.js
const PubNub = require('pubnub');

const pubnub = new PubNub({
    publishKey: 'pub-c-3630818d-ef34-4556-b812-5be90222c863',
    subscribeKey: 'sub-c-e5ec60c7-481c-4840-89d8-d072f1ee178e',
    userId: 'sec-c-MjFiMzMzZDctMzZiOC00NTljLTg4ZGYtZjAzYjkxNDY0NDVl' // 
});

const publishMessage = (channel, message) => {
    pubnub.publish({
        channel: channel,
        message: message
    }, (status, response) => {
        if (status.error) {
            console.log('Publish failed: ', status);
        } else {
            console.log('Message published with timetoken', response.timetoken);
        }
    });
};

const subscribeToChannel = (channel) => {
    pubnub.subscribe({
        channels: [channel]
    });

    pubnub.addListener({
        message: function(event) {
            console.log('Message received: ', event.message);
        }
    });
};

module.exports = {
    publishMessage,
    subscribeToChannel
};
