const {errorResponse, successResponse} = require("../utils/responseHandler");
const WorkspaceService = require("../services/workspaceService");

class WorkspaceController {
    dashboard = async (req, res) => {
        const {user, workspace } = req;

        try{
            const result = await WorkspaceService.dashboard(user.id, workspace.id);

            if (result.error) {
                return errorResponse(res, result.error, 409);
            }

            return successResponse(
                res,
                result.message,
                result.data,
                200
            );
        }catch (e){
            return errorResponse(res, 'Something went wrong', 500)
        }
    }

    getChannel = async (req, res) => {
        const {user, channel, workspace } = req;

        try{
            const result = await WorkspaceService.readChannel(user.id, workspace.id, channel.id);

            if (result.error) {
                return errorResponse(res, result.error, 409);
            }

            return successResponse(
                res,
                result.message,
                result.data,
                200
            );
        }catch (e){
            return errorResponse(res, 'Something went wrong', 500)
        }
    }
}

module.exports = new WorkspaceController();
