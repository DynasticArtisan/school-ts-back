const { Schema, model } = require('mongoose');

const HomeworkSchema = new Schema({
    exercise: { type: Schema.Types.ObjectId, ref: 'Exercise' },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    status: { type: String },
    Comment: { type: String }
},{
    timestamps: true
})

HomeworkSchema.virtual("files", {
    ref: "HomeworkFiles",
    foreignField: "homework",
    localField: "_id"
})

module.exports = model('Homework', HomeworkSchema)