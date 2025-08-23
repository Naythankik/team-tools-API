const Channel = require("../models/Channel");
const DirectMessage = require("../models/DirectMessage");
const Chat = require("../models/Chat");

const ChatResource = require("../resources/chatResource");
const ChannelResource = require("../resources/channelResource");
const DirectMessageResource = require("../resources/directMessageResource");

class WorkspaceService {
    dashboard = async (userId, workspaceId) => {
        try{
            const [channels, DMs] = await Promise.all([
                Channel.find({
                    workspace: workspaceId,
                    $or: [
                        { createdBy: userId },
                        { members: userId }
                    ]
                }).select('_id channelType name slug')
                    .sort('username').lean(),

                DirectMessage.find({participants: userId, workspace: workspaceId})
                    .select('_id participants').populate('participants', 'firstName lastName avatar status')
                    .lean()
            ]);

            return {
                message: 'Dashboard fetched successfully',
                data: {
                    channels: ChannelResource(channels),
                    DMs: DirectMessageResource(DMs)
                }
            }
        }catch (e){
            console.log(e)
            return { error: 'Internal server error' };
        }
    }

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

module.exports = new WorkspaceService()
