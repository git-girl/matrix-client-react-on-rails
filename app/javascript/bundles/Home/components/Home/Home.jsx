import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import style from "./Home.module.css";
import SignUp from "../SignUp/SignUp";
import RoomsList from "../RoomsList/RoomsList";
import request from "axios";
import Util from "../../utilities.js";
import Loading from "../Loading/Loading";
import consumer from "channels/consumer";
import ActiveRoom from "../ActiveRoom/ActiveRoom"

// Home is a function with arg props that returns the body
const Home = (props) => {
  // INFO: you can use syncComlete if you add stuff to change
  // the user details as to not trigger a sync
  const [syncComplete, setSyncComplete] = useState(false);
  const [user, setUser] = useState(props.user);
  const [rooms, setRooms] = useState(Util.tryGetRoomsLocalStorage());
  // TODO: also get something like current room from the room
  // you last sent a message
  const [activeRoom, setActiveRoom] = useState( () => {
    if (Util.tryGetRoomsLocalStorage()) {
      return Util.getFirstElementOfRooms(rooms)
    }}
  )

  const handleSignUpSuccess = (newUser) => {
    const requestConfig = {
      responseType: "json",
      headers: ReactOnRails.authenticityHeaders(),
    };
    request
      .get("/sync", user, requestConfig)
      .then(() => {
        // get rooms as a callback so after newUser has been set
        setUser(newUser, getRooms());
      })
      .catch((error) => {
        // TODO: handle error
      });
  };

  // ROOM COLLECTION
  const getRooms = () => {
    const requestConfig = {
      responseType: "json",
      headers: ReactOnRails.authenticityHeaders(),
    };

    request
      .get("/rooms", user, requestConfig)
      .then((response) => {
        // response is a id display_name kv pair
        // TODO: write this back in did it for debug
        // setRooms(response.data, setActiveRoom(rooms[0]));
        setRooms(response.data);
        // store it in loaclStorage
        window.localStorage.setItem("rooms", JSON.stringify(response.data));
      })
      .catch((error) => {
        // TODO: handle error
      });
  };

  // SINGLE ROOM 
  // TODO: switch to set current room -> send a join request over actionCabl
  const getRoom = (room_id) => { 
    const requestConfig = {
      responseType: "json",
      headers: ReactOnRails.authenticityHeaders(),
    };

    const requestData = { 
      room_id: "!YcdlKUHdHYxJJYBIkM:matrix.org"
    }
    request
      .post("/stream_room", requestData , requestConfig)
      .then((response) => {
        // console.debug(response)
      })
      .catch((error) => {
        // TODO: handle error
      });
  };
  // TODO: and a username component
  // -> could have a link for settings but meh
  // <h2 className={style.fancy_font}>{user.username}</h2>

  if (Util.object_vals_not_null(user)) {
    if (rooms) {
      return (
        <div className={style.flex_container}>
          <div className={style.room_list}> 
            <ul>
              <RoomsList rooms={rooms} roomEnterClick={getRoom} />
            </ul>
          </div>

          <div className={style.active_room}> 
            <ActiveRoom room={activeRoom} user={user} getRoom={getRoom}/>
          </div>
        </div>
      );
    } else {
      return <Loading text="Fetching your Rooms" />;
    }
  } else {
    return (
      <div>
        <h3>Hey there, you can sign into your existing matrix account on a server below</h3>
        <SignUp onSuccess={handleSignUpSuccess} />
      </div>
    );
  }
};

Home.propTypes = {
  user: PropTypes.object.isRequired,
};

export default Home;
