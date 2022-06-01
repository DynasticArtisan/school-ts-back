const fileService = require("../services/fileService")

class FilesController {
    async getFilesList(req, res, next){
        try {
        const Files = await fileService.getFileList()
        res.json(Files)
        } catch (e) {
            next(e)
        }
    }

    async deleteFile(req, res, next){
        try {
            const { file } = req.params;
            await fileService.deleteFile(file)
            res.json('Файл удален')
        } catch (e) {
            next(e)
        }

    }

}
module.exports = new FilesController()