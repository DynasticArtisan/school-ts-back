const { Schema, model } = require('mongoose');

const UserProgressSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    lessons: [{
        lesson: { type: Schema.Types.ObjectId, ref: 'Lessons' },
        isCompleted: { type: Boolean },
    }],
    currentLesson: { type: Schema.Types.ObjectId, ref: 'Lessons' }

    

})

module.exports = model('UserProgress', UserProgressSchema)





