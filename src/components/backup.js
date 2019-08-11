import React, { Component } from 'react';
//import {connect} from 'react-redux'
import posed from 'react-pose';
import { styler, physics, easing, tween, composite  } from "popmotion"
import { Stage, Layer, Rect, Text, Circle} from 'react-konva';
import Konva from 'konva';


class Pieza extends Component{
  constructor(props) {
      super(props);
      this.paint = this.paint.bind(this);
    }

  state = {
      color: 'white',
  }

componentDidUpdate() {
  if(this.props.moviendo){
    //this.paint();
    this.animate();
  }

}

componentDidMount(){
  //this.paint();
  this.kk();
}

animate(){
  var { width, height, rotation } = this.props;
  var radius= 250;
  const ctx = this.refs.canvas.getContext("2d");
  var wheel = this.refs.canvas;
  //wheel.width=wheel.height=(radius*2+2);
  console.log('animate: '+width);
  console.log('calculado: '+(radius*2+2));

  var PI2=Math.PI*2;
  var angle=PI2-PI2/4;

  var cw= 800;
  var ch= 800;

  ctx.clearRect(0,0,400,400);
  //ctx.save();
  ctx.translate(cw/2,ch/2);
  ctx.rotate(this.props.angle);
  ctx.drawImage(wheel,-(radius*2+2),-(radius*2+2));
  //ctx.drawImage(wheel,-wheel.width/2,-wheel.height/2);
  ctx.rotate(-this.props.angle);
  ctx.translate(-cw/2,-ch/2);


  //ctx.drawImage(indicator,cw/2-indicator.width/2,ch/2-indicator.height/2)
  //angle+=PI2/360;
  //requestAnimationFrame(animate);

}

kk(){
var { width, height, rotation } = this.props;
const wheelCtx = this.refs.canvas.getContext("2d");
var PI2=Math.PI*2;
var myData = ['👽','🎲','👻','🍇','👽','🎲','👻','🍇','👽','🎲','👻','🍇'];
var cx=150;
var cy=150;
var radius=250;
var angle=PI2-PI2/4;


  width=height=radius*2+2;
  wheelCtx.lineWidth=1;
  wheelCtx.font='24px verdana';
  wheelCtx.textAlign='center';
  wheelCtx.textBaseline='middle';

  var cx=width/2;
  var cy=height/2;

  var sweepAngle=PI2/myData.length;
  var startAngle=0;
  for(var i=0;i<myData.length;i++){

    // calc ending angle based on starting angle
    var endAngle=startAngle+sweepAngle;

    // draw the wedge
    wheelCtx.beginPath();
    wheelCtx.moveTo(cx,cy);
    wheelCtx.arc(cx,cy,radius,startAngle,endAngle,false);
    wheelCtx.closePath();
    wheelCtx.fillStyle='white';
    wheelCtx.strokeStyle='black';
    wheelCtx.fill();
    //wheelCtx.stroke();

    // draw the label
    var midAngle=startAngle+(endAngle-startAngle)/2;
    var labelRadius=radius*.85;
    var x=cx+(labelRadius)*Math.cos(midAngle);
    var y=cy+(labelRadius)*Math.sin(midAngle);
    wheelCtx.fillStyle='gold';
    wheelCtx.fillText(myData[i],x,y);
    wheelCtx.strokeText(myData[i],x,y);

    // increment angle
    startAngle+=sweepAngle;
  }
    wheelCtx.save();
}


paint() {
  const { width, height, rotation } = this.props;
  const context = this.refs.canvas.getContext("2d");
  var radius = 150;
  context.clearRect(0, 0, width, height);
  context.save();
  context.translate(100, 100);

  context.fillStyle = "white";
  //context.fillRect(-50, -50, 100, 100);

    var centerX = 300;
    var centerY = 150;
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    context.fillStyle = 'white';
    context.fill();
    context.lineWidth = 5;
    context.strokeStyle = 'white';
    context.stroke();

    if(this.props.moviendo){
        context.translate(300,150);
        //context.rotate(rotation/50);
        context.translate(100, 100);
    }
    context.font = "bold 16px Arial";
    context.fillText("👻", (300) + 90 , (150) + 90);
    context.rotate(rotation/50);
    context.fillText("🍇", (300) - 90 , (150) - 90);
    context.fillText("🎲", (300) + 90 , (150) - 80);
    context.fillText("👽",(300) - 90 , (150) + 80);


  context.restore();
}

handle(){

}

render(){
var index = 0;
var symbols = ['a','b','c','d'];

const { width, height } = this.props;
return(
  <div >
  <canvas
      style={{maxWidth: '100%'}}
       ref="canvas"
       width={width}
       height={height}
     />

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


export default Pieza;
