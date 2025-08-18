const seeder = process.argv[2];
const count = process.argv[3] ?? 5;
const fs = require('fs');
const path = require("node:path");
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
    (async () => {
        const seederDir = path.join(__dirname, 'src', 'database', 'seeder');
        const files = fs.readdirSync(seederDir);

        for (const file of files) {
            const filePath = path.join(seederDir, file);
            const module = require(filePath);

            if(typeof module.run === 'function'){
                console.log(`Running ${file}...`);
                await module.run(count)
                    .then(() => {
                        console.log(`Successfully ran ${file} with count ${count}`);
                    })
                    .catch(err => {
                        console.error(`Error running seeder:`, err.message);
                    });
            }
        }

        console.log('All seeders ran successfully.')
        process.exit(0);
    })()
}
