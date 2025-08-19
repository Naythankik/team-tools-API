const UserResource = require('./userResource');

const formatChat = (chat) => {
    if (!chat) return null;

    return {
        id: chat._id,
        workspace: chat.workspace,
        channel: chat.channel,
        attachments: chat.attachments,
        content: chat.content,
        reactions: chat?.reactions.map(user => ({user: UserResource(user), ...user})),
        sender: UserResource(chat.sender),
        isDeleted: chat.isDeleted,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
    };
};

const formatChatList = (chats = []) => {
    return Array.isArray(chats) ? chats.map(formatChat) : formatChat(chats);
};

module.exports = formatChatList;
