const { Schema, model } = require('mongoose');

const LessonSchema = new Schema({
    title: { type: String },
    description: { type: String },
    module: { type: Schema.Types.ObjectId, rel: 'Modules' },
    course: { type: Schema.Types.ObjectId, rel: 'Courses' },
    firstLesson: { type: Boolean },
    prevLesson: { type: Schema.Types.ObjectId, rel: 'Lessons' },
})

LessonSchema.virtual('progress', {
    ref: 'UsersLessonProgress',
    localField: '_id',
    foreignField: 'lesson',
    justOne: true
})

LessonSchema.virtual('nextLesson', {
    ref: 'Lessons',
    localField: '_id',
    foreignField: 'prevLesson',
    justOne: true
})

LessonSchema.virtual('exercise', {
    ref: 'Exercise',
    localField: '_id',
    foreignField: 'lesson',
    justOne: true
})


module.exports = model('Lessons', LessonSchema)