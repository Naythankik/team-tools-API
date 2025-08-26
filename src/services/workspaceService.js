const Channel = require("../models/Channel");
const DirectMessage = require("../models/DirectMessage");

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
}

module.exports = new WorkspaceService()
