const { Schema, model } = require('mongoose');

const HomeworkFilesSchema = new Schema({
    homework: { type: Schema.Types.ObjectId, ref: 'Homework' },
    path: { type: String },
},{
    timestamps: true
})

module.exports = model('HomeworkFiles', HomeworkFilesSchema)