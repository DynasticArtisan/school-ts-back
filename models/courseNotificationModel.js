const { Schema, model } = require('mongoose');

const NotificationSchema = new Schema({
    course: { type: Schema.Types.ObjectId, ref: 'Courses' }
},{
    timestamps: true
})

module.exports = model('Notifications', NotificationSchema)