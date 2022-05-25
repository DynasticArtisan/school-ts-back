const { Schema, model } = require('mongoose');

const ULProgressSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' , required: true },
    course: { type: Schema.Types.ObjectId, ref: 'Courses' },
    lesson: { type: Schema.Types.ObjectId, ref: 'Lessons', required: true },
    module: { type: Schema.Types.ObjectId, ref: 'Modules' },
    isCompleted: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
},{
    timestamps: true
})

module.exports = model('UsersLessonProgress', ULProgressSchema)