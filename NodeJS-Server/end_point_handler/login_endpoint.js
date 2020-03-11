const express = require('express')
const cors = require('cors');
const database = require('../db_handler/db_controller');




const router = express.Router()

router.post('/api/signup', cors(), database.createUser);
router.post('/api/signin', cors(), database.loginUser);
router.post('/api/verify-user-email', cors(), database.verifyUserEmail);
router.post('/api/forgot-password', cors(), database.forgotPasswordCheckEmail);
router.post('/api/change-forgotten-password', cors(), database.changeForgottenPassword);


module.exports = router