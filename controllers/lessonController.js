const path = require("path");
const ApiError = require("../exceptions/ApiError");
const lessonsService = require("../services/lessonsService");
const tokenService = require("../services/tokenService");

class LessonController {
    async getLesson(req, res, next){
        try {
            const { lessonId } = req.params;
            const userId = req.user.id;
            const lesson = await lessonsService.getLessonData(userId, lessonId)
            return res.sendFile(path.join(__dirname, '..', `/lessons/${lesson}`))
        } catch (e) {
            next(e);
        }
    }
    async getVideo(req, res, next){
        try {
            const { refreshToken } = req.cookies;
            const userData = await tokenService.validateRefreshToken(refreshToken)
            if(userData.id !== '6229ccddd1bee500c4bd428f'){
                throw ApiError.UnauthorizedError()
            }
            return res.sendFile(path.join(__dirname, '..', '/videos/lesson1.MP4'))
        } catch (e) {
            next(e)
        }
    }

}

module.exports = new LessonController()