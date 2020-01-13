import React, { Component } from 'react';
//import {connect} from 'react-redux'
import Konva from 'konva';
import blip from '../blip.mp3';
import win from '../win.mp3';
import './bulma/css/bulma.css'
import Rou from './rou.png';
import Chipo from './chip.png';
import Mon from './moun.jpg';
import Lottie from 'react-lottie';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Zoom from '@material-ui/core/Zoom';
import {Redirect} from 'react-router-dom';


class Pieza3 extends Component{
  constructor(props) {
      super(props);
      this.tick = this.tick.bind(this);
      this.stopInSymbol = this.stopInSymbol.bind(this);
      this.gameid = this.props.match.params.id;
      let winSound = new Audio (win);
      this.winSound = winSound;
    }

  state = {
      toLobby: false,
      joining: true,
      enMovimiento: false,
      rotation: Math.PI*2/360,
      blips: 0,
      stoping: false,
      socket: window.io('http://localhost:3001'),
      players: null,
      simbolSeleccionado: 0,
      locked: false,
      explode: false,
      bet: 25,
      inputBet: 25,
      totalCoins: null,
      serverStatus: ''
  }

componentDidUpdate() {

}

componentWillUnmount(){
  this.state.socket.emit('forceDisconnect');
}

componentDidMount(){
  console.log(this.props);
  this.state.socket.on('invalidBet', (msg)=>{
    this.setState({locked: false})
  });

  this.state.socket.emit("join", {user: this.props.username, room: this.gameid});

  this.state.socket.on('update', (msg)=>{
    let coins = null;
    if(msg.players[this.state.socket.id]){
       coins = msg.players[this.state.socket.id].coins;
    }
    this.setState({joining:false, players: msg.players, totalCoins: coins})
  });

  this.state.socket.on('start', (msg)=>{
    this.setState({joining:false, players: msg.players})
    this.start();
  });

  this.state.socket.on('stop', (msg)=>{
    this.setState({a: msg.a, b: msg.b});
    this.stopx();
  });

  this.state.socket.on('gameFinished', (msg)=>{
    console.log(msg)
    console.log(this.state.socket.id)
    if(msg.players[this.state.socket.id]){
      var coins = msg.players[this.state.socket.id].coins;
    }
    else{
      console.log('error')
      //console.log(msg.players[this.state.socket.id].coins);
      var coins = 0;
    }
    this.setState({players: msg.players, locked: false, totalCoins: coins})
  });

  if(this.state.enMovimiento){
     requestAnimationFrame(this.tick);
  }
}

returnLobby(){
  this.state.socket.emit('forceDisconnect');
  this.setState({toLobby:true})
}

selectSimbolo(simbolo){
  console.log(simbolo);
  this.state.socket.emit("selecciona", {seleccion: simbolo});
  this.setState({simbolSeleccionado: simbolo})
}

lockIn(){
  if(this.state.simbolSeleccionado != 0){
     this.state.socket.emit("lockIn");
     this.setState({locked: true});
  }
}

setBet(){
  var placeholderBet = parseInt(this.state.inputBet, 10);
  if(placeholderBet > this.state.totalCoins){

  }
  else{
    if(placeholderBet<25){
      this.state.socket.emit("bet", {amount: 25});
      this.setState({bet: 25, inputBet: 25});
    }
    else{
      this.state.socket.emit("bet", {amount: placeholderBet});
      this.setState({bet: placeholderBet});
    }
  }

}

handleInputChange(e) {
    this.setState({
        [e.target.name]: e.target.value
    });
}

stop(){
  var spin = document.getElementById("spin");
  spin.style.transform = "rotate(" + (this.state.rotation) + "deg)";
  this.setState({enMovimiento: false})
}
start(){
  this.setState({enMovimiento: true})
  requestAnimationFrame(this.tick);
}

stopx(){
  this.setState({stopping:true});
  requestAnimationFrame(this.stopInSymbol);
}

stopInSymbol(){
  //+28
  //fantasma 0 y 6
  //uvas 34 y 37
  //dulce 64 y 68
  //Corona 94 y 98
  let a = this.state.a;
  let b = this.state.b;
  if(this.state.enMovimiento){
  var PI2=Math.PI*1000;
  const rotation = this.state.rotation + 0.2 ;
  const angle = this.state.rotation+=PI2/360;
  var spin = document.getElementById("spin");
  if(this.state.blips%6 == 0){
    var blips = new Audio (blip);
    blips.play();
  }
  console.log('rotacion: '+this.state.rotation);
  console.log(Math.ceil(this.state.rotation % 360))
  let range = Math.ceil(this.state.rotation % 360)

  if(a<range && range <b){
     this.state.socket.emit("finished");
     this.setState({enMovimiento: false, stopping: false, explode: true})
     this.winSound.play();
  }
  else{
    spin.style.transform = "rotate(" + (-angle) + "deg)";
    this.setState({rotation:angle, blips: this.state.blips+1});
    requestAnimationFrame(this.stopInSymbol);
  }
 }
}

tick() {
  if(this.state.enMovimiento && !this.state.stopping){
  var PI2=Math.PI*1000;
  const rotation = this.state.rotation + 0.2 ;
  const angle = this.state.rotation+=PI2/360;
  var spin = document.getElementById("spin");
  if(this.state.blips%6 == 0){
    var blips = new Audio (blip);
    blips.play();
  }

  spin.style.transform = "rotate(" + (-angle) + "deg)";
  this.setState({rotation:angle, blips: this.state.blips+1});
  requestAnimationFrame(this.tick);
  }
}




//🎁  🎆 🎇 🎈 🎉 🎋 🎍  🎏 🎐 🎑 🎒

render(){
if(this.state.toLobby){return(<Redirect to='/lobby'/>)}
if(this.state.joining){return(<div>Conectando...<progress style={{width:'14em'}} className="progress is-info" max="100">40%</progress></div>)}
var PI2=Math.PI*2;
var angle=PI2-PI2/4;
var startAngle=0;
var symbols = ['🎁','🎒','👻','🍇','🎈','👑','🐋','🎑','🍬','🎏','🎍','👽'];
var sweepAngle=PI2/symbols.length;
var radius = 150;
var blurred;
this.state.enMovimiento ? blurred = 'blurThis' : blurred = '';

const defaultOptions = {loop: false, autoplay: true, animationData: require('./plup.json'),
  rendererSettings: {
  preserveAspectRatio: 'xMidYMid slice'
  }
};


var ev=[ {eventName: 'complete',callback: () => this.setState({explode: false}),},]

var plup = <Lottie options={defaultOptions} height={'23em'} width={'23em'} isStopped={false} isClickToPauseDisabled = {true} eventListeners={ev}
         direction={1} speed={1.5} isPaused={false} style={{position: 'absolute',top:'-2em', left: '1em',zIndex: '9999'}}/>;

return(
<div className="container is-fluid" id='pieza3' style={{maxWidth: '100%',marginTop: '3em'}}>
  <div className="columns is-variable" >
 <div className="column ">
  <Paper style={{marginTop: '2em',padding:'1em', maxWidth: '100%', paddingTop: '0em', margin:'1em', marginTop: '0em',
                  zoom: '0.85', width: 'max-content', marginLeft: '1em',
                  background: '#2f2e4a', boxShadow:'0px 1px 15px 0px rgb(68, 159, 247), 0px 2px 12px 0px rgba(0,0,0,0.14), 0px 3px 10px -2px rgba(0,0,0,0.12)',
                  boxShadow:' rgb(10, 10, 10) 0px 1px 3px 1px'}}
           className='rounder glass'>
    <Paper style={{marginRight: '-1em',marginLeft: '-1em', marginBottom: '-1em',
                   marginBottom: '2em',height: '8em', paddingTop: '1em', boxShadow:'none', borderRadius: '10px',
                   borderBottomLeftRadius: '0px',borderBottomRightRadius: '0px',
                   background: 'linear-gradient(135deg, #29fadf 0%,#4c83ff 100%)', background: '#1e202f'}}>
        <h5 className="grey-text text-darken-3 title"  style={{color:'white', textAlign: 'center', marginTop: '1%'}}>
            Game {this.gameid}</h5>

        <div style={{color:'white',fontWeight: '500', textAlign: 'center'}}>Total:
        <img src={Chipo} height='25' width='25' style={{marginLeft: '8px'}}/> x{this.state.totalCoins}</div>

        <div style={{color:'white',fontWeight: '500', textAlign: 'center'}}>Your bet:
        <img src={Chipo} height='25' width='25' style={{marginLeft: '8px'}}/> x{this.state.bet}</div>

        <p style={{color:'white',fontWeight: '500', textAlign: 'center',marginTop: '1em'}}>Status: {this.state.serverStatus}</p>
    </Paper>

{this.state.locked == true ?
  <div>
    <input className="input is-info blend" type="number" min='25' value={this.state.inputBet}  name="inputBet" disabled
           style={{marginBottom: '1em', width: '25%', fontWeight: 700, color:'#4698f9'}}></input>
    <div className='button is-info' disabled style={{marginLeft: '1em'}}>Set bet<img src={Chipo} height='25' width='25' style={{marginLeft: '8px'}}/></div>
  </div>

   :<div>
   <input className="input is-info blend" type="number" min='25' value={this.state.inputBet} onChange={e=>this.handleInputChange(e)} name="inputBet"
       style={{marginBottom: '1em', width: '25%', fontWeight: 700, color:'#4698f9'}}></input>
    <div className='button is-info' style={{marginLeft: '1em'}} onClick={()=>this.setBet()}>
      Set bet<img src={Chipo} height='25' width='25' style={{marginLeft: '8px'}}/></div></div>
        }

    <div className="field">
    <div className="control">
      <div className="select is-info blend">
      {this.state.locked == true ?
        <select className="blend" disabled onChange={(e)=>this.selectSimbolo(e.target.value)}>
          {symbols.map((simbolo, index)=>{return(<option key={index}>{simbolo}</option>)})}
        </select>
      :
      <select className="blend" onChange={(e)=>this.selectSimbolo(e.target.value)}>
        {symbols.map((simbolo, index)=>{return(<option key={index}>{simbolo}</option>)})}
      </select>
      }

      </div>
      {this.state.locked == true ? <div className='button' disabled style={{marginLeft: '4em'}}>Locked In</div>
        : <div className='button is-info' style={{marginLeft: '4em'}} onClick={()=>this.lockIn()} >Lock</div>
      }

    </div>
    </div>

    <div className="table-container">
      <table className="table " style={{backgroundColor: 'inherit'}}>
      <thead>
        <tr>
        <th className='whitew'>Player</th>
        <th className='whitew'>Choice</th>
        <th className='whitew'>Status</th>
        <th className='whitew'>Bet</th>
        <th className='whitew'>Profit</th>
      </tr>
    </thead>
        <tbody>
    {Object.keys(this.state.players).map((player, key)=>{
      return(<tr key={key+'as3'} style={{fontWeight: '500'}}>

              <th className='whitew'>{this.state.players[player].nombre}</th>
              <td>{this.state.players[player].seleccion}</td>
              <Zoom in={true} style={{ transitionDelay:'500ms' }}>
              {this.state.players[player].estado == 'pending' ?
                <td><span style={{margin: '1em'}} className="tag is-danger">Pending...</span></td>
              : <td><span style={{margin: '1em'}} className="tag is-success">Ready!</span></td> }
              </Zoom>
            <td><div className="tags has-addons" style={{marginTop: '14.5%'}}>
                  <span className="tag is-dark" style={{background: '#1e202f'}}><img src={Chipo} height='20' width='20'/></span>
                  <span className="tag is-info" style={{fontWeight: '500'}}>x{this.state.players[player].bet}</span>
              </div></td>
              <td>{
                  this.state.players[player].profits ?
                    this.state.players[player].profits > 0 ? <div style={{color: '#23d160' }}>+{this.state.players[player].profits}</div>
                    : <div  style={{color: '#ff3860' }}>{this.state.players[player].profits}</div>
                  : '' }
              </td>
            </tr>
          )
     })
    }
    </tbody>
    </table>
    </div>




    </Paper>

</div>

<div className="column is-two-third mobilize" style={{marginTop: '1em', position: 'relative'}}>

    {this.state.explode ? plup : ''}
    <svg height="18em" width="18em" className='circulo' style={{width: '100%'}} viewBox="0 0 370 370" >
    <defs>
        <filter id="blurFilter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.2" />
        </filter>
    </defs>
      <circle cx="180" cy="180" r={radius*1.2} stroke="black" strokeWidth="0" fill="#2dbbc5"/>
      <circle cx="180" cy="180" r={radius*1.15} stroke="black" strokeWidth="0" fill="#32dbe7"/>

     <g id='spin' className={'svgc mobilize'}>
        <circle cx="180" cy="180" r={radius} stroke="black" strokeWidth="0" fill="white"/>
        {symbols.map((simbolo, index)=>{
          var endAngle=startAngle+sweepAngle;
          var midAngle=startAngle+(endAngle-startAngle)/2;
          var labelRadius = radius*.85; //radius = 400 *.85
          startAngle+=sweepAngle;
          return(<text  className={blurred} key={index}
                 x={170+(labelRadius)*Math.cos(midAngle)} y={190+(labelRadius)*Math.sin(midAngle)}> {simbolo} </text>)
         })
        }
        </g>
        <circle cx="180" cy="180" r={8} stroke="black" strokeWidth="0" fill="#32dbe7"/>
          <rect rx='5' x='5' y='120' width="6em" height="2em" style={{fill:'white', zIndex: 999, fillOpacity:'0.7'}}
                stroke="white" strokeWidth="1" />
    </svg>

  </div>

 </div>
</div>
    );
  }
}


const mapStateToProps = (state) =>{
  return{

  }
}

const mapDispatchToProps = (dispatch) =>{
  return{

  }
}


export default Pieza3;
