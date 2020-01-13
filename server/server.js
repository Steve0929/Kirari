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
//app.options('*', cors())
app.use(function(req,res,next){
  res.header("Access-Control-Allow-Origin", "*"); //change for "http://localhost:3000"
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

app.set('port', process.env.PORT || 3001, '0.0.0.0')
var x = app.get('port');
const server = require('http').createServer(app);

var io = require('socket.io')(server);
var rooms = [{id:'st12af23', playersnum: 0, spectators: 0, bet: 25, players: {}, ready: 0, inGame: false},
             {id:'f79va91j', playersnum: 0, spectators: 0, bet: 5,  players: {}, ready: 0, inGame: false},
             {id:'9dk18dhq', playersnum: 0, spectators: 0, bet: 10, players: {}, ready: 0, inGame: false},
             {id:'rj9fmla4', playersnum: 0, spectators: 0, bet: 50, players: {}, ready: 0, inGame: false},

            ];


app.get('/rooms', (req,res) =>{
rooms.forEach(room=>{
  //console.log(Object.keys(room.players).length);
  let num = Object.keys(room.players).length;
  //room.players.length == undefined ? num = 0 : num = room.players.length;
  room.playersnum = num;
})

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
      var usuario = {nombre: msg.user, id: socket.id, coins: 500, seleccion: '', estado: 'pending', bet: 25, profits: null}
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
    if(room.players[socket.id].bet > room.players[socket.id].coins){
       socket.emit('invalidBet');
       return;
    }
    room.players[socket.id].estado = 'locked';
    room.ready++;
    //if(room.ready == 3 && room.inGame == false){
    if(room.inGame == false && room.ready == Object.keys(room.players).length){
       io.sockets.in(socket.room).emit('start', {players: room.players});
       room.inGame = true;
       setTimeout(function(){game(socket)},2500);

    }
    else{
      io.sockets.in(socket.room).emit('update', {players: room.players});
    }
  })

  socket.on('finished', async (msg)=>{
    console.log('game finished')
    var room= await rooms.find(room => room.id === socket.room);
    var isFinished = true;
    //room.players[socket.id].seleccion = '';
    room.players[socket.id].estado = 'pending';
    if(room.players[socket.id].seleccion == room.winSymbol){
       room.players[socket.id].coins = room.players[socket.id].coins +  room.players[socket.id].bet;
       room.players[socket.id].profits =  room.players[socket.id].bet
    }
    else{
       room.players[socket.id].coins = room.players[socket.id].coins -  room.players[socket.id].bet;
       room.players[socket.id].profits =  - room.players[socket.id].bet
    }
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

    choices = [[0,6 ,'🐋'],[34,37, '🎑'],[64,68,'🍬'],[94,98,'🎏'],[126,130,'🎍'],[157,161,'👽'],[188,192,'🎁'],
               [213,218,'🎒'],[248,252,'👻'],[274,280,'🍇'], [304,310,'🎈'], [332,340,'👑'] ];
    //choices = [[0, 6, '🐋']]

    var index = await Math.floor(Math.random() * choices.length);
    console.log('Index: '+index)
    var win =  choices[index];
    console.log('winner: '+win)
    room.winSymbol = win[2];
    io.sockets.in(socket.room).emit('stop', {a: win[0], b: win[1], c: win[2], players: room.players});
  }

  socket.on('disconnect', async ()=>{
    console.log(socket+' disconnected');
    socket.leave();
    var room= await rooms.find(room => room.id === socket.room);
    if(room){
      delete room.players[socket.id];
      //io.emit('update', {players: room.players});
      io.sockets.in(socket.room).emit('update', {players: room.players});
    }

  })

  socket.on('forceDisconnect', async ()=>{
    console.log(socket+' disconnected forcedly');
    socket.leave();
    var room= await rooms.find(room => room.id === socket.room);
    if(room){
      delete room.players[socket.id];
      io.sockets.in(socket.room).emit('update', {players: room.players});
    }
    //io.emit('update', {players: room.players});

  })



})



server.listen(3001, '0.0.0.0');
console.log("Server On "+x);
