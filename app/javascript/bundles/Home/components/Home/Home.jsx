import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import style from "./Home.module.css";
import SignUp from "../SignUp/SignUp";
import RoomsList from "../RoomsList/RoomsList";
import request from "axios";
import Util from "../../utilities.js";
import Loading from "../Loading/Loading";
import consumer from "channels/consumer";
import ActiveRoom from "../ActiveRoom/ActiveRoom";
import Olm from "../../../../../../node_modules/@matrix-org/olm/olm_legacy.js";
import SendMessage from "../SendMessage/SendMessage";

const Home = (props) => {
   const [user, setUser] = useState(props.user);
  const [rooms, setRooms] = useState(Util.tryGetRoomsLocalStorage());
  // TODO: also get something like current room from the room
  // you last sent a message
  const [activeRoom, setActiveRoom] = useState(() => {
    if (Util.tryGetRoomsLocalStorage()) {
      return Util.getFirstElementOfRooms(rooms);
    }
  });

  const handleSignUpSuccess = (newUser) => {
    // Init olm for e2e
    // rip :( 
    Olm.init().then(console.log("Olm inited"));

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
        setRooms(response.data);
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
      room_id: room_id,
    };
    request
      .post("/stream_room", requestData, requestConfig)
      .then(() => {
        // setActiveRoom(`loading room: ${room_id}`);
      })
      .catch((error) => {
        // TODO: handle error
      });
  };

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
            <ActiveRoom room={activeRoom} user={user} getRoom={getRoom} />
            <SendMessage room={activeRoom} user={user} />
          </div>
        </div>
      );
    } else {
      return <Loading text="Fetching your Rooms" />;
    }
  } else {
    return (
      <div>
        <h3>
          Hey there, you can sign into your existing matrix account on a server
          below
        </h3>
        <SignUp onSuccess={handleSignUpSuccess} />
      </div>
    );
  }
};

Home.propTypes = {
  user: PropTypes.object.isRequired,
};

export default Home;
