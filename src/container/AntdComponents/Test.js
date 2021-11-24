import React from 'react';
import { ConfigProvider, DatePicker, message } from 'antd';
// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import zhCN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import "antd/dist/antd.css";
import Navigater from './Navigation'
import Checkbox from './Checkbox'

moment.locale('zh-cn');

export default class App extends React.Component {
  state = {
    date: null,
  };

  handleChange = (date) => {
    message.info(`您选择的日期是: ${date.format('YYYY-MM-DD')}`);
    this.setState({ date });
  }
  render() {
    const { date } = this.state;
    return (
      <div style={{display: 'flex', flexDirection: 'column'}}>
          <div style={{height:'100%', display: 'flex', flexDirection: 'row'}}>
              <Navigater/>
              <ConfigProvider locale={zhCN}>
                <div style={{ width: 400, margin: '100px auto' }}>
                  <DatePicker onChange={this.handleChange} />
                  <div style={{ marginTop: 20 }}>
                    当前日期：{date ? date.format('YYYY-MM-DD') : '未选择'}
                  </div>
                </div>
              </ConfigProvider>
          </div>
          <Checkbox/>
      </div>
      
    );
  }
}
