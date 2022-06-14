const path = require("path");
const multer = require("multer");
const roles = require("../utils/roles");

types = ['image/png', 'image/jpeg', 'image/jpg']

storage = multer.diskStorage ({
    destination(req, file, cb){
        cb(null, 'filestore/homeworks')
    },
    filename(req, file, cb){
        cb(null, req.user.id + Date.now().toString() + path.extname(file.originalname))
    }
})

fileFilter = (req, file, cb) => {
    if(types.includes(file.mimetype) && req.user.role === roles.user){
        cb(null, true)
    } else {
        cb(null, false)
    }
}

module.exports = multer({ storage, fileFilter }).single("file")