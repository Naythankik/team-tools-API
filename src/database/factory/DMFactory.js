const Workspace = require("../../models/Workspace");
const { faker } = require("@faker-js/faker");

async function randomWorkspaceId() {
    const result = await Workspace.aggregate([
        { $sample: { size: 1 } },
        { $project: { _id: 1, members: 1 } },
    ]);
    return result[0];
}

const DMFactory = async (count) => {
    const document = [];
    const workspace = await randomWorkspaceId();

    for (let i = 0; i < count; i++) {
        const participantA = faker.helpers.arrayElement(workspace.members);

        const remaining = workspace.members.filter(
            (m) => String(m) !== String(participantA)
        );

        const participantB = faker.helpers.arrayElement(remaining);

        const participants = [participantA, participantB].sort();

        document.push({
            workspace: workspace._id,
            participants,
        });
    }

    return document;
};

module.exports = DMFactory;
