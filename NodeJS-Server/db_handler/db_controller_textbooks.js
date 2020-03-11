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
            response.status(200).json(results.rows);
        }
    });
};

const getTextBookById = (request, response) => {
    const id = parseInt(request.params.id);

    database.query('select * from textbooks where id = $1', [id], (error, results) => {
        if (error) {
            console.log(error);
        } else {
            response.status(200).json(results.rows);
        }
    });
};

const deleteTextBook = (request, response) => {
    const id = parseInt(request.params.id);

    database.query('delete from textbooks where id = $1', [id], (error, results) => {
        if (error) {
            console.log(error);
        }

        response.status(200).send('textbooks deleted with ID: ${id}');
    });
};

module.exports = {
    getTextBooks,
    getTextBookById,
    // updateTextBook,
    deleteTextBook
};