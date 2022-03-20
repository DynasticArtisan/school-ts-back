const { Schema, model } = require('mongoose');

const ModuleSchema = new Schema({
    urlname: { type: String },
    title: { type: String },
    description: { type: String },
    lessons: [
        { type: Schema.Types.ObjectId, rel: 'Lessons' }
    ]
})

module.exports = model('Modules', ModuleSchema)