import PropTypes from 'prop-types';
import React, {useState} from 'react';
import * as paths from '../../constants/paths';
import request from 'axios';

const RoomsList = (props) => { 
  const [user] = useState(props.user);
  const [rooms, setRooms] = useState(props.rooms);

  const getRooms = () => { 
    const requestConfig = {
      responseType: 'json',
      headers: ReactOnRails.authenticityHeaders(),
    };
    request
      .get('/user/rooms', { user }, requestConfig)
      .then((response) => {
        onSuccess(response.data);
      })
      .catch((error) => {
        // TODO: handle error -> you dont have rooms
      });
  }

  if(rooms !== null){ 
    return ( 
      <div> 
        <h3>Rooms</h3>
        
        <a href='/user/rooms'>GET user/rooms</a>
        
      </div>
    )
  }
}

RoomsList.propTypes = { 
  user: PropTypes.object.isRequired,
}
export default RoomsList;
