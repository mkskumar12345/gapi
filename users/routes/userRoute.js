const express = require('express');
const { registration, userLogin, userLogout } = require('../controllers/userController');
const { user_tokenval } = require('../middleware/user_token_val');
const userRoute = express.Router();


userRoute.route('/citizen/signup').post(registration)
userRoute.route('/user/login').post(userLogin)
userRoute.route('/user/logout').get(user_tokenval,userLogout)




module.exports = userRoute