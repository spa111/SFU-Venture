const express = require('express');
const bodyParser = require('body-parser');
const expressJwt = require('express-jwt');
const cors = require('cors');
const login_endpoint = require('./end_point_handler/login_endpoint');
const userdata_endpoint = require('./end_point_handler/user_data_endpoint');
const textbook_endpoint = require('./end_point_handler/textbooks_endpoint');
const database = require('./db_handler/db_controller');
const volunteer_endpoint = require('./end_point_handler/volunteer_endpoint')
const activity_endpoint = require('./end_point_handler/activity_enpoint')
const image_endpoint = require('./end_point_handler/marketplace_image_endpoint')



const app = express();
const port = 3000;

// Use CORS to accept a request coming from any browser

app.use(cors({ origin: '*' }));
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

app.use(expressJwt({ secret: 'sfuventure_jwt_token_string' }).unless({
    path: ['/api/signup', '/api/signin', '/api/verify-user-email', '/api/forgot-password', '/api/change-forgotten-password']
}));

// Application endpoints
app.get('/', (request, response) => {
    response.json({
        info: 'Node.js, Express, and Postgres API'
    });
});

// Login API's
app.use(login_endpoint);


// USER Data manipulation API's
app.use(userdata_endpoint);

// TEXTBOOKS API'S
app.use(textbook_endpoint);

// Volunteer API'S
app.use(volunteer_endpoint)

// Activity Finder API'S
app.use(activity_endpoint)

// ISBN Image Finder API'S
app.use(image_endpoint)


// Start NodeJS server and list on port 3000 for requests
app.listen(port, () => {
    console.log('Node.js server running on port ' + port);
    database.createDefaultAdmin();
});