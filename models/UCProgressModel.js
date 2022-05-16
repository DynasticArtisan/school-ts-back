const { Schema, model } = require('mongoose');

const UCProgressSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    course: { type: Schema.Types.ObjectId, ref: 'Courses' },
    modules: [{
        type: Schema.Types.ObjectId, rel: 'UsersModuleProgress'
    }],
    isComplited: { type: Boolean, default: false }
})

module.exports = model('UsersCourseProgress', UCProgressSchema)