const Chat = require("../models/Chat");
const ChatResource = require("../resources/chatResource");

class ChatService {
    readChat = async (userId, workspace, chatId, limit = 30) => {
        try {
            const chats = await Chat.findOne({
                _id: chatId,
                workspace,
                participants: userId
            })
                .populate('participants', 'id firstName status username lastName avatar')
                .populate({
                    path: 'messages',
                    select: 'chat media type content reactions sender isDeleted',
                    populate: {
                        path: 'sender',
                        select: 'firstName lastName username avatar status'
                    },
                    options: { sort: { createdAt: -1 }, limit }
                }).lean()

            if (!chats) {
                return { error: "No chats found for this user" };
            }

            return {
                message: "",
                data: {
                    chats: ChatResource(chats),
                },
            };
        } catch (err) {
            console.error(err);
            return { error: "Internal server error" };
        }
    };
}

module.exports = ChatService
