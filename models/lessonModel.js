const { Schema, model } = require('mongoose');

const LessonSchema = new Schema({
    title: { type: String },
    description: { type: String },
    urlname: { type: String },
})

module.exports = model('Lessons', LessonSchema)