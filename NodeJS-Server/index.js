const express = require('express');
const bodyParser = require('body-parser');
const database = require('./db_queries');
const nodemailer = require('nodemailer');
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

app.get('/api/users', cors(), database.getUsers);
app.get('/api/users/:id', cors(), database.getUserById);
app.post('/api/users', cors(), database.createUser);
app.put('/api/users/:id', cors(), database.updateUser);
app.delete('/api/users/:id', cors(), database.deleteUser);

app.post('/api/signup', cors(), (request, response) => {

    // Email details
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'sfuventure470@gmail.com',
            pass: 'ventureABC123'
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    
    var mailOptions = {
        from: 'sfuventure470@gmail.com',
        to: 'EXAMPLE-EMAIL@gmail.com',
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
    };
    
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
            response.status(535).json(error);
        } else {
            console.log('Email sent: ' + info.response);
            response.json('Email sent: ' + info.response);
        }
    });
});

// Start NodeJS server and list on port 3000 for requests
app.listen(port, () => {
    console.log('Node.js server running on port ' + port);
});