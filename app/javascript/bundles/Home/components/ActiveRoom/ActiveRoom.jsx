import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import style from "./ActiveRoom.module.css";
import Loading from "../Loading/Loading";
import consumer from "channels/consumer";

const ActiveRoom = (props) => { 
  const [room, setRoom] = useState(props.room)

  return (
    "todo"
  )
}

ActiveRoom.propTypes = {
  room: PropTypes.object.isRequired,
};

export default ActiveRoom;
