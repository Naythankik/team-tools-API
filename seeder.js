const seeder = process.argv[2];
const count = process.argv[3] ?? 5;
require('dotenv').config({ quiet: true});
require('./src/config/databaseConnection')();


if(seeder){
    try {
        const seederModule = require(`./src/database/seeder/${seeder}`);
        if (typeof seederModule.run !== 'function') {
            throw new Error(`The seeder "${seeder}" does not have a run() method.`);
        }

        seederModule.run(count)
            .then(() => {
                console.log(`Successfully ran ${seeder} with count ${count}`);
                process.exit(0);
            })
            .catch(err => {
                console.error(`Error running seeder:`, err.message);
                process.exit(1);
            });
    } catch (err) {
        if (err.code === 'MODULE_NOT_FOUND') {
            console.error(`Seeder "${seeder}" not found in ./src/database/seeder/`);
        } else {
            console.error(`Error loading seeder:`, err.message);
        }
        process.exit(1);
    }
}else{
    require('./src/database/seeder/DatabaseSeeder')();
}
