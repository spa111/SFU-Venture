const requestCaller = require('request');
const googleapiKey = "AIzaSyDT4wuLrTQhVV6kil3hKjjyAwxnJ5vwZdw"
const googleApiBasicCall = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?"
const Pool = require('pg').Pool;

const database = new Pool({
    user: 'postgres',
    host: '35.203.175.95',
    database: 'postgres',
    password: 'postgres',
    port: 5432
});

const getActivityAround = (request, response) => {
    let coord = request.body.coord;
    let radius = request.body.radius;
    let type = request.body.typer;
    let keyword = request.body.keyword;

    // https://maps.googleapis.com/maps/api/place/textsearch/xml?query=restaurants+in+Sydney&key=YOUR_API_KEY
    // https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=1500&type=restaurant&keyword=cruise&key=YOUR_API_KEY

    requestCaller(`${googleApiBasicCall}location=${coord}&radius=${radius}&type=${type}&keyword=${keyword}&key=${googleapiKey}
    `, { json: true }, (err, res, body) => {
        if (err) {
            return console.log(err);
        } else {
            response.status(200).json(body.results);
        }

    });
};

// Queries
const getAllActivities = (request, response) => {
    database.query('select * from activities order by ID ASC', (error, results) => {
        if (error) {
            console.log(error);
        } else {
            response.status(200).json(results.rows);
        }
    });
};

const getUserActivities = (request, response) => {
    const id = parseInt(request.params.id);

    database.query('select * from activities where poster_user_id = $1', [id], (error, results) => {
        if (error) {
            console.log(error);
        } else {
            response.status(200).json(results.rows);
        }
    });
};

const deleteActivityById = (request, response) => {
    const id = parseInt(request.params.id);

    database.query('delete from activities where id = $1', [id], (error, results) => {
        if (error) {
            console.log(error);
        }

        response.status(200).send({ response: "Activity deleted" });
    });
};

const createActivity = (request, response) => {
    const {
        poster_user_id,
        corresponding_department,
        activity_title,
        activity_description,
        activity_price,
        activity_location,
        activity_timestamp
    } = request.body;

    // Need to add another check in the db to make it so that the admin is the only one who verifies whether a user is faculty or not
    database.query(
        'insert into activities (poster_user_id, corresponding_department, activity_title, activity_description, activity_price, activity_location, activity_timestamp) values ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [poster_user_id, corresponding_department, activity_title, activity_description, activity_price, activity_location, activity_timestamp],
        (error, results) => {
            if (error) {
                console.log(error);
                response.status(401).json({ error: error });
            } else {
                console.log("Activity Added");
                response.status(201).send({ response: "Activity Added" });
            }
        }
    );
};


module.exports = {
    getActivityAround,
    createActivity,
    deleteActivityById,
    getUserActivities,
    getAllActivities
}