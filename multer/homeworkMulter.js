const path = require("path");
const multer = require("multer");

types = ['image/png', 'image/jpeg', 'image/jpg']

storage = multer.diskStorage ({
    destination(req, file, cb){
        cb(null, 'filestore/homeworks')
    },
    filename(req, file, cb){
        cb(null, req.body.user + Date.now().toString() + path.extname(file.originalname))
    }
})

fileFilter = (req, file, cb) => {
    if(types.includes(file.mimetype)){
        cb(null, true)
    } else {
        cb(null, false)
    }
}

module.exports = multer({ storage, fileFilter }).single("file")