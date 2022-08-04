const { Schema, model } = require('mongoose');

const FilesSchema = new Schema({
    homework: { type: Schema.Types.ObjectId, ref: 'Homeworks' },
    filename: { type: String, required: true },
    filepath: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, required: true, ref: "Users" }
}, { timestamps: true }
)

module.exports = model('HomeworkFiles', FilesSchema)