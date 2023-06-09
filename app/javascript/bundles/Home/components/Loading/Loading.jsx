import PropTypes from 'prop-types';
import React, {useState} from 'react';
import style from "./Loading.module.css";

const Loading = (props) => { 
  const [text] = useState(props.text);
  const [asciArt, setAsciArt] = useState("");

  const loading_ascii_art = (disp_string) => { 
    if (disp_string == "...") { 
      return ""
    } else { 
      return `${disp_string}.`
    }
  }

  const interval = setInterval(function() {
    setAsciArt(loading_ascii_art(asciArt))
  }, 500);

  return ( 
    <p className={style.border}> 
      {text} {asciArt}
    </p>
  );
}

Loading.propTypes = { 
  text: PropTypes.string.isRequired,
}

export default Loading;
