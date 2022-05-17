const { Schema, model } = require('mongoose');

const UMProgressSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    module: { type: Schema.Types.ObjectId, rel: 'Modules' },
    isCompleted: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: false }
})

module.exports = model('UsersModuleProgress', UMProgressSchema)