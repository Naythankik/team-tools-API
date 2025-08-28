const MessageFactory = require('../factory/MessageFactory');
const Message = require('../../models/Message');

const MessageSeeder = {
    run: async (count) => {
        const message = await MessageFactory(count);

        await Message.insertMany(message);
    }
}

module.exports = MessageSeeder;
