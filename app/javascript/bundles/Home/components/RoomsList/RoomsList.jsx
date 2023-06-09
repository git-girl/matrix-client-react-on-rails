import PropTypes from 'prop-types';
import React, {useState} from 'react';
import * as paths from '../../constants/paths';
import request from 'axios';

const RoomsList = (props, railsContext) => { 
  const [user] = useState(props.user);
  const [rooms] = useState(props.rooms);

  // console.debug(props.rooms)

  // TODO: fix rooms definition in home controller 
  // that sets the useState as a [] i want to use the props.rooms maybe 
  // if that is null i get nicer code  here as well
    if (!(props.rooms === undefined || props.rooms.length == 0)) {
    return (
        props.rooms.rooms.map( (data) => {
        return (
          <li key={data}>
            { data }
          </li>
        )
      }
    )
    )
  }
}

RoomsList.propTypes = { 
  rooms: PropTypes.object.isRequired,
}
export default RoomsList;
