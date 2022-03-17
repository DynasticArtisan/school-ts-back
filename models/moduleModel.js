const { Schema, model } = require('mongoose');

const ModuleSchema = new Schema({
    title: { type: String },
    description: { type: String },
    lessons: [{ type: Schema.Types.ObjectId, ref: 'Lessons' }]
})

module.exports = model('Modules', ModuleSchema)