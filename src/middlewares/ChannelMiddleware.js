const { errorResponse } = require("../utils/responseHandler");
const Channel = require("../models/Channel");

const verifyChannelMembership = async (req, res, next) => {
    try {
        const channelSlug = req.params.channel;

        if (!channelSlug) {
            return errorResponse(res, "Channel is not specified", 400);
        }

        const channel = await Channel.findOne({
            slug: channelSlug,
            workspace: req.workspace.id,
            $or: [
                { members: req.user.id },
                { createdBy: req.user._id },
            ],
        });

        if (!channel) {
            return errorResponse(res, "You are not a member of this channel", 403);
        }

        req.channel = { id: channel._id };
        next();
    } catch (e) {
        return errorResponse(res, "Something went wrong", 500);
    }
};

module.exports = { verifyChannelMembership };
