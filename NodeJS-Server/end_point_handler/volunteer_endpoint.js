const express = require('express')
const cors = require('cors');
const database = require('../db_handler/db-controller_volunteer');


const router = express.Router()

router.get('/api/volunteer', cors(), database.getAllVolunteerPos);
router.post('/api/createVolunteer', cors(), database.createVolunteerPos);
router.get('/api/volunteer/:id', cors(), database.getVolunteerPosById);
router.delete('/api/volunteer/:id', cors(), database.deleteVolunteerPos);

module.exports = router