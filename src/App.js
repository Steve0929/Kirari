import React from 'react';
import logo from './logo.svg';
import './App.css';
import Pieza from './components/Pieza.js'
import Pieza2 from './components/Pieza2.js'
import Pieza3 from './components/Pieza3.js'


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { rotation: 0, enMovimiento: true, angle:Math.PI*2/360};
    this.tick = this.tick.bind(this);
  }

  componentDidMount() {
    //requestAnimationFrame(this.tick);
  }

  tick() {
    if(this.state.enMovimiento){
      var PI2=Math.PI*2;
      const rotation = this.state.rotation + 0.2;
      const angle = this.state.angle+=PI2/360;
      this.setState({ rotation, angle: angle});
      requestAnimationFrame(this.tick);
    }

  }


  render() {
    return (
      <header className="App-header" style={{backgroundColor: '#f0f0f0', maxWidth: '100%'}}>
      <Pieza3 enRotacion={this.state.enMovimiento} style={{overflow: 'hidden'}}/>
        </header>
    );
  }
}



export default App;
