import React, { Component } from 'react';
import logo from './logo.svg';
import './Home.css';

class Home extends Component {
  componentDidMount(){
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="/login"
            target="_blank"
            rel="noopener noreferrer"
          >
            登录
          </a>
          <a
            className="App-link"
            href="/form"
            target="_blank"
            rel="noopener noreferrer"
          >
            表单页面
          </a>
        </header>
      </div>
    );
  }
}

export default Home;
