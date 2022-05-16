const { Schema, model } = require('mongoose');

const UMProgressSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    course: { type: Schema.Types.ObjectId, ref: 'UsersCourseProgress' },
    module: { type: Schema.Types.ObjectId, rel: 'Modules' },
    lessons: [{
        type: Schema.Types.ObjectId, rel: 'UsersLessonProgress'
    }],
    isComplited: { type: Boolean, default: false }
})

module.exports = model('UsersModuleProgress', UMProgressSchema)