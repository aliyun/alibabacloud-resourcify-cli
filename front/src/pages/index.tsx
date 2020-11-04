import { Layout } from 'antd';
import React from 'react';
import Content from '../component/content';
import SubList from '../component/sublist';
import './index.scss';

export interface AppContentProps {}

const AppContent: React.FC<AppContentProps> = () => {
  return (
    <Layout className='mainPage'>
      <Layout.Sider width='230'>
        <SubList />
      </Layout.Sider>
      <Layout className='site-layout' style={{ marginLeft: 230 }}>
        <Content />
      </Layout>
    </Layout>
  );
};

export default AppContent;
