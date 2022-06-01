const { Schema, model } = require('mongoose');
const fs = require('fs')

const FilesSchema = new Schema({
    homework: { type: Schema.Types.ObjectId, ref: 'Homeworks' },
    filename: { type: String, required: true },
    filepath: { type: String, required: true, unique: true }
}, { timestamps: true }
)


FilesSchema.post('findOneAndDelete', function(doc){
    console.log('findOneAndDelete')
    fs.unlink('filestore/'+doc.filepath, function(err){
        if(err){
            console.log(err)
        }
    })
})


module.exports = model('Files', FilesSchema)