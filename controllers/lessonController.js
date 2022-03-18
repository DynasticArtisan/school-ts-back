const path = require("path");

class LessonController {
    async getLesson(req, res, next){
        try {
            const lesson = 'lesson1'
            return res.sendFile(path.join(__dirname, '..', '/lessons/lesson1.html'))
        } catch (e) {
            next(e);
        }
    }
    async getVideo(req, res, next){
        try {
            const video = 'lesson1.MP4'
            return res.sendFile(path.join(__dirname, '..', '/videos/lesson1.MP4'))
        } catch (e) {
            next(e)
        }
    }

}

module.exports = new LessonController()