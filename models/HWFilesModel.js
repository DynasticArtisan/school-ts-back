const { Schema, model } = require('mongoose');

const HomeworkFilesSchema = new Schema({
    homework: { type: Schema.Types.ObjectId, ref: 'Homeworks' },
    path: { type: String },
},{
    timestamps: true
})

module.exports = model('HomeworkFiles', HomeworkFilesSchema)