const { faker } = require('@faker-js/faker');
const User = require('../../models/User');
const Channel = require('../../models/Channel');

async function randomId(model, match = {}) {
    const result = await model.aggregate([
        { $match: match },
        { $sample: { size: 1 } },
        { $project: { _id: 1 } },
    ]);
    return result[0]?._id;
}

const ChatFactory = async (count) => {
    const document = [];

    for (let i = 0; i < count; i++) {
        const reactions = [];
        const numberOfReactions = faker.number.int({ min: 1, max: 3 });
        for (let r = 0; r < numberOfReactions; r++) {
            reactions.push({
                user: await randomId(User),
                emoji: faker.internet.emoji(),
            });
        }

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
            sender: await randomId(User),
            channel: await randomId(Channel),
            content: faker.lorem.words({ min: 10, max: 25 }),
            attachments,
            reactions,
            isDeleted: faker.helpers.arrayElement([true, false]),
        });
    }

    return document;
};

module.exports = ChatFactory;
