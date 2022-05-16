const { Schema, model } = require('mongoose');

const ModuleSchema = new Schema({
    urlname: { type: String },
    title: { type: String },
    description: { type: String },
    lessons: [
        { type: Schema.Types.ObjectId, rel: 'Lessons' }
    ],
    course: { type: Schema.Types.ObjectId, rel: 'Courses' },
    prevModule: { type: Schema.Types.ObjectId, rel: 'Modules' },
    nextModule: { type: Schema.Types.ObjectId, rel: 'Modules' },
})

module.exports = model('Modules', ModuleSchema)