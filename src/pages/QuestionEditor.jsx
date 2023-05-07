import { DeleteOutlined } from "@ant-design/icons";
import { Button, Checkbox, Col, Divider, Form, Input, Modal, Radio, Row, Space, Tooltip } from "antd";
import React, { useState } from "react";

const { TextArea } = Input;

const QuestionEditor = ({ form, questions, setQuestions }) => {
    console.log("questions", questions)
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [pastedOptions, setPastedOptions] = useState('');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(null);

    const handleAddPastedOptions = (questionIndex) => {
        const newOptions = pastedOptions.split('\n');
        const newQuestions = [...questions];
        const updatedQuestion = { ...newQuestions[questionIndex] };
        updatedQuestion.options = [
            ...updatedQuestion.options,
            ...newOptions.map((opt) => ({ optionText: opt })),
        ];
        newQuestions[questionIndex] = updatedQuestion;
        setQuestions(newQuestions);
        setPastedOptions('');
        setIsModalVisible(false);
    };

    const openModalForQuestion = (questionIndex) => {
        setCurrentQuestionIndex(questionIndex);
        setIsModalVisible(true);
    };

    const addQuestion = (questionType) => {
        const newQuestions = [...questions, {
            questionType: questionType,
            questionText: '',
            options: questionType === 'TEXT' ? [] : ['', ''],
        }];
        setQuestions(newQuestions);
    };

    const updateQuestion = (questionIndex, newQuestionText) => {
        const newQuestions = [...questions];
        const updatedQuestion = { ...newQuestions[questionIndex] };
        updatedQuestion.questionText = newQuestionText;
        newQuestions[questionIndex] = updatedQuestion;
        setQuestions(newQuestions);
    };

    const removeQuestion = (questionIndex) => {
        const newQuestions = questions.filter((_, index) => index !== questionIndex);
        setQuestions(newQuestions);
    };

    const addOption = (questionIndex) => {
        const newQuestions = [...questions];
        const updatedQuestion = { ...newQuestions[questionIndex] };
        updatedQuestion.options = [...updatedQuestion.options, { optionText: '' }];
        newQuestions[questionIndex] = updatedQuestion;
        setQuestions(newQuestions);
    };

    const updateOptions = (questionIndex, optionIndex, newOptionText) => {
        const newQuestions = [...questions];
        const updatedQuestion = { ...newQuestions[questionIndex] };
        const updatedOptions = [...updatedQuestion.options];
        updatedOptions[optionIndex] = { ...updatedOptions[optionIndex], optionText: newOptionText };
        updatedQuestion.options = updatedOptions;
        newQuestions[questionIndex] = updatedQuestion;
        setQuestions(newQuestions);
    };

    const removeOption = (questionIndex, optionIndex) => {
        const newQuestions = [...questions];
        const updatedQuestion = { ...newQuestions[questionIndex] };
        const updatedOptions = updatedQuestion.options.filter((_, index) => index !== optionIndex);
        updatedQuestion.options = updatedOptions;
        newQuestions[questionIndex] = updatedQuestion;
        setQuestions(newQuestions);
    };

    return (
        <div >
            <h2>Questions</h2>
            <Space direction="vertical" style={{ width: "100%" }} size="large">
                {questions.map((question, questionIndex) => {
                    let content;
                    switch (question.questionType) {
                        case "TEXT":
                            content = <>
                                <Row align="top">
                                    <Col span={2}>
                                        <span>Q{questionIndex + 1}.</span>
                                    </Col>
                                    <Col span={18}>
                                        <Form.Item
                                            form={form}
                                            name={`question_${questionIndex}`}
                                            rules={[
                                                { required: true, message: 'Please input a question.' },
                                            ]}
                                            initialValue={question.questionText}
                                        >
                                            <Input
                                                placeholder="Type your question here."
                                                onChange={(e) =>
                                                    updateQuestion(questionIndex, e.target.value)
                                                }
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Button
                                            onClick={() => removeQuestion(questionIndex)}
                                            type="primary"
                                            danger
                                        >
                                            Remove Question
                                        </Button>
                                    </Col>
                                </Row>
                            </>
                            break;
                        case "RADIO":
                            content = (
                                <>
                                    <Row align="top">
                                        <Col span={2}>
                                            <span>Q{questionIndex + 1}.</span>
                                        </Col>
                                        <Col span={18}>
                                            <Form.Item
                                                form={form}
                                                name={`question_${questionIndex}`}
                                                rules={[
                                                    { required: true, message: 'Please input a question.' },
                                                ]}
                                                initialValue={question.questionText}
                                            >
                                                <Input
                                                    placeholder="Type your question here."
                                                    onChange={(e) =>
                                                        updateQuestion(questionIndex, e.target.value)
                                                    }
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={4}>
                                            <Button
                                                onClick={() => removeQuestion(questionIndex)}
                                                type="primary"
                                                danger
                                            >
                                                Remove Question
                                            </Button>
                                        </Col>
                                    </Row>
                                    <div>
                                        <Radio.Group>
                                            {question.options.map((option, optionIndex) => (
                                                <Radio key={optionIndex}>
                                                    <Form.Item
                                                        form={form}
                                                        name={`question_${questionIndex}_option_${optionIndex}`}
                                                        rules={[
                                                            { required: true, message: 'Please input an option.' },
                                                        ]}
                                                        initialValue={option.optionText}
                                                    >
                                                        <Input
                                                            placeholder="Option text"
                                                            onChange={(e) =>
                                                                updateOptions(questionIndex, optionIndex, e.target.value)
                                                            }
                                                        />
                                                    </Form.Item>
                                                    <Tooltip title="Remove Option">
                                                        <Button
                                                            onClick={() => removeOption(questionIndex, optionIndex)}
                                                            type="text"
                                                            icon={<DeleteOutlined />}
                                                            danger
                                                        />
                                                    </Tooltip>
                                                </Radio>
                                            ))}
                                        </Radio.Group>
                                    </div>
                                    <div>
                                        <Button
                                            onClick={() => addOption(questionIndex)}
                                            type="primary"
                                        >
                                            Add Option
                                        </Button>
                                        <Button
                                            onClick={() => openModalForQuestion(questionIndex)}
                                            type="secondary"
                                            style={{ marginLeft: '8px' }}
                                        >
                                            Paste Options
                                        </Button>
                                    </div>
                                </>
                            );
                            break;
                        case "CHECKBOX":
                            content = (
                                <>
                                    <Row align="top">
                                        <Col span={2}>
                                            <span>Q{questionIndex + 1}.</span>
                                        </Col>
                                        <Col span={18}>
                                            <Form.Item
                                                form={form}
                                                name={`question_${questionIndex}`}
                                                rules={[
                                                    { required: true, message: 'Please input a question.' },
                                                ]}
                                                initialValue={question.questionText}
                                            >
                                                <Input
                                                    placeholder="Type your question here."
                                                    onChange={(e) =>
                                                        updateQuestion(questionIndex, e.target.value)
                                                    }
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={4}>
                                            <Button
                                                onClick={() => removeQuestion(questionIndex)}
                                                type="primary"
                                                danger
                                            >
                                                Remove Question
                                            </Button>
                                        </Col>
                                    </Row>
                                    <div>
                                        <Checkbox.Group>
                                            {question.options.map((option, optionIndex) => (
                                                <Checkbox key={optionIndex}>
                                                    <Form.Item
                                                        form={form}
                                                        name={`question_${questionIndex}_option_${optionIndex}`}
                                                        rules={[
                                                            { required: true, message: 'Please input an option.' },
                                                        ]}
                                                        initialValue={option.optionText}
                                                    >
                                                        <Input
                                                            placeholder="Option text"
                                                            onChange={(e) =>
                                                                updateOptions(questionIndex, optionIndex, e.target.value)
                                                            }
                                                        />
                                                    </Form.Item>
                                                    <Tooltip title="Remove Option">
                                                        <Button
                                                            onClick={() => removeOption(questionIndex, optionIndex)}
                                                            type="text"
                                                            icon={<DeleteOutlined />}
                                                            danger
                                                        />
                                                    </Tooltip>
                                                </Checkbox>
                                            ))}
                                        </Checkbox.Group>
                                    </div>
                                    <div>
                                        <Button
                                            onClick={() => addOption(questionIndex)}
                                            type="primary"
                                        >
                                            Add Option
                                        </Button>
                                        <Button
                                            onClick={() => openModalForQuestion(questionIndex)}
                                            type="secondary"
                                            style={{ marginLeft: '8px' }}
                                        >
                                            Paste Options
                                        </Button>
                                    </div>
                                </>
                            );
                            break;
                        default:
                            return null;
                    }
                    return (
                        <React.Fragment key={questionIndex}>
                            {content}
                            <Divider />
                        </React.Fragment>
                    );
                })}
            </Space>
            <Space style={{ marginTop: "16px" }}>
                <Button onClick={() => addQuestion("TEXT")} type="primary">
                    Add Input
                </Button>
                <Button onClick={() => addQuestion("RADIO")} type="primary">
                    Add Radio
                </Button>
                <Button onClick={() => addQuestion("CHECKBOX")} type="primary">
                    Add Checkbox
                </Button>
            </Space>
            <Modal
                title="Paste Options"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                destroyOnClose
            >
                <TextArea
                    placeholder="Each line is an option"
                    autoSize={{ minRows: 5 }}
                    onChange={(e) => setPastedOptions(e.target.value)}
                />
                <Button
                    style={{ marginTop: "16px" }}
                    type="primary"
                    onClick={() => handleAddPastedOptions(currentQuestionIndex)}
                >
                    Add Options
                </Button>
            </Modal>
        </div>
    );
};

export default QuestionEditor;
