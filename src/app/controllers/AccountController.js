const User = require('../models/User')
const bcrypt = require('bcrypt')
const { mutipleMongooseToObject } = require('../../util/handleBlockHbs')
const { mongooseToObject } = require('../../util/handleBlockHbs')
const jwt = require('jsonwebtoken')
const sendMail = require('../../config/sendMail')

const { CLIENT_URL } = process.env

const AccountController = {
    //form login
    login: async (req, res, next) => {
        res.render('account/login')
    },
    //form profile

    profile: async (req, res, next) => {
        res.render('account/profile')
    },

    profileEdit: async (req, res, next) => {
        res.render('account/profile_edit')
    },

    //update user from user
    update: async (req, res, next) => {
        try {
            const {username,address} = req.body

            const user = await User.findOne({ _id: req.params.id })

            await User.updateOne({ _id: req.params.id }, {
                username: username ? username : user.username,
                avatar: (req.file) ? req.file.path.split('\\').slice(5, 7).join('/') : user.avatar,
                address: address ? address : user.address,
            })
            req.session.user.username = username ? username : user.username,
            res.locals.lcuser.username = req.session.user.username
            req.session.user.avatar = (req.file) ? req.file.path.split('\\').slice(5, 7).join('/') : user.avatar
            req.session.user.address = address ? address : user.address,
            res.locals.lcuser = req.session.user

            await res.redirect('/account/profile')
            
        } catch (error) {

            return res.status(500).json({ msg: error.message }) 

        }
        
    },

    logout: async (req, res, next) => {
        try {
            if (req.session) {
                req.session.destroy(function (err) {
                    if (err) {
                        return res.json({ err });
                    } else {
                        return res.redirect(req.headers.referer)
                    }
                });
            }
        } catch (error) {
            return res.status(500).json({ msg: err.message })
        }
    },
    //form register
    register: async (req, res, next) => {
        res.render('account/register')
    },
    //form reset password
    resetpassword: async (req, res, next) => {
        res.render('account/resetpassword')
    },
    changepass: async (req, res, next) => {
        res.render('account/changepassword')
    },
    changepasspost: async (req, res, next) => {
        try {
            const { oldpassword, newpassword } = req.body
            const user = await User.findOne({ _id: req.params.id })
            if (!user)
                return res.status(500).json({ msg: err.message })
            const isMatch = await bcrypt.compare(oldpassword, user.password)
            if (!isMatch) return res.render('account/changepassword', {
                err: 'old password incorrect',
            })
            const passwordHash = await bcrypt.hash(newpassword, 12);
            await User.updateOne({ _id: req.params.id }, {
                password: passwordHash
            })

            res.redirect('/account/profile')

        } catch (error) {
            return res.status(500).json({ msg: err.message })
        }
    },

    //login function
    loginsubmit: async (req, res, next) => {
        try {
            const { email, password } = req.body
            const user = await User.findOne({ email: email })
            if (!user) return res.render('account/login', {
                err: 'This email does not exist.'
            })
            if (user.status === 'lock')
                return res.render('account/login', {
                    err: 'your account has been locked !!!'
                })
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) return res.render('account/login', {
                errpass: 'password incorrect'
            })
            req.session.isLogged = true;
            req.session.user = user

            if (req.session.user.role === 'admin') {
                req.session.isAdmin = true
            }

            const url = req.query.reURL || '/'
            res.redirect(url)

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }

    },
    //register user
    store: async (req, res, next) => {
        try {
            const { username, email, password } = req.body

            const user = await User.findOne({ email: email })
            if (user) return res.render('account/register', {
                err: 'email has been used',
            })
            const passwordHash = await bcrypt.hash(password, 12);

            const newUser = {
                username, email, password: passwordHash
            }

            const activation_token = createActivationToken(newUser);

            const url = `${CLIENT_URL}/account/activate/${activation_token}`;

            sendMail(email, url, "Verify your email address");

            res.render('account/register', {
                notification: "Register Success! Please activate your email to login."
            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    activeMail: async (req, res, nex) => {
        try {

            const token = req.params.token

            const user = jwt.verify(token, process.env.ACTIVATION_TOKEN_SECRET)

            const { username, email, password } = user

            const check = await User.findOne({ email: email })

            if (check) return res.status(400).json({ msg: "This email already exists." })

            const newUser = new User({
                username, email, password
            })

            await newUser.save();

            res.redirect('/account/login')


        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    ////reset pass word from send mail
    sendmailpass: async (req, res, next) => {
        try {

            const { email } = req.body
            const user = await User.findOne({ email })
            if (!user)
                return res.render('account/resetpassword', {
                    err: 'this email dose not exist!'
                })

            const userId = user._id

            const url = `${CLIENT_URL}/account/reset/${userId}`

            sendMail(email, url, "Reset your password")

            res.render('account/resetpassword', {
                notification: 'Re-send the password, please check your email.',
            })


        } catch (err) {
            return res.status(500).json({ msg: err.message })

        }
    },
    newpassword: async (req, res, next) => {
        try {
            await res.render('account/mailresetpass')
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    newpasswordsm: async (req, res) => {
        try {

            const { newpassword } = req.body
            const id = req.params.userid
            const user = await User.findOne({_id:req.params.userid })
            if (!user)
                return res.render('account/mailresetpass', {
                    err: 'not found user!'
                })

            const passwordHash = await bcrypt.hash(newpassword, 12);

            await User.updateOne({ _id: id }, {
                password: passwordHash
            })

            res.redirect('/account/login')
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }

}

const createActivationToken = (payload) => {
    return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, { expiresIn: '5m' })
}

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
}

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}

module.exports = AccountController;