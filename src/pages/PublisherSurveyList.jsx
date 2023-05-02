import React, { useState, useEffect } from 'react';
import { List, Avatar, Pagination, Button, Space, message, Modal } from 'antd';
import { UserOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';

const { confirm } = Modal;

const PublisherSurveyList = () => {
  const serverDomain = process.env.REACT_APP_SERVER_DOMAIN;
  const uiDomain = process.env.REACT_APP_UI_DOMAIN;
  const [surveys, setSurveys] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

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
    const shareUrl = `${uiDomain}/participant/reply/${surveyId}`;
    navigator.clipboard.writeText(shareUrl);
    message.success('Survey URL was copied to clipboard, please send to others.');
  };

  const handleCloneClick = async (e, surveyId) => {
    e.stopPropagation();
    const surveyToClone = surveys.find((survey) => survey.id === surveyId);
    const clonedSurvey = JSON.parse(JSON.stringify(surveyToClone));

    // Remove 'id' attribute from clonedSurvey, its questions, and options
    delete clonedSurvey.id;
    clonedSurvey.questions.forEach((question) => {
      delete question.id;
      question.options.forEach((option) => delete option.id);
    });

    confirm({
      title: 'Do you want to clone this survey?',
      icon: <ExclamationCircleOutlined />,
      async onOk() {
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(clonedSurvey),
        };

        try {
          const response = await fetch(`${serverDomain}/api/surveys`, requestOptions);

          if (response.ok) {
            message.success('Survey was cloned');
            fetchSurveys(pagination.current - 1, pagination.pageSize);
          } else {
            message.error('Error cloning survey.');
          }
        } catch (error) {
          message.error('Error cloning survey.');
        }
      },
    });
  };

  const handleDeleteClick = async (e, surveyId) => {
    e.stopPropagation();

    confirm({
      title: 'Do you want to delete this survey?',
      icon: <ExclamationCircleOutlined />,
      async onOk() {
        const requestOptions = {
          method: 'DELETE',
        };

        try {
          const response = await fetch(`${serverDomain}/api/surveys/${surveyId}`, requestOptions);

          if (response.ok) {
            message.success('Survey was deleted');
            fetchSurveys(pagination.current - 1, pagination.pageSize);
          } else {
            message.error('Error deleting survey.');
          }
        } catch (error) {
          message.error('Error deleting survey.');
        }
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
            actions={[
              <Button onClick={(e) => handleEditClick(e, survey.id)}>Edit</Button>,
              <Button onClick={(e) => handleShareClick(e, survey.id)}>Share</Button>,
              <Button onClick={(e) => handleCloneClick(e, survey.id)}>Clone</Button>,
              <Button onClick={(e) => handleDeleteClick(e, survey.id)}>Delete</Button>]}
          >
            <List.Item.Meta
              title={survey.title}
              description={survey.description}
            />
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