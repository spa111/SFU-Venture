const express = require('express')
const cors = require('cors');
const activityFinder = require('../db_handler/actvitiy_finder_controller');


const router = express.Router()

router.post('/api/activity/', cors(), activityFinder.getActivityAroundSFU);

module.exports = router