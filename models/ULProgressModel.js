const { Schema, model } = require('mongoose');

const ULProgressSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' , required: true },
    module: { type: Schema.Types.ObjectId, rel: 'UsersModuleProgress' },
    lesson: { type: Schema.Types.ObjectId, rel: 'Lessons', required: true },
    isComplited: { type: Boolean, default: false }
})

module.exports = model('UsersLessonProgress', ULProgressSchema)