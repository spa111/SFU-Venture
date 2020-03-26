const express = require('express')
const cors = require('cors');
const activityFinder = require('../db_handler/actvitiy_finder_controller');


const router = express.Router()

router.post('/api/activityAround/', cors(), activityFinder.getActivityAround);
router.get('/api/activity', cors(), activityFinder.getAllActivities);
router.post('/api/activity', cors(), activityFinder.createActivity);
router.get('/api/activity/:id', cors(), activityFinder.getActivityById);
router.delete('/api/activity/:id', cors(), activityFinder.deleteActivityById);
module.exports = router