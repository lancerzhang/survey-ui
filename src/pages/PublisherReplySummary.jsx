import { Button, Divider, List, Table, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const { Title } = Typography;
const serverDomain = process.env.REACT_APP_SERVER_DOMAIN;

const PublisherReplySummary = () => {
  const { id } = useParams();
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      const response = await fetch(`${serverDomain}/api/survey-replies/surveys/${id}/summary`);
      const data = await response.json();
      setSummary(data);
    };

    fetchSummary();
  }, [id, serverDomain]);

  if (!summary) {
    return <div>Loading...</div>;
  }

  if (summary.totalReplies === 0) {
    return (
      <div>
        <Title level={3}>{summary.surveyTitle}</Title>
        <Divider />
        <p>No replies received.</p>
      </div>
    );
  }

  const columns = [
    {
      title: 'Option',
      dataIndex: 'optionText',
      key: 'optionText',
    },
    {
      title: 'Count',
      dataIndex: 'count',
      key: 'count',
    },
    {
      title: 'Percentage',
      dataIndex: 'percentage',
      key: 'percentage',
    },
  ];

  const handleDownloadCsv = () => {
    window.location.href = `${serverDomain}/api/survey-replies/surveys/${id}/csv`;
  };

  return (
    <div>
      <Title level={3}>{summary.surveyTitle}</Title>
      <Button onClick={handleDownloadCsv} style={{ marginBottom: '1rem' }}>
        Download CSV
      </Button>
      <Divider />
      <p>Total Replies: {summary.totalReplies}</p>
      <List
        itemLayout="vertical"
        dataSource={summary.questionSummaries}
        renderItem={(questionSummary) => (
          <List.Item key={questionSummary.questionId}>
            <List.Item.Meta title={questionSummary.questionText} />
            {questionSummary.questionType === 'TEXT' ? (
              <p>Text responses not shown in summary.</p>
            ) : (
              <Table
                dataSource={Object.entries(questionSummary.optionCounts).map(([optionText, count]) => ({
                  key: optionText,
                  optionText,
                  count,
                  percentage: `${questionSummary.optionPercentages[optionText]}%`,
                }))}
                columns={columns}
                pagination={false}
              />
            )}
          </List.Item>
        )}
      />
    </div>
  );
};

export default PublisherReplySummary;
