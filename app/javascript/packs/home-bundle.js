import ReactOnRails from 'react-on-rails';

import Home from '../bundles/Home/components/Home/Home';
import SignUp from '../bundles/Home/components/SignUp/SignUp';
import RoomsList from '../bundles/Home/components/RoomsList/RoomsList';
import Loading from '../bundles/Home/components/Loading/Loading';
import ActiveRoom from '../bundles/Home/components/ActiveRoom/ActiveRoom';
import SendMessage from '../bundles/Home/components/SendMessage/SendMessage';
import NewRoom from '../bundles/Home/components/NewRoom/NewRoom';
import Invite from '../bundles/Home/components/Invite/Invite';

ReactOnRails.register({
  Home,
  SignUp,
  RoomsList,
  ActiveRoom,
  Loading,
  SendMessage,
  NewRoom,
  Invite,
})

