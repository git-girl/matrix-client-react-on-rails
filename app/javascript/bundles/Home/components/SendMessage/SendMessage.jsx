import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom';
import style from "./SendMessage.module.css";
import consumer from "channels/consumer";
import request from "axios";

const SendMessage = (props) => {
  const [room, setRoom] = useState(props.room);
  const [user] = useState(props.user);
  const [message, setMessage] = useState('');

  const sendMessage = (message) => { 
    const requestData = { 
      // room: room,
      message: message
    } 

    const requestConfig = {
      responseType: "json",
      headers: ReactOnRails.authenticityHeaders(),
    };

    request
      .post("/send_message", requestData, requestConfig)
      .then(() => {
      })
      .catch((error) => {
        // TODO: handle error
      });
  }

  const handleMessageDraft = (event) => {
    setMessage(event.target.value);
  };

  const handleMessageSubmit = (event) => {
    if (event.key === 'Enter') {
      sendMessage(message); 

      setMessage("");
    }
  };

  return (
    <input
    type="text"
    value={message}
    onChange={handleMessageDraft}
    onKeyDown={handleMessageSubmit} 
    />
  );
};

SendMessage.propTypes = { 
  room: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  // TODO: -> pass back out to home that passes it into ActiveRoom
  // appendMatrixEvent: PropTypes.func.isRequired
}

export default SendMessage;
