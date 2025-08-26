const Channel = require("../models/Channel");
const Chat = require("../models/Chat");

const ChatResource = require("../resources/chatResource");
const ChannelResource = require("../resources/channelResource");

class ChannelService {
    readChannel = async (userId, workspace, channelId, limit = 50) => {
        try {
            const [channel, chats] = await Promise.all([
                Channel.findOne({ _id: channelId })
                    .select('-workspace')
                    .populate('members', 'firstName lastName username avatar status')
                    .populate('createdBy', 'firstName lastName username avatar'),

                Chat.find({ channel: channelId, workspace })
                    .sort({ createdAt: -1 })
                    .limit(limit)
                    .populate('sender', 'firstName lastName avatar')
                    .populate('reactions.user', 'firstName lastName username avatar')
                    .lean()
            ]);

            if (!channel) {
                return { error: "No channel found for this user" };
            }

            return {
                message: "",
                data: {
                    channel: ChannelResource(channel),
                    chats: ChatResource(chats),
                },
            };
        } catch (err) {
            console.error(err);
            return { error: "Internal server error" };
        }
    };
}

module.exports = ChannelService
