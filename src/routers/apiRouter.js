const authMiddleware = require('../middlewares/authMiddleware');
const express = require('express');
const config = require("config");
const request = require("request");

const apiRouter = express.Router();
const authRouter = require('./authRouter');
const usersRouter = require('./usersRouter');
const coursesRouter = require('./coursesRouter');
const modulesRouter = require('./modulesRouter');
const lessonsRouter = require('./lessonsRouter');
const homeworkRouter = require('./homeworkRouter');


// УБРАТЬ
const courseProgressModel = require('../models/courseProgressModel');
const moduleProgressModel = require('../models/moduleProgressModel');
const lessonProgressModel = require('../models/lessonProgressModel');
const homeworkModel = require('../models/homeworkModel');
const homeworkVerifyModel = require('../models/homeworkVerifyModel');
const homeworkFilesModel = require('../models/homeworkFilesModel');
const courseMasterModel = require('../models/courseMasterModel');
const { default: notifRouter } = require('./notifRouter');

apiRouter.use('/auth', authRouter);
apiRouter.use('/users', authMiddleware, usersRouter);
apiRouter.use('/courses', authMiddleware, coursesRouter);
apiRouter.use('/modules', authMiddleware, modulesRouter);
apiRouter.use('/lessons', authMiddleware, lessonsRouter);
apiRouter.use('/homework', authMiddleware, homeworkRouter);
apiRouter.use('/notification', notifRouter);


apiRouter.post('/test', async function(req, res, next){
    request(
      'https://api.mailopost.ru/v1/email/campaigns/643268/deliver ', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.get("MailoKey")}`
        }
      },
      (err, response, body) => {
        if (err) return res.status(500).send({ message: err })
    
        return res.send(body)
      }
    )
})

apiRouter.delete("/progress", async function(req, res, next){
    await courseProgressModel.deleteMany()
    await moduleProgressModel.deleteMany()
    await lessonProgressModel.deleteMany()
    await courseMasterModel.deleteMany()
    res.json("DELETED")
})

apiRouter.delete("/homeworks", async function(req, res, next){
    await homeworkModel.deleteMany()
    await homeworkFilesModel.deleteMany()
    await homeworkVerifyModel.deleteMany()
    res.json("DELETED")
})



module.exports = apiRouter;