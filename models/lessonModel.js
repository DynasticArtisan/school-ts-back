const { Schema, model } = require('mongoose');

const LessonSchema = new Schema({
    index: { type: Number },
    urlname: { type: String },
    title: { type: String },
    description: { type: String },
    module: { type: Schema.Types.ObjectId, rel: 'Modules' },
    prevLesson: { type: Schema.Types.ObjectId, rel: 'Lessons' },
    nextLesson: { type: Schema.Types.ObjectId, rel: 'Lessons' },
})

module.exports = model('Lessons', LessonSchema)