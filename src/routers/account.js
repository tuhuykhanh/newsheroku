const express = require('express')
const router = express.Router();
const accountConstroller = require('../app/controllers/AccountController')
const checklogout = require('../app/middlewares/CheckLogOut')

const path = require('path');
//midleware uploads file
const multer  = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(__dirname, '../public/uploads'))
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix + '.jpg') 
    }
  })
const upload = multer({ storage: storage })


//login
router.get('/login',checklogout.requiresLogout,accountConstroller.login);


router.post('/login',checklogout.requiresLogout,accountConstroller.loginsubmit);

//profile

router.get('/profile',checklogout.requiresLogin,accountConstroller.profile);

// router.post('/profile/edit',accountConstroller.uploadfile);

router.get('/profile/edit',checklogout.requiresLogin,accountConstroller.profileEdit);
router.put('/profile/edit/:id',upload.single('avatar'),checklogout.requiresLogin,accountConstroller.update);

//change password form 
router.get('/profile/changepass' ,checklogout.requiresLogin, accountConstroller.changepass)
router.post('/profile/changepass/:id',checklogout.requiresLogin, accountConstroller.changepasspost)

//log out
router.get('/logout',
checklogout.requiresLogin,
accountConstroller.logout);

//form register GET
router.get('/register',checklogout.requiresLogout,accountConstroller.register);

//form register POST
router.get('/activate/:token', accountConstroller.activeMail);
router.post('/store', accountConstroller.store);


router.post('/password_resets',accountConstroller.sendmailpass);

router.get('/password_resets',accountConstroller.resetpassword);

router.get('/reset/:userid',accountConstroller.newpassword);
router.post('/reset/:userid',accountConstroller.newpasswordsm);




module.exports = router;