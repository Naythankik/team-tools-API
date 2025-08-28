const UserResource = require('./userResource');
const MessageResource = require('./messageResource');

const formatChat = (chat) => {
    if (!chat) return null;

    return {
        id: chat._id,
        workspace: chat.workspace,
        channel: chat.channel,
        type: chat.type,
        participants: UserResource(chat.participants),
        messages: MessageResource(chat.messages),
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
    };
};

const formatChatList = (chats = []) => {
    return Array.isArray(chats) ? chats.map(formatChat) : formatChat(chats);
};

module.exports = formatChatList;
