const { Schema, model } = require('mongoose');

const ModuleSchema = new Schema({
    title: { type: String },
    description: { type: String },
    course: { type: Schema.Types.ObjectId, rel: 'Courses' },
    firstModule: { type: Boolean, default: false },
    prevModule: { type: Schema.Types.ObjectId, rel: 'Modules' },
})

ModuleSchema.virtual('nextModule', {
    ref: 'Modules',
    localField: '_id',
    foreignField: 'prevModule',
    justOne: true
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