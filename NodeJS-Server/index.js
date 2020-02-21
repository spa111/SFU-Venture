const express = require('express');
const bodyParser = require('body-parser');
const expressJwt = require('express-jwt');
const cors = require('cors');
const database = require('./db_controller');
const app = express();
const port = 3000;

// Use CORS to accept a request coming from any browser
app.options('*', cors());

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

app.use(expressJwt({secret: 'sfuventure_jwt_token_string'}).unless({path: ['/api/signup', '/api/signin', '/api/verify-user-email']}));

// Application endpoints
app.get('/', (request, response) => {
    response.json({
        info: 'Node.js, Express, and Postgres API'
    });
});

// Login API's
app.post('/api/signup', cors(), database.createUser);
app.post('/api/signin', cors(), database.loginUser);
app.post('/api/verify-user-email', cors(), database.verifyUserEmail);

// USER Data manipulation API's
app.get('/api/users', cors(), database.getUsers);
app.get('/api/users/:id', cors(), database.getUserById);
app.put('/api/users/:id', cors(), database.updateUser);
app.delete('/api/users/:id', cors(), database.deleteUser);

// Start NodeJS server and list on port 3000 for requests
app.listen(port, () => {
    console.log('Node.js server running on port ' + port);
});