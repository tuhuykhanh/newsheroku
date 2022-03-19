require('dotenv').config()
const express = require('express');
const { reset } = require('nodemon');
const {engine} = require("express-handlebars");
const path = require('path');
const app = express();

const route = require('./routers/index')
const db = require('./config/db/index')
const methodOverride = require('method-override');

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const cors = require('cors')
const session = require('express-session');
const MongoStore = require('connect-mongo');
const fs = require('fs')

//midleware
const checkAuthen = require('./app/middlewares/CheckLogOut')

//midleware upload
db.connect();

app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')));
app.set('trustproxy', true)

app.use(express.json())
app.use(express.urlencoded({
    extended:true
  }))

app.use(session({
  secret: ' hard ',
  resave: true,
  saveUninitialized: false,
  store: MongoStore.create(
    { mongoUrl: 'mongodb://localhost:27017/review_site_db' }
    )
  }));
  
app.use(checkAuthen.checkLocalAuthen);
app.use(cors());

app.engine('.hbs',engine({
    defaultLayout: 'main',
    extname:'.hbs'
}))
app.set('view engine','.hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

route(app);

///socket ///
io.on('connection', (socket) => {
   console.log('a user connected with id:' + socket.id);

    socket.on('disconnect', ()=>{
      console.log('1 user disconnected'+' '+ socket.id)
    })

    socket.on('comment', function(data){
      
      data.time = Date()
      socket.broadcast.emit('send', data)
     
    })
    socket.on('typing', function(data){
        socket.broadcast.emit('usertyping', data )
    })
    socket.on('deletecomment',function(id){
      socket.broadcast.emit('deletecommentserver', id)
    })

});
const port = process.env.PORT || 3000;
server.listen(port,console.log(`app is runing with port ${port}`));
