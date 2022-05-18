const { Schema, model } = require('mongoose');

const CourseSchema = new Schema({
    urlname: { type: String },
    title: { type: String },
    subtitle: { type: String },
    description: { type: String },
    image: { type: String },
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


module.exports = model('Courses', CourseSchema)