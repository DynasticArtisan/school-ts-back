const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
    info: {
        birthday: { type: String },
        phone: { type: String },
        city: { type: String },
        sex: { type: String },
        status: { type: String },
        avatar: { type: String }
    },
    settings: {
        notifications: {
            courseNotif: { type: Boolean, required: true, default: true },
            lessonsNotif: { type: Boolean, required: true, default: true },
            actionsNotif: { type: Boolean, required: true, default: true },
        }
    },
    notifications: [],
    courses: [
        {
            id: { type: Schema.Types.ObjectId, ref: 'Courses' },
            currentModule: { type: Schema.Types.ObjectId, ref: 'Modules' },
            currentLesson: { type: Schema.Types.ObjectId, ref: 'Lessons' },
            progress: {
                modules: [{ 
                    id: { type: Schema.Types.ObjectId, ref: 'Modules' },
                    available: { type: Boolean, default: false },
                    passed: { type: Boolean, default: false }
                 }],
                lessons: [{ 
                   id: { type: Schema.Types.ObjectId, ref: 'Lessons' },
                   available: { type: Boolean, default: false },
                   passed: { type: Boolean, default: false }
                }]
            }
        }
    ],
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email : {type: String, unique: true, required: true},
    password : {type: String, required: true},
    isActivated : {type: Boolean, default: false},
    activateLink : {type: String},
    role: { type: String, required:true, default: 'user' },

})

module.exports = model('User', UserSchema)