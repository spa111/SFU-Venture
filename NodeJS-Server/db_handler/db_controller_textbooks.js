const Pool = require('pg').Pool;

const database = new Pool({
    user: 'cmpt470',
    host: 'localhost',
    database: 'cmpt470',
    password: 'cmpt470',
    port: 5432
});



// Queries
const getTextBooks = (request, response) => {
    database.query('select * from textbooks order by ID ASC', (error, results) => {
        if (error) {
            console.log(error);
        } else {
            console.log(results.rows)
            response.status(200).json(results.rows);
        }
    });
};


module.exports = {
    getTextBooks
};