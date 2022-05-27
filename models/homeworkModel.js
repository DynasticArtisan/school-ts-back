const { Schema, model } = require('mongoose');
const fileService = require('../services/fileService');

const HomeworkSchema = new Schema({
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

HomeworkSchema.post('findOneAndDelete', function(doc){
    fileService.deleteHomeworkFiles(doc._id)
})





module.exports = model('Homework', HomeworkSchema)