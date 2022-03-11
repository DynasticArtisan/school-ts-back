const express = require('express');
const superController = require('../controllers/superController');

const superRouter = express.Router();
superRouter.post('/role', superController.setRole);

superRouter.post('/delete', superController.deleteUser);


module.exports = superRouter;