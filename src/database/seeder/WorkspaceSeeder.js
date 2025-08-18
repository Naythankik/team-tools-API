const WorkspaceFactory = require('../factory/WorkspaceFactory');
const Workspace = require('../../models/Workspace');

const WorkspaceSeeder = {
    run: async (count) => {
        const workspace = await WorkspaceFactory(count);

        await Workspace.insertMany(workspace);
    }
}

module.exports = WorkspaceSeeder;
