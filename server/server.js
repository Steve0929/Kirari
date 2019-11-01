const express = require('express');
const router = express.Router();
const app = express();
const morgan = require('morgan');
const mongoose = require ('mongoose');
const path = require ('path');
const bodyParser = require ('body-parser');
const session = require ('express-session');
const passport = require ('passport');
const cookieSession = require ('cookie-session');
var fs = require('fs');
const cors = require('cors');

// allow-cors
app.options('*', cors())
app.use(function(req,res,next){
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); //change for "http://localhost:3000"
  //res.header("Access-Control-Allow-Credentials", "true"); //!!!
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  next();
})


//Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));
app.use(express.static(path.join(__dirname, 'public')));


var sess = {
  secret: 'bulletproof server',
  resave: true,
  saveUninitialized: true,
  cookie: {
        secure: false
    }
}
//app.use(session(sess));
app.use(cookieSession({
    name: 'arela',
    keys: ['kirari19239xAbfdkey'],
    maxAge: 15* 1000 //
}));

app.use(passport.initialize());
app.use(passport.session());
//app.use(express.static(__dirname + './arela/src/App.js'))

//connect to database
/*
const db = 'mongodb://localhost/manage';
const awsdb = 'mongodb://admin:adminpagos1@ds225608.mlab.com:25608/pagos'
mongoose.connect(awsdb, {
  useNewUrlParser: true,
  })
  .then (db=> console.log('Conectado a la db')).catch(er=>console.log(err));
*/

app.set('port', process.env.PORT || 3001)
var x = app.get('port');
const server = require('http').createServer(app);
var io = require('socket.io')(server);
var rooms = [{id:'st12af23', playersnum: 2, spectators: 5, bet: 25, players: {}, ready: 0, inGame: false},
             {id:'f79va91j', playersnum: 4, spectators: 0, bet: 5,  players: {}, ready: 0, inGame: false},
             {id:'9dk18dhq', playersnum: 4, spectators: 7, bet: 10, players: {}, ready: 0, inGame: false},
             {id:'rj9fmla4', playersnum: 1, spectators: 2, bet: 50, players: {}, ready: 0, inGame: false},

            ];


app.get('/rooms', (req,res) =>{
res.json({
  rooms: rooms
 });
})

app.get('/roominfo', async (req,res) =>{
  var room= await rooms.find(room => room.id === 'st12af23');
  res.json({
    RoomStatus: room
   });
})



io.on('connection', (socket) => {
  console.log('nueva conexion');
  socket.on('join', async (msg)=>{
      console.log(msg.user+' has joined '+msg.room+' game');
      socket.room = msg.room;
      var usuario = {nombre: 'Esteban', id: socket.id, coins: 500, seleccion: '', estado: 'pending', bet: 25}
      var room= await rooms.find(room => room.id === msg.room);
      room.players[socket.id] = usuario;
      socket.join(msg.room);
      //io.emit('update', {players: room.players});
      io.sockets.in(msg.room).emit('update', {players: room.players});
      var length =Object.keys(room.players).length;
      if(length>2){
        //io.emit('start', {players: room.players});
          //io.sockets.in(socket.room).emit('start', {players: room.players});
      }
  })

  socket.on('selecciona', async (msg)=>{
    console.log(socket+' selecciona');
    var room= await rooms.find(room => room.id === socket.room);
    room.players[socket.id].seleccion = msg.seleccion;
    io.sockets.in(socket.room).emit('update', {players: room.players});
  })

  socket.on('bet', async (msg)=>{
    console.log(socket+' bets ');
    var room= await rooms.find(room => room.id === socket.room);
    room.players[socket.id].bet = msg.amount;
    io.sockets.in(socket.room).emit('update', {players: room.players});
  })

  socket.on('lockIn', async (msg)=>{
    console.log(socket+' locked in');
    var room= await rooms.find(room => room.id === socket.room);
    room.players[socket.id].estado = 'locked';
    room.ready++;
    if(room.ready == 3 && room.inGame == false){
       io.sockets.in(socket.room).emit('start', {players: room.players});
       room.inGame = true;
       setTimeout(function(){game(socket)},2500);

    }
    else{
      io.sockets.in(socket.room).emit('update', {players: room.players});
    }
  })

  socket.on('finished', async (msg)=>{
    console.log('ff')
    var room= await rooms.find(room => room.id === socket.room);
    var isFinished = true;
    room.players[socket.id].seleccion = '';
    room.players[socket.id].estado = 'pending';
    for (var key of Object.keys(room.players)) {
         if(room.players[key].estado != 'pending'){
            isFinished = false;
            break;
         }
        //console.log(key + " -> " + p[key])
      }
    if(isFinished){
      console.log('Game finished')
        room.ready = 0;
        room.inGame = false;
        io.sockets.in(socket.room).emit('gameFinished', {players: room.players});
    }

  })

async function game(socket){
    var room= await rooms.find(room => room.id === socket.room);
    //fantasma 0 y 6
    //uvas 34 y 37
    //dulce 64 y 68
    //Corona 94 y 98
    for (var key of Object.keys(room.players)) {
        room.players[key].estado = 'playing';
        //console.log(key + " -> " + p[key])
      }
    choices = [[0,6],[34,37],[64,68],[94,98]];
    var index = Math.floor(Math.random() * choices.length);
    var win = choices[index];
    console.log('winner: '+win)
    io.sockets.in(socket.room).emit('stop', {a: win[0], b: win[1], players: room.players});
  }

  socket.on('disconnect', async ()=>{
    console.log(socket+' disconnected');
    socket.leave();
    var room= await rooms.find(room => room.id === socket.room);
    delete room.players[socket.id];
    //io.emit('update', {players: room.players});
    io.sockets.in(socket.room).emit('update', {players: room.players});
  })

  socket.on('forceDisconnect', async ()=>{
    console.log(socket+' disconnected forcedly');
    socket.leave();
    var room= await rooms.find(room => room.id === socket.room);
    delete room.players[socket.id];
    //io.emit('update', {players: room.players});
    io.sockets.in(socket.room).emit('update', {players: room.players});
  })



})



server.listen(x);
console.log("Server On "+x);
