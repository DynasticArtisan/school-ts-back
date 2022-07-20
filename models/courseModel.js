const { Schema, model } = require('mongoose');

const CourseSchema = new Schema({
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    icon: { type: String }
})

CourseSchema.virtual('modules',{
    ref: "Modules",
    localField: "_id",
    foreignField: "course",
})

CourseSchema.virtual('progress', {
    ref: "UsersCourseProgress",
    localField: "_id",
    foreignField: "course",
    justOne: true
})

CourseSchema.virtual('mastering', {
    ref: "CourseMasters",
    localField: "_id",
    foreignField: "course",
    justOne: true
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