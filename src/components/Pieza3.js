import React, { Component } from 'react';
//import {connect} from 'react-redux'
import Konva from 'konva';
import blip from '../blip.mp3';
import win from '../win.mp3';
import './bulma/css/bulma.css'
import Rou from './rou.png';
import Chipo from './chip.png';
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
    }

  state = {
      toLobby: false,
      joining: true,
      enMovimiento: false,
      rotation: Math.PI*2/360,
      blips: 0,
      stoping: false,
      socket: window.io('http://localhost:3001'),
      players: null
  }

componentDidUpdate() {

}

componentDidMount(){
  this.state.socket.emit("join", {user: 'Esteban', room: this.gameid});

  this.state.socket.on('update', (msg)=>{
    this.setState({joining:false, players: msg.players})
  });

  this.state.socket.on('start', (msg)=>{
    this.start();
  });

  if(this.state.enMovimiento){
     requestAnimationFrame(this.tick);
  }
}

returnLobby(){
  this.state.socket.emit('forceDisconnect');
  this.setState({toLobby:true})
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
  let a = 94;
  let b = 98;
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
  let winSound = new Audio (win);
  if(a<range && range <b){
     winSound.play();
     this.setState({enMovimiento: false, stopping: false})
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


render(){
if(this.state.toLobby){return(<Redirect to='/lobby'/>)}
if(this.state.joining){return(<div>Conectando...<progress style={{width:'14em'}} className="progress is-info" max="100">40%</progress></div>)}
var PI2=Math.PI*2;
var angle=PI2-PI2/4;
var startAngle=0;
var symbols = ['👽','👑','👻','🍇','🍬','👑','🐋','🍇','🍬','👑','👻','👽'];
var sweepAngle=PI2/symbols.length;
var radius = 150;
var blurred;
this.state.enMovimiento ? blurred = 'blurThis' : blurred = '';
return(
<div className="container is-fluid" id='pieza3' style={{marginTop: '3em'}}>
  <div className="columns is-variable">

 <div className="column is-one-third">
   <button className='button is-warning' onClick={()=>this.returnLobby()} >Return to lobby</button>
  <Paper style={{marginTop: '2em',padding:'1em', maxWidth: '100%', paddingTop: '0em', margin:'1em',
                  background: '', boxShadow:'0px 1px 15px 0px rgb(68, 159, 247), 0px 2px 12px 0px rgba(0,0,0,0.14), 0px 3px 10px -2px rgba(0,0,0,0.12)'}}
           className='rounder'>

    <Paper style={{marginRight: '-1em',marginLeft: '-1em', marginBottom: '-1em',
                   marginBottom: '2em',height: '8em', paddingTop: '1em', boxShadow:'none', borderRadius: '10px',
                   borderBottomLeftRadius: '0px',borderBottomRightRadius: '0px',
                   background: 'linear-gradient(135deg, #29fadf 0%,#4c83ff 100%)'}}>
        <h5 className="grey-text text-darken-3 title"  style={{color:'white', textAlign: 'center', marginTop: '1%'}}>
            Game {this.gameid}</h5>
        <div style={{color:'white',fontWeight: '500', textAlign: 'center'}}><img src={Chipo} height='25' width='25'/> x25</div>
        <p style={{color:'white',fontWeight: '500', textAlign: 'center',marginTop: '1em'}}>Estado:</p>
    </Paper>
    {Object.keys(this.state.players).map((player, key)=>{
      console.log(player);
      console.log(this.state.players)
      return(<p key={key+'as3'} style={{fontWeight: '500', textAlign: 'center'}}>{this.state.players[player].nombre} 👻
                  <Zoom in={true} style={{ transitionDelay:'500ms' }}>
                  <span style={{margin: '1em'}} className="tag is-success">Ready!</span></Zoom></p>)
    })
    }

    <p style={{fontWeight: '500', textAlign: 'center'}}>usuario1 👻
              <Zoom in={true} style={{ transitionDelay:'500ms' }}>
              <span style={{margin: '1em'}} className="tag is-success">Ready!</span></Zoom></p>

    <p className='level-item' style={{fontWeight: '500', textAlign: 'center'}}>Steve 🍬 <span>
              <progress style={{width:'1em', marginLeft: '2em'}} className="progress is-danger" max="100">30%</progress></span></p>

    <p className='level-item' style={{fontWeight: '500', textAlign: 'center'}}>knightdark 👑 <span>
              <progress style={{width:'1em', marginLeft: '2em'}} className="progress is-danger" max="100">30%</progress></span></p>
    </Paper>
</div>

<div className="column is-one-third">
    <svg height="18em" width="18em" className='circulo' style={{width: '100%'}} viewBox="0 0 370 370" >
    <defs>
        <filter id="blurFilter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" />
        </filter>
    </defs>
     <g id='spin' className={'svgc '}>
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

          <rect rx='5' x='5' y='120' width="6em" height="2em" style={{fill:'white', zIndex: 999, fillOpacity:'0.7'}}
                stroke="white" strokeWidth="1" />
    </svg>

  </div>
  <div className="column is-one-third" style={{marginTop: '2em'}}>
  <button className='button is-primary' style={{marginRight: '1em'}} onClick={()=>this.start()}>Start</button>
  <button className='button is-danger' style={{marginRight: '1em'}} onClick={()=>this.stop()} >Stop</button>
  <button className='button is-warning' onClick={()=>this.stopx()} >Stop in symbol</button>
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
