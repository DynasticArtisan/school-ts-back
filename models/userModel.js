const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email : {type: String, unique: true, required: true},
    password : {type: String, required: true},
    isActivated : {type: Boolean, default: false},
    activateLink : {type: String},
    role: { type: String, required:true, default: 'user' },
    newNotifications: { type: Boolean },
    avatar: { type: String },
    info: {
        birthday: { type: String },
        phone: { type: String },
        city: { type: String },
        gender: { type: String },
        status: { type: String },
    },
    settings: {
        notifications: {
            courseNotif: { type: Boolean, required: true, default: true },
            lessonsNotif: { type: Boolean, required: true, default: true },
            actionsNotif: { type: Boolean, required: true, default: true },
        }
    },

})

module.exports = model('User', UserSchema)