import React from "react";
import { Card, Button, Form, Input, Row, Col } from "antd";

class Connection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        host: '172.16.77.185',
        clientId: 'ssss',
        port: '8083',
    };
  }

  onRecordChange = (value) => {
    // const { record } = this.state;
    // const changedRecord = Object.assign(record, value);
    // this.setState({ record: changedRecord });
  };

  handleConnect = () => {
    const { host, clientId, port } = this.state;
    const url = `ws://${host}:${port}/mqtt`;
    const options = {
      keepalive: 30,
      protocolId: "MQTT",
      protocolVersion: 4,
      clean: true,
      reconnectPeriod: 1000,
      connectTimeout: 30 * 1000,
      will: {
        topic: "WillMsg",
        payload: "Connection Closed abnormally..!",
        qos: 0,
        retain: false,
      },
      rejectUnauthorized: false,
    };
    options.clientId = clientId;
    options.username = '';
    options.password = '';
    this.props.connect(url, options);
  };

  render() {
    const ConnectionForm = (
        <div>
        <Input 
          value={this.state.host}
          onChange={(e)=>{
              this.setState({
                  host: e.target.value
              })
          }}
        />
        <Input 
          value={this.state.port}
          onChange={(e)=>{
              this.setState({
                  port: e.target.value
              })
          }}/>
        <Input 
          value={this.state.clientId}
          onChange={(e)=>{
              this.setState({
                  clientId: e.target.value
              })
          }}/>

        </div>
    );

    return (
      <Card
        title="Connection"
        actions={[
          <Button type="primary" onClick={this.handleConnect}>
            {this.props.connectBtn}
          </Button>,
          <Button danger onClick={this.props.disconnect}>
            Disconnect
          </Button>,
        ]}
      >
        {ConnectionForm}
      </Card>
    );
  }
}

export default Connection;