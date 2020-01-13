import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import './bulma/css/bulma.css'
import Chipo from './chip.png';
import Eye from './eye.png';
import Sn from './sn.jpg';
import {Redirect} from 'react-router-dom';

class Lobby extends React.Component {
  state = {
      rooms: null,
       redirect: false,
       room: null,
       username: 'username'
  }

  handleInputChange(e) {
      this.setState({
          [e.target.name]: e.target.value
      });
  }

componentDidMount() {
  this.setState({username:this.props.username})
  this.getRooms();
}

setUser(){
  this.props.onSetUser(this.state.username)
}

getRooms(){
  //var url = 'http://localhost:3001';
  var url = 'http://192.168.31.54:3001';
    fetch(url+'/rooms', {
          method: 'GET',
          headers: {'Content-Type' : 'application/json', 'Accept': 'application/json'}
    })
    .then(res => res.json())
    .then((res) => {
          if(res.data=='error'){

          }
          else{
            this.setState({rooms: res.rooms});
          }
    });
}

JoinRoom(room){
  console.log('Join: '+room)
  this.setState({redirect: true, room:room})
}

// wordBreak: 'break-word'

render() {
if (this.state.redirect) {
      return <Redirect to={'/game/'+this.state.room}/>;
    }
return (
<div className='conainer is-fluid' style={{maxWidth: '100%', marginTop: '2em'}}>
 <div className="columns " >
   <div className="column is-three-fifths">
    <Paper style={{marginTop: '2em',padding:'1em', maxWidth: '100%', paddingTop: '0em', margin:'1em', width: 'max-content',
                    background: '#1e202f', color: 'white', marginRight: '1em',
                    boxShadow:'rgb(10, 10, 10) 0px 1px 3px 1px'}}
             className='rounder '>
  <div className="table-container">
    <table className="table" style={{backgroundColor: 'inherit', color:'white'}}>
      <thead>
        <tr>
        <th className='whitew'>Room id</th>
        <th className='whitew'>Players</th>
        <th className='whitew'>Bet</th>
        <th className='whitew'>Join</th>
        <th className='whitew'>Spectate</th>
      </tr>
    </thead>
    <tbody>
    {this.state.rooms ?
      this.state.rooms.map(room=>{
        return(
        <tr key={room.id}>
        <th className='whitew'>{room.id}</th>
        <td className='whitew'>{room.playersnum}/4</td>
        <td><div className="tags has-addons" style={{marginTop: '13%'}}>
              <span className="tag is-dark"><img src={Chipo} height='20' width='20'/></span>
              <span className="tag is-info" style={{fontWeight: '500'}}>x{room.bet}</span>
            </div></td>
        <td><a onClick={()=>this.JoinRoom(room.id)} className="tag is-success">Join</a></td>
        <td className='whitew'>{room.spectators} spectating <a><img src={Eye} height='20' width='20'/></a></td>
        </tr>
      )
      })
      : <tr className='whitew'><th>Error while loading the rooms</th></tr>
    }
    </tbody>
    </table>
    </div>
    <button className='button is-info' style={{marginRight: '1em'}} onClick={()=>this.getRooms()}>Refresh</button>

    </Paper>
    </div>

      <div className="column is-one-third">
       <Paper  style={{marginTop: '2em',padding:'1em', maxWidth: '100%', paddingTop: '0em', margin:'1em', width: 'max-content',
                       background: '#1e202f', color: 'white', marginRight: '1em',
                       boxShadow:'rgb(10, 10, 10) 0px 1px 3px 1px'}}className='rounder '>
        <p style={{paddingTop: '1em', marginBottom: '1em'}}>{this.props.username}</p>
        <input className="input is-info blend2" type="text" value={this.state.username}
                  onChange={e=>this.handleInputChange(e)} name="username"
                  style={{marginBottom: '1em', width: '75%', fontWeight: 700, color:'#209cee'}}></input>
        <button className='button is-info' style={{marginLeft: '1em'}} onClick={()=>this.setUser()}>Set</button>
        </Paper>

    </div>
  </div>
</div>
    );
  }
}



export default Lobby;
