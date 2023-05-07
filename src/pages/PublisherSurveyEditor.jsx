import { Button, DatePicker, Divider, Form, Input, InputNumber, Space, Switch, notification } from 'antd';
import moment from 'moment-timezone';
import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import the styles
import { useHistory, useLocation, useParams } from 'react-router-dom';
import QuestionEditor from '../components/QuestionEditor';
import { removeIdsFromSurvey } from '../utils/surveyUtils';

const serverDomain = process.env.REACT_APP_SERVER_DOMAIN;

const PublisherSurveyEditor = () => {
  const { id } = useParams();
  const [survey, setSurvey] = useState(null);
  const [questions, setQuestions] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const templateId = queryParams.get('templateId');

  const handleQuestionsChange = (updatedQuestions) => {
    setQuestions(updatedQuestions);
  };

  useEffect(() => {
    const fetchSurvey = async () => {
      const response = await fetch(`${serverDomain}/api/surveys/${templateId ? templateId : id}`);
      const data = await response.json();

      let modifiedData = data;

      if (templateId) {
        // Remove all id fields in the survey, questions, and options
        modifiedData = removeIdsFromSurvey(data);
        modifiedData.isTemplate = false;
      }

      setSurvey(modifiedData);
      setQuestions(modifiedData.questions);
    };

    if (id === 'new' && !templateId) {
      // Initialize a new survey
      setSurvey({});
    } else {
      fetchSurvey();
    }
  }, [id, templateId]);


  const onFinish = async (values) => {
    values.questions = questions;

    // Add userId: 1 for new surveys
    if (id === 'new') {
      values.userId = 1;
    }

    // Filter out null values for startTime and endTime
    const filteredValues = Object.fromEntries(
      Object.entries(values).filter(([key, value]) => !(value === null && (key === 'startTime' || key === 'endTime')))
    );

    const requestOptions = {
      method: id === 'new' ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filteredValues),
    };

    const successMessage = `Survey saved successfully!`;
    const errorMessage = `Error saving survey.`;

    try {
      const response = await fetch(
        id === 'new'
          ? `${serverDomain}/api/surveys/`
          : `${serverDomain}/api/surveys/${id}`,
        requestOptions
      );

      if (response.ok) {
        if (values.isTemplate) {
          history.push('/publisher/templates');
        } else {
          history.push('/publisher/surveys');
        }
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


  const imageHandler = async function () {
    const input = document.createElement("input");

    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const formData = new FormData();

      formData.append("image", file);

      // Adjust the URL to match your API endpoint
      const response = await fetch(`${serverDomain}/api/upload`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const filename = await response.text();
        // Adjust the URL to match your API endpoint
        const imageUrl = `${serverDomain}/api/image/${filename}`;

        // Insert the image in the editor
        const range = this.quill.getSelection();
        this.quill.insertEmbed(range.index, "image", imageUrl);
      } else {
        console.error("Failed to upload image");
      }
    };
  };

  const quillModules = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link', 'image']],
      handlers: {
        image: imageHandler,
      },
    }
  };

  return (
    <div>
      {survey && (
        <Form
          form={form}
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
            <ReactQuill placeholder="Enter survey description" modules={quillModules} />
          </Form.Item>
          <Form.Item
            label="Is survey template"
            name="isTemplate"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch />
          </Form.Item>
          <Form.Item
            label="Is anonymous survey"
            name="isAnonymous"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch />
          </Form.Item>
          <Form.Item label="Allow resubmit"
            name="allowResubmit"
            valuePropName="checked"
            initialValue={false}>
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
              <Button onClick={handleClose}>Close</Button>
            </Space>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default PublisherSurveyEditor;

