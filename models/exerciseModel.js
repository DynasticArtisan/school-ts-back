const { Schema, model } = require('mongoose');

const ExerciseSchema = new Schema({
    lesson: { type: Schema.Types.ObjectId, ref: 'Lessons' },
    module: { type: Schema.Types.ObjectId, ref: 'Modules' },
    task: { type: String }
})

module.exports = model('Exercise', ExerciseSchema)