const { Schema, model } = require('mongoose');

const HomeworkVerifiesSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    homework: { type: Schema.Types.ObjectId, ref: 'Homeworks', required: true },
    course: { type: Schema.Types.ObjectId, ref: 'Courses', required: true },
},
{
    timestamps: true
})

module.exports = model('HomeworkVerifies', HomeworkVerifiesSchema)