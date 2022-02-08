import { useEffect, useState } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import './app.scss';
import Nav from './components/Nav/Nav';
import Spinner from './components/Spinner/Spinner';
import Callback from './pages/Callback/Callback';
import Inventory from './pages/Inventory/Inventory';
import Login from './pages/Login/Login';
import Settings from './pages/Settings/Settings';
import Vendors from './pages/Vendors/Vendors';
import TokenStorage from './storage/TokenStorage';

const App = () => {
  const [loading, _] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);

  const tokenStorage = TokenStorage.getInstance();
  const tokens = tokenStorage.getAllTokens();

  const handleAuth = () => {
    setIsAuthed(true);
  };

  useEffect(() => {
    if (tokens) {
      setIsAuthed(true);
    }
  }, [setIsAuthed]);

  return (
    <div className="App">
      <BrowserRouter>
        <Nav isAuthorized={isAuthed} />
        <Switch>
          <Route exact={true} path="/login">
            <Login handleAuth={handleAuth} />
          </Route>
          <Route exact={true} path="/vendors" component={Vendors} />
          <Route exact={true} path="/" component={Vendors} />
          <Route exact={true} path="/inventory" component={Inventory} />
          <Route exact={true} path="/callback" component={Callback} />
          <Route exact={true} path="/settings" component={Settings} />
          <Redirect to="/" />
        </Switch>
        {loading && <Spinner text="Loading Destiny manifest" noOverlay={false} />}
      </BrowserRouter>
    </div>
  );
};

export default App;
