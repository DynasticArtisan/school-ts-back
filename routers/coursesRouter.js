const express = require('express');
const coursesController = require('../controllers/coursesController');

const coursesRouter = express.Router();
coursesRouter.get('/', coursesController.getAllCoursesData)
module.exports = coursesRouter;