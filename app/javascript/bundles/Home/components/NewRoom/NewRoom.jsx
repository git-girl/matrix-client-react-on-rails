import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import request from "axios";

const NewRoom = ( {getRooms ,setActiveRoom}) => {
  const [newRoomName, setNewRoomName] = useState("");
  const [roomCreateError, setRoomCreateError] = useState();
  const [creatingRoom, setCreatingRoom] = useState(false);

  const handleNewRoomSubmit = (event) => {
    if (event.key === "Enter") {
      startDM(newRoomName);

      setNewRoomName("");
    }
  };

  const handleNewRoomDraft = (event) => {
    setNewRoomName(event.target.value);
  };
  const startDM = (userName) => {
    // TODO: fix this creatingRoom not working
    setCreatingRoom(true);

    const requestData = {
      username: userName,
    };

    const requestConfig = {
      responseType: "json",
      headers: ReactOnRails.authenticityHeaders(),
    };

    request
      .post("/new_room", requestData, requestConfig)
      .then((response) => {
          setActiveRoom([response.data[0], response.data[1]])
          getRooms();
      })
      .catch((error) => { 
          if (error.hasOwnProperty('response')) { 
            setRoomCreateError(error.response.data.error)
          } else { 
            console.debug(error)
          }
      })
      .finally(() => {
        setCreatingRoom(false);
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
  } else if(creatingRoom) { return (
    <div>
      <Loading text="Creating room"/>
    </div>
  );
  } else { return ( 
    <div>
      { roomCreateError } 
      { roomCreateHTML }
    </div>
    )
  } 
};

NewRoom.propTypes = {
  getRooms: PropTypes.func.isRequired,
};

export default NewRoom;
