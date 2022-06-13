const { Schema, model } = require('mongoose');
const fileService = require('../services/fileService');

const HomeworkSchema = new Schema({
    course: { type: Schema.Types.ObjectId, ref: 'Courses'},
    exercise: { type: Schema.Types.ObjectId, ref: 'Exercise' },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    status: { type: String },
    Comment: { type: String }
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






module.exports = model('Homework', HomeworkSchema)