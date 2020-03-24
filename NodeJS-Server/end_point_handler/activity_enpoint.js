const express = require('express')
const cors = require('cors');
const activityFinder = require('../db_handler/actvitiy_finder_controller');


const router = express.Router()

router.get('/api/activity/sfu/:text', cors(), activityFinder.getActivityAroundSFU);

module.exports = router