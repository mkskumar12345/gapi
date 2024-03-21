const express = require('express');
const { add_citizen, delete_citizen } = require('../controllers/usersController');
const admin_token_val = require('../middleware/adminTokenVal')
const usersRoute = express.Router();




usersRoute.route('/add/citizen').post(admin_token_val,add_citizen);
usersRoute.route('/delete/citizen/:citizen_id').delete(admin_token_val,delete_citizen);



module.exports = usersRoute;