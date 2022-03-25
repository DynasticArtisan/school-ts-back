const { Schema, model } = require('mongoose');

const NotificationSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required:true },
    type: { type: String, required: true },
    lesson: { type: Schema.Types.ObjectId, ref: 'Lessons' },
    course: { type: Schema.Types.ObjectId, ref: 'Courses' }
})

module.exports = model('Notifications', NotificationSchema)