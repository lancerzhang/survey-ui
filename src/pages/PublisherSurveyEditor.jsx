import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Form, Input, Switch, Button, Divider, notification, DatePicker, InputNumber, Space } from 'antd';
import QuestionEditor from './QuestionEditor';
import moment from 'moment-timezone';

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
      setQuestions(data.questions);
    };
    if (id === 'new') {
      // Initialize a new survey
      setSurvey({});
    } else {
      fetchSurvey();
    }
  }, [id]);

  const onFinish = async (values, saveAsTemplate = false) => {
    values.questions = questions;

    // Add userId: 1 for new surveys
    if (id === 'new') {
      values.userId = 1;
    }

    if (saveAsTemplate) {
      values.isTemplate = true;
    }

    // Filter out null values for startTime and endTime
    const filteredValues = Object.fromEntries(
      Object.entries(values).filter(([key, value]) => !(value === null && (key === 'startTime' || key === 'endTime')))
    );

    console.log('Form values:', filteredValues);

    const requestOptions = {
      method: id === 'new' ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filteredValues),
    };

    const successMessage = `Survey ${saveAsTemplate ? 'template' : ''} saved successfully!`;
    const errorMessage = `Error saving survey ${saveAsTemplate ? 'template' : ''}.`;

    try {
      const response = await fetch(
        id === 'new'
          ? `${serverDomain}/api/surveys/`
          : `${serverDomain}/api/surveys/${id}`,
        requestOptions
      );

      if (response.ok) {
        notification.success({ message: successMessage });
      } else {
        notification.error({ message: errorMessage });
      }
    } catch (error) {
      notification.error({ message: errorMessage });
    }
  };

  const validateEndTime = (_, value) => {
    const startTime = form.getFieldValue('startTime');

    if (value && startTime && !value.isAfter(startTime)) {
      return Promise.reject(new Error('End time should be greater than start time'));
    }
    return Promise.resolve();
  };


  const [form] = Form.useForm();

  const history = useHistory();

  const handleClose = () => {
    history.goBack();
  };

  const onSaveAsTemplate = async () => {
    const values = await form.validateFields();
    onFinish(values, true);
  };


  return (
    <div>
      {survey && (
        <Form
          initialValues={{
            ...survey,
            startTime: survey.startTime ? moment(survey.startTime) : null,
            endTime: survey.endTime ? moment(survey.endTime) : null,
          }}
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
          <Form.Item label="Start Time" name="startTime">
            <DatePicker
              showTime
              onChange={(value) => {
                const utcValue = value ? moment.tz(value, 'UTC') : null;
                form.setFieldsValue({ startTime: utcValue });
              }}
            />
          </Form.Item>
          <Form.Item label="End Time" name="endTime" rules={[{ validator: validateEndTime }]}>
            <DatePicker
              showTime
              onChange={(value) => {
                const utcValue = value ? moment.tz(value, 'UTC') : null;
                form.setFieldsValue({ endTime: utcValue });
              }}
            />
          </Form.Item>
          <Form.Item label="Max Replies" name="maxReplies">
            <InputNumber min={1} />
          </Form.Item>
          <Divider />
          <QuestionEditor form={form} questions={questions} onQuestionsChange={handleQuestionsChange} />
          <Divider />
          <Form.Item wrapperCol={{ offset: 4 }}>
            <Space>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
              <Button onClick={onSaveAsTemplate}>Save As Public Template</Button>
              <Button onClick={handleClose}>Close</Button>
            </Space>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default PublisherSurveyEditor;

