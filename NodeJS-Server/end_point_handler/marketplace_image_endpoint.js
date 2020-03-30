const express = require('express')
const cors = require('cors');

const imageFinder = require('../db_handler/marketplace_image_handler.js');


const router = express.Router()

router.post('/api/getBookDetail', cors(), imageFinder.getBookDetails);
router.post('/api/getBookCover', cors(), imageFinder.getImageForISBN);



module.exports = router