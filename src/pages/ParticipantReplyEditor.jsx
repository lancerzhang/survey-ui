import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Typography, Form, Input, Radio, Checkbox, Button, Space, Row, notification, message } from 'antd';
import moment from 'moment';

const ParticipantReplyEditor = () => {
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

    const onFinish = async (values) => {
        const userId = 1;
        const surveyId = parseInt(id);

        const questionReplies = survey.questions.map((question, questionIndex) => {
            const questionReply = {
                questionId: question.id,
            };

            if (question.questionType === 'TEXT') {
                questionReply.replyText = values[`question_${questionIndex}`];
            } else if (question.questionType === 'RADIO') {
                const selectedOption = question.options.find(
                    (option) => option.optionText === values[`question_${questionIndex}`]
                );

                questionReply.optionReplies = [
                    {
                        optionId: selectedOption.id,
                        selected: true,
                    },
                ];
            } else if (question.questionType === 'CHECKBOX') {
                questionReply.optionReplies = question.options.map((option) => ({
                    optionId: option.id,
                    selected: values[`question_${questionIndex}`].includes(option.optionText),
                }));
            }

            return questionReply;
        });

        const requestBody = {
            userId,
            surveyId,
            questionReplies,
        };

        console.log('Request body:', requestBody);

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        };

        try {
            const response = await fetch(
                `${serverDomain}/api/survey-replies/`,
                requestOptions
            );

            if (response.ok) {
                notification.success({ message: 'Survey replied successfully!' });
            } else {
                notification.error({ message: 'Error replying survey.' });
            }
        } catch (error) {
            notification.error({ message: 'Error replying survey.' });
        }
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
            <Form onFinish={onFinish}>
                {survey.questions.map((question, questionIndex) => (
                    <React.Fragment key={questionIndex}>
                        <Typography.Title level={4}>
                            Q{questionIndex + 1}. {question.questionText}
                        </Typography.Title>
                        {question.questionType === 'TEXT' && (
                            <Form.Item name={`question_${questionIndex}`}
                                rules={[
                                    { required: true, message: 'Please input a question.' },
                                ]}>
                                <Input placeholder="Type your answer here" />
                            </Form.Item>
                        )}
                        {question.questionType === 'RADIO' && (
                            <Form.Item name={`question_${questionIndex}`}
                                rules={[
                                    { required: true, message: 'Please select an option.' },
                                ]}>
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
                            <Form.Item name={`question_${questionIndex}`}
                                rules={[
                                    { required: true, message: 'Please select an option.' },
                                ]}>
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

export default ParticipantReplyEditor;
