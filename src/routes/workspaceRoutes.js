const { Router} = require('express');
const router = Router();
const WorkspaceController = require('../controllers/workspaceController');
const { verifyWorkspaceMembership } = require("../middlewares/WorkspaceMiddleware");
const channelRoutes = require("./channelRoutes");
const chatRoutes = require("./chatsRoutes");

const controller = new WorkspaceController();

router.get('/:workspace', verifyWorkspaceMembership, controller.dashboard);

// Route middlewares
router.use('/:workspace/channels', verifyWorkspaceMembership, channelRoutes);
router.use('/:workspace/chats', verifyWorkspaceMembership, chatRoutes);

module.exports = router;
