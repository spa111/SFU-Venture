const Pool = require('pg').Pool;
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const TOKEN_STRING = 'sfuventure_jwt_token_string';

const isProduction = false;

const URL_DEV = "http://localhost:8080";
const URL_SERVER = "http://34.82.223.192";
const URL = isProduction ? URL_SERVER : URL_DEV;

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
    var is_faculty_verified = false;
    var is_admin = false;
    var hashed_password = generatePasswordHash(password);

    // Need to add another check in the db to make it so that the admin is the only one who verifies whether a user is faculty or not
    database.query(
        'insert into users (fullname, password, email, username, is_email_verified, is_admin, is_student, is_faculty, is_faculty_verified) values ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', [fullname, hashed_password, email, username, is_email_verified, is_admin, is_student, is_faculty, is_faculty_verified],
        (error, results) => {
            if (error) {
                console.log(error);
                response.status(401).send(`Error, email is currently in use`);
            } else {
                var verification_token = jwt.sign({ userId: results.rows[0].id }, TOKEN_STRING, { expiresIn: '1d' });
                var url = `${URL}/verify-email/${verification_token}`;

                var mailOptions = {
                    from: 'sfuventure470@gmail.com',
                    to: email,
                    subject: 'Please confirm your email',
                    html: `
                        <h4>Please click this link to confirm to verify your email: <a href="${url}">${url}</a></h4>
                        <p>This link will only be valid for 1 day.</p>
                    `
                };

                sendEmail(mailOptions);
                response.status(201).send(`Please check your email for instructions to activate your account`);
            }
        }
    );
};

const verifyUserEmail = (request, response) => {
    var token_details = "";
    try {
        token_details = jwt.verify(request.body.token, TOKEN_STRING);
    } catch (err) {
        response.status(401).send("Error, your authentication token is invalid. Please try logging in to regenerate another email with a new authentication token.");
        return;
    }

    database.query(
        'update users set is_email_verified = $1 where id = $2', [true, token_details.userId], (error, results) => {
            if (error) {
                console.log(error);
                response.status(401).send("Error, your authentication token is invalid. Please try logging in to regenerate another email with a new authentication token.");
            } else {
                console.log(`User: ${token_details.userId} has been verified`);
                response.status(200).send({ 'response': 'Your account has been verified. Enjoy SFU Venture.' });
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
                    var url = `${URL}/verify-email/${verification_token}`;
                    var mailOptions = {
                        from: 'sfuventure470@gmail.com',
                        to: user.email,
                        subject: 'Please confirm your email',
                        html: `
                            <h4>Please click this link to confirm to verify your email: <a href="${url}">${url}</a></h4>
                            <p>This link will only be valid for 1 day.</p>
                        `
                    };

                    sendEmail(mailOptions);
                }

            } else {
                response.status(401).send("Invalid username and password combination.");
            }
        }
    });
};

const forgotPasswordCheckEmail = (request, response) => {
    const { email } = request.body;

    database.query(
        'select * from users where email = $1', [email],
        (error, results) => {
            if (error) {
                console.log(error);
                response.status(401).send(`Error, email doesn't exist`);
            } else {
                if (results.rows[0] && results.rows[0].id) {
                    var verification_token = jwt.sign({ userId: results.rows[0].id }, TOKEN_STRING, { expiresIn: '1d' });
                    var url = `${URL}/change-forgotten-password/${verification_token}`;

                    var mailOptions = {
                        from: 'sfuventure470@gmail.com',
                        to: email,
                        subject: 'Password Reset',
                        html: `
                            <h4>Please click this link to reset your password: <a href="${url}">${url}</a></h4>
                            <p>This link will only be valid for 1 day. If this wasn't you, please consider changing your password.</p>
                        `
                    };

                    sendEmail(mailOptions);
                    response.status(201).send({ 'response': `Please check your email for reset instructions` });
                } else {
                    response.status(401).send(`Error, email doesn't exist`);
                }
            }
        }
    );
};

const changeForgottenPassword = (request, response) => {
    const { token, password } = request.body;

    var token_details = "";
    try {
        token_details = jwt.verify(token, TOKEN_STRING);
    } catch (err) {
        response.status(401).send("Error, your authentication token is invalid. Please try the process of resetting your password again.");
        return;
    }

    const hashed_password = generatePasswordHash(password);
    database.query(
        'update users set password = $1 where id = $2', [hashed_password, token_details.userId], (error, results) => {
            if (error) {
                console.log(error);
                response.status(401).send("Error, your authentication token is invalid. Please try the process of resetting your password again.");
            } else {
                response.status(200).send({ 'response': 'Your account password has been changed. Enjoy SFU Venture.' });
            }
        }
    );
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

const emailBuyerAndSeller = (request, response) => {
    const { buyerId, sellerId, message, textbook } = request.body;

    let seller_email = "";
    let buyer_email = "";

    database.query(
        'select * from users where id = $1 union all select * from users where id = $2', [sellerId, buyerId], 
        (error, results) => {
            if (error) {
                console.log(error);
                response.status(500).send(`Internal server error`);
            } else {
                if (results.rows[0] && results.rows[0].id) {
                    console.log(results.rows);
                    seller_email = results.rows[0].email;
                    buyer_email = results.rows[1].email

                    var seller_message = {
                        from: 'sfuventure470@gmail.com',
                        to: seller_email,
                        subject: `${buyer_email} wants to buy your ${textbook.txt_book_name} ${textbook.faculty_name} ${textbook.course_name} textbook`,
                        html: `<p>${message}</p>`
                    };

                    var buyer_message = {
                        from: 'sfuventure470@gmail.com',
                        to: buyer_email,
                        subject: `Message sent to ${seller_email} regarding textbook ${textbook.txt_book_name}`,
                        html: `<p>
                            The following message was sent to ${seller_email}:<br><br>
                            ${message}
                        </p>`
                    };

                    sendEmail(seller_message);
                    sendEmail(buyer_message);
                    response.status(201).send({ 'response': `Messages Sent to buyer and seller` });
                } else {
                    response.status(500).send(`Internal server error`);
                }
            }
        }
    );
};

const sendEmail = function(mailOptions) {

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
    verifyUserEmail,
    forgotPasswordCheckEmail,
    changeForgottenPassword,
    emailBuyerAndSeller
};