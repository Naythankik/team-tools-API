const DMFactory = require('../factory/DMFactory');
const ConversationFactory = require('../factory/ConversationFactory');

const Conversation = require('../../models/Conversation');
const DM = require('../../models/DirectMessage');

const DirectMessageSeeder = {
    run: async (count) => {
        const dmDocs = await DMFactory(count);
        const createdDMs = await DM.insertMany(dmDocs);

        const conversationDocs = await ConversationFactory(count * 10);
        await Conversation.insertMany(conversationDocs);

        for (const dm of createdDMs) {
            const lastConvo = await Conversation
                .findOne({ directMessage: dm._id })
                .sort({ createdAt: -1 });

            if (lastConvo) {
                await DM.findByIdAndUpdate(dm._id, {
                    lastMessage: {
                        text: lastConvo.text || lastConvo.mediaUrl,
                        at: lastConvo.createdAt,
                        sender: lastConvo.sender,
                    },
                });
            }
        }
    }
};

module.exports = DirectMessageSeeder;
