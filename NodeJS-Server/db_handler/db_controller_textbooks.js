const Pool = require('pg').Pool;

const database = new Pool({
    user: 'postgres',
    host: '35.203.175.95',
    database: 'postgres',
    password: 'postgres',
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

    database.query('select * from textbooks where posting_user_id = $1', [id], (error, results) => {
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

        response.status(200).send({ response: 'textbooks deleted with ID: ${id}' });
    });
};

const createTextBook = (request, response) => {
    const { user_id, txt_book_name, course_name, faculty_name, price, post_date, img_url, description } = request.body;


    // Need to add another check in the db to make it so that the admin is the only one who verifies whether a user is faculty or not
    database.query(
        'insert into textbooks (posting_user_id, txt_book_name, course_name, faculty_name, price, post_date, img_url, description) values ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [user_id, txt_book_name, course_name, faculty_name, price, post_date, img_url, description],
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