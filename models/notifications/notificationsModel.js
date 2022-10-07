const { Schema, model } = require('mongoose');

const NotifSchema = new Schema({
    user: { type: Schema.Types.ObjectId, rel: 'User', required: true },
    title: { type: String, required: true },
    image: { type: String, required: true },
    body: { type: String, required: true },
    readed: { type: Boolean, default: false }
})

module.exports = model('Notifications', NotifSchema)