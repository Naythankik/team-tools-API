const UserResource = require('./userResource');
const ChatResource = require('./chatResource');

const formatMessage = (message) => {
    if (!message) return null;

    return {
        id: message._id,
        // chat: ChatResource(message.chat),
        sender: UserResource(message.sender),
        type: message.type,
        content: message.content,
        media: message.media,
        readBy: UserResource(message.readBy),
        reactions: message?.reactions?.map(user => ({user: UserResource(user), ...user})),
        isDeleted: message.isDeleted,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
    };
};

const formatMessageList = (conversations = []) => {
    return Array.isArray(conversations) ? conversations.map(formatMessage) : formatMessage(conversations);
};

module.exports = formatMessageList;
