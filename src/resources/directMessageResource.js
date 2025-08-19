const UserResource = require('./userResource');

const formatDM = (dm) => {
    if (!dm) return null;

    return {
        id: dm._id,
        participants: UserResource(dm.participants),
        createdAt: dm.createdAt,
        updatedAt: dm.updatedAt,
    };
};

const formatDMList = (dms = []) => dms.map(formatDM);

module.exports = formatDMList;
