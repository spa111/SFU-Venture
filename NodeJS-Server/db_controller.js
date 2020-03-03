const Pool = require('pg').Pool;
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const TOKEN_STRING = 'sfuventure_jwt_token_string';

const database = new Pool({
    user: 'cmpt470',
    host: 'localhost',
    database: 'cmpt470',
    password: 'cmpt470',
    port: 5432
});

// Password Hashers
const generatePasswordHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
};

const validPassword = function(input_password, database_password) {
    return bcrypt.compareSync(input_password, database_password);
};

// Queries
const getUsers = (request, response) => {
    database.query('select * from users order by ID ASC', (error, results) => {
        if (error) {
            console.log(error);
        } else {
            response.status(200).json(results.rows);
        }
    });
};

const getUserById = (request, response) => {
    const id = parseInt(request.params.id);

    database.query('select * from users where id = $1', [id], (error, results) => {
        if (error) {
            console.log(error);
        } else {
            response.status(200).json(results.rows);
        }
    });
};

const createUser = (request, response) => {
    const { fullname, password, email, is_student, is_faculty } = request.body;

    var username = email.split("@")[0];
    var is_email_verified = false;
    var is_admin = false;
    var hashed_password = generatePasswordHash(password);

    // Need to add another check in the db to make it so that the admin is the only one who verifies whether a user is faculty or not
    database.query(
        'insert into users (fullname, password, email, username, is_email_verified, is_admin, is_student, is_faculty) values ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [fullname, hashed_password, email, username, is_email_verified, is_admin, is_student, is_faculty],
        (error, results) => {
            if (error) {
                console.log(error);
                response.status(401).send(`Error, email is currently in use`);
            } else {
                var verification_token = jwt.sign({ userId: results.rows[0].id }, TOKEN_STRING, { expiresIn: '1d' });
                sendEmail(email, verification_token);
                response.status(201).send(`Please verify your email using the link sent to your email`);
            }
        }
    );
};

const verifyUserEmail = (request, response) => {
    const token_details = jwt.verify(request.body.token, TOKEN_STRING);
    database.query(
        'update users set is_email_verified = $1 where id = $2', [true, token_details.userId],

        (error, results) => {
            if (error) {
                console.log(error);
            } else {
                console.log(`User: ${token_details.userId} has been verified`);
                response.status(200).send('User verified');
            }
        }
    );
};

const loginUser = (request, response) => {
    const { username, password } = request.body;

    database.query('select * from users where username = $1', [username], (error, results) => {
        if (error) {
            console.log(error);
        } else {
            var user = results.rows[0];
            if (user) {
                if (user.is_email_verified) {
                    if (validPassword(password, user.password)) {
                        // Return a vaid web token and the user details
                        var token = jwt.sign({ userID: user.id }, TOKEN_STRING, { expiresIn: '1d' });
                        console.log("User: " + user.id + ": " + token);
                        response.status(201).send({ token, user });

                    } else {
                        response.status(401).send("Invalid username and password combination");
                    }

                } else {
                    response.status(401).send("Please validate your account using the link that was been sent to your email.");

                    // Resend the token to verify the email
                    var verification_token = jwt.sign({ userId: user.id }, TOKEN_STRING, { expiresIn: '1d' });
                    sendEmail(user.email, verification_token);
                }

            } else {
                response.status(401).send("Invalid username and password combination.");
            }
        }
    });
};


const updateUser = (request, response) => {
    const id = parseInt(request.params.id);
    const { fullname, password } = request.body;
    var hashed_password = generatePasswordHash(password);

    database.query(
        'update users set name = $1, password = $2 where id = $3', [fullname, hashed_password, id],

        (error, results) => {
            if (error) {
                console.log(error);
            }

            response.status(200).send('User modified with ID: ${id}');
        }
    );
};

const deleteUser = (request, response) => {
    const id = parseInt(request.params.id);

    database.query('delete from users where id = $1', [id], (error, results) => {
        if (error) {
            console.log(error);
        }

        response.status(200).send('User deleted with ID: ${id}');
    });
};

const sendEmail = function(end_user_email, verification_token) {
    var url = `http://localhost:4200/verify-email/${verification_token}`;

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

    // Message details
    var mailOptions = {
        from: 'sfuventure470@gmail.com',
        to: end_user_email,
        subject: 'Please confirm your email',
        html: `
            <h4>Please click this link to confirm to verify your email: <a href="${url}">${url}</a></h4>
            <p>This link will only be valid for 1 day.</p>
        `
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
            response.status(535).json(error);
        } else {
            console.log(`Email sent: ${info.response}`);
        }
    });
};

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    loginUser,
    verifyUserEmail
};