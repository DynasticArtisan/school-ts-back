const { Schema, model } = require('mongoose');

const UCProgressSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    course: { type: Schema.Types.ObjectId, ref: 'Courses' },
    isCompleted: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: false }
})

module.exports = model('UsersCourseProgress', UCProgressSchema)