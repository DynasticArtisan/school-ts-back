const { Schema, model } = require('mongoose');

const UCProgressSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    course: { type: Schema.Types.ObjectId, ref: 'Courses' },
    isAvailable: { type: Boolean, default: true },
    lastModule: { type: Schema.Types.ObjectId, ref: 'Modules' },
    isCompleted: { type: Boolean, default: false },
    format: { type: String, default: 'оптимальный' }
},
{
    timestamps: true
})

UCProgressSchema.virtual('totalCompleted',{
    ref: "UsersLessonProgress",
    localField: "course",
    foreignField: "course",
    match: progress => ({ user: progress.user, isCompleted: true }),
    count: true
})

UCProgressSchema.virtual('lastLesson',{
    ref: "UsersLessonProgress",
    localField: "course",
    foreignField: "course",
    match: progress => ({ user: progress.user, isCompleted: true }),
    justOne: true
})


module.exports = model('UsersCourseProgress', UCProgressSchema)