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
          <img src={logo} className="App-logo" alt="logo" />
          <div className="wrapBtn">
              <div onClick={this.goPages.bind(this,'/login')} className="App-link">登录</div>
              <div onClick={this.goPages.bind(this,'/form')} className="App-link">表单页面</div>
              <div onClick={this.goPages.bind(this,'/redux_test')} className="App-link">测试redux</div>
              <div onClick={this.goPages.bind(this,'/carousel')} className="App-link">轮播图</div>
              <div onClick={this.goPages.bind(this,'/antdtest')} className="App-link">antd组件</div>
          </div>
          
        </header>
      </div>
    );
  }
}

export default Home;
