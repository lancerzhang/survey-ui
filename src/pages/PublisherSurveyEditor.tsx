import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Input, Switch, Button, Divider } from 'antd';
import AddQuestionModal from '../components/AddQuestionModal';

const PublisherSurveyEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [survey, setSurvey] = useState<any>(null);
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const serverDomain = process.env.REACT_APP_SERVER_DOMAIN;

  useEffect(() => {
    const fetchSurvey = async () => {
      const response = await fetch(`${serverDomain}/api/surveys/${id}`);
      const data = await response.json();
      setSurvey(data);
    };
    if (id === 'new') {
      // Initialize a new survey
    } else {
      fetchSurvey();
    }
  }, [id]);

  const onFinish = (values: any) => {
    console.log('Form values:', values);
  };

  const handleAddQuestionClick = () => {
    setShowAddQuestionModal(true);
  };

  const handleAddQuestion = (questionType: string) => {
    console.log('Adding question of type:', questionType);
    setShowAddQuestionModal(false);
  };

  const handleAddQuestionCancel = () => {
    setShowAddQuestionModal(false);
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
          <h2>Questions</h2>
          {/* Render questions here */}
          <Form.Item wrapperCol={{ offset: 4 }}>
            <Button type="primary" onClick={handleAddQuestionClick}>
              Add Question
            </Button>
          </Form.Item>
          <Divider />
          {/* Add other form items for the remaining fields */}
          <Form.Item wrapperCol={{ offset: 4 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
          <div>
            <AddQuestionModal
              visible={showAddQuestionModal}
              onCancel={handleAddQuestionCancel}
              onAddQuestion={handleAddQuestion}
            />
          </div>
        </Form>

      )}
    </div>
  );
};

export default PublisherSurveyEditor;
