import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import Home from './container/Home/Home';
import Login from './container/Login/Login';
import Form from './container/Form/Form';
import TestRedux from './container/TestRedux/TestRedux';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Switch>
            <Route path='/' exact component={Home}/>
            <Route path='/login' exact component={Login}/>
            <Route path='/form' exact component={Form}/>
            <Route path='/redux_test' exact component={TestRedux}/>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
