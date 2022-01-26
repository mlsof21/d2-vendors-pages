import { useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import './app.scss';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import Nav from './components/Nav/Nav';
import Spinner from './components/Spinner/Spinner';
import Callback from './pages/Callback/Callback';
import Inventory from './pages/Inventory/Inventory';
import Login from './pages/Login/Login';
import Logout from './pages/Logout/Logout';
import Settings from './pages/Settings/Settings';
import Vendors from './pages/Vendors/Vendors';

const App = () => {
  const [loading, _] = useState(false);

  return (
    <div className="App">
      <Nav />
      <ErrorBoundary>
        <Switch>
          <Route exact={true} path="/login" component={Login} />
          <Route exact={true} path={['/vendors', '/']} component={Vendors} />
          <Route exact={true} path="/inventory" component={Inventory} />
          <Route exact={true} path="/callback" component={Callback} />
          <Route exact={true} path="/settings" component={Settings} />
          <Route exact={true} path="/logout" component={Logout} />
          <Redirect to="/" />
        </Switch>
        {loading && <Spinner text="Loading Destiny manifest" noOverlay={false} />}
      </ErrorBoundary>
    </div>
  );
};

export default App;
