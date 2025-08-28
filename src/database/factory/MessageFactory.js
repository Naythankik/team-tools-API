const { faker } = require('@faker-js/faker');
const Chat = require('../../models/Chat');
const Channel = require('../../models/Channel');

const MessageFactory = async (count) => {
    const document = [];

    for (let i = 0; i < count; i++) {
        let chat = await Chat.findOne()
            .skip(Math.floor(Math.random() * await Chat.countDocuments()))
            .populate('channel', 'members')
            .lean();

        let participants = chat.participants;

        // if no participants (channel chat), use channel.members instead
        if ((!participants || participants.length === 0) && chat.channel && chat.channel.members) {
            participants = chat.channel.members;
        }

        // if still no participants (fallback), skip to avoid error
        if (!participants || participants.length === 0) continue;

        const type = faker.helpers.arrayElement(['text', 'image', 'file', 'video']);
        const sender = faker.helpers.arrayElement(participants);

        const message = {
            chat: chat._id,
            sender,
            type,
            readBy: [sender],
            createdAt: faker.date.recent(),
        };

        // ----- conditional content -----
        if (type === 'text') {
            message.content = faker.lorem.sentence();
        } else {
            const name = faker.system.fileName();

            message.media = {
                url: faker.internet.url(),
                type: name.split('.').pop(),
                tmpName: name, // e.g., "upload_1234.png"
                size: faker.number.int({ min: 1000, max: 5000000 }) // bytes: ~1KB – 5MB
            };
        }

        // ----- reactions -----
        const numberOfReactions = faker.number.int({ min: 1, max: 3 });
        const reactedUsers = faker.helpers.arrayElements(participants, numberOfReactions);

        message.reactions = reactedUsers.map((user) => ({
            user,
            emoji: faker.internet.emoji(),
        }));

        document.push(message);
    }

    return document;
};

module.exports = MessageFactory;
