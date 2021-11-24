import { Menu, Button } from 'antd';
import { PieChartOutlined, DesktopOutlined, InboxOutlined, MailOutlined, AppstoreOutlined, MenuUnfoldOutlined,MenuFoldOutlined} from '@ant-design/icons';
import React from 'react';

const SubMenu = Menu.SubMenu;

export default class App extends React.Component {
  state = {
    collapsed: false,
  }

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  onSelects = (e)=>{
    console.log('点击后的回调',e);
  }

  render() {
    return (
      <div style={{ width: 200, height: 500,backgroundColor:'#001529' }}>
        
          <Menu
            onSelect={this.onSelects}
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub2']}
            mode="inline"
            theme="dark"
            inlineCollapsed={this.state.collapsed}
          >
            <Menu.Item key="1">
              <PieChartOutlined/>
              <span>Option 1</span>
            </Menu.Item>
            <Menu.Item key="2">
              <DesktopOutlined/>
              <span>Option 2</span>
            </Menu.Item>
            <Menu.Item key="3">
              <InboxOutlined/>
              <span>Option 3</span>
            </Menu.Item>
            <SubMenu key="sub1" title={<span><MailOutlined/><span>Navigation One</span></span>}>
              <Menu.Item key="5">Option 5</Menu.Item>
              <Menu.Item key="6">Option 6</Menu.Item>
              <Menu.Item key="7">Option 7</Menu.Item>
              <Menu.Item key="8">Option 8</Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" title={<span><AppstoreOutlined/><span>Navigation Two</span></span>}>
              <Menu.Item key="9">Option 9</Menu.Item>
              <Menu.Item key="10">Option 10</Menu.Item>
              <SubMenu key="sub3" title="Submenu">
                <Menu.Item key="11">Option 11</Menu.Item>
                <Menu.Item key="12">Option 12</Menu.Item>
              </SubMenu>
            </SubMenu>
          </Menu>

        <Button type="primary" onClick={this.toggleCollapsed} style={{margin: 0}}>
          {this.state.collapsed ?
          <MenuUnfoldOutlined/>:<MenuFoldOutlined/>
          }
        </Button>
      </div>
    );
  }
}