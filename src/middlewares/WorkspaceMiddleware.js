const {errorResponse} = require("../utils/responseHandler");
const Workspace = require("../models/Workspace");

const verifyWorkspaceMembership = async (req, res, next) => {
    try{
        const workspace = req.params.workspace;

        if(!workspace){
            return errorResponse(res, 'Workspace is not specified', 400);
        }

        const verifyUser = await Workspace.findOne({
            slug: workspace,
            $or: [
                { members: req.user._id },
                { owner: req.user._id}
            ]
        });

        if(!verifyUser){
            return errorResponse(res, 'You are not a member of this workspace', 403);
        }

        req.workspace = { id: verifyUser._id}
        next()
    }catch (e){
        return errorResponse(res, 'Something went wrong', 500)
    }
}

module.exports = {
    verifyWorkspaceMembership
}
