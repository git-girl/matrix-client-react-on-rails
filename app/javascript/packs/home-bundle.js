import ReactOnRails from 'react-on-rails';

import Home from '../bundles/Home/components/Home/Home';
import SignUp from '../bundles/Home/components/SignUp/SignUp';
import RoomsList from '../bundles/Home/components/RoomsList/RoomsList';
import Loading from '../bundles/Home/components/Loading/Loading';

ReactOnRails.register({
  Home,
  SignUp,
  RoomsList,
  Loading,
})

