const { Schema, model } = require('mongoose');

const CourseProgressSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: Schema.Types.ObjectId, ref: 'Courses', required: true },
    format: { type: String, default: 'оптимальный' },
    isAvailable: { type: Boolean, default: true },
    isCompleted: { type: Boolean, default: false },
    endAt: { type: Date }
},
{
    timestamps: true
})


CourseProgressSchema.virtual('completedLessonsCount',{
    ref: "UsersLessonProgress",
    localField: "course",
    foreignField: "course",
    match: progress => ({ user: progress.user, isCompleted: true }),
    count: true
})
CourseProgressSchema.virtual('totalLessonsCount',{
    ref: "Lessons",
    localField: "course",
    foreignField: "course",
    count: true
})

CourseProgressSchema.virtual('lastLesson',{
    ref: "UsersLessonProgress",
    localField: "course",
    foreignField: "course",
    match: progress => ({ user: progress.user, isCompleted: true }),
    justOne: true
})


module.exports = model('UsersCourseProgress', CourseProgressSchema)