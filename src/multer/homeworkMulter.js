const path = require("path");
const multer = require("multer");
const roles = require("../utils/roles");

const types = ['image/png', 'image/jpeg', 'image/jpg', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']

const storage = multer.diskStorage ({
    destination(req, file, cb){
        cb(null, 'filestore/homeworks')
    },
    filename(req, file, cb){
        cb(null, req.user.id + Date.now().toString() + path.extname(file.originalname))
    }
})

const fileFilter = (req, file, cb) => {
    console.log(file.mimetype)
    if(types.includes(file.mimetype) && req.user.role === roles.user){
        cb(null, true)
    } else {
        cb(null, false)
    }
}

module.exports = multer({ storage, fileFilter }).single("file")