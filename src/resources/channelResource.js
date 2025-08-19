const UserResource = require('./userResource');

const formatChannel = (channel) => {
    if (!channel) return null;

    return {
        id: channel._id,
        workspace: channel.workspace,
        name: channel.name,
        slug: channel.slug,
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

const formatChannelList = (channels = []) => {
    return Array.isArray(channels) ? channels.map(formatChannel) : formatChannel(channels);
};

module.exports = formatChannelList;
