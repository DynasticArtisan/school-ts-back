const path = require("path");
const multer = require("multer");
const roles = require("../utils/roles");

const types = ['image/png', 'image/jpeg', 'image/jpg']
const fields = [
    {
        name: 'image', maxCount: 1
    },
    {
        name: 'icon', maxCount: 1
    }
]

const storage = multer.diskStorage ({
    destination(req, file, cb){
        cb(null, 'filestore/images')
    },
    filename(req, file, cb){
        cb(null, file.fieldname + Date.now().toString() + path.extname(file.originalname))
    }
})

const fileFilter = (req, file, cb) => {
    if(req.user.role === roles.super && types.includes(file.mimetype)){
        cb(null, true)
    } else {
        cb(null, false)
    }
}

module.exports = multer({ storage, fileFilter }).fields(fields)