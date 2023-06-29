const path = require('path');
const multer = require('multer');

const tempPath = path.join(__dirname, "..", 'temp');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, tempPath)
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({
    storage
})

module.exports = upload