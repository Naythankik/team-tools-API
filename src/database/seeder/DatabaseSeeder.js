const UserSeeder = require('./UserSeeder');
const WorkspaceSeeder = require('./WorkspaceSeeder');
const ChannelSeeder = require('./ChannelSeeder');
const DMSeeder = require('./DirectMessageSeeder');
const ChatSeeder = require('./ChatSeeder');

const DatabaseSeeder = async () => {
    try{
        await UserSeeder.run(5);
        await WorkspaceSeeder.run(5);
        await ChannelSeeder.run(5);
        await ChatSeeder.run(5);
        await DMSeeder.run(5);
    }catch (e){
        console.log(e)
        process.exit(1);
    }

    console.log('All seeders ran successfully.')
    process.exit(0);
}


module.exports = DatabaseSeeder;
