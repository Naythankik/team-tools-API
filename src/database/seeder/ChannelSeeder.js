const ChannelFactory = require('../factory/ChannelFactory');
const Channel = require('../../models/Channel');

const ChannelSeeder = {
    run: async (count) => {
        const channel = await ChannelFactory(count);

        await Channel.insertMany(channel);
    }
}

module.exports = ChannelSeeder;
