const { Schema, model } = require('mongoose');

const HomeworkVerifiesSchema = new Schema({
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'CourseMasters', required: true },
    homework: { type: Schema.Types.ObjectId, ref: 'Homeworks', required: true },
},
{
    timestamps: true
})

module.exports = model('HomeworkVerifies', HomeworkVerifiesSchema)