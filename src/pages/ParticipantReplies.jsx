import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import PublisherList from './PublisherList'; // Import the PublisherList component

const ParticipantReplies = () => {
  const serverDomain = process.env.REACT_APP_SERVER_DOMAIN;
  const [refresh, setRefresh] = useState(false);

  const history = useHistory();

  const handleItemClick = (replyId) => {
    history.push(`/participant/reply-editor/${replyId}`);
  };

  const userId = 1;
  const fetchDataUrl = `${serverDomain}/api/surveys/replied/user/${userId}?`;

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
