const path = require("path")
const multer = require("multer")

types = ['image/png', 'image/jpeg', 'image/jpg']

storage = multer.diskStorage ({
    destination(req, file, cb){
        cb(null, 'filestore/avatars')
    },
    filename(req, file, cb){
        cb(null, req.user.id + Date.now() + path.extname(file.originalname))
    }
})

fileFilter = (req, file, cb) => {
    if(types.includes(file.mimetype)){
        cb(null, true)
    } else {
        cb(null, false)
    }
}

module.exports = multer({ storage, fileFilter }).single("avatar")