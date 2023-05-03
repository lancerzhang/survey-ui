import React, { useState, useEffect } from 'react';
import { List, Avatar, Pagination, Button, Space, message, Modal } from 'antd';
import { UserOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import moment from 'moment-timezone';

const { confirm } = Modal;

const ParticipantReplies = () => {
  const serverDomain = process.env.REACT_APP_SERVER_DOMAIN;
  const [replies, setReplies] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  const fetchReplies = async (pageNumber = 0, pageSize = 10) => {
    const response = await fetch(`${serverDomain}/api/replies/user/1?page=${pageNumber}&size=${pageSize}`);
    const data = await response.json();
    setReplies(data.content);
    setPagination({ ...pagination, total: data.totalElements });
  };

  useEffect(() => {
    fetchReplies(pagination.current - 1, pagination.pageSize);
  }, [pagination.current, pagination.pageSize]);

  const handlePaginationChange = (page, pageSize) => {
    setPagination({ ...pagination, current: page, pageSize: pageSize || 10 });
  };

  const history = useHistory();

  const handleItemClick = (replyId) => {
    history.push(`/publisher/reply-editor/${replyId}`);
  };


  return (
    <div>
      <h1>Replies</h1>
      <List
        itemLayout="vertical"
        dataSource={replies}
        renderItem={(reply) => (
          <List.Item
            key={reply.id}
            onClick={() => handleItemClick(reply.id)}
          >
            <List.Item.Meta
              title={reply.title}
              description={moment(reply.createdAt).local().format('YYYY-MM-DD HH:mm:ss')}
            />
            {reply.description}
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

export default ParticipantReplies;