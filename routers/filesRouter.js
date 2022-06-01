const express = require("express");
const filesController = require("../controllers/filesController");

const filesRouter = express.Router();


filesRouter.get('/', filesController.getFilesList)
filesRouter.delete('/:file', filesController.deleteFile)




module.exports = filesRouter;