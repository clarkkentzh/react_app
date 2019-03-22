import React, { Component } from 'react';
import {connect} from 'react-redux';
import './TestRedux.css';

class TestRedux extends Component {

    addData = (types)=>{
        this.props.dispatch({type: types})
    }

    render() {
        let text = this.props.toDolist.isShow ? '隐藏数据' : '显示数据';
        return (
        <div className="redux">
            {this.props.toDolist.isShow ?
            <div  style={{
                height: '100px',
                display: 'flex',
                alignItems:'center',
                justifyContent:'space-between',
                width: '300px',
            }}>
                <h1>{'展示redux数据:'}</h1>
                <h1>{this.props.toDolist.numbers}</h1>
            </div>
            : 
            <div style={{
                height: '100px'
            }}></div>
            }
            
            <div className='refresh' onClick={this.addData.bind(this, 'ADD_DATA')}>刷新数据</div>
            <div className='reset' onClick={this.addData.bind(this, 'RESET_DATA')}>重置数据</div>
            <div className='reset' onClick={this.addData.bind(this, 'SHOW_DATA')}>{text}</div>
        </div>
        );
    }
}

function select(store){
    return ({
        toDolist: store.toDolist
    })
}

export default connect(select)(TestRedux);
