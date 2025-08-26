const { Router} = require('express');
const ChannelController = require('../controllers/channelController');
const { verifyChannelMembership } = require("../middlewares/ChannelMiddleware");

const router = Router({ mergeParams: true });
const controller = new ChannelController();

router.get('/:channel', verifyChannelMembership, controller.getChannel);

module.exports = router;
