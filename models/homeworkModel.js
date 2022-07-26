const { Schema, model } = require('mongoose');

const HomeworkSchema = new Schema({
    lesson: { type: Schema.Types.ObjectId, ref: 'Lessons'},
    course: { type: Schema.Types.ObjectId, ref: 'Courses'},
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, default: 'wait' },
    comment: { type: String }
},{
    timestamps: true
})
HomeworkSchema.virtual("files", {
    ref: "Files",
    foreignField: "homework",
    localField: "_id"
})







module.exports = model('Homeworks', HomeworkSchema)