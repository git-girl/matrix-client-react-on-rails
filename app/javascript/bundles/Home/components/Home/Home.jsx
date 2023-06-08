import PropTypes from 'prop-types';
import React, {useState} from 'react';
import style from './Home.module.css'; 
import * as paths from '../../constants/paths';

// Home is a function with arg props that returns the body
const Home = (props) => { 
  const [username]  = useState(props.username);

  return ( 
    <div>
      <div class={style.fancy_font}> 
        <h2>
          Hello, {username}
        </h2>
      </div>

        <ul> 
          <li> 
            <a href={paths.SIGNUP_PATH}>Login to your Matrix account</a>
          </li>
        </ul>
    </div>
  )
}

Home.propTypes = { 
  username: PropTypes.string.isRequired,
}

export default Home;
