const {errorResponse, successResponse} = require("../utils/responseHandler");
const ChatService = require("../services/chatService");

class ChatController {
    constructor(service = new ChatService()) {
        this.service = service;
    }

    readChat = async (req, res) => {
        const {user, workspace } = req;
        const { chat } = req.params;

        try{
            const result = await this.service.readChat(
                user.id,
                workspace.id,
                chat
            );

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
            console.log(e)
            return errorResponse(res, 'Something went wrong', 500)
        }
    }
}

module.exports = ChatController;
