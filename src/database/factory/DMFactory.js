const User = require('../../models/User');

async function randomId(model, match = {}) {
    const result = await model.aggregate([
        { $match: match },
        { $sample: { size: 1 } },
        { $project: { _id: 1 } },
    ]);
    return result[0]?._id;
}

const DMFactory = async (count) => {
    const document = [];

    for (let i = 0; i < count; i++) {
        document.push({
            participants: [
                await randomId(User),
                await randomId(User)
            ],
        });
    }

    return document;
};

module.exports = DMFactory;
