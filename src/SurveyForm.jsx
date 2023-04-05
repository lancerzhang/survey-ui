import React from 'react';
import { Form, Input, Button } from 'antd';

const SurveyForm = () => {
  const onFinish = (values) => {
    console.log('Form values: ', values);
  };

  return (
    <Form onFinish={onFinish}>
      <Form.Item
        label="Question"
        name="question"
        rules={[{ required: true, message: 'Please input a question!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SurveyForm;
