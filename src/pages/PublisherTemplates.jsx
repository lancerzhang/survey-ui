import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Modal, message } from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PublisherList from '../components/SurveyList';

const { confirm } = Modal;
const serverDomain = process.env.REACT_APP_SERVER_DOMAIN;

const PublisherTemplates = () => {
  const fetchDataUrl = `${serverDomain}/surveys?isTemplate=true`;
  const [refresh, setRefresh] = useState(false);

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  const navigate = useNavigate();

  const handleEditClick = (e, surveyId) => {
    e.stopPropagation();
    navigate(`/publisher/survey-editor/${surveyId}`);
  };

  const handleUseClick = (e, surveyId) => {
    e.stopPropagation();
    navigate(`/publisher/survey-editor/new?templateId=${surveyId}`);
  };

  const handleDeleteClick = async (e, surveyId) => {
    e.stopPropagation();

    confirm({
      title: 'Do you want to delete this template?',
      icon: <ExclamationCircleOutlined />,
      async onOk() {
        const requestOptions = {
          method: 'DELETE',
        };

        try {
          const response = await fetch(`${serverDomain}/surveys/${surveyId}`, requestOptions);

          if (response.ok) {
            message.success('Template was deleted');
            handleRefresh();
          } else {
            message.error('Error deleting template.');
          }
        } catch (error) {
          message.error('Error deleting template.');
        }
      },
    });
  };

  const renderItemActions = (template) => [
    <Button onClick={(e) => handleEditClick(e, template.id)}>Edit</Button>,
    <Button onClick={(e) => handleDeleteClick(e, template.id)}>Delete</Button>,
    <Button onClick={(e) => handleUseClick(e, template.id)}>Use</Button>,
  ];

  const onItemClick = (itemId) => {
    navigate(`/publisher/survey-editor/${itemId}`);
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

export default PublisherTemplates;