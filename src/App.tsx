import { useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import './app.scss';
import Nav from './components/Nav/Nav';
import Spinner from './components/Spinner/Spinner';
import Callback from './pages/Callback/Callback';
import Login from './pages/Login/Login';
import Settings from './pages/Settings/Settings';
import Vendors from './pages/Vendors/Vendors';
import TokenStorage from './storage/Tokens';

const App = () => {
  const [loading, _] = useState(false);

  const tokenStorage = TokenStorage.getInstance();
  // const membershipInfoStorage = MembershipInfoStorage.getInstance();

  const tokens = tokenStorage.getAllTokens();
  const isAuthed = tokens ? true : false;

  return (
    <div className="App">
      <Nav isAuthorized={isAuthed} />
      <Switch>
        <Route exact={true} path="/login" component={Login} />
        <Route exact={true} path="/vendors" component={Vendors} />
        <Route exact={true} path="/" component={Vendors} />
        <Route exact={true} path="/callback" component={Callback} />
        <Route exact={true} path="/settings" component={Settings} />
        <Redirect to="/" />
      </Switch>
      {loading && <Spinner text="Loading Destiny manifest" noOverlay={false} />}
    </div>
  );
};

export default App;
