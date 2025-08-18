const UserFactory = require('../factory/UserFactory');
const User = require('../../models/User');

const UserSeeder = {
    run: async (count) => {
        const user = await UserFactory(count);

        await User.insertMany(user);
    }
}

module.exports = UserSeeder;
