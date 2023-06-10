import request from 'axios';

import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Loading from '../Loading/Loading'

// TODO: rename to SignUpForm
const SignUp = ({onSuccess}) => { 

  // INFO: this declares a new state to be Used and the second arg is the setter function
  const [user, setUser] = useState({});
  const [username, setUsername] = useState('');
  const [greeting, setGreeting] = useState(<p></p>);
  const [homeServer, setHomeServer] = useState();

  // TODO: display loading animation
  const handleSubmit = (event) => {
    event.preventDefault();

    const formHomeServer = event.target.elements.homeServer.value;
 
    // username already set through setUsername at this point
    // TODO: make this interate with the Home component this is 
    // somewhat redundant
    const greetingString = (
      <div>
        <p>Hey there, @{username}! Getting things ready for you :)</p>
        <p>Checking your credentials against {formHomeServer}</p>
      </div>
    );
    setGreeting(<Loading text={ greetingString } />);

    let user = {
      username: event.target.elements.username.value,
      password: event.target.elements.password.value,
      // NOTE: dont send https because only want the domain
      home_server: formHomeServer ,
    }

    const requestConfig = {
      responseType: 'json',
      headers: ReactOnRails.authenticityHeaders(),
    };

    request
      .post('/session', user, requestConfig)
      .then((response) => {
        onSuccess(response.data);
      })
      .catch((error) => {
        // TODO: handle error
      });
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  return ( 
    <div>

      {greeting}

    <form onSubmit={handleSubmit}>
    <fieldset>

    <label>
    <p>Home Server</p>
    <span>
      https:// <input type="text" name="homeServer"/>
    </span>
    </label>

    <label>
    <p>Name</p>
    <input type="text" value={username} onChange={handleUsernameChange} name="username"/>
    </label>

    <label>
    <p>Password</p>
    <input type="password" name="password"/>
    </label>

    </fieldset>
    <button type="submit">Submit</button>
    </form>
    </div>
  )
}

SignUp.propTypes = { 
    onSuccess: PropTypes.func.isRequired,
  }

export default SignUp;
