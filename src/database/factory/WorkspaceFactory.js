const { faker } = require('@faker-js/faker');
const User = require('../../models/User');
const slugify = require("slugify");

async function randomId(model, match = {}) {
    const result = await model.aggregate([
        { $match: match },
        { $sample: { size: 1 } },
        { $project: { _id: 1 } }
    ]);
    return result[0]?._id;
}

const WorkspaceFactory = async (count) => {
    const document = [];

    for (let i = 0; i < count; i++) {
        const ownerId = await randomId(User);

        const members = [ownerId];

        const numberOfExtraMembers = faker.number.int({ min: 10, max: 20 });

        for (let x = 0; x < numberOfExtraMembers; x++) {
            const memberId = await randomId(User);

            if (memberId && !members.includes(memberId)) {
                members.push(memberId);
            }
        }
        const name = faker.company.name()

        document.push({
            name: name,
            slug: slugify(name),
            owner: ownerId,
            members,
            description: faker.lorem.paragraph({ min: 1, max: 2 }),
            isArchived: faker.helpers.arrayElement([true, false]),
            coverImage: faker.image.avatar()
        });
    }

    return document;
};

module.exports = WorkspaceFactory;
