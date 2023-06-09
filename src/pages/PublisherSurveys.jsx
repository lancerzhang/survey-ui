import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Input, Modal, message } from 'antd';
import copy from 'copy-to-clipboard';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PublisherList from '../components/SurveyList';
import useFetchUsers from '../useFetchUsers';
import { removeIdsFromSurvey } from '../utils/surveyUtils';

const { confirm } = Modal;
const serverDomain = process.env.REACT_APP_SERVER_DOMAIN;
const uiDomain = process.env.REACT_APP_UI_DOMAIN;

const PublisherSurveys = () => {
  const user = useFetchUsers().user;

  const fetchDataUrl = `${serverDomain}/surveys/user/${user.id}?`;
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(false);
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const [surveyUrl, setSurveyUrl] = useState("");

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  const handleEditClick = (e, surveyId) => {
    e.stopPropagation();
    navigate(`/publisher/survey-editor/${surveyId}`);
  };

  const handleResultClick = (e, surveyId) => {
    e.stopPropagation();
    navigate(`/publisher/survey/${surveyId}/summary`);
  };

  const handlePrizeClick = (e, surveyId) => {
    e.stopPropagation();
    navigate(`/publisher/survey/${surveyId}/prizes`);
  };

  const handleShareClick = (e, surveyId) => {
    e.stopPropagation();
    const shareUrl = `${uiDomain}#/participant/reply-editor/${surveyId}`;
    setSurveyUrl(shareUrl);
    setIsShareModalVisible(true);
  };

  const handleCopyClick = () => {
    copy(surveyUrl);
    message.success('Survey URL was copied to clipboard, please send to others.');
  };

  const handleCloneClick = async (e, surveyId) => {
    e.stopPropagation();
    const response = await fetch(`${serverDomain}/surveys/${surveyId}`);
    const surveyToClone = await response.json();
    let clonedSurvey = JSON.parse(JSON.stringify(surveyToClone));
    clonedSurvey = removeIdsFromSurvey(clonedSurvey);
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
          const response = await fetch(`${serverDomain}/surveys`, requestOptions);

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
          const response = await fetch(`${serverDomain}/surveys/${surveyId}`, requestOptions);

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
    <Button onClick={(e) => handleResultClick(e, survey.id)}>Result</Button>,
    <Button onClick={(e) => handlePrizeClick(e, survey.id)}>Prize</Button>,
    <Button onClick={(e) => handleCloneClick(e, survey.id, handleRefresh)}>Clone</Button>,
    <Button onClick={(e) => handleDeleteClick(e, survey.id, handleRefresh)}>Delete</Button>,
  ];

  const onItemClick = (itemId) => {
    navigate(`/publisher/survey-editor/${itemId}`);
  };

  return (
    <>
      <PublisherList
        fetchDataUrl={fetchDataUrl}
        onItemClick={onItemClick}
        renderItemActions={renderItemActions}
        refresh={refresh}
      />
      <Modal
        title="Share Survey"
        visible={isShareModalVisible}
        onCancel={() => setIsShareModalVisible(false)}
        footer={null}
      >
        <Input
          value={surveyUrl}
          addonAfter={
            <Button onClick={handleCopyClick}>
              Copy
            </Button>
          }
        />
      </Modal>
    </>
  );
};

export default PublisherSurveys;