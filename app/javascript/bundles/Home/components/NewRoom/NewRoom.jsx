import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import style from "./NewRoom.module.css";
import consumer from "channels/consumer";
import request from "axios";

const NewRoom = ( {getRooms ,setActiveRoom}) => {
  const [newRoomName, setNewRoomName] = useState("");
  const [roomCreateError, setRoomCreateError] = useState();

  const handleNewRoomSubmit = (event) => {
    if (event.key === "Enter") {
      createRoom(newRoomName);

      setNewRoomName("");
    }
  };

  const handleNewRoomDraft = (event) => {
    setNewRoomName(event.target.value);
  };
  const createRoom = (roomName) => {
    const requestData = {
      new_room: roomName,
    };

    const requestConfig = {
      responseType: "json",
      headers: ReactOnRails.authenticityHeaders(),
    };

    request
      .post("/new_room", requestData, requestConfig)
      .then((response) => {
          setActiveRoom(response.data.room_id)
          getRooms();
      })
      .catch((error) => { 
          if (error.hasOwnProperty('response')) { 
            setRoomCreateError(error.response.data.error)
          } else { 
            console.debug(error)
          }
      });
  };

  const roomCreateHTML = ( 
      <div>
        <p>
          <b>Create a new <br></br> 
             private Room</b>
        </p>
        <input
          type="text"
          value={newRoomName}
          onChange={handleNewRoomDraft}
          onKeyDown={handleNewRoomSubmit}
        />
      </div>
  );
  if (!roomCreateError) {
    return roomCreateHTML ; 
  } else { return ( 
    <div>
      { roomCreateError } 
      { roomCreateHTML }
    </div>
    )
  } 
};

NewRoom.propTypes = {};

export default NewRoom;
