const Pool = require('pg').Pool;
const database = new Pool({
    user: 'cmpt470',
    host: 'localhost',
    database: 'cmpt470',
    password: 'cmpt470',
    port: 5432
});


// Base Queries
const getUsers = (request, response) => {
    database.query('select * from users order by ID ASC', (error, results) => {
        if (error) {
            throw error;
        }

        response.status(200).json(results.rows);
    });
};

const getUserById = (request, response) => {
    const id = parseInt(request.params.id);

    database.query('select * from users where id = $1', [id], (error, results) => {
        if (error) {
            throw error;
        }

        response.status(200).json(results.rows);
    });
};

const createUser = (request, response) => {
    const { name, password, email } = request.body;

    database.query('insert into users (name. password, email) values ($1, $2, $3)', [name, password, email], (error, results) => {
        if (error) {
            throw error;
        }

        response.status(201).send('User added with ID: ${result.insertId}');
    });
};

const updateUser = (request, response) => {
    const id = parseInt(request.params.id);
    const { name, password, email } = request.body;

    database.query(
        'update users set name = $1, password = $2, email = $3 where id = $4',
        [name, password, email, id],
        
        (error, results) => {
            if (error) {
                throw error;
            }

            response.status(200).send('User modified with ID: ${id}');
        }
    );
};

const deleteUser = (request, response) => {
    const id = parseInt(request.params.id);

    database.query('delete from users where id = $1', [id], (error, results) => {
        if (error) {
            throw error;
        }

        response.status(200).send('User deleted with ID: ${id}');
    });
};

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};