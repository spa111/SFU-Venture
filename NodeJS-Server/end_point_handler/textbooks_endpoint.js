const express = require('express')
const cors = require('cors');
const database = require('../db_handler/db_controller_textbooks');




const router = express.Router()

router.get('/api/textbooks', cors(), database.getTextBooks);
router.get('/api/textbooks/:id', cors(), database.getTextBookById);
// router.put('/api/textbooks/:id', cors(), database.updateTextBook);
router.delete('/api/textbooks/:id', cors(), database.deleteTextBook);

module.exports = router