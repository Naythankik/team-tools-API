const Channel = require("../models/Channel");
const Chat = require("../models/Chat");
const Message = require("../models/Message");

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

                Chat.findOne({ channel: channelId, workspace })
                    .populate({
                        path: 'messages',
                        select: 'chat media type content reactions sender isDeleted',
                        populate: {
                            path: 'sender',
                            select: 'firstName lastName username avatar status'
                        },
                        options: { sort: { createdAt: -1 }, limit }
                    })
                    .lean()
            ]);

            if (!channel) {
                return { error: "No channel found for this user" };
            }

            chats.participants = channel.members;

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
