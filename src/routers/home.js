const express = require('express')
const router = express.Router();
const homeController = require('../app/controllers/HomeController')

const path = require('path');
const multer  = require('multer')
const crypto = require('crypto');

const storage = multer.diskStorage({
    //folder upload -> public/upload
    destination: path.resolve(__dirname, '../public/img/postContent'),
    filename: function (req, file, cb) {
      crypto.pseudoRandomBytes(16, function (err, raw) {
        if (err) return cb(err)
        cb(null, Math.floor(Math.random()*9000000000) + 1000000000 + path.extname(file.originalname))
      })
    }
})
const upload = multer({ storage: storage })

// router.post('/upload',upload.array('flFileUpload', 12),homeController.upload)
// router.get('/files',homeController.fileUpload)

//search
router.get('/search',homeController.searchPage)
router.get('/',homeController.index)

module.exports =  router;



