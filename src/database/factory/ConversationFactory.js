const { faker } = require('@faker-js/faker');
const DM = require('../../models/DirectMessage');

const randomDM = async () => {
    const result = await DM.aggregate([{ $sample: { size: 1 } }]);
    return result[0];
};

const ConversationFactory = async (count) => {
    const document = [];

    for (let i = 0; i < count; i++) {
        const d = await randomDM();
        const type = faker.helpers.arrayElement(['text', 'image', 'file', 'video']);
        const sender = faker.helpers.arrayElement([...d.participants]);

        const dm = {
            directMessage: d._id,
            sender,
            type,
            readBy: [sender]
        };

        // conditional fields
        if (type === 'text') {
            dm.text = faker.lorem.sentence();
        } else {
            dm.mediaUrl = faker.internet.url();
            dm.mediaType = type;
        }

        document.push(dm);
    }

    return document;
};

module.exports = ConversationFactory;
