import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import PublisherList from '../components/SurveyList';
import useFetchUsers from '../useFetchUsers';

const serverDomain = process.env.REACT_APP_SERVER_DOMAIN;

const ParticipantReplies = () => {
  const user = useFetchUsers().user;
  const [refresh, setRefresh] = useState(false);

  const history = useHistory();

  const handleItemClick = (replyId) => {
    history.push(`/participant/reply-editor/${replyId}`);
  };

  const fetchDataUrl = `${serverDomain}/surveys/replied/user/${user.id}?`;

  return (
    <div>
      <PublisherList
        fetchDataUrl={fetchDataUrl}
        onItemClick={handleItemClick}
        refresh={refresh}
      />
    </div>
  );
};

export default ParticipantReplies;
