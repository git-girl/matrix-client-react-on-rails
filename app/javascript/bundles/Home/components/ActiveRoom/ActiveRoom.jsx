import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import style from "./ActiveRoom.module.css";
import Loading from "../Loading/Loading";
import consumer from "channels/consumer";

const ActiveRoom = (props) => { 
  const [room, setRoom] = useState(props.room)
  const [user] = useState(props.user)
  const [matrixEvents, setMatrixEvents] = useState([])
  const getRoom = props.getRoom

  // TODO: this can trigger room load but put in a 
  // better place so i dont get constant requests
  // const getRoomData = (room) => {
  //   const roomId = Object.keys(room)[0];
  //   getRoom(roomId);
  // }
  // getRoomData(room);

  // TODO: I THINK THIS IS NOT RERENDERING ONCE I SETSTATE 
  // THE MATRIXEVENTS

  useEffect(() => {
    const subscription = consumer.subscriptions.create(
      { channel: "MatrixClientChannel", user: user}, {
      received(data) {
        if (data.events) {
          console.debug(data.events)
          setMatrixEvents(data.events)
        }
        else if (data.message) {
          console.log(data.message)
        }
        else {
          console.log("GOT AN UNHANDLED MESSAGE FROM MatrixClientChannel")
          console.debug(message)
        }
      },
    });
    return () => {
    subscription.unsubscribe();
      };
    }, [room]);

  // TODO: content.body needs a proxy for nil -> cant decrypt
  // TODO: move this to eventsComponent
  //       and have this ActiveRooms component only take care of the organizing 
  //       of sendmessageHtml and the Event list Html
  const eventListHTML = matrixEvents.map((event) => { 
    return ( 
      <div key={event.event_id} className={style.matrixEventContainer}>
        <div className={style.matrixEventInfo}>
         {event.sender}
          <br></br>
         {event.content.msgtype}
         <div className={style.matrixEventTimestamp}>
          {event.unsigned.age}
         </div>
        </div>
        <div className={style.matrixEventBody}>
          {event.content.body}
        </div>
      </div>
    )
  });

  const sendMessageHTML = (
    <div>

    </div>
  )

  return eventListHTML;
}

ActiveRoom.propTypes = {
  room: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  getRoom: PropTypes.func.isRequired,
};

export default ActiveRoom;
