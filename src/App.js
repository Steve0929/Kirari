import React from 'react';
import logo from './logo.svg';
import './App.css';
import Pieza from './components/Pieza.js';
import Pieza2 from './components/Pieza2.js';
import Pieza3 from './components/Pieza3.js';
import Nav from './components/Nav.js';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Lobby from './components/Lobby.js';
import Mon from './components/moun.jpg';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { rotation: 0, enMovimiento: true, angle:Math.PI*2/360};
    this.tick = this.tick.bind(this);
  }

  state={
    username: 'username',
  }

  componentDidMount() {
    this.setState({username: 'username'})
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


  setUser = (name) => {
        this.setState({username: name});
        //  <div style={{backgroundImage:`url(${Mon})`}}>
    }

  render() {
    return (
      <div>
      <Router >
      <Nav/>
      <header className="App-header" style={{backgroundColor: 'rgb(54, 58, 88)', maxWidth: '100%', display:'flow-root'}}>
      <Route path='/game/:id' render={(props) => <Pieza3  username={this.state.username} style={{overflow: 'hidden'}} {...props}/>} />
      <Route path='/perfil' render={(props) => <Pieza3  style={{overflow: 'hidden'}}/>} />
      <Route path='/lobby' render={(props) => <Lobby onSetUser={this.setUser} username={this.state.username}/>} />
      </header>
      </Router>
      </div>
    );
  }
}



export default App;
