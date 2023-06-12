import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom';
import style from "./ActiveRoom.module.css";
import Loading from "../Loading/Loading";
import consumer from "channels/consumer";

const ActiveRoom = ({room, user, setLoading}) => {
  const [matrixEvents, setMatrixEvents] = useState([]);

  const addMatrixEvent = (newEvent) => {
    setMatrixEvents((prevEvents) => [...prevEvents, newEvent]);
  };

  const ageToHumanReadable = (ms) => {
    let x = ms / 1000;
    let seconds = Math.round(x % 60);
    x /= 60;
    let minutes = Math.round(x % 60);
    x /= 60;
    let hours = Math.round(x % 24);
    x /= 24;
    let days = Math.round(x);
  
    if (days > 0) {
      return `${days} days ago`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ago`;
    } else if (minutes > 0) {
      return `${minutes}m ago`;
    } else {
      return `${seconds}s ago`;
    }
  };

  // Oh boi
  const resurectSerializedJSON = (serialziedJSON) => {
    const index = serialziedJSON.indexOf(": ");
    const key = serialziedJSON.slice(0, index);
    let value = serialziedJSON.slice(index + 1);
    value = value.replace(/\\"/g, '"');
    // remove the last " the first gets removed by key removal
    value = value.slice(1, -1);

    return JSON.parse(value)
  };

  const setupSubscription = () => {
    const subscription = consumer.subscriptions.create(
      { channel: "MatrixClientChannel", user: user },
      {
        connected() {
          console.log("WS Connection established");

        },
        received(data) {
          if (data.hasOwnProperty("events")) {

            setMatrixEvents(data.events);
            setLoading(false);

          } else if (data.hasOwnProperty("event")) {

            const newMatrixEvent = resurectSerializedJSON(data.event);
            addMatrixEvent(newMatrixEvent);
            // Keys receive was here :( 

          } else {
            console.log("Got an unhandled message from MatrixClientChannel");
            console.debug(data);
          }
        },
      }
    );

    const send = (data) => {
      subscription.perform("receive", { data: data });
    };

    return { subscription, send };
  };

  useEffect(() => {
    const { subscription, send } = setupSubscription();

    return () => {
      subscription.unsubscribe();
    };
  }, [room]);
  // TODO: content.body needs a proxy for nil -> cant decrypt
  // TODO: move this to eventsComponent
  //       and have this ActiveRooms component only take care of the organizing
  //       of sendmessageHtml and the Event list Html

  const eventListHTML = matrixEvents.map((event) => {
    let sender = "sender";
    let timestamp = "timestamp";
    let body = "body";

    try {
      sender = event.sender;
      timestamp = ageToHumanReadable(event.unsigned.age);
      body = event.content.body || event.content.ciphertext;
    } catch (error) {
      console.error("Error accessing event properties:", error);
    }

    // WARN: somehow event_id is not unique across events :shrug:
    return (
      <div key={event.event_id} className={style.matrixEventContainer}>
        <div className={style.matrixEventInfo}>
          {sender}
          <div className={style.matrixEventTimestamp}>{timestamp}</div>
        </div>
        <div className={style.matrixEventBody}>{body}</div>
      </div>
    );
  });

 return (
   <div>
   { eventListHTML }
   </div>
 );
};

ActiveRoom.propTypes = {
  room: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  setLoading: PropTypes.func.isRequired,
};

export default ActiveRoom;
