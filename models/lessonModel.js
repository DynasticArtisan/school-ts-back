const { Schema, model } = require('mongoose');

const LessonSchema = new Schema({
    index: { type: Number },
    urlname: { type: String },
    title: { type: String },
    description: { type: String },
    
})

module.exports = model('Lessons', LessonSchema)