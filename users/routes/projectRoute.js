const express = require('express');
const uploadProject = require('../../utils/projectImg');
const { addProject, show_no_of_project, show_all_projects, projects_by_type, view_projects_by_id } = require('../controllers/projectCont');
const { user_tokenval } = require('../middleware/user_token_val');
const projectRoute = express.Router();




projectRoute.route('/add/project').post(user_tokenval,uploadProject.array('images', 4),addProject)
projectRoute.route('/show/number/project').get(user_tokenval,show_no_of_project)
projectRoute.route('/show/all/project').get(show_all_projects)
projectRoute.route('/show/project/by/type').get(projects_by_type)
projectRoute.route('/view/project/by/id').get(view_projects_by_id)
// projectRoute.route('/show/closed/project').get(off_tokenval,closed_projects)
// projectRoute.route('/show/rejected/project').get(off_tokenval,rejected_projects)



module.exports = projectRoute