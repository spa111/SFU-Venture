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

const createTextBook = (request, response) => {
    const { txt_book_name, course_name, faculty_name, price, post_date, img_url } = request.body;


    // Need to add another check in the db to make it so that the admin is the only one who verifies whether a user is faculty or not
    database.query(
        'insert into textbooks (txt_book_name, course_name, faculty_name, price, post_date, img_url) values ($1, $2, $3, $4, $5, $6) RETURNING *', [txt_book_name, course_name, faculty_name, price, post_date, img_url],
        (error, results) => {
            if (error) {
                console.log(error);
                response.status(401).json({ error: error });
            } else {
                console.log("Textbook Added");
                response.status(201).json({ response: "Textbook Added" });
            }
        }
    );
};

module.exports = {
    getTextBooks,
    getTextBookById,
    createTextBook,
    // updateTextBook,
    deleteTextBook
};