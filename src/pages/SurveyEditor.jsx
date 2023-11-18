import { Button, Col, DatePicker, Divider, Form, Input, InputNumber, List, Row, Space, Switch, notification } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import the styles
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import useFetchUsers from '../useFetchUsers';
import { removeIdsFromSurvey, removeNewIdsFromSurvey } from '../utils/surveyUtils';
import QuestionEditor from './QuestionEditor';
import './SurveyEditor.css';

const { TextArea } = Input;
const serverDomain = process.env.REACT_APP_SERVER_DOMAIN;

const SurveyEditor = () => {
    const user = useFetchUsers().user;
    const [survey, setSurvey] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [form] = Form.useForm();
    const queryParams = new URLSearchParams(location.search);
    const templateId = queryParams.get('templateId');
    const [surveyAccess, setSurveyAccess] = useState([]);
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const fetchSurvey = async () => {
            const response = await fetch(`${serverDomain}/surveys/${templateId ? templateId : id}`);
            const data = await response.json();

            let modifiedData = data;

            if (templateId) {
                // Remove all id fields in the survey, questions, and options
                modifiedData = removeIdsFromSurvey(data);
                modifiedData.isTemplate = false;
            } else {
                const response = await fetch(`${serverDomain}/survey-access/${id}`);
                const data = await response.json();
                setSurveyAccess(data);

            }
            setSurvey(modifiedData);
        };

        if (id === 'new' && !templateId) {
            // Initialize a new survey
            setSurvey({ description: '', questions: [] });
        } else {
            fetchSurvey();
        }
    }, [id, templateId]);

    const onFinish = async (values) => {
        const newSurvey = { ...survey, ...values };

        // Add userId: 1 for new surveys
        if (id === 'new') {
            newSurvey.userId = user.id;
        }

        // Filter out null values for startTime and endTime
        const filteredValues = Object.fromEntries(
            Object.entries(newSurvey).filter(([key, value]) => !(value === null) && !key.includes("__"))
        );

        const requestBody = removeNewIdsFromSurvey(filteredValues);
        const requestOptions = {
            method: id === 'new' ? 'POST' : 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        };

        const successMessage = `Survey saved successfully!`;
        const errorMessage = `Error saving survey.`;

        try {
            const response = await fetch(
                id === 'new'
                    ? `${serverDomain}/surveys/`
                    : `${serverDomain}/surveys/${id}`,
                requestOptions
            );

            if (response.ok) {
                if (filteredValues.isTemplate) {
                    navigate('/publisher/templates');
                } else {
                    navigate('/publisher/surveys');
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

    const handleClose = () => {
        navigate(-1);
    };

    const setQuestions = (questions) => {
        setSurvey({ ...survey, questions });
    };

    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch(`${serverDomain}/files/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to upload image');
        }

        const filename = await response.text();
        const imageUrl = `${serverDomain}/files/image/${filename}`;
        return imageUrl;
    };

    const customImageHandler = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            if (file) {
                try {

                    const imageUrl = await uploadImage(file);
                    const quill = ReactQuill.findDOMNode(this).querySelector('.ql-editor');
                    const range = this.quill.getSelection(true);
                    this.quill.insertEmbed(range.index, 'image', imageUrl);
                    this.quill.setSelection(range.index + 1);

                } catch (error) {
                    console.error('Image upload failed', error);
                }
            }
        };
    };

    const quillModules = {
        toolbar: {
            container: [
                ['bold', 'italic', 'underline', 'strike'], // toggled buttons
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                [{ 'color': [] }, { 'background': [] }], // dropdown with defaults from theme
                // ['link', 'image'], 
                ['link'],
            ],
            // there is a bug if use customImageHandler, the question input box will lose focus after each typing
            // handlers: {
            //     image: customImageHandler,
            // },
        }
    };

    const addUser = (user) => {
        if (!surveyAccess.some(access => access.user.id === user.id)) {
            setSurveyAccess([...surveyAccess, { user }]);
        }
        // Optionally clear the search results and search input after adding a user
        setSearchResults([]);
    };

    const deleteSurveyAccess = (user) => {
        setSurveyAccess(surveyAccess.filter((u) => u !== user));
    };

    const handleSearch = async (searchString) => {
        const response = await fetch(`${serverDomain}/users/search?searchString=${searchString}`);
        const data = await response.json();
        setSearchResults(data);
    };

    const SearchResult = ({ result }) => (
        <div className="searchResult" onClick={() => addUser(result)}>
            {result.employeeId}, {result.displayName}
        </div>
    );

    return (
        <div>
            {survey && (
                <Form
                    form={form}
                    initialValues={{
                        ...survey,
                        startTime: survey.startTime ? dayjs(survey.startTime) : null,
                        endTime: survey.endTime ? dayjs(survey.endTime) : null,
                    }}
                    onFinish={onFinish}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 22 }}
                >
                    <Form.Item
                        label="Title"
                        name="title"
                        rules={[{ required: true, message: 'Please input a title!' }]}
                    >
                        <TextArea
                            autoSize={{ minRows: 1 }}
                            placeholder="Enter survey title"
                        />
                    </Form.Item>
                    <Form.Item label="Description">
                        <ReactQuill
                            theme="snow"
                            value={survey.description}
                            modules={quillModules}
                            onChange={(value) => setSurvey({ ...survey, description: value })}
                        />
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
                        />
                    </Form.Item>
                    <Form.Item label="End Time" name="endTime" rules={[{ validator: validateEndTime }]}>
                        <DatePicker
                            showTime
                        />
                    </Form.Item>
                    <Form.Item label="Max Replies" name="maxReplies">
                        <InputNumber min={1} />
                    </Form.Item>
                    <Divider />
                    <QuestionEditor
                        form={form}
                        questions={survey.questions}
                        setQuestions={setQuestions}
                    />
                    <Divider />
                    <Form.Item label="Share this survey to:">
                        <Input.Search
                            placeholder="Enter display name or employee ID to search"
                            onSearch={handleSearch}
                        />
                        {searchResults.map(result => (
                            <SearchResult key={result.id} result={result} />
                        ))}
                        <List
                            className="sharedUserList"
                            dataSource={surveyAccess}
                            locale={{ emptyText: ' ' }} // Setting emptyText to a space
                            renderItem={sa => (
                                <List.Item actions={[<a onClick={() => deleteSurveyAccess(sa)}>Delete</a>]}>
                                    {sa.user.employeeId}, {sa.user.displayName}
                                </List.Item>
                            )}
                        />
                    </Form.Item>
                    <Divider />
                    <Row justify="center">
                        <Col>
                            <Space>
                                <Button type="primary" htmlType="submit">
                                    Submit
                                </Button>
                                <Button onClick={handleClose}>Close</Button>
                            </Space>
                        </Col>
                    </Row>
                </Form>
            )}
        </div>
    );
};

export default SurveyEditor;
