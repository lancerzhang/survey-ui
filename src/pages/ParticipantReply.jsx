import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Typography, Form, Input, Radio, Checkbox, Button, Space, Row, Col, message } from 'antd';
import moment from 'moment';

const ParticipantReply = () => {
    const serverDomain = process.env.REACT_APP_SERVER_DOMAIN;
    const [survey, setSurvey] = useState(null);
    const [loading, setLoading] = useState(true);
    const history = useHistory();
    const { id } = useParams();

    useEffect(() => {
        const loadSurvey = async () => {
            try {
                const response = await fetch(`${serverDomain}/api/surveys/${id}`);
                const data = await response.json();
                const now = moment();

                if (data.startTime && now.isBefore(data.startTime)) {
                    message.error('The survey has not started yet.');
                    history.push('/');
                    return;
                }

                if (data.endTime && now.isAfter(data.endTime)) {
                    message.error('The survey has ended.');
                    history.push('/');
                    return;
                }

                setSurvey(data);
            } catch (error) {
                message.error('Failed to load the survey.');
                history.push('/');
            } finally {
                setLoading(false);
            }
        };

        loadSurvey();
    }, [id, history]);

    const handleSubmit = (values) => {
        // Handle form submission logic here
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!survey) {
        return null;
    }

    return (
        <div>
            <Typography.Title>{survey.title}</Typography.Title>
            <Form onFinish={handleSubmit}>

                {survey.questions.map((question, questionIndex) => (
                    <React.Fragment key={questionIndex}>
                        <Typography.Title level={4}>
                            Q{questionIndex + 1}. {question.questionText}
                        </Typography.Title>
                        {question.questionType === 'TEXT' && (
                            <Form.Item name={`question_${questionIndex}`}>
                                <Input placeholder="Type your answer here" />
                            </Form.Item>
                        )}
                        {question.questionType === 'RADIO' && (
                            <Form.Item name={`question_${questionIndex}`}>
                                <Radio.Group>
                                    {question.options.map((option, optionIndex) => (
                                        <Radio key={optionIndex} value={option.optionText}>
                                            {option.optionText}
                                        </Radio>
                                    ))}
                                </Radio.Group>
                            </Form.Item>
                        )}
                        {question.questionType === 'CHECKBOX' && (
                            <Form.Item name={`question_${questionIndex}`}>
                                <Checkbox.Group>
                                    {question.options.map((option, optionIndex) => (
                                        <Checkbox key={optionIndex} value={option.optionText}>
                                            {option.optionText}
                                        </Checkbox>
                                    ))}
                                </Checkbox.Group>
                            </Form.Item>
                        )}
                    </React.Fragment>
                ))}

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default ParticipantReply;
