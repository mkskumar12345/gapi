const express = require('express');
const { get_villages_by_blockId, get_blocks } = require('../controllers/areasCont');
const areasRoute = express.Router();





areasRoute.route('/get/villagesby/block').get(get_villages_by_blockId);
areasRoute.route('/get/blocks').get(get_blocks);





module.exports = areasRoute;