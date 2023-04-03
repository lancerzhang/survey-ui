import React from 'react';
import { Layout, Menu } from 'antd';
import { useHistory } from 'react-router-dom';

const { Header, Content, Footer } = Layout;

interface LayoutWrapperProps {
  children: React.ReactNode;
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
  const history = useHistory();

  const handleClick = (path: string) => {
    history.push(path);
  };

  return (
    <Layout className="layout">
      <Header>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal">
          {/* Publisher links */}
          <Menu.Item key="1" onClick={() => handleClick('/publisher/surveys')}>Surveys</Menu.Item>
          <Menu.Item key="2" onClick={() => handleClick('/publisher/survey-editor')}>Create Survey</Menu.Item>
          {/* Participant links */}
          <Menu.Item key="3" onClick={() => handleClick('/participant/surveys')}>Take Survey</Menu.Item>
          <Menu.Item key="4" onClick={() => handleClick('/participant/history')}>Survey History</Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <div className="site-layout-content">{children}</div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Survey-UI ©2023 Created by YourName</Footer>
    </Layout>
  );
};

export default LayoutWrapper;
