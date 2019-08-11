import React, { Component } from 'react';
//import {connect} from 'react-redux'
import posed from 'react-pose';
import { styler, physics, easing, tween, composite  } from "popmotion"
import { Stage, Layer, Rect, Text, Circle} from 'react-konva';
import Konva from 'konva';
import blip from '../blip.mp3';
import './bulma/css/bulma.css'
import Rou from './rou.png';

class Pieza2 extends Component{
  constructor(props) {
      super(props);
      this.tick = this.tick.bind(this);
    }

  state = {
      enMovimiento: true,
      rotation: Math.PI*2/360,
      blips: 0,
  }

componentDidUpdate() {

}

componentDidMount(){
  requestAnimationFrame(this.tick);
}

stop(){
  var spin = document.getElementById("spin");
  //spin.style.transformOrigin = "400px 160px";
  spin.style.filter = "";
  spin.style.transform = "rotate(" + (this.state.rotation) + "deg)";
  this.setState({enMovimiento: false})
}
start(){
  this.setState({enMovimiento: true})
  requestAnimationFrame(this.tick);
    //    <Pieza moviendo={this.state.enMovimiento} angle={this.state.angle} rotation={this.state.rotation} width={800} height={800} />
}


  tick() {
    if(this.state.enMovimiento){
    var PI2=Math.PI*800;
    const rotation = this.state.rotation + 0.2 ;
    const angle = this.state.rotation+=PI2/360;
    var spin = document.getElementById("spin");
    //spin.style.transformOrigin = "400px 160px";
    spin.style.filter = "blur(0.5px)";
    if(this.state.blips%6 == 0){
      var blips = new Audio (blip);
       blips.play();
    }

    //spin.style.transform = "rotate(" + (-angle) + "deg)";
    this.setState({rotation:angle, blips: this.state.blips+1});
    requestAnimationFrame(this.tick);
    }
  }

prevent(e){
 e.preventDefault();
 console.log('dd');
}

render(){
var index = 0;
var symbols = ['a','b','c','d'];


const Part = posed.div({
  pressable: true,
  press: {translate: 600 }
});

const { width, height } = this.props;
var PI2=Math.PI*2;
var angle=PI2-PI2/4;
var startAngle=0;
var symbols = ['👽','🎲','👻','🍇','👽','🎲','👻','🍇','👽','🎲','👻','🍇'];
var sweepAngle=PI2/symbols.length;
var rot;
const CANVAS_VIRTUAL_WIDTH = window.innerWidth/2;
const CANVAS_VIRTUAL_HEIGHT = window.innerHeight/2;
const scale = Math.min(
    window.innerWidth / CANVAS_VIRTUAL_WIDTH,
    window.innerHeight / CANVAS_VIRTUAL_HEIGHT
  );
document.body.classList.add("no-sroll");
var radius = 125;

return(
<div class="container is-fluid">

  <button onClick={()=>this.start()}>start</button>
  <button onClick={()=>this.stop()} style={{zIndex: '9999', position: 'absolute'}}>stop</button>

  
  <div id='spin' className={'positionSpin'} >
  <Stage width={1200} height={1200} scaleX={scale} scaleY={scale}>
  <Layer >
  <Circle
      x={400}
      y={160}
      radius={radius}
      fill={'white'}
      shadowBlur={0}
      stroke= 'grey'
      strokeWidth= {0}
      onClick={this.handleClick}

    />
    {symbols.map(simbolo=>{
      console.log(simbolo);
      var endAngle=startAngle+sweepAngle;
      var midAngle=startAngle+(endAngle-startAngle)/2;
      var labelRadius = radius*.85; //radius = 400 *.85
      startAngle+=sweepAngle;
      return(<Text className='rot' x={395+(labelRadius)*Math.cos(midAngle)} y={155+(labelRadius)*Math.sin(midAngle)}
              width={50} height={50} text={simbolo} />)
     })
    }
    </Layer>
     </Stage>

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


export default Pieza2;
