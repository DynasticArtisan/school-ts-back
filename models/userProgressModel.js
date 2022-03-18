const { Schema, model } = require('mongoose');

const UserProgressSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    courses: [
        {
            course: { type: Schema.Types.ObjectId, ref: 'Courses' },
            lessonsCompleted: { type: Number, default: 0 }
        }
    ],
    modules: [
        {
            module: { type: Schema.Types.ObjectId, ref: 'Modules' },
            isComplited: { type: Boolean, default: false }
        }
    ],
    lessons: [
        {
            lesson: { type: Schema.Types.ObjectId, ref: 'Lessons' },
            isComplited: { type: Boolean, default: false }
        }
    ],
    currentLesson: { type: Schema.Types.ObjectId, ref: 'Lessons' }

})

module.exports = model('UserProgress', UserProgressSchema)