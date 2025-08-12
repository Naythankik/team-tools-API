const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');


const UserFactory = async (count) => {
    const document = [];

    for(let i = 0; i < count; i++){
        const status = faker.helpers.arrayElement(['online', 'offline', 'away']);

        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash('password', salt);

        document.push({
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            username: faker.internet.username(),
            title: faker.person.prefix(),
            email: faker.internet.email(),
            avatar: `https://randomuser.me/api/portraits/men/${faker.helpers.rangeToNumber({min: 1, max: 100})}.jpg`,
            password: password,
            role: 'user',
            telephone: faker.phone.imei(),
            status: status,
            whenLastActive: status === 'offline' ? faker.date.past() : null,
            isEmailVerified: faker.helpers.arrayElement([true, false]),
        })
    }

    return document;
}

module.exports = UserFactory;
