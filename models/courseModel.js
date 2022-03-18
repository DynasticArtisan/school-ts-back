const { Schema, model } = require('mongoose');

const CourseSchema = new Schema({
    urlname: { type: String },
    title: { type: String },
    subtitle: { type: String },
    description: { type: String },
    image: { type: String },
    modules: [ { type: Schema.Types.ObjectId, rel: 'Modules' } ]
})

module.exports = model('Courses', CourseSchema)