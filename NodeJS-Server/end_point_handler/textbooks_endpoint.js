const express = require('express')
const cors = require('cors');
const database = require('../db_handler/db_controller_textbooks');




const router = express.Router()

router.get('/api/getAllTextBooks', cors(), database.getTextBooks);


module.exports = router