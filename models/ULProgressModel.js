const { Schema, model } = require('mongoose');

const ULProgressSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' , required: true },
    lesson: { type: Schema.Types.ObjectId, rel: 'Lessons', required: true },
    isCompleted: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: false },
})

module.exports = model('UsersLessonProgress', ULProgressSchema)