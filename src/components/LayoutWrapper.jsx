import { MenuOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Dropdown, Layout, Menu, Row, Space } from 'antd';
import React, { useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import useMediaQuery from '../hooks/useMediaQuery';
import Footer from './Footer';
import styles from './LayoutWrapper.module.css';

const { Header, Content } = Layout;

const LayoutWrapper = ({ children }) => {
  const isMobile = useMediaQuery('(max-width: 767px)');

  const history = useHistory();
  const handleClick = (path) => {
    history.push(path);
  };

  // Get the current location
  const location = useLocation();

  // Determine the selected key based on the current pathname
  const selectedKey = useMemo(() => {
    const path = location.pathname;
    if (path.startsWith('/publisher/surveys')) return '1';
    if (path.startsWith('/publisher/survey-editor')) return '2';
    if (path.startsWith('/publisher/templates')) return '3';
    if (path.startsWith('/publisher/delegates')) return '4';
    if (path.startsWith('/participant/replies')) return '5';
    if (path.startsWith('/participant/reply-editor')) return '5';
    return '1';
  }, [location.pathname]);

  const userMenu = (
    <Menu>
      <Menu.Item key="1" onClick={() => handleClick('/me')}>My Profile</Menu.Item>
      <Menu.Item key="2" onClick={() => handleClick('/settings')}>Settings</Menu.Item>
    </Menu>
  );

  const navMenu = (
    <div style={{ minWidth: '600px' }}>
      <Menu theme="dark" mode="horizontal" selectedKeys={[selectedKey]}>
        {/* Publisher links */}
        <Menu.Item key="1" onClick={() => handleClick('/publisher/surveys')}>Surveys</Menu.Item>
        <Menu.Item key="2" onClick={() => handleClick('/publisher/survey-editor/new')}>Create Survey</Menu.Item>
        <Menu.Item key="3" onClick={() => handleClick('/publisher/templates')}>Public Templates</Menu.Item>
        <Menu.Item key="4" onClick={() => handleClick('/publisher/delegates')}>Delegates</Menu.Item>
        {/* Participant links */}
        <Menu.Item key="5" onClick={() => handleClick('/participant/replies')}>My Replies</Menu.Item>
      </Menu>
    </div>
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
      <Footer />
    </Layout>
  );
};

export default LayoutWrapper;
