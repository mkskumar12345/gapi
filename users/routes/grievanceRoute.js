const express = require('express');
const { addGrievance, check_api, show_all_grievances, grievances_by_type, view_grievance_by_id} = require('../controllers/grievanceCont');
const upload = require('../../utils/imgandjpg');
const { user_tokenval } = require('../middleware/user_token_val');
const grievanceRoute = express.Router();




grievanceRoute.route('/add/grievance').post(user_tokenval,upload.array('images', 4),addGrievance)
grievanceRoute.route('/check/api').post(user_tokenval,check_api)
grievanceRoute.route('/show/all/grievance').get(user_tokenval,show_all_grievances)
grievanceRoute.route('/show/grievance/by/type').get(user_tokenval,grievances_by_type)
grievanceRoute.route('/view/grievance/by/id').get(user_tokenval,view_grievance_by_id)
// grievanceRoute.route('/show/closed/grievance').get(citizen_tokenval,closed_grievances)
// grievanceRoute.route('/show/rejected/grievance').get(citizen_tokenval,rejected_grievances)



module.exports = grievanceRoute