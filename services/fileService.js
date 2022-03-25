const fs = require('fs')

class FileService {
    async removeAvatar(file){
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