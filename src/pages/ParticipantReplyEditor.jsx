import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Typography, Form, Input, Radio, Checkbox, Button, Space, Row, notification, message } from 'antd';
import moment from 'moment';

const ParticipantReplyEditor = () => {
    const serverDomain = process.env.REACT_APP_SERVER_DOMAIN;
    const [survey, setSurvey] = useState(null);
    const [surveyReply, setSurveyReply] = useState(null);
    const [questionReplies, setQuestionReplies] = useState([]);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const history = useHistory();

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

        const loadSurveyReply = async () => {
            try {
                const userId = 1;
                const replyResponse = await fetch(
                    `${serverDomain}/api/survey-replies/surveys/${id}/user/${userId}`
                );
                const replyData = await replyResponse.json();
                if (replyData) {
                    setSurveyReply(replyData);
                }
                setQuestionReplies(replyData.questionReplies);
            } catch (error) {
                console.error('Failed to load the survey reply:', error);
            }
        };

        loadSurvey();
        loadSurveyReply();
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

        if (surveyReply) {
            requestBody.id = surveyReply.id;
        }

        console.log('Request body:', requestBody);

        const requestOptions = {
            method: surveyReply ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        };

        try {
            const response = await fetch(
                `${serverDomain}/api/survey-replies/${surveyReply ? surveyReply.id : ''}`,
                requestOptions
            );

            if (response.ok) {
                history.push('/participant/replies');
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
                {survey.questions.map((question, questionIndex) => {
                    const questionReply = questionReplies.find((qr) => qr.questionId === question.id);

                    return (
                        <React.Fragment key={questionIndex}>
                            <Typography.Title level={4}>
                                Q{questionIndex + 1}. {question.questionText}
                            </Typography.Title>
                            {question.questionType === 'TEXT' && (
                                <Form.Item
                                    name={`question_${questionIndex}`}
                                    initialValue={questionReply ? questionReply.replyText : ''}
                                    rules={[
                                        { required: true, message: 'Please input a question.' },
                                    ]}
                                >
                                    <Input placeholder="Type your answer here" />
                                </Form.Item>
                            )}
                            {question.questionType === 'RADIO' && (
                                <Form.Item
                                    name={`question_${questionIndex}`}
                                    initialValue={
                                        questionReply
                                            ? question.options.find(
                                                (option) =>
                                                    questionReply.optionReplies.find(
                                                        (or) => or.optionId === option.id && or.selected
                                                    )
                                            ).optionText
                                            : null
                                    }
                                    rules={[
                                        { required: true, message: 'Please select an option.' },
                                    ]}
                                >
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
                                <Form.Item
                                    name={`question_${questionIndex}`}
                                    initialValue={
                                        questionReply
                                            ? question.options
                                                .filter((option) =>
                                                    questionReply.optionReplies.find(
                                                        (or) => or.optionId === option.id && or.selected
                                                    )
                                                )
                                                .map((option) => option.optionText)
                                            : []
                                    }
                                    rules={[
                                        { required: true, message: 'Please select an option.' },
                                    ]}
                                >
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
                    );
                })}

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

