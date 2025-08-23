const app = require('./app');
const connection = require('./src/config/databaseConnection');

const PORT = process.env.PORT || 5000;

connection().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
