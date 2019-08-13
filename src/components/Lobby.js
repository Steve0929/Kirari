import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import './bulma/css/bulma.css'
import Chipo from './chip.png';
import Eye from './eye.png';
import {Redirect} from 'react-router-dom';

class Lobby extends React.Component {
  state = {
      rooms: null,
       redirect: false,
       room: null
  }

componentDidMount() {
  this.getRooms();
}


getRooms(){
  var url = 'http://localhost:3001';
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
  this.setState({redirect: true,room:room})
}


render() {
if (this.state.redirect) {
      return <Redirect to={'/game/'+this.state.room}/>;
    }
return (
<div className='conainer is-fluid' style={{maxWidth: '100%', marginTop: '2em'}}>
 <div className="columns is-centered">
   <div className="column is-two-thirds">
    <Paper style={{marginTop: '2em',padding:'1em', maxWidth: '100%', paddingTop: '0em', margin:'1em',
                    boxShadow:'0px 1px 15px 0px rgb(68, 159, 247), 0px 2px 12px 0px rgba(0,0,0,0.14), 0px 3px 10px -2px rgba(0,0,0,0.12)'}}
             className='rounder '>
  <div className="table-container">
    <table className="table is-hoverable">
      <thead>
        <tr>
        <th>Room id</th>
        <th>Players</th>
        <th>Bet</th>
        <th>Join</th>
        <th>Spectate</th>
      </tr>
    </thead>
    <tbody>
    {this.state.rooms ?
      this.state.rooms.map(room=>{
        return(
        <tr key={room.id}>
        <th>{room.id}</th>
        <td>{room.playersnum}/4</td>
        <td><div className="tags has-addons" style={{marginTop: '13%'}}>
              <span className="tag is-dark"><img src={Chipo} height='20' width='20'/></span>
              <span className="tag is-info" style={{fontWeight: '500'}}>x{room.bet}</span>
            </div></td>
        <td><a onClick={()=>this.JoinRoom(room.id)} className="tag is-success">Join</a></td>
        <td>{room.spectators} spectating <a><img src={Eye} height='20' width='20'/></a></td>
        </tr>
      )
      })
      : <tr><th>Error while loading the rooms</th></tr>
    }
    </tbody>
    </table>
    </div>
    <button className='button is-primary' style={{marginRight: '1em'}} onClick={()=>this.getRooms()}>Refresh</button>

    </Paper>
    </div>
  </div>
</div>
    );
  }
}



export default Lobby;
