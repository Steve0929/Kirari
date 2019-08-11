import React, { Component } from 'react';
//import {connect} from 'react-redux'
import posed from 'react-pose';
import { styler, physics, easing, tween, composite  } from "popmotion"
import { Stage, Layer, Rect, Text, Circle} from 'react-konva';
import Konva from 'konva';
import blip from '../blip.mp3';
import './bulma/css/bulma.css'
import Rou from './rou.png';

class Pieza3 extends Component{
  constructor(props) {
      super(props);
      this.tick = this.tick.bind(this);
    }

  state = {
      enMovimiento: false,
      rotation: Math.PI*2/360,
      blips: 0,
  }

componentDidUpdate() {

}

componentDidMount(){
  if(this.state.enMovimiento){
     requestAnimationFrame(this.tick);
  }

}

stop(){
  var spin = document.getElementById("spin");
  //var blur = document.getElementById("blur");
  //blur.style.filter = "";
  spin.style.transform = "rotate(" + (this.state.rotation) + "deg)";
  this.setState({enMovimiento: false})
}
start(){
  this.setState({enMovimiento: true})
  requestAnimationFrame(this.tick);
}

  tick() {
    if(this.state.enMovimiento){
    var PI2=Math.PI*1000;
    const rotation = this.state.rotation + 0.2 ;
    const angle = this.state.rotation+=PI2/360;
    var spin = document.getElementById("spin");
    //var blur = document.getElementById("blur");
  // blur.style.filter = "blur(0.8px)";
    if(this.state.blips%6 == 0){
      var blips = new Audio (blip);
       blips.play();
    }

    spin.style.transform = "rotate(" + (-angle) + "deg)";
    this.setState({rotation:angle, blips: this.state.blips+1});
    requestAnimationFrame(this.tick);
    }
  }

prevent(e){
 e.preventDefault();
 console.log('dd');
}

render(){

var PI2=Math.PI*2;
var angle=PI2-PI2/4;
var startAngle=0;
var symbols = ['👽','👑','👻','🍇','🍬','👑','👻','🍇','🍬','👑','👻','👽'];
var sweepAngle=PI2/symbols.length;
var radius = 150;
var blurred;
this.state.enMovimiento ? blurred = 'blurThis' : blurred = '';
return(
<div className="container is-fluid" id='pieza3'>

  <button className='button is-primary' style={{marginRight: '1em'}} onClick={()=>this.start()}>Start</button>
  <button className='button is-danger' onClick={()=>this.stop()} >Stop</button>

  <div id='blur'>
    <svg height="18em" width="18em" className='circulo'>
    <defs>
        <filter id="blurFilter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" />
        </filter>
    </defs>

     <g id='spin' className={'svgc '}>
        <circle cx="180" cy="180" r={radius} stroke="black" stroke-width="0" fill="white"/>
        {symbols.map(simbolo=>{
          var endAngle=startAngle+sweepAngle;
          var midAngle=startAngle+(endAngle-startAngle)/2;
          var labelRadius = radius*.85; //radius = 400 *.85
          startAngle+=sweepAngle;
          return(<text  className={blurred}
                 x={170+(labelRadius)*Math.cos(midAngle)} y={190+(labelRadius)*Math.sin(midAngle)}> {simbolo} </text>)
         })
        }
        </g>

          <rect rx='5' x='5' y='125' width="6em" height="2em" style={{fill:'white', zIndex: 999, fillOpacity:'0.7'}}
                stroke="white" stroke-width="1" />
    </svg>
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
