const { Schema, model } = require('mongoose');

const CourseSchema = new Schema({
    urlname: { type: String },
    title: { type: String },
    subtitle: { type: String },
    description: { type: String },
    image: { type: String },
    mobileImage: { type: String },
})

CourseSchema.virtual('modules',{
    ref: "Modules",
    localField: "_id",
    foreignField: "course",
})

CourseSchema.virtual('totalLessons',{
    ref: "Lessons",
    localField: "_id",
    foreignField: "course",
    count: true
})

CourseSchema.virtual('totalCompleted',{
    ref: "UsersCourseProgress",
    localField: "_id",
    foreignField: "course",
    match: {
        isCompleted: true
    },
    count: true
})

CourseSchema.virtual('totalInProgress',{
    ref: "UsersCourseProgress",
    localField: "_id",
    foreignField: "course",
    match: {
        isCompleted: false
    },
    count: true
})

module.exports = model('Courses', CourseSchema)