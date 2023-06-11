import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import style from "./ActiveRoom.module.css";
import Loading from "../Loading/Loading";
import consumer from "channels/consumer";

const ActiveRoom = (props) => {
  const [room, setRoom] = useState(props.room);
  const [user] = useState(props.user);
  const [matrixEvents, setMatrixEvents] = useState([]);
  const [memeberKeys, setMemberKeys] = useState([]);
  const getRoom = props.getRoom;

  // TODO: this can trigger room load but put in a
  // better place so i dont get constant requests
  // const getRoomData = (room) => {
  //   const roomId = Object.keys(room)[0];
  //   getRoom(roomId);
  // }
  // getRoomData(room);

  // TODO: I THINK THIS IS NOT RERENDERING ONCE I SETSTATE
  // THE MATRIXEVENTS

  const addMatrixEvent = (newEvent) => {
    setMatrixEvents((prevEvents) => [...prevEvents, newEvent]);
  };

  const setupSubscription = () => {
    const subscription = consumer.subscriptions.create(
      { channel: "MatrixClientChannel", user: user },
      {
        connected() {
          console.log("WS Connection established");
        },
        received(data) {
          if (data.hasOwnProperty('events')) { 
            console.debug(data.events);
            setMatrixEvents(data.events);
          } else if (data.hasOwnProperty('event')) {
            // NOTE: there is some weird escaped thing going on but 
            // this doesnt apply to the first key :shrug: 
            // so im removing the first thing -> room.encrypte:\s 
            // WARN: This is probably not great and you need to replace the first 
            // key regardless  of it being m.room.encrypted.
            const firstKeyRemovedEvent = data.event.replace(/m\.room\.encrypted:\s+/, '');
            const newMatrixEvent = JSON.parse(firstKeyRemovedEvent)
            addMatrixEvent(newMatrixEvent)

            if (data.hasOwnProperty('keys')) {
              console.debug(JSON.parse(data.keys))
              setMemberKeys()
            } else {
              console.error("Didn't get keys for the room from WS")
            }

          }
          else {
            console.log("GOT AN UNHANDLED MESSAGE FROM MatrixClientChannel");
            console.debug(data);
          }
        },
      }
    );

    const send = (data) => {
      subscription.perform('receive', { data: data });
    };

    return { subscription, send };
  };

  useEffect(() => {
    const { subscription, send } = setupSubscription();

    send({ message: 'Hello, backend!' });

    return () => {
      subscription.unsubscribe();
    };
  }, [room]);
  // TODO: content.body needs a proxy for nil -> cant decrypt
  // TODO: move this to eventsComponent
  //       and have this ActiveRooms component only take care of the organizing
  //       of sendmessageHtml and the Event list Html
 
const eventListHTML = matrixEvents.map((event) => {
  let sender = 'sender';
  let msgType = 'msgType';
  let timestamp = 'timestamp';
  let body = 'body';

  try {
    sender = event.sender;
    msgType = event.msgType;
    timestamp = event.timestamp;
    body = event.body;
  } catch (error) {
    console.error('Error accessing event properties:', error);
  }

  // WARN: somehow event_id is not unique across events :shrug: 
  return (
    <div key={event.event_id} className={style.matrixEventContainer}>
      <div className={style.matrixEventInfo}>
        {sender}
        <br></br>
        {msgType}
        <div className={style.matrixEventTimestamp}>{timestamp}</div>
      </div>
      <div className={style.matrixEventBody}>{body}</div>
    </div>
  );
});

  const sendMessageHTML = <div></div>;

  return eventListHTML;
};

ActiveRoom.propTypes = {
  room: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  getRoom: PropTypes.func.isRequired,
};

export default ActiveRoom;
