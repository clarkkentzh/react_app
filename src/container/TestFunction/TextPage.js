import wordList from './util/arrayWords'
import React, { Component } from 'react';
import './Form.css';
import {getMenWords,getAccount,getPrivateKey,getAccountId }from './util/getrandom'
const bip39 = require('bip39');

class TestPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
        value: '',
        publicKey: '',
        privateKey: '',
        accountId: '',
        inputText: ''
    };

    this.createWords = this.createWords.bind(this);
    this.getInfos = this.getInfos.bind(this);
  }

  createWords() {
    let text = getMenWords();
    this.setState({
        value: text
    })
  }

  getInfos() {
    if(!this.state.inputText){
        alert('请输入助记词')
        return;
    }
    let publics = getAccount(this.state.inputText);
    let privates = getPrivateKey(this.state.inputText)
    let accounts = getAccountId(this.state.inputText)

    this.setState({
        publicKey: publics,
        privateKey: privates,
        accountId: accounts
    })
  }

  onChangeText(e){
    this.setState({
        inputText: e.target.value
    })
  }

  render() {
    return (
        <div className='wraps'>
            <div className="testDiv">
                <p>{'助记词：' + this.state.value}</p>
                <br></br>
                <input style={{width: '800px'}} onChange={(e)=>{
                    this.onChangeText(e)
                }}></input>
                <p style={{marginTop:'20px'}}>{'公钥：' + this.state.publicKey}</p>
                <br></br>
                <p>{'私钥：' + this.state.privateKey}</p>
                <br></br>
                <p>{'accountID：' + this.state.accountId}</p>
            </div>
            <div className='select' onClick={this.createWords}>生成助记词</div>
            <div className='select' onClick={this.getInfos}>创建账户</div>
        </div>
    );
  }
}

export default TestPage;
