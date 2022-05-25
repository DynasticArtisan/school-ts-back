const { Schema, model } = require('mongoose');

const ModuleSchema = new Schema({
    urlname: { type: String },
    title: { type: String },
    description: { type: String },
    course: { type: Schema.Types.ObjectId, rel: 'Courses' },
    firstModule: { type: Boolean },
    prevModule: { type: Schema.Types.ObjectId, rel: 'Modules' },
})

ModuleSchema.virtual('lessons', {
    ref: 'Lessons',
    localField: '_id',
    foreignField: 'module'
})

ModuleSchema.virtual('progress', {
    ref: 'UsersModuleProgress',
    localField: '_id',
    foreignField: 'module',
    justOne: true
})

module.exports = model('Modules', ModuleSchema)