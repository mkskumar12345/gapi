const express = require('express');
const { delete_citizen, add_official, delete_official, no_all_users, show_all_officials, show_all_citizens } = require('../controllers/usersController');
const admin_token_val = require('../middleware/adminTokenVal')
const usersRoute = express.Router();




usersRoute.route('/add/official').post(admin_token_val,add_official);
usersRoute.route('/delete/official/:user_id').delete(admin_token_val,delete_official);
usersRoute.route('/delete/citizen/:user_id').delete(admin_token_val,delete_citizen);
usersRoute.route('/number/all/users').get(admin_token_val,no_all_users);
usersRoute.route('/show/all/officials').get(admin_token_val,show_all_officials);
usersRoute.route('/show/all/citizens').get(admin_token_val,show_all_citizens);



module.exports = usersRoute;