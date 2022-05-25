const progressService = require("../services/progressService");

class ProgressController {
    // Lesson progress
    async createULProgress (req, res, next) {
        try {
            const { userID, lessonID } = req.body;
            const ULProgress = await progressService.createULProgress(userID, lessonID);
            res.json(ULProgress)
        } catch (err) {
            next(err)
        }
    }
    async getAllULProgress (req, res, next) {
        try {
            const ULProgress = await progressService.getAllULProgress();
            res.json(ULProgress)
        } catch (err) {
            next(err)
        }
    }
    async getOneULProgress (req, res, next) {
        try {  
            const { progressID } = req.params;
            const ULProgress = await progressService.getOneULProgress(progressID);
            res.json(ULProgress)
        } catch (e) {
            next(e)
        }
    }
    async updateULProgress (req, res, next) {
        try {
            const { progressID } = req.params;
            const ULProgress = await progressService.updateULProgress(progressID, req.body)
            res.json(ULProgress)
        } catch (e) {
            next(e)
        }
    }
    async deleteULProgress (req, res, next) {
        try {
            const { progressID } = req.params;
            const ULProgress = await progressService.deleteULProgress(progressID);
            res.json(ULProgress)
        } catch (err) {
            next(err)
        }
    }
    async deleteAllULProgress (req, res, next) {
        try {
            const ULProgress = await progressService.deleteAllULProgress()
            res.json(ULProgress)
        } catch (e) {
            next(e)
        }
    }

    // Module progress
    async createUMProgress (req, res, next) {
        try {
            const UMProgress = await progressService.createUMProgress(req.body);
            res.json(UMProgress)
        } catch (err) {
            next(err)
        }
    }
    async getAllUMProgress (req, res, next) {
        try {
            const UMProgress = await progressService.getAllUMProgress();
            res.json(UMProgress)
        } catch (err) {
            next(err)
        }
    }
    async getOneUMProgress (req, res, next) {
        try {
            const { progressID } = req.params;
            const UMProgress = await progressService.getOneUMProgress(progressID)
            res.json(UMProgress)
        } catch (err) {
            next(err)
        }
    }
    async updateUMProgress (req, res, next) {
        try {
            const { progressID } = req.params;
            const UMProgress = await progressService.updateUMProgress(progressID, req.body)
            res.json(UMProgress)
        } catch (err) {
            next(err)
        }
    }
    async deleteUMProgress (req, res, next) {
        try {
            const { progressID } = req.params;
            const UMProgress = await progressService.deleteUMProgress(progressID)
            res.json(UMProgress)
        } catch (err) {
            next(err)
        }
    }
    async deleteAllUMProgress (req, res, next) {
        try {
            const UMProgress = await progressService.deleteAllUMProgress()
            res.json(UMProgress)            
        } catch (e) {
            next(e)
        }
    }

    // Courses progress
    async createUCProgress (req, res, next) {
        try {
            const UCProgress = await progressService.createUCProgress(req.body);
            res.json(UCProgress)
        } catch (err) {
            next(err)
        }
    }
    async getAllUCProgress (req, res, next) {
        try {
            const UCProgress = await progressService.getAllUCProgress();
            res.json(UCProgress)
        } catch (err) {
            next(err)
        }
    }
    async getOneUCProgress (req, res, next) {
        try {
            const { progressID } = req.params;
            const UCProgress = await progressService.getOneUCProgress(progressID)
            res.json(UCProgress)
        } catch (err) {
            next(err)
        }
    }
    async updateUCProgress (req, res, next) {
        try {
            const { progressID } = req.params;
            const UCProgress = await progressService.updateUCProgress(progressID, req.body)
            res.json(UCProgress)
        } catch (err) {
            next(err)
        }
    }
    async deleteUCProgress (req, res, next) {
        try {
            const { progressID } = req.params;
            const UCProgress = await progressService.deleteUCProgress(progressID)
            res.json(UCProgress)
        } catch (err) {
            next(err)
        }
    }
    async deleteAllUCProgress (req, res, next) {
        try {
            const UCProgress = await progressService.deleteAllUCProgress()
            res.json(UCProgress)            
        } catch (e) {
            next(e)
        }
    }





    // User Access Managing
    async unlockCourseToUser(req, res, next){
        try {
            const { user, course } = req.body;
            const Course = await progressService.unlockCourseToUser(course, user)
            res.json(Course)
        } catch (e) {
            next(e)
        }
    }

    async completeLesson(req, res, next){
        try {
            const { lesson, user } = req.body;
            const data = await progressService.completeLesson(lesson, user)
            res.json(data)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new ProgressController()