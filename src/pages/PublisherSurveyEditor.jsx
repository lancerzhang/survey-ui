import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Input, Switch, Button, Divider, notification } from 'antd';
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

  const onFinish = async (values) => {
    values.questions = questions;

    // Add userId: 1 for new surveys
    if (id === 'new') {
      values.userId = 1;
    }

    console.log('Form values:', values);

    const requestOptions = {
      method: id === 'new' ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    };

    try {
      const response = await fetch(
        id === 'new'
          ? `${serverDomain}/api/surveys/`
          : `${serverDomain}/api/surveys/${id}`,
        requestOptions
      );

      if (response.ok) {
        notification.success({ message: 'Survey saved successfully!' });
      } else {
        notification.error({ message: 'Error saving survey.' });
      }
    } catch (error) {
      notification.error({ message: 'Error saving survey.' });
    }
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
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: 'Please input a title!' }]}
          >
            <Input placeholder="Enter survey title" />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please input a description!' }]}
          >
            <Input.TextArea placeholder="Enter survey description" />
          </Form.Item>
          <Form.Item
            label="Allow anonymous reply"
            name="allowAnonymousReply"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item label="Allow resubmit" name="allowResubmit" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Divider />
          <QuestionEditor questions={questions} onQuestionsChange={handleQuestionsChange} />
          <Divider />
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

