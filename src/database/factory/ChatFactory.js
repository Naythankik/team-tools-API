const { faker } = require('@faker-js/faker');
const Channel = require('../../models/Channel');
const Workspace = require("../../models/Workspace");

async function randomId(model, match = {}) {
    const result = await model.aggregate([
        { $match: match },
        { $sample: { size: 1 } },
        { $project: { _id: 1 } },
    ]);
    return result[0]?._id;
}

async function randomWorkspaceId() {
    const result = await Workspace.aggregate([
        { $sample: { size: 1 } },
        { $project: { _id: 1, members: 1 } },
    ]);
    return result[0];
}

const ChatFactory = async (count) => {
    const document = [];

    for (let i = 0; i < count; i++) {
        const workspace = await randomWorkspaceId();
        let channel = await randomId(Channel, { workspace: workspace._id });

        if (!channel) {
            const createdBy = faker.helpers.arrayElement(workspace.members);
            const remainingMembers = workspace.members.filter(
                (m) => String(m) !== String(createdBy)
            );

            const shuffled = faker.helpers.shuffle(remainingMembers);
            const numberToTake = faker.number.int({
                min: 2,
                max: shuffled.length,
            });
            const members = shuffled.slice(0, numberToTake);

            const newChannel = await Channel.create({
                workspace: workspace._id,
                description: faker.lorem.words({ min: 10, max: 25 }),
                name: 'general',
                channelType: 'public',
                createdBy,
                members,
                isDefault: faker.helpers.arrayElement([true, false]),
                isArchived: faker.helpers.arrayElement([true, false]),
            });

            channel = newChannel._id;
        }

        // ----- reactions (use only workspace members) -----
        const reactions = [];
        const numberOfReactions = faker.number.int({ min: 1, max: 3 });
        for (let r = 0; r < numberOfReactions; r++) {
            reactions.push({
                user: faker.helpers.arrayElement(workspace.members), // << changed
                emoji: faker.internet.emoji(),
            });
        }

        // ----- attachments -----
        const attachments = [];
        const hasAttachments = faker.datatype.boolean({ probability: 0.7 });
        if (hasAttachments) {
            const numberOfAttachments = faker.number.int({ min: 1, max: 3 });
            for (let a = 0; a < numberOfAttachments; a++) {
                attachments.push({
                    url: faker.internet.url(),
                    type: faker.helpers.arrayElement(['image', 'video', 'audio', 'file']),
                });
            }
        }

        document.push({
            workspace: workspace._id,
            channel,
            sender: faker.helpers.arrayElement(workspace.members),
            content: faker.lorem.words({ min: 10, max: 25 }),
            attachments,
            reactions,
            isDeleted: faker.helpers.arrayElement([true, false]),
        });
    }

    return document;
};

module.exports = ChatFactory;
