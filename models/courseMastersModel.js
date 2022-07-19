const { Schema, model } = require('mongoose');

const CourseMasterSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: Schema.Types.ObjectId, ref: 'Courses', required: true },
    isAvailable: { type: Boolean, default: true },
},
{
    timestamps: true
})

CourseProgressSchema.virtual('verifiedHomeworksCount',{
    ref: "HomeworkVerifies",
    localField: "_id",
    foreignField: "verifiedBy",
    count: true
})


module.exports = model('CourseMasters', CourseMasterSchema)