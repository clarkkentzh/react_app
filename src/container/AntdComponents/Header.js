import { Breadcrumb } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';

const breadcrumbNameMap = {
  '/': '首页',
  '/login': '登录',
  '/form': '表单',
  '/redux_test': '测试',
  '/carousel': '轮播图',
  '/antdtest': '组件',
};  
const header = ({propsData})=>{
  const { location } = propsData;
  const pathSnippets = location.pathname.split('/').filter(i => i);
  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    return (
      <Breadcrumb.Item key={url}>
        <Link to={url}>
          {breadcrumbNameMap[url]}
        </Link>
      </Breadcrumb.Item>
    );
  });
  const breadcrumbItems = [(
    <Breadcrumb.Item key="home">
      <Link to="/">首页</Link>
    </Breadcrumb.Item>
  )].concat(extraBreadcrumbItems);
  return (
    <Breadcrumb className='headerBread'>
      {breadcrumbItems}
    </Breadcrumb>
  )
}
export default header
  