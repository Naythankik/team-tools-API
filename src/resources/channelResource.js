const UserResource = require('./userResource');

const formatChannel = (channel) => {
    if (!channel) return null;

    return {
        id: channel._id,
        workspace: channel.workspace,
        name: channel.name,
        description: channel.description,
        channelType: channel.channelType,
        members: UserResource(channel.members),
        createdBy: UserResource(channel.createdBy),
        isPrivate: channel.isDefault,
        isArchived: channel.isArchived,
        createdAt: channel.createdAt,
        updatedAt: channel.updatedAt,
    };
};

const formatChannelList = (channels = []) => channels.map(formatChannel);

module.exports = formatChannelList;
