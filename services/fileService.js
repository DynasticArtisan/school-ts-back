const fs = require('fs')
const filesModel = require('../models/filesModel')
const ApiError = require("../exceptions/ApiError")

class FileService {
    async removeAvatar(file){
        await fs.unlink(`filestore/avatars/${file}`, (err)=>{
            if(err){
                console.log(err)
                return false
            } else {
                return true
            }
        })
    }

    async createHomeworkFile(payload){
        const File = await filesModel.create(payload)
        return File
    }

    async getFileList(){
        const Files = await filesModel.find()
        return Files
    }

    async deleteFile(fileID){
        const File = await filesModel.findByIdAndDelete(fileID)
        if(!File){
            throw ApiError.BadRequest("File not found")
        }
        return File
    }

    async deleteHomeworkFiles(homework){
        const Files = await filesModel.deleteMany({ homework });
        return Files
    }

}
module.exports = new FileService()