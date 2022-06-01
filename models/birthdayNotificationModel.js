const { Schema, model } = require('mongoose');

const BirthdayNotificationSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required:true }
})

module.exports = model('BirthdayNotifications', BirthdayNotificationSchema)