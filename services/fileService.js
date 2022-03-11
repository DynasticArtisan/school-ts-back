const fs = require('fs')

const ApiError = require('../exceptions/ApiError')
class FileService {
    async removeAvatar(file){
        const path = 
        await fs.unlink(`images/${file}`, (err)=>{
            if(err){
                console.log(err)
                return false
            } else {
                return true
            }
        })
    }
}
module.exports = new FileService()