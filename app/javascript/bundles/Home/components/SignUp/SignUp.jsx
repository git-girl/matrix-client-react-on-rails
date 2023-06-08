import request from 'axios';

import React, {useState} from 'react';
import PropTypes from 'prop-types';

// TODO: rename to SignUpForm
const SignUp = (props) => { 

  // INFO: this declares a new state to be Used and the second arg is the setter function
  const [user, setUser] = useState({});
  const [username, setUsername] = useState('');
  const [password ] = useState('');
  const [greeting, setGreeting] = useState(
    <h2>
    Hey there! Please sign into your matrix account
    </h2>
  );

  // TODO: display loading animation
  const handleSubmit = (event) => {
    event.preventDefault();

    // username already set through setUsername at this point
    const greetingString = <h2>Hey there, @{username}! Getting things ready for you :)</h2>;
    setGreeting(greetingString);

    // TODO: learn the proper way to do this, 
    // I think you are supposed to track the state better
    let user = {
      username: event.target.elements.username.value,
      password: event.target.elements.password.value,
    }


    const requestConfig = {
      responseType: 'json',
      headers: ReactOnRails.authenticityHeaders(),
    };

    return request.
      post('http://localhost:3000/user', {user}, requestConfig);

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
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
  }

export default SignUp;
