import React from 'react';
import {
  Route,
  Switch,
  withRouter
} from 'react-router-dom';
import Home from './container/Home/Home';
import Login from './container/Login/Login';
import Form from './container/Form/Form';
import TestRedux from './container/TestRedux/TestRedux';
import Carousel from './container/Carousel/Carousel';
import TestAntd from './container/AntdComponents/Test'
import Header from './container/AntdComponents/Header'
import HookPage from './container/Hook/HookPage'

const App = withRouter((props)=> {
    return (
        <div className="App">
          <Header propsData={props}/>
          <Switch>
            <Route path='/' exact component={Home}/>
            <Route path='/login' exact component={Login}/>
            <Route path='/form' exact component={Form}/>
            <Route path='/redux_test' exact component={TestRedux}/>
            <Route path='/carousel' exact component={Carousel}/>
            <Route path='/antdtest' exact component={TestAntd}/>
            <Route path='/hook' exact component={HookPage}/>
          </Switch>
        </div>
    );
})

export default App;
