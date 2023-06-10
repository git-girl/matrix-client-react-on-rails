import PropTypes from "prop-types";
import React, { useState } from "react";
import style from "./RoomsList.module.css";
import request from "axios";

const RoomsList = (props) => {
  const [rooms] = useState(Object.entries(props.rooms));

  const getRoom = (room_id) => { 
    const requestConfig = {
      responseType: "json",
      headers: ReactOnRails.authenticityHeaders(),
    };

    const requestData = { 
      room_id: room_id
    }
    request
      .post("/stream_room", requestData , requestConfig)
      .then((response) => {
        console.debug(response)
      })
      .catch((error) => {
        // TODO: handle error
      });
  };

  return rooms.map(([room_id, room_name]) => {
    return (
      <li key={room_id}>
        <a className={style.linkStyle} onClick={() => getRoom(room_id)}>
      {room_name}
      </a>
      </li>
    );
  });
};

RoomsList.propTypes = {
  rooms: PropTypes.object.isRequired,
};
export default RoomsList;
