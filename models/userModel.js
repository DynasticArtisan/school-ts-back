const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email : {type: String, unique: true, required: true},
    password : {type: String, required: true},
    isActivated : {type: Boolean, default: false},
    role: { type: String, required:true, default: 'user' },
    settings: {
        birthday: { type: String },
        phone: { type: String },
        city: { type: String },
        gender: { type: String },
        status: { type: String },
        avatar: { type: Number, min: 1, max: 12 },    
    },
    

    // остальное убрать

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
    newNotifications: { type: Boolean },
    activateLink : {type: String},
},{
    timestamps: true
})


module.exports = model('User', UserSchema)