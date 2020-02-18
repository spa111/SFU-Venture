const express = require('express');
const bodyParser = require('body-parser');
const database = require('./db_queries');
const cors = require('cors');
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

// Application endpoints
app.get('/', (request, response) => {
    response.json({
        info: 'Node.js, Express, and Postgres API'
    });
});

app.get('/users', cors(), database.getUsers);
app.get('/users/:id', cors(), database.getUserById);
app.post('/users', cors(), database.createUser);
app.put('/users/:id', cors(), database.updateUser);
app.delete('/users/:id', cors(), database.deleteUser);

// Start NodeJS server and list on port 3000 for requests
app.listen(port, () => {
    console.log('Node.js server running on port ' + port);
});