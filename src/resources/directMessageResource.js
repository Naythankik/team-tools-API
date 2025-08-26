const UserResource = require('./userResource');
const ConversationResource = require('./conversationResource');

const formatDM = (dm) => {
    if (!dm) return null;

    return {
        id: dm._id,
        participants: UserResource(dm.participants),
        lastMessage: dm.lastMessage,
        workspace: dm.workspace,
        createdAt: dm.createdAt,
        updatedAt: dm.updatedAt,
        conversation: ConversationResource(dm.conversation),
    };
};

const formatDMList = (dms = []) => {
    return Array.isArray(dms) ? dms.map(formatDM) : formatDM(dms);
};

module.exports = formatDMList;
