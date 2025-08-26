const { Router} = require('express');
const ChatController = require("../controllers/chatController");

const router = Router({ mergeParams: true });
const controller = new ChatController();

router.get('/:chat', controller.readChat);

module.exports = router;
