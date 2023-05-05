import { Alert, Button, Checkbox, Form, Input, Radio, Typography, notification } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import QuillContent from '../components/QuillContent';

const ParticipantReplyEditor = () => {
    const serverDomain = process.env.REACT_APP_SERVER_DOMAIN;
    const [survey, setSurvey] = useState(null);
    const [surveyReply, setSurveyReply] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(true);
    const [editForm, setEditForm] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const { id } = useParams();
    const history = useHistory();

    const validateDate = (data) => {
        const now = moment();

        if (data.startTime && now.isBefore(data.startTime)) {
            setErrorMessage('The survey has not started yet.');
            return false;
        }

        if (data.endTime && now.isAfter(data.endTime)) {
            setErrorMessage('The survey has ended.');
            return false;
        }

        return true;
    };

    const checkMaxReplies = async (data) => {
        if (!data.maxReplies) {
            return true;
        }
        if (data.isTemplate) {
            setErrorMessage('The survey is a template and cannot be replied to.');
            return false;
        }

        const response = await fetch(`${serverDomain}/api/survey-replies/surveys/${id}/count`);
        const replyCount = await response.json();

        if (replyCount >= data.maxReplies) {
            setErrorMessage('The survey has reached the maximum number of replies.');
            return false;
        }

        return true;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userId = 1;
                const surveyResponse = await fetch(`${serverDomain}/api/surveys/${id}`);
                const surveyData = await surveyResponse.json();
                setSurvey(surveyData);

                const surveyReplyResponse = await fetch(`${serverDomain}/api/survey-replies/surveys/${id}/user/${userId}`);
                if (surveyReplyResponse.status !== 404) {
                    const replyData = await surveyReplyResponse.json();
                    if (replyData) {
                        setSurveyReply(replyData);
                    }
                    setShowForm(true);
                    const validationResult = validateDate(surveyData) && surveyData.allowResubmit;
                    setEditForm(validationResult)
                } else {
                    const validationResult = validateDate(surveyData) && (await checkMaxReplies(surveyData));
                    setShowForm(validationResult);
                }

            } catch (error) {
                setErrorMessage('Failed to load the survey and survey reply data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const onFinish = async (values) => {
        const userId = 1;
        const surveyId = parseInt(id);

        const questionReplies = survey.questions.map((question, questionIndex) => {
            const existingQuestionReply = surveyReply && surveyReply.questionReplies.find((qr) => qr.questionId === question.id);

            const questionReply = {
                questionId: question.id,
            };

            if (existingQuestionReply) {
                questionReply.id = existingQuestionReply.id;
            }

            if (question.questionType === 'TEXT') {
                questionReply.replyText = values[`question_${questionIndex}`];
            } else if (question.questionType === 'RADIO') {
                const selectedOption = question.options.find(
                    (option) => option.optionText === values[`question_${questionIndex}`]
                );

                questionReply.optionReplies = question.options.map((option) => {
                    const existingOptionReply = existingQuestionReply && existingQuestionReply.optionReplies.find((or) => or.optionId === option.id);

                    return {
                        id: existingOptionReply?.id,
                        optionId: option.id,
                        selected: option.id === selectedOption.id,
                    };
                });
            }
            else if (question.questionType === 'CHECKBOX') {
                questionReply.optionReplies = question.options.map((option) => {
                    const existingOptionReply = existingQuestionReply && existingQuestionReply.optionReplies.find((or) => or.optionId === option.id);

                    return {
                        id: existingOptionReply?.id,
                        optionId: option.id,
                        selected: values[`question_${questionIndex}`].includes(option.optionText),
                    };
                });
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


    const isEditable = () => {
        if (!surveyReply) {
            return true;
        }
        return survey.allowResubmit && validateDate(survey);
    };

    const isFormDisabled = !isEditable();
    if (loading) {
        return <div>Loading...</div>;
    }

    if (!survey) {
        return null;
    }

    return (
        <div>
            {errorMessage && (
                <Alert
                    message="Error"
                    description={errorMessage}
                    type="error"
                    showIcon
                    style={{ marginBottom: '1rem' }}
                />
            )}
            <Typography.Title>{survey.title}</Typography.Title>
            <Typography.Paragraph><QuillContent>{survey.description}</QuillContent></Typography.Paragraph>
            {showForm ? (
                <Form onFinish={onFinish}>
                    {survey.questions.map((question, questionIndex) => {
                        const questionReply = surveyReply ? surveyReply.questionReplies.find((qr) => qr.questionId === question.id) : '';

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
                                        <Input placeholder="Type your answer here" disabled={!editForm} />
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
                                        <Radio.Group disabled={!editForm}>
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
                                        <Checkbox.Group disabled={!editForm}>
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
                        <Button type="primary" htmlType="submit" disabled={!editForm}>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            ) : null}
        </div>
    );
};

export default ParticipantReplyEditor;
