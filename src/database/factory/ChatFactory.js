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
        const type = faker.helpers.arrayElement(['one-to-one', 'group', 'channel']);
        let channel = await randomId(Channel, { workspace: workspace._id });

        // Create a channel if none exists in this workspace
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

        // Base chat object
        const chatDoc = {
            workspace: workspace._id,
            channel: type === 'channel' ? channel : undefined,
            type,
            createdAt: faker.date.recent(),
        };

        // Add participants only if not a channel
        if (type === 'one-to-one') {
            chatDoc.participants = faker.helpers.arrayElements(workspace.members, 2);
        } else if (type === 'group') {
            const groupSize = faker.number.int({
                min: 3,
                max: Math.min(8, workspace.members.length),
            });
            chatDoc.participants = faker.helpers.arrayElements(workspace.members, groupSize);
        }else{
            chatDoc.participants = undefined
        }

        document.push(chatDoc);
    }

    return document;
};

module.exports = ChatFactory;
