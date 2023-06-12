import PropTypes from "prop-types";
import React, { useState } from "react";
import request from "axios";

const Invite = (props) => { 
  const [activeRoom] = useState(props.activeRoom);
  const [invited, setInvited] = useState(false);
  const [invitedUser, setInvitedUser] = useState("");

  const inviteUser = (username) => { 
    const requestData = { 
      username: username,
    }
    console.debug(requestData)

    const requestConfig = {
      responseType: "json",
      headers: ReactOnRails.authenticityHeaders(),
    }

    request
    .post("/invite_user", requestData, requestConfig)
      .then(() => {
        setInvited(true);

      })
      .catch(() => {
        // TODO: write something on user not found
      });
  };


  const handleDraftInvite = (event) => {
    setInvitedUser(event.target.value);
  };

  const handleInviteSubmit = (event) => {
    if (event.key === 'Enter') {
      inviteUser(invitedUser); 
      setInvitedUser("");
    }
  };

  let invitedNotice = ""
  if (invited) {
    invitedNotice = `Invited user ${invitedUser}`
  }

  return ( 
    <>
    <p>{invitedNotice}</p>

    <input
    type="text"
    value={invitedUser}
    onChange={handleDraftInvite}
    onKeyDown={handleInviteSubmit} 
    placeholder="@username:server.xyz"
    />

    </>
  );
}

Invite.propTypes = {
  activeRoom: PropTypes.array.isRequired
}

export default Invite;

