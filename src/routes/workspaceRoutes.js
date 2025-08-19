const express = require('express');
const router = express.Router();
const WorkspaceController = require('../controllers/workspaceController');
const {verifyMembership} = require("../middlewares/WorkspaceMiddleware");
//
// // GET /api/v1/workspaces
router.get('/:workspace', verifyMembership, WorkspaceController.dashboard);
//
// // GET /api/v1/workspaces/:id
// router.get('/:id', getWorkspace);
//
// // POST /api/v1/workspaces
// router.post('/', createWorkspace);
//
// // PATCH /api/v1/workspaces/:id
// router.patch('/:id', updateWorkspace);
//
// // DELETE /api/v1/workspaces/:id
// router.delete('/:id', deleteWorkspace);

module.exports = router;
