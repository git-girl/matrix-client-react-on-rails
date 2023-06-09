import PropTypes from 'prop-types';
import React, {useState} from 'react';
import * as paths from '../../constants/paths';
import request from 'axios';

const RoomsList = (props, railsContext) => { 
  const [user] = useState(props.user);
  const [rooms] = useState(props.rooms);

  if(props.rooms.rooms !== []){ 
    return (
        props.rooms.rooms.map( (data) => {
        return (
          <li>
            { data }
          </li>
        )
      }
    )
    )
  }
}

RoomsList.propTypes = { 
  rooms: PropTypes.array.isRequired,
}
export default RoomsList;
