const express = require('express');
const router = express.Router();
const WorkspaceController = require('../controllers/workspaceController');
const { verifyWorkspaceMembership } = require("../middlewares/WorkspaceMiddleware");
const {verifyChannelMembership} = require("../middlewares/ChannelMiddleware");


router.get('/:workspace', verifyWorkspaceMembership, WorkspaceController.dashboard);
router.get('/:workspace/channels/:channel', verifyWorkspaceMembership, verifyChannelMembership, WorkspaceController.getChannel)

module.exports = router;
