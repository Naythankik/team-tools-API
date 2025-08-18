const ChatFactory = require('../factory/ChatFactory');
const Chat = require('../../models/Chat');

const ChatSeeder = {
    run: async (count) => {
        const chat = await ChatFactory(count);

        await Chat.insertMany(chat);
    }
}

module.exports = ChatSeeder;
