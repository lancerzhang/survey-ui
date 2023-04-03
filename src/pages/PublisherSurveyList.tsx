import React, { useState, useEffect } from 'react';
import { List, Avatar, Pagination } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';

const PublisherSurveyList: React.FC = () => {
  const [surveys, setSurveys] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  const fetchSurveys = async (pageNumber = 0, pageSize = 10) => {
    const response = await fetch(`http://localhost:8080/api/surveys/user/1?page=${pageNumber}&size=${pageSize}`);
    const data = await response.json();
    setSurveys(data.content);
    setPagination({ ...pagination, total: data.totalElements });
  };

  useEffect(() => {
    fetchSurveys(pagination.current - 1, pagination.pageSize);
  }, [pagination.current, pagination.pageSize]);

  const handlePaginationChange = (page: number, pageSize?: number) => {
    setPagination({ ...pagination, current: page, pageSize: pageSize || 10 });
  };

  const history = useHistory();

  const handleItemClick = (surveyId: number) => {
    history.push(`/publisher/survey-editor/${surveyId}`);
  };

  return (
    <div>
      <h1>Surveys</h1>
      <List
        itemLayout="vertical"
        dataSource={surveys}
        renderItem={(survey: any) => (
          <List.Item
          key={survey.id}
          onClick={() => handleItemClick(survey.id)}
          >
            <List.Item.Meta
              avatar={<Avatar icon={<UserOutlined />} />}
              title={survey.user.username}
              description={survey.title}
            />
            {survey.description}
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
