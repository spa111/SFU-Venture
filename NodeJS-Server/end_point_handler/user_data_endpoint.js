const express = require('express');
const cors = require('cors');
const database = require('../db_handler/db_controller');


const router = express.Router();

router.get('/api/users', cors(), database.getUsers);
router.get('/api/users/:id', cors(), database.getUserById);
router.get('/api/users/checkHasAdminPrivileges/:id', cors(), database.checkHasAdminPrivileges);
router.delete('/api/users/:id', cors(), database.deleteUser);
router.put('/api/users/:id/updatePrivileges', cors(), database.updatePrivileges);

router.post('/api/users/update-password', cors(), database.updatePassword);
router.post('/api/users/emailBuyerAndSeller', cors(), database.emailBuyerAndSeller);

module.exports = router;