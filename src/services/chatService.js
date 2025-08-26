const DirectMessage = require("../models/DirectMessage");
const Conversation = require("../models/Conversation");

const directMessageResource = require("../resources/directMessageResource");

class ChatService {
    readChat = async (userId, workspace, chatId) => {
        try {
            const chats = await DirectMessage.findOne({
                _id: chatId,
                workspace,
                participants: userId
            })
                .select('-participants')
                .populate({
                    path: 'conversation',
                    select: '-_id',
                    populate: {
                        path: 'sender',
                        select: 'firstName lastName avatar',
                    }
                });

            if (!chats) {
                return { error: "No channel found for this user" };
            }

            return {
                message: "",
                data: {
                    chats: directMessageResource(chats),
                },
            };
        } catch (err) {
            console.error(err);
            return { error: "Internal server error" };
        }
    };
}

module.exports = ChatService
