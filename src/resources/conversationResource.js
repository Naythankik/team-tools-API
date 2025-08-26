const UserResource = require('./userResource');

const formatConversation = (chat) => {
    if (!chat) return null;

    return {
        id: chat._id,
        sender: UserResource(chat.sender),
        text: chat.text,
        mediaType: chat.mediaType,
        mediaUrl: chat.mediaUrl,
        type: chat.type,
        readBy: chat.readBy,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
    };
};

const formatConversationList = (conversations = []) => {
    return Array.isArray(conversations) ? conversations.map(formatConversation) : formatConversation(conversations);
};

module.exports = formatConversationList;
