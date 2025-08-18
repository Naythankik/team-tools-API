const { faker } = require('@faker-js/faker');
const User = require('../../models/User');
const Workspace = require('../../models/Workspace'); // <-- important

async function randomId(model, match = {}) {
    const result = await model.aggregate([
        { $match: match },
        { $sample: { size: 1 } },
        { $project: { _id: 1 } },
    ]);
    return result[0]?._id;
}

const ChannelFactory = async (count) => {
    const document = [];

    for (let i = 0; i < count; i++) {
        const createdBy = await randomId(User);

        const members = [createdBy];

        const numberOfExtraMembers = faker.number.int({ min: 5, max: 15 });

        for (let x = 0; x < numberOfExtraMembers; x++) {
            const memberId = await randomId(User);
            if (memberId && !members.includes(memberId)) {
                members.push(memberId);
            }
        }

        document.push({
            workspace: await randomId(Workspace),
            name: faker.company.catchPhraseNoun().toLowerCase(),
            description: faker.lorem.words({ min: 10, max: 25 }),
            channelType: faker.helpers.arrayElement(['public', 'private']),
            members,
            createdBy,
            isDefault: faker.helpers.arrayElement([true, false]),
            isArchived: faker.helpers.arrayElement([true, false]),
        });
    }

    return document;
};

module.exports = ChannelFactory;
