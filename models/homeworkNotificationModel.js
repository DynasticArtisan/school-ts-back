const { Schema, model } = require('mongoose');

const HomeworkNotificationSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    homework: { type: Schema.Types.ObjectId, ref: 'Homework', required: true },
    new: { type: Boolean, default: true }
},{
    timestamps: true
})

module.exports = model('HomeworkNotifications', HomeworkNotificationSchema)