const express = require('express')
const cors = require('cors');
const activityFinder = require('../db_handler/activity_finder_controller');


const router = express.Router()

router.post('/api/activityAround/', cors(), activityFinder.getActivityAround);
router.get('/api/activity', cors(), activityFinder.getAllActivities);
router.post('/api/createActivity', cors(), activityFinder.createActivity);
router.get('/api/activity/:id', cors(), activityFinder.getUserActivities);
router.delete('/api/activity/:id', cors(), activityFinder.deleteActivityById);
module.exports = router