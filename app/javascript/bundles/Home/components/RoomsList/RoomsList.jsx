import PropTypes from "prop-types";
import React, { useState } from "react";
import style from "./RoomsList.module.css";

const RoomsList = ({ rooms, roomEnterClick }) => {
  const [roomsList] = useState(Object.entries(rooms));

  const handleRoomClick = (roomId, roomName) => {
    roomEnterClick(roomId,  roomName);
  };

  return roomsList.map(([roomId, roomName]) => {
    return (
      <li key={roomId}>
        <a className={style.linkStyle} onClick={() => handleRoomClick(roomId, roomName)}>
      {roomName}
      </a>
      </li>
    );
  });
};

RoomsList.propTypes = {
  rooms: PropTypes.object.isRequired,
  roomEnterClick: PropTypes.func.isRequired,
};
export default RoomsList;
