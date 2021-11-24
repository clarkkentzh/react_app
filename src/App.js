import React,{Component} from 'react';
import {
  Route,
  Switch,
  withRouter,
  BrowserRouter
} from 'react-router-dom';
import Home from './container/Home/Home';
import Login from './container/Login/Login';
import Form from './container/Form/Form';
import TestRedux from './container/TestRedux/TestRedux';
import Carousel from './container/Carousel/Carousel';
import TestAntd from './container/AntdComponents/Test'
import Header from './container/AntdComponents/Header'
import HookPage from './container/Hook/HookPage'
import TextPage from './container/TestFunction/TextPage'
import GameDemo from './container/GameDemo/GamePage'
import ReadFile from './container/ReadFile'
import SocketComponent from './container/Socket/SocketComponent'
import MQTTComponent from './container/MQTT/index'
import DvaScreen from './container/DvaTest/DvaScreen'
import { render } from 'react-dom';
class App extends Component {
    constructor(props) {
      super(props);
      this.state = {
      };
    } 
    render(){
        return (
          <BrowserRouter>
            <Header/>
            <div className="App">
              <Switch>
                <Route path='/' exact component={Home}/>
                <Route path='/login' exact component={Login}/>
                <Route path='/form' exact component={Form}/>
                <Route path='/redux_test' exact component={TestRedux}/>
                <Route path='/carousel' exact component={Carousel}/>
                <Route path='/antdtest' exact component={TestAntd}/>
                <Route path='/hook' exact component={HookPage}/>
                <Route path='/tests' exact component={TextPage}/>
                <Route path='/reactdemo' exact component={GameDemo}/>
                <Route path='/readfile' exact component={ReadFile}/>
                <Route path='/websocket' exact component={SocketComponent}/>
                <Route path='/mqtt' exact component={MQTTComponent}/>
                <Route path='/dva' exact component={DvaScreen}/>
              </Switch>
            </div>
          </BrowserRouter>
        );
    }
}

export default App;
