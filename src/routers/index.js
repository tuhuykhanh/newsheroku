const homeRouter  = require('./home')
const acountRouter  = require('./account')
const adminRouter  = require('./admin')
const postRouter = require('./post')
const categoryRouter = require('./category')
const commentRouter = require('./comment')

function route(app) {
    
    app.use('/getvalue',postRouter)
    app.use('/account',acountRouter)
    app.use('/admin',adminRouter)     
    app.use('/post',postRouter) 
    app.use('/c',categoryRouter)
    app.use('/api',commentRouter)
    app.use('/',homeRouter) 
        
}
module.exports = route;