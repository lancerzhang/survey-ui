import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, message, Modal } from 'antd';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import PublisherList from '../components/SurveyList';

const { confirm } = Modal;

const PublisherSurveys = () => {
  const serverDomain = process.env.REACT_APP_SERVER_DOMAIN;
  const uiDomain = process.env.REACT_APP_UI_DOMAIN;
  const userId = 1;
  const fetchDataUrl = `${serverDomain}/api/surveys/user/${userId}?`;
  const history = useHistory();
  const [refresh, setRefresh] = useState(false);

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  const handleEditClick = (e, surveyId) => {
    e.stopPropagation();
    history.push(`/publisher/survey-editor/${surveyId}`);
  };

  const handleShareClick = (e, surveyId) => {
    e.stopPropagation();
    const shareUrl = `${uiDomain}/participant/reply-editor/${surveyId}`;
    navigator.clipboard.writeText(shareUrl);
    message.success('Survey URL was copied to clipboard, please send to others.');
  };

  const handleCloneClick = async (e, surveyId) => {
    e.stopPropagation();
    const response = await fetch(`${serverDomain}/api/surveys/${surveyId}`);
    const surveyToClone = await response.json();
    const clonedSurvey = JSON.parse(JSON.stringify(surveyToClone));

    // Remove 'id' attribute from clonedSurvey, its questions, and options
    delete clonedSurvey.id;
    clonedSurvey.questions.forEach((question) => {
      delete question.id;
      question.options.forEach((option) => delete option.id);
    });

    // Add '(clone)' to clonedSurvey title
    clonedSurvey.title = `${clonedSurvey.title} (clone)`;

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
            handleRefresh();
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
            handleRefresh();
          } else {
            message.error('Error deleting survey.');
          }
        } catch (error) {
          message.error('Error deleting survey.');
        }
      },
    });
  };

  const renderItemActions = (survey) => [
    <Button onClick={(e) => handleEditClick(e, survey.id)}>Edit</Button>,
    <Button onClick={(e) => handleShareClick(e, survey.id)}>Share</Button>,
    <Button onClick={(e) => handleCloneClick(e, survey.id, handleRefresh)}>Clone</Button>,
    <Button onClick={(e) => handleDeleteClick(e, survey.id, handleRefresh)}>Delete</Button>,
  ];

  const onItemClick = (itemId) => {
    history.push(`/publisher/survey-editor/${itemId}`);
  };

  return (
    <PublisherList
      fetchDataUrl={fetchDataUrl}
      onItemClick={onItemClick}
      renderItemActions={renderItemActions}
      refresh={refresh}
    />
  );
};

export default PublisherSurveys;