import React, { Component } from 'react';
import { connect } from 'react-redux';
  
@connect(({ user }) => ({ ...user }))
class DvaScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        console.log('sssssssssssss');
        return (
            <div style={{fontSize: '40px', color: 'red'}}>
                {this.props.test}
            </div>
        );
    }
}

export default DvaScreen