import './app.scss';
import Spinner from './components/Spinner/Spinner';
import { ReactElement, useState } from 'react';
import Nav from './components/Nav/Nav';
import { Switch, Route, Redirect } from 'react-router-dom';
import Login from './pages/Login/Login';
import Callback from './pages/Callback/Callback';
import Home from './pages/Home/Home';
import Vendors from './pages/Vendors/Vendors';
import Settings from './pages/Settings/Settings';

function App(): ReactElement {
  const [loading, _] = useState(false);

  return (
    <div className="App">
      <Nav />
      <Switch>
        <Route exact={true} path="/login" component={Login} />
        <Route exact={true} path="/vendors" component={Vendors} />
        <Route exact={true} path="/callback" component={Callback} />
        <Route exact={true} path="/settings" component={Settings} />
        <Route exact={true} path="/" component={Home} />
        <Redirect to="/" />
      </Switch>
      {loading && <Spinner text="Loading Destiny manifest" noOverlay={false} />}
    </div>
  );
}

export default App;
