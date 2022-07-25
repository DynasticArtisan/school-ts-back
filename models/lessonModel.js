const { Schema, model } = require('mongoose');

const LessonSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    withExercise: { type: Boolean, default: false },
    exercise: { type: String },
    module: { type: Schema.Types.ObjectId, rel: 'Modules', required: true },
    course: { type: Schema.Types.ObjectId, rel: 'Courses', required: true },
    firstLesson: { type: Boolean, default: false },
    prevLesson: { type: Schema.Types.ObjectId, rel: 'Lessons' },
})
LessonSchema.virtual('nextLesson', {
    ref: 'Lessons',
    localField: '_id',
    foreignField: 'prevLesson',
    justOne: true
})
LessonSchema.virtual('progress', {
    ref: 'UsersLessonProgress',
    localField: '_id',
    foreignField: 'lesson',
    justOne: true
})
LessonSchema.virtual('homework', {
    ref: "Homeworks",
    foreignField: "lesson",
    localField: "_id",
    justOne: true
})

module.exports = model('Lessons', LessonSchema)