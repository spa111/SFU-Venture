const Pool = require('pg').Pool;
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const TOKEN_STRING = 'sfuventure_jwt_token_string';

const isProduction = false;

const URL_DEV = "http://localhost:8080";
const URL_SERVER = "http://35.199.189.130";
const URL = isProduction ? URL_SERVER : URL_DEV;

const database = new Pool({
    user: 'postgres',
    host: '35.203.175.95',
    database: 'postgres',
    password: 'postgres',
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
const createDefaultAdmin = function() {
    let hashed_password = generatePasswordHash("sfuventure");

    database.query('select * from users where email = $1', ["sfuventure470@gmail.com"],
        (error, results) => {
            if (error) {
                console.log("Error pulling default user existance");
                console.log(error);

            } else {
                if (results && results.rows && results.rows[0]) {
                    console.log("Default Admin Exists");

                } else {

                    database.query(
                        'insert into users (fullname, password, email, username, is_email_verified, is_admin, is_student, is_faculty, is_faculty_verified) values ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', ["SFU Venture", hashed_password, "sfuventure470@gmail.com", "sfuventure470", true, true, false, false, false],
                        (error, results) => {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log("Default admin added to the database");
                            }
                        }
                    );
                }
            }
        });
};

const getUsers = (request, response) => {
    database.query('select * from users', (error, results) => {
        if (error) {
            console.log(error);
            response.status(401).send(error);
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

const updatePrivileges = (request, response) => {
    let id = request.params.id;
    let payload = request.body;

    let is_admin = false;
    let is_student = false;
    let is_faculty = false;
    let is_faculty_verified = false;

    if (payload.accessLevel == "Admin") {
        is_admin = true;
        is_student = false;
        is_faculty = false;
        is_faculty_verified = false;
    } else if (payload.accessLevel == "Faculty") {
        is_admin = false;
        is_student = false;
        is_faculty = true;
        is_faculty_verified = true;
    } else {
        is_admin = false;
        is_student = true;
        is_faculty = false;
        is_faculty_verified = false;
    }

    database.query(
        'update users set is_admin = $1, is_student = $2, is_faculty = $3, is_faculty_verified = $4 where id = $5', [is_admin, is_student, is_faculty, is_faculty_verified, id],
        (error, results) => {
            if (error) {
                console.log(error);
                response.status(401).send(error);
            } else {
                response.status(200).send(results);
            }
        }
    );
};

const createUser = (request, response) => {
    const { fullname, password, email, is_student, is_faculty } = request.body;

    var username = email.split("@")[0];
    var is_email_verified = false;
    var is_faculty_verified = false;
    var is_admin = false;
    var hashed_password = generatePasswordHash(password);

    database.query('select * from users where username = $1', [username], (error, results) => {
        if (error) {
            console.log(error);
        } else {
            if (results && results.rows && results.rows[0]) {
                // Check if the email is already in the database
                if (results.rows[0].email == email) {

                    // If the email is verified already, display and error
                    if (results.rows[0].is_email_verified) {
                        response.status(401).send(`Error, email is currently in use`);
                    } else {
                        // Person just created a new account and accidently clicked the button twice
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
                } else {
                    // Person has an email whose pre-@ portion is the same as already stored in the database
                    username += ("" + results.rows.length);
                }
            } else {
                // New user
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
            }
        }
    });


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
    const isUsingEmail = username.includes('@');

    if (isUsingEmail) {
        const email = username;
        database.query('select * from users where email = $1', [email], (error, results) => {
            if (error) {
                console.log(error);
            } else {
                var user = results.rows[0];
                if (user) {
                    if (user.is_email_verified) {
                        // Need to add a check for the faculty verification to prevent access unless they have permission from admin)
                        if (user.is_faculty && !user.is_faculty_verified) {
                            if (validPassword(password, user.password)) {
                                response.status(401).send("Your faculty status has not been verified. Please wait for an admin to process the request");
                            } else {
                                response.status(401).send("Invalid email and password combination");
                            }
                        } else {
                            if (validPassword(password, user.password)) {
                                // Return a vaid web token and the user details
                                var token = jwt.sign({ userID: user.id }, TOKEN_STRING, { expiresIn: '1d' });
                                console.log("User: " + user.id + ": " + token);
                                response.status(201).send({ token, user });

                            } else {
                                response.status(401).send("Invalid email and password combination");
                            }
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
    } else {
        database.query('select * from users where username = $1', [username], (error, results) => {
            if (error) {
                console.log(error);
            } else {
                var user = results.rows[0];
                if (user) {
                    if (user.is_email_verified) {
                        // Need to add a check for the faculty verification to prevent access unless they have permission from admin)
                        if (user.is_faculty && !user.is_faculty_verified) {
                            if (validPassword(password, user.password)) {
                                response.status(401).send("Your faculty status has not been verified. Please wait for an admin to process the request");
                            } else {
                                response.status(401).send("Invalid username and password combination");
                            }
                        } else {
                            if (validPassword(password, user.password)) {
                                // Return a vaid web token and the user details
                                var token = jwt.sign({ userID: user.id }, TOKEN_STRING, { expiresIn: '1d' });
                                console.log("User: " + user.id + ": " + token);
                                response.status(201).send({ token, user });

                            } else {
                                response.status(401).send("Invalid username and password combination");
                            }
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
    }
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

const updatePassword = (request, response) => {
    var { id, oldPassword, newPassword } = request.body;

    database.query('select * from users where id = $1', [id], (error, results) => {
        if (error) {
            console.log(error);
        } else {
            let user = JSON.parse(JSON.stringify(results.rows[0]));

            // Update the password if it was valid
            if (validPassword(oldPassword, user.password)) {

                let hashed_password = generatePasswordHash(newPassword);
                database.query(
                    'update users set password = $1 where id = $2', [hashed_password, id],
                    (err, res) => {
                        if (err) {
                            console.log(error);
                        }

                        response.status(200).send({ response: 'Password updated' });
                    }
                );

            } else {
                response.status(401).send("Error. Old password doesn't match existing records");
            }

        }
    });
};

const deleteUser = (request, response) => {
    const id = parseInt(request.params.id);

    database.query('delete from users where id = $1', [id], (error, results) => {
        if (error) {
            console.log(error);
            response.status(401).send(error);
        }

        response.status(200).send({ response: 'User deleted' });
    });
};

const emailBuyerAndSeller = (request, response) => {
    var { buyerId, sellerId, message, textbook } = request.body;

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
                    seller_email = results.rows[0].email;
                    buyer_email = results.rows[1].email

                    if (message == "Hi there. I would like to talk about purchasing this textbook. Please send me an email if it is still available. <br><br> Thanks") {
                        message += `,<br>${buyer_email}`;
                    }

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

const checkHasAdminPrivileges = (request, response) => {
    var id = request.params.id;
    database.query(
        'select * from users where id = $1', [id],
        (error, results) => {
            if (error) {
                console.log(error);
                response.status(500).send(`Internal server error`);
            } else {
                if (results.rows[0] && results.rows[0].id) {
                    response.status(200).send({
                        'hasPrivileges': results.rows[0].is_admin
                    });
                } else {
                    response.status(500).send(`Internal server error`);
                }
            }
        }
    );
}

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
    createDefaultAdmin,
    getUsers,
    getUserById,
    createUser,
    updatePassword,
    updatePrivileges,
    deleteUser,
    loginUser,
    verifyUserEmail,
    forgotPasswordCheckEmail,
    changeForgottenPassword,
    emailBuyerAndSeller,
    checkHasAdminPrivileges
};