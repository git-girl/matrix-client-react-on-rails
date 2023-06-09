import PropTypes from 'prop-types';
import React, {useState} from 'react';
import style from './Home.module.css'; 
import SignUp from '../SignUp/SignUp';
import RoomsList from '../RoomsList/RoomsList';
import request from 'axios';


// Home is a function with arg props that returns the body
const Home = (props) => { 
   const [user, setUser]  = useState(props.user);
   const [rooms, setRooms] = useState([]);

  // TODO: im still not getting the rerender properly 
  const handleSignUpSuccess = (newUser) => {
    console.debug(newUser)
    setUser(newUser);

    console.debug(user)

    const requestConfig = {
      responseType: 'json',
      headers: ReactOnRails.authenticityHeaders(),
    };

    request
      .get('/sync', user, requestConfig)
      .then((response) => {
        console.log("triggered sync")
      })
      .catch((error) => {
        // TODO: handle error
      });
  };

  const getRooms = () => { 
    const requestConfig = {
      responseType: 'json',
      headers: ReactOnRails.authenticityHeaders(),
    };

    request
      .get('/rooms', user, requestConfig)
      .then((response) => {
        console.debug(response.data)
        setRooms(response.data)
      })
      .catch((error) => {
        // TODO: handle error
      });
  }

  if(user) {
    return (
      <div>
      <h2 className={style.fancy_font}>Hey there, {user.username}!</h2> 
      
      <a onClick={getRooms}>Get my Rooms</a>

      <ul>
        <RoomsList rooms={ rooms }/>
      </ul>

      </div>
    );
  } else {
    return (
      <div>
      <h2>Hey there, you can signup below</h2> 
      <SignUp onSuccess={handleSignUpSuccess} />
      </div>
    );
  }
}

Home.propTypes = { 
  // user: PropTypes.object.isRequired,
}

export default Home;
