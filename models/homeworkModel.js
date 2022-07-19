const { Schema, model } = require('mongoose');
const fileService = require('../services/fileService');

const HomeworkSchema = new Schema({
    exercise: { type: Schema.Types.ObjectId, ref: 'Exercise' },
    course: { type: Schema.Types.ObjectId, ref: 'Courses'},
    lesson: { type: Schema.Types.ObjectId, ref: 'Lessons'},
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, default: 'wait' },
    comment: { type: String },
    checkBy: { type: Schema.Types.ObjectId, ref: 'User' }
},{
    timestamps: true
})

HomeworkSchema.virtual("files", {
    ref: "Files",
    foreignField: "homework",
    localField: "_id"
})

HomeworkSchema.virtual("lastfile", {
    ref: "Files",
    foreignField: "homework",
    localField: "_id",
    justOne: true
})






module.exports = model('Homeworks', HomeworkSchema)