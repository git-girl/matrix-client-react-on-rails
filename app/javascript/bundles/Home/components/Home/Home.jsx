import PropTypes from "prop-types";
import React, { useState } from "react";
import style from "./Home.module.css";
import SignUp from "../SignUp/SignUp";
import RoomsList from "../RoomsList/RoomsList";
import request from "axios";
import Util from "../../utilities.js";
import Loading from "../Loading/Loading";
import ActiveRoom from "../ActiveRoom/ActiveRoom";
import SendMessage from "../SendMessage/SendMessage";
import NewRoom from "../NewRoom/NewRoom";
import Invite from "../Invite/Invite";

const Home = (props) => {
  const [user, setUser] = useState(props.user);
  const [rooms, setRooms] = useState();
  const [activeRoom, setActiveRoom] = useState(props.user.active_room);
  const [loading, setLoading] = useState(false);
  // for resetting Active Room
  const [matrixEvents, setMatrixEvents] = useState([]);
  
  const activeRoomName = () => { 
    if (activeRoom) {
      return activeRoom[1]
    }
    else {
      return "No active Room"
    }
  }

  const handleSignUpSuccess = (newUser) => {

    const requestConfig = {
      responseType: "json",
      headers: ReactOnRails.authenticityHeaders(),
    };
    request
      .get("/sync", user, requestConfig)
      .then(() => {
        // get rooms as a callback so after newUser has been set
        setUser(newUser);
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
  if (Util.object_vals_not_null(user) && !rooms) { 
    getRooms();
  }

  // SINGLE ROOM
  const getRoom = (roomId, roomName) => {

    setActiveRoom([roomId, roomName]);
    setMatrixEvents([]);

    const requestConfig = {
      responseType: "json",
      headers: ReactOnRails.authenticityHeaders(),
    };

    const requestData = {
      room_id: roomId,
    };
    request
      .post("/stream_room", requestData, requestConfig)
      .then(() => {
           })
      .catch((error) => {
        // TODO: handle error
      });
  };

  const signOut = () => {
    localStorage.clear();

    const requestConfig = {
      responseType: "json",
      headers: ReactOnRails.authenticityHeaders(),
    };

    const requestData = {};

    request.post("/signout", requestData, requestConfig).then(() => {
      setUser({ username: null, home_server: null });
    });
  };

  const activeRoomOrLoadingHTML = () => {
    if (!loading) {
      return (
            <ActiveRoom
              room={activeRoom}
              user={user}
              setLoading={setLoading}
              matrixEvents={[]}
            />
      );
    } else { 
      const text = `Fetching Room Message for ${activeRoomName()}`
      return ( 
        <>
        <Loading text={text} />
          <ActiveRoom
            room={activeRoom}
            user={user}
            setLoading={setLoading}
          />
        </>
      );
    }
  };
  if (Util.object_vals_not_null(user)) {
    if (rooms) {
      return (
        <div className={style.flex_container}>
          <div className={style.room_list}>
            <b>
              <a onClick={signOut}>SignOut</a>
            </b>
            <NewRoom getRooms={getRooms} setActiveRoom={setActiveRoom}/>
            <ul>
              <RoomsList rooms={rooms} roomEnterClick={getRoom} />
            </ul>
          </div>

         <div className={style.roomWindow}>

            <h4>{activeRoomName()}</h4>
            <div className={style.InviteWindowContainer}>
              Invite User <Invite className={style.inviteWindow} />
            </div>

            <div className={style.messagesBox}>
              {activeRoomOrLoadingHTML()}
            </div>

            <div className={style.sendMessageBox}>
            <SendMessage
              room={activeRoom}
              user={user}
            />
            </div>
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
        <p>
          {" "}
          or create an account somewhere{" "}
          <a href="https://joinmatrix.org/servers/">here</a>{" "}
        </p>
        <SignUp onSuccess={handleSignUpSuccess} />
      </div>
    );
  }
};

Home.propTypes = {
  user: PropTypes.object.isRequired,
};

export default Home;
