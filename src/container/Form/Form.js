import React, { Component } from 'react';
import './Form.css';

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {value: '鸣人'};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('你最喜欢的动漫人物是: ' + this.state.value);
    event.preventDefault();
  }
  render() {
    return (
      <form className="form" onSubmit={this.handleSubmit}>
        <label>
          点击选择:
          <br></br>
          <select className='select' value={this.state.value} onChange={this.handleChange}>
            <option value="雏田">雏田</option>
            <option value="佐助">佐助</option>
            <option value="鸣人">鸣人</option>
            <option value="小樱">小樱</option>
          </select>
        </label>
        <br></br>
        <input className='input' type="submit" value="Submit" />
      </form>
    );
  }
}

export default Form;
