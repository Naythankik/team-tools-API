const UserResource = require('./userResource');

const formatWorkspace = (workspace) => {
    if (!workspace) return null;

    return {
        id: workspace._id,
        name: workspace.name,
        slug: workspace.slug,
        description: workspace.description,
        createdBy: UserResource(workspace.owner),
        members: UserResource(workspace.members),
        isArchived: workspace.isArchived,
        createdAt: workspace.createdAt,
        updatedAt: workspace.updatedAt,
        coverImage: workspace.coverImage
    };
};

const formatWorkspaceList = (workspaces) => {
    return Array.isArray(workspaces) ? workspaces.map(formatWorkspace) : formatWorkspace(workspaces);
};

module.exports = formatWorkspaceList;
