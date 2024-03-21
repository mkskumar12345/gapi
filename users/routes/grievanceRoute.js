const express = require('express');
const { addGrievance, show_no_of_grievances, show_all_grievances, pending_grievances, closed_grievances, rejected_grievances } = require('../controllers/grievanceCont');
const upload = require('../../utils/imgandjpg');
const { user_tokenval } = require('../middleware/citizenTokenVal');
const grievanceRoute = express.Router();




grievanceRoute.route('/add/grievance').post(user_tokenval,upload.array('images', 4),addGrievance)
grievanceRoute.route('/show/number/grievance').get(show_no_of_grievances)
grievanceRoute.route('/show/all/grievance').get(show_all_grievances)
grievanceRoute.route('/show/pending/grievance').get(pending_grievances)
grievanceRoute.route('/show/closed/grievance').get(closed_grievances)
grievanceRoute.route('/show/rejected/grievance').get(rejected_grievances)



module.exports = grievanceRoute