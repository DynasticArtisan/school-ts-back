const progressService = require("../services/progressService");

class ProgressController {
    async getAllULProgress (req, res, next) {
        try {
            const ULProgress = await progressService.getAllULProgress();
            res.json(ULProgress)
        } catch (err) {
            next(err)
        }
    }

    async createULProgress (req, res, next) {
        try {
            const { userID, lessonID } = req.body;
            const ULProgress = await progressService.createULProgress(userID, lessonID);
            res.json(ULProgress)
        } catch (err) {
            next(err)
        }
    }

    async readULProgress (req, res, next) {
        try {
            const { userID, lessonID } = req.body;
            const ULProgress = await progressService.readULProgress(userID, lessonID);
            res.json(ULProgress)
        } catch (err) {
            next(err)
        }
    }

    async deleteULProgress (req, res, next) {
        try {
            const { userID, lessonID } = req.body;
            const ULProgress = await progressService.deleteULProgress(userID, lessonID);
            res.json(ULProgress)
        } catch (err) {
            next(err)
        }
    }

    // Module
    async getAllUMProgress (req, res, next) {
        try {
            const UMProgress = await progressService.getAllUMProgress();
            res.json(UMProgress)
        } catch (err) {
            next(err)
        }
    }

    async createUMProgress (req, res, next) {
        try {
            const { userID, moduleID } = req.body;
            const UMProgress = await progressService.createUMProgress(userID, moduleID);
            res.json(UMProgress)
        } catch (err) {
            next(err)
        }
    }

    async readUMProgress (req, res, next) {
        try {
            const { userID, moduleID } = req.body;
            const UMProgress = await progressService.readUMProgress(userID, moduleID);
            res.json(UMProgress)
        } catch (err) {
            next(err)
        }
    }

    async deleteUMProgress (req, res, next) {
        try {
            const { userID, moduleID } = req.body;
            const UMProgress = await progressService.deleteUMProgress(userID, moduleID);
            res.json(UMProgress)
        } catch (err) {
            next(err)
        }
    }

    // Courses
    async getAllUCProgress (req, res, next) {
        try {
            const UCProgress = await progressService.getAllUCProgress();
            res.json(UCProgress)
        } catch (err) {
            next(err)
        }
    }

    async createUCProgress (req, res, next) {
        try {
            const { userID, courseID } = req.body;
            const UCProgress = await progressService.createUCProgress(userID, courseID);
            res.json(UCProgress)
        } catch (err) {
            next(err)
        }
    }

    async readUCProgress (req, res, next) {
        try {
            const { userID, courseID } = req.body;
            const UCProgress = await progressService.readUCProgress(userID, courseID);
            res.json(UCProgress)
        } catch (err) {
            next(err)
        }
    }

    async deleteUCProgress (req, res, next) {
        try {
            const { userID, courseID } = req.body;
            const UCProgress = await progressService.deleteUCProgress(userID, courseID);
            res.json(UCProgress)
        } catch (err) {
            next(err)
        }
    }



    async createUserProgress (req, res, next) {
        try {
            const { userID, courseID } = req.body;
            const UserProgress = await progressService.createUserProgress(userID, courseID);
            res.json(UserProgress)
        } catch (err) {
            next(err)
        }
    }

    async dropDB(req,res,next){
        try {
            await progressService.dropAllProgress()
            res.json('data droped')
        } catch (err) {
            next(err)
        }
    }
}

module.exports = new ProgressController()