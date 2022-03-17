const { Schema, model } = require('mongoose');

const CourseSchema = new Schema({
    title: { type: String },
    description: { type: String },
    image: { type: String },
    modules: [{ type: Schema.Types.ObjectId, ref: 'Modules' }]
})

module.exports = model('Course', CourseSchema)