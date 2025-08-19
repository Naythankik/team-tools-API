const { faker } = require('@faker-js/faker');
const Workspace = require('../../models/Workspace');
const slugify = require("slugify");

async function randomWorkspaceId() {
    const result = await Workspace.aggregate([
        { $sample: { size: 1 } },
        { $project: { _id: 1, members: 1 } },
    ]);
    return result[0];
}

const ChannelFactory = async (count) => {
    const document = [];

    for (let i = 0; i < count; i++) {
        const workspace = await randomWorkspaceId();

        const createdBy = faker.helpers.arrayElement(workspace.members);

        const remainingMembers = workspace.members.filter(
            (m) => String(m) !== String(createdBy)
        );

        const numberToTake = faker.number.int({
            min: 2,
            max: remainingMembers.length,
        });
        const members = remainingMembers.slice(0, numberToTake);

        const name = faker.company.catchPhraseNoun().toLowerCase()
        document.push({
            workspace: workspace._id,
            name,
            slug: slugify(name),
            description: faker.lorem.words({ min: 10, max: 25 }),
            channelType: faker.helpers.arrayElement(['public', 'private']),
            createdBy,
            members,
            isDefault: faker.helpers.arrayElement([true, false]),
            isArchived: faker.helpers.arrayElement([true, false]),
        });
    }

    return document;
};

module.exports = ChannelFactory;
