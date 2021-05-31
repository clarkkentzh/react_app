import React, { Component } from 'react';
import { Input,Button, message } from 'antd';
import './index.css';
import WebSocket from '../../utils/WebSocket'

class SocketComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: '',
            messageList: [],
        };
    }

    componentDidMount(){
        this.socket = new WebSocket({
            socketUrl: 'ws://192.168.51.127:32305/websocket/admin',
            timeout: 5000,
            socketMessage: (receive) => {
                console.log('get message',receive);  //后端返回的数据，渲染页面
                let lists = [...this.state.messageList];
                lists.unshift(receive)
                this.setState({
                    messageList: lists
                })
            },
            socketClose: (msg) => {
                console.log(msg);
            },
            socketError: () => {
                console.log(this.state.taskStage + '连接建立失败');
            },
            socketOpen: () => {
                console.log('连接建立成功');
                // 心跳机制 定时向后端发数据
                // this.taskRemindInterval = setInterval(() => {
                //     this.socket.sendMessage({ "msgType": 0 })
                // }, 30000)
            }
        })
        try {
            this.socket.connection();
        } catch (e) {
            // 捕获异常，防止js error
            // donothing
        }
    }

    submitMessage(){
        if(!this.state.inputValue){
            message.warning('请输入内容')
            return;
        }
        this.socket.sendMessage(this.state.inputValue)
    }

    render() {
        const {inputValue, messageList} = this.state;
        return (
            <div className="socket_container">
                <div className="row_center">
                    <Input
                        value={inputValue}
                        onChange={(e)=>{
                            this.setState({
                                inputValue: e.target.value
                            })
                        }}
                        style={{width: '150px',marginRight: '20px'}}
                    />
                    <Button
                        type="primary"
                        onClick={()=>{
                            this.submitMessage()
                        }}
                    >提交</Button>
                </div>
                <div style={{marginTop: '20px'}}>接收的消息</div>
                <div style={{display:'flex', flexDirection:'column',}}>
                    <div style={{fontSize: '12px', color: 'red'}}></div>
                </div>
            </div>
        );
    }
}

export default SocketComponent;
