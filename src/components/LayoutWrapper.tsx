import React from 'react';
import { Layout, Menu, Dropdown, Avatar, Space, Row, Col, Button } from 'antd';
import { useHistory } from 'react-router-dom';
import { UserOutlined, MenuOutlined } from '@ant-design/icons';
import styles from './LayoutWrapper.module.css';
import useMediaQuery from '../hooks/useMediaQuery';

const { Header, Content, Footer } = Layout;

interface LayoutWrapperProps {
  children: React.ReactNode;
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
  const history = useHistory();
  const isMobile = useMediaQuery('(max-width: 767px)');

  const handleClick = (path: string) => {
    history.push(path);
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="1" onClick={() => handleClick('/my-profile')}>My Profile</Menu.Item>
      <Menu.Item key="2" onClick={() => handleClick('/settings')}>Settings</Menu.Item>
    </Menu>
  );

  const navMenu = (
    <Menu theme="dark" mode="horizontal">
      {/* Publisher links */}
      <Menu.Item key="1" onClick={() => handleClick('/publisher/surveys')}>Surveys</Menu.Item>
      <Menu.Item key="2" onClick={() => handleClick('/publisher/survey-editor/new')}>Create Survey</Menu.Item>
      <Menu.Item key="3" onClick={() => handleClick('/publisher/templates')}>Templates</Menu.Item>
      {/* Participant links */}
      <Menu.Item key="4" onClick={() => handleClick('/participant/survey-replies')}>Survey Replies</Menu.Item>
    </Menu>
  );

  return (
    <Layout className={styles.layout}>
      <Header>
        <Row justify="space-between" align="middle">
          <Col>
            {isMobile ? (
              <Dropdown overlay={navMenu} trigger={['click']}>
                <Button type="primary" icon={<MenuOutlined />} />
              </Dropdown>
            ) : (
              navMenu
            )}
          </Col>
          <Col>
            <Dropdown overlay={userMenu} trigger={['click']}>
              <Space>
                <Avatar icon={<UserOutlined />} />
              </Space>
            </Dropdown>
          </Col>
        </Row>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <div className={styles['site-layout-content']}>{children}</div>
        </Content>
      <Footer style={{ textAlign: 'center' }}>Survey-UI ©2023 Created by YourName</Footer>
    </Layout>
  );
};

export default LayoutWrapper;
