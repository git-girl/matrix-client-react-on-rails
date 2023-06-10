import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import style from "./Home.module.css";
import SignUp from "../SignUp/SignUp";
import RoomsList from "../RoomsList/RoomsList";
import request from "axios";
import Util from "../../utilities.js";
import Loading from "../Loading/Loading";
import consumer from "channels/consumer";
import * as ActionCable from "@rails/actioncable";

// Home is a function with arg props that returns the body
const Home = (props) => {
  const [user, setUser] = useState(props.user);
  const [rooms, setRooms] = useState(props.rooms);

  const handleSignUpSuccess = (newUser) => {
    const requestConfig = {
      responseType: "json",
      headers: ReactOnRails.authenticityHeaders(),
    };
    // TODO: 
    // this needs to do something like enable the consomuer
    // ws connection
    
    request
      .get("/sync", user, requestConfig)
      .then(() => {
        // BUG: this Is the issue this only means that i triggered
        // the sync but not that it is complete.
        // i need to get a thing that is check for sync complete
        setUser(newUser);
        console.log("finished sync request  trigger")
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

  useEffect(() => {
    const subscription = consumer.subscriptions.create("SyncChannel", {
      received(data) {
        console.debug(data)
        if (data.message === "SYNCJOB_COMPLETE") {
          getRooms();
        }
      },
      connected() { 
        console.log("CONNECTED TO THE SYNC CHANNEL")
      }
    });

    // Clean up the subscription when the component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, [user]);
  // TODO: and a username component
  // -> could have a link for settings but meh
  // <h2 className={style.fancy_font}>{user.username}</h2>

  if (Util.object_vals_not_null(user)) {
    console.debug(user);
    console.log(rooms);
    if (rooms) {
      return (
        <div>
          <ul>
            <RoomsList rooms={rooms} />
          </ul>
        </div>
      );
    } else {
      // getRooms();

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
