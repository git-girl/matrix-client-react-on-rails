import PropTypes from "prop-types";
import React, { useState } from "react";

const RoomsList = (props, railsContext) => {
  const [rooms] = useState(props.rooms);

  if (!(rooms === undefined || rooms  == 0)) {
    return rooms.rooms.map((data) => {
      return (
        <li key={data}>
          <a href="https://github.com/git-girl">{data}</a>
        </li>
      );
    });
  }
};

RoomsList.propTypes = {
  rooms: PropTypes.object.isRequired,
};
export default RoomsList;
