import PropTypes from "prop-types";
import React, { useState } from "react";
import style from "./Home.module.css";
import SignUp from "../SignUp/SignUp";
import RoomsList from "../RoomsList/RoomsList";
import request from "axios";
import Util from "../../utilities.js";
import Loading from "../Loading/Loading";

// Home is a function with arg props that returns the body
const Home = (props) => {
  const [user, setUser] = useState(props.user);
  const [rooms, setRooms] = useState(props.rooms);
  const [renderRoomsSection, setRenderRoomsSection] = useState(false);

  const handleSignUpSuccess = (newUser) => {
    const requestConfig = {
      responseType: "json",
      headers: ReactOnRails.authenticityHeaders(),
    };
    request
      .get("/sync", user, requestConfig)
      .then(() => {
        setUser(newUser);
        setRenderRoomsSection(true);
      })
      .catch((error) => {
        // TODO: handle error
      });
  };

  const getRooms = () => {
    const requestConfig = {
      responseType: "json",
      headers: ReactOnRails.authenticityHeaders(),
    };

    request
      .get("/rooms", user, requestConfig)
      .then((response) => {
        setRooms(response.data);
      })
      .catch((error) => {
        // TODO: handle error
      });
  };

  // TODO: Loading Component
  // if renderRoomsSection -> else render Loading Component
  // with msg Syncing

  // TODO: and a username component
  // -> could have a link for settings but meh
  // <h2 className={style.fancy_font}>{user.username}</h2>

  if (Util.object_vals_not_null(user)) {
    if (rooms) {
      return (
        <div>
          <ul>
            <RoomsList rooms={rooms} />
          </ul>
        </div>
      );
    } else {
      getRooms();

      return <Loading text="Fetching your Rooms"/>;
    }
  } else {
    return (
      <div>
        <h2>Hey there, you can signup below</h2>
        <SignUp onSuccess={handleSignUpSuccess} />
      </div>
    );
  }
};

Home.propTypes = {
  user: PropTypes.object.isRequired,
};

export default Home;
