const { Schema, model } = require('mongoose');

const UCProgressSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    course: { type: Schema.Types.ObjectId, ref: 'Courses' },
    isAvailable: { type: Boolean, default: true },
    lastLesson: { type: Schema.Types.ObjectId, ref: 'Lessons' },
    lastModule: { type: Schema.Types.ObjectId, ref: 'Modules' },
    isCompleted: { type: Boolean, default: false },
},{
    timestamps: true
})


module.exports = model('UsersCourseProgress', UCProgressSchema)