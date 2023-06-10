import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import style from "./Home.module.css";
import SignUp from "../SignUp/SignUp";
import RoomsList from "../RoomsList/RoomsList";
import request from "axios";
import Util from "../../utilities.js";
import Loading from "../Loading/Loading";
import consumer from "channels/consumer";

// Home is a function with arg props that returns the body
const Home = (props) => {
  const [syncComplete, setSyncComplete] = useState(false)
  const [user, setUser] = useState(props.user);
  const [rooms, setRooms] = useState(props.rooms);

  const handleSignUpSuccess = (newUser) => {
    const requestConfig = {
      responseType: "json",
      headers: ReactOnRails.authenticityHeaders(),
    };
    request
      .get("/sync", user, requestConfig)
      .then(() => {
        setUser(newUser);
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
        setRooms(response.data.rooms);
      })
      .catch((error) => {
        // TODO: handle error
      });
  };

  useEffect(() => {
    const subscription = consumer.subscriptions.create("SyncChannel", {
      received(data) {
        if (data.message === "SYNCJOB_COMPLETE") {
          setSyncComplete(true);
          getRooms();
        }
      },
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [user]);
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
           return <Loading text="Fetching your Rooms" />;
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
