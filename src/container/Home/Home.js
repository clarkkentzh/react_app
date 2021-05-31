import React, { Component } from 'react';
import logo from './logo.svg';
import './Home.css';

class Home extends Component {
  componentDidMount(){
  }

  goPages = (routerName)=>{
    this.props.history.push(routerName)
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className="wrapBtn">
              <div onClick={this.goPages.bind(this,'/login')} className="App-link">登录</div>
              <div onClick={this.goPages.bind(this,'/form')} className="App-link">表单页面</div>
              <div onClick={this.goPages.bind(this,'/redux_test')} className="App-link">测试redux</div>
              <div onClick={this.goPages.bind(this,'/carousel')} className="App-link">轮播图</div>
              <div onClick={this.goPages.bind(this,'/antdtest')} className="App-link">antd组件</div>
              <div onClick={this.goPages.bind(this,'/hook')} className="App-link">Hook新特性</div>
              <div onClick={this.goPages.bind(this,'/tests')} className="App-link">测试页面</div>
              <div onClick={this.goPages.bind(this,'/reactdemo')} className="App-link">官网例子</div>
              <div onClick={this.goPages.bind(this,'/readfile')} className="App-link">读取文件</div>
              <div onClick={this.goPages.bind(this,'/websocket')} className="App-link">websocket</div>
              <div onClick={this.goPages.bind(this,'/mqtt')} className="App-link">MQTT</div>
          </div>
        </header>
      </div>
    );
  }
}

export default Home;
