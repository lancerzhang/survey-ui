import React, { useState, useEffect } from 'react';
import { List, Avatar, Pagination, Button, Space, message, Modal } from 'antd';
import { UserOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';

const { confirm } = Modal;

const PublisherSurveyList = () => {
  const [surveys, setSurveys] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const serverDomain = process.env.REACT_APP_SERVER_DOMAIN;

  const fetchSurveys = async (pageNumber = 0, pageSize = 10) => {
    const response = await fetch(`${serverDomain}/api/surveys/user/1?page=${pageNumber}&size=${pageSize}`);
    const data = await response.json();
    setSurveys(data.content);
    setPagination({ ...pagination, total: data.totalElements });
  };

  useEffect(() => {
    fetchSurveys(pagination.current - 1, pagination.pageSize);
  }, [pagination.current, pagination.pageSize]);

  const handlePaginationChange = (page, pageSize) => {
    setPagination({ ...pagination, current: page, pageSize: pageSize || 10 });
  };

  const history = useHistory();

  const handleItemClick = (surveyId) => {
    history.push(`/publisher/survey-editor/${surveyId}`);
  };

  const handleEditClick = (e, surveyId) => {
    e.stopPropagation();
    history.push(`/publisher/survey-editor/${surveyId}`);
  };

  const handleShareClick = (e, surveyId) => {
    e.stopPropagation();
    const shareUrl = `/participant/survey-reply/${surveyId}`;
    navigator.clipboard.writeText(shareUrl);
    message.success('Survey URL (TBC) was copied to clipboard, please send to others');
  };

  const handleCloneClick = (e) => {
    e.stopPropagation();
    confirm({
      title: 'Do you want to clone this survey?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        message.success('Survey was cloned (not implemented)');
      },
    });
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    confirm({
      title: 'Do you want to delete this survey?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        message.success('Survey was deleted (not implemented)');
      },
    });
  };


  return (
    <div>
      <h1>Surveys</h1>
      <List
        itemLayout="vertical"
        dataSource={surveys}
        renderItem={(survey) => (
          <List.Item
            key={survey.id}
            onClick={() => handleItemClick(survey.id)}
          >
            <List.Item.Meta
              avatar={<Avatar icon={<UserOutlined />} />}
              title={survey.userId}
              description={survey.title}
            />
            {survey.description}
            <Space style={{ marginTop: 8 }}>
              <Button onClick={(e) => handleEditClick(e, survey.id)}>Edit</Button>
              <Button onClick={(e) => handleShareClick(e, survey.id)}>Share</Button>
              <Button onClick={(e) => handleCloneClick(e)}>Clone</Button>
              <Button onClick={(e) => handleDeleteClick(e)}>Delete</Button>
            </Space>
          </List.Item>
        )}
      />
      <Pagination
        current={pagination.current}
        pageSize={pagination.pageSize}
        total={pagination.total}
        onChange={handlePaginationChange}
      />
    </div>
  );
};

export default PublisherSurveyList;