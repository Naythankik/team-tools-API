const Channel = require("../models/Channel");
const Chat = require("../models/Chat");

const ChannelResource = require("../resources/channelResource");
const ChatResource = require("../resources/chatResource");

class WorkspaceService {
    dashboard = async (userId, workspaceId) => {
        try{
            const [channels, chats] = await Promise.all([
                Channel.find({
                    workspace: workspaceId,
                    $or: [
                        { createdBy: userId },
                        { members: userId }
                    ]
                }).select('_id channelType name slug')
                    .sort('username').lean(),

                Chat.find({
                    workspace: workspaceId,
                    type: { $in: ['one-to-one', 'group'] },
                    participants: userId
                }).select('_id type participants')
                    .populate({
                        path: 'participants',
                        match: {
                            _id: { $ne: userId }
                        },
                        select: 'firstName lastName avatar status',
                        justOne: true
                    })
                    .lean()
            ]);

            return {
                message: 'Dashboard fetched successfully',
                data: {
                    channels: ChannelResource(channels),
                    chats: ChatResource(chats)
                }
            }
        }catch (e){
            console.log(e)
            return { error: 'Internal server error' };
        }
    }
}

module.exports = new WorkspaceService()
