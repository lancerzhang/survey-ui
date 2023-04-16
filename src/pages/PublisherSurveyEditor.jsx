import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Input, Switch, Button, Divider } from 'antd';
import QuestionEditor from './QuestionEditor';

const PublisherSurveyEditor = () => {
  const { id } = useParams();
  const [survey, setSurvey] = useState(null);
  const [questions, setQuestions] = useState([]);
  const serverDomain = process.env.REACT_APP_SERVER_DOMAIN;

  const handleQuestionsChange = (updatedQuestions) => {
    setQuestions(updatedQuestions);
  };

  useEffect(() => {
    const fetchSurvey = async () => {
      const response = await fetch(`${serverDomain}/api/surveys/${id}`);
      const data = await response.json();
      setSurvey(data);
    };
    if (id === 'new') {
      // Initialize a new survey
      setSurvey({});
    } else {
      fetchSurvey();
    }
  }, [id]);

  const onFinish = (values) => {
    values.questions=questions;
    console.log('Form values:', values);
  };

  return (
    <div>
      {survey && (
        <Form
          initialValues={survey}
          onFinish={onFinish}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
        >
          <Form.Item label="Title" name="title">
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="Allow anonymous reply" name="allowAnonymousReply" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item label="Allow resubmit" name="allowResubmit" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Divider />
          <QuestionEditor questions={questions} onQuestionsChange={handleQuestionsChange} />
          <Divider />
          {/* Add other form items for the remaining fields */}
          <Form.Item wrapperCol={{ offset: 4 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default PublisherSurveyEditor;
