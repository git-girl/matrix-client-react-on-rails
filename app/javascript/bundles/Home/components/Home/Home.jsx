import PropTypes from 'prop-types';
import React, {useState} from 'react';
import style from './Home.module.css'; 
import SignUp from '../SignUp/SignUp';
import RoomsList from '../RoomsList/RoomsList';


// Home is a function with arg props that returns the body
const Home = (props) => { 
  const [user, setUser]  = useState(props.user);

  // TODO: im still not getting the rerender properly 
  const handleSignUpSuccess = (newUser) => {
    setUser(newUser);
  };

  if(user) {
    return (
      <div>
      <h2 className={style.fancy_font}>Hey there, {user.username}!</h2> 

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
