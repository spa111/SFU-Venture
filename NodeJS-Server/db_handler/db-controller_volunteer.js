const Pool = require('pg').Pool;

const database = new Pool({
    user: 'postgres',
    host: '35.203.175.95',
    database: 'postgres',
    password: 'postgres',
    port: 5432
});



// Queries
const getAllVolunteerPos = (request, response) => {
    database.query('select * from volunteer_board order by ID ASC', (error, results) => {
        if (error) {
            console.log(error);
        } else {
            response.status(200).json(results.rows);
        }
    });
};

const getVolunteerPosById = (request, response) => {
    const id = parseInt(request.params.id);

    database.query('select * from volunteer_board where id = $1', [id], (error, results) => {
        if (error) {
            console.log(error);
        } else {
            response.status(200).json(results.rows);
        }
    });
};

const deleteVolunteerPos = (request, response) => {
    const id = parseInt(request.params.id);

    database.query('delete from volunteer_board where id = $1', [id], (error, results) => {
        if (error) {
            console.log(error);
        }

        response.status(200).send('volunteer deleted with ID: ${id}');
    });
};

const createVolunteerPos = (request, response) => {
    const { user_id, volunteer_title, volunteer_description, volunteer_location } = request.body;


    // Need to add another check in the db to make it so that the admin is the only one who verifies whether a user is faculty or not
    database.query(
        'insert into volunteer_board (user_id, volunteer_title, volunteer_description, volunteer_location) values ($1, $2, $3, $4) RETURNING *', [user_id, volunteer_title, volunteer_description, volunteer_location],
        (error, results) => {
            if (error) {
                console.log(error);
                response.status(401).json({ error: error });
            } else {
                console.log("Volunteer Added");
                response.status(201).json({ response: "Volunteer Added" });
            }
        }
    );
};

module.exports = {
    getAllVolunteerPos,
    getVolunteerPosById,
    deleteVolunteerPos,
    createVolunteerPos
};