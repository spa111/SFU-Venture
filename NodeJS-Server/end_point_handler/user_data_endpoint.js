const express = require('express')
const cors = require('cors');
const database = require('../db_controller');


const router = express.Router()

router.get('/api/users', cors(), database.getUsers);
router.get('/api/users/:id', cors(), database.getUserById);
router.put('/api/users/:id', cors(), database.updateUser);
router.delete('/api/users/:id', cors(), database.deleteUser);

module.exports = router