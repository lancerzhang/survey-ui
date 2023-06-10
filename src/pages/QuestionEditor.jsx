import { DeleteOutlined } from "@ant-design/icons";
import { Button, Col, Divider, Form, Input, InputNumber, Modal, Row, Space, Switch, Tooltip } from "antd";
import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { BASE_NUM_NEW_ID } from "../utils/surveyUtils";

const { TextArea } = Input;

const QuestionEditor = ({ form, questions, setQuestions }) => {

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [pastedOptions, setPastedOptions] = useState('');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(null);
    const [sequenceNumber, setSequenceNumber] = useState(BASE_NUM_NEW_ID);

    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }

        const items = Array.from(questions);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setQuestions(items);
    }


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
        const newQuestions = [
            ...questions,
            {
                id: sequenceNumber,
                questionType: questionType,
                questionText: '',
                options: questionType === 'TEXT' ? [] : [{ id: sequenceNumber + 1 }, { id: sequenceNumber + 2 }],
            },
        ];
        setQuestions(newQuestions);
        setSequenceNumber(sequenceNumber + 3);
    };


    const updateQuestion = (questionIndex, fieldName, newFieldValue) => {
        const newQuestions = [...questions];
        const updatedQuestion = { ...newQuestions[questionIndex] };
        updatedQuestion[fieldName] = newFieldValue;
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
        updatedQuestion.options = [...updatedQuestion.options, { id: sequenceNumber, optionText: '' }];
        newQuestions[questionIndex] = updatedQuestion;
        setQuestions(newQuestions);
        setSequenceNumber(sequenceNumber + 1);
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
        <div>
            <h2>Questions</h2>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="questions">
                    {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                            <Space direction="vertical" style={{ width: "100%" }} size="large">
                                {questions.map((question, questionIndex) => (
                                    <Draggable key={question.id} draggableId={String(question.id)} index={questionIndex}>
                                        {(provided) => {

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
                                                                    name={`question__${question.id}`}
                                                                    rules={[
                                                                        { required: true, message: 'Please input a question.' },
                                                                    ]}
                                                                    initialValue={question.questionText}
                                                                >
                                                                    <TextArea
                                                                        autoSize={{ minRows: 1 }}
                                                                        placeholder="Type your question here."
                                                                        onChange={(e) =>
                                                                            updateQuestion(questionIndex, "questionText", e.target.value)
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

                                                        <Form.Item
                                                            form={form}
                                                            label="Is mandatory"
                                                            name={`question__${question.id}_isMandatory`}
                                                            valuePropName="checked"
                                                            initialValue={question.isMandatory}
                                                        >
                                                            <Switch onChange={(value) =>
                                                                updateQuestion(questionIndex, "isMandatory", value)
                                                            } />
                                                        </Form.Item>
                                                    </>
                                                    break;
                                                case "CHOICE":
                                                    content = (
                                                        <>
                                                            <Row align="top">
                                                                <Col span={2}>
                                                                    <span>Q{questionIndex + 1}.</span>
                                                                </Col>
                                                                <Col span={18}>
                                                                    <Form.Item
                                                                        form={form}
                                                                        name={`question__${question.id}`}
                                                                        rules={[
                                                                            { required: true, message: 'Please input a question.' },
                                                                        ]}
                                                                        initialValue={question.questionText}
                                                                    >
                                                                        <TextArea
                                                                            autoSize={{ minRows: 1 }}
                                                                            placeholder="Type your question here."
                                                                            onChange={(e) =>
                                                                                updateQuestion(questionIndex, "questionText", e.target.value)
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
                                                            {question.options.map((option, optionIndex) => (
                                                                <Row>
                                                                    <Col span={20}>
                                                                        <Form.Item
                                                                            form={form}
                                                                            name={`option__${option.id}`}
                                                                            rules={[
                                                                                { required: true, message: 'Please input an option.' },
                                                                            ]}
                                                                            initialValue={option.optionText}
                                                                        >
                                                                            <TextArea
                                                                                autoSize={{ minRows: 1 }}
                                                                                placeholder="Option text"
                                                                                onChange={(e) =>
                                                                                    updateOptions(questionIndex, optionIndex, e.target.value)
                                                                                }
                                                                            />
                                                                        </Form.Item>
                                                                    </Col>
                                                                    <Col span={4}>
                                                                        <Tooltip title="Remove Option">
                                                                            <Button
                                                                                onClick={() => removeOption(questionIndex, optionIndex)}
                                                                                type="text"
                                                                                icon={<DeleteOutlined />}
                                                                                danger
                                                                            />
                                                                        </Tooltip></Col>
                                                                </Row>
                                                            ))}
                                                            <Form.Item
                                                                form={form}
                                                                label="Is mandatory"
                                                                name={`question__${question.id}_isMandatory`}
                                                                valuePropName="checked"
                                                                initialValue={question.isMandatory}
                                                            >
                                                                <Switch onChange={(value) =>
                                                                    updateQuestion(questionIndex, "isMandatory", value)
                                                                } />
                                                            </Form.Item>
                                                            <Form.Item
                                                                form={form}
                                                                label="Min selection"
                                                                name={`question__${question.id}_minSelection`}
                                                                initialValue={question.minSelection}
                                                            >
                                                                <InputNumber onChange={(value) =>
                                                                    updateQuestion(questionIndex, "minSelection", value)
                                                                } />
                                                            </Form.Item>
                                                            <Form.Item
                                                                form={form}
                                                                label="Max selection"
                                                                name={`question__${question.id}_maxSelection`}
                                                                initialValue={question.maxSelection}
                                                            >
                                                                <InputNumber onChange={(value) =>
                                                                    updateQuestion(questionIndex, "maxSelection", value)
                                                                } />
                                                            </Form.Item>
                                                            <Row justify="center">
                                                                <Col>
                                                                    <Space>
                                                                        <Button onClick={() => addOption(questionIndex)} type="primary">
                                                                            Add Option
                                                                        </Button>
                                                                        <Button
                                                                            onClick={() => openModalForQuestion(questionIndex)}
                                                                            type="secondary"
                                                                        >
                                                                            Paste Options
                                                                        </Button>
                                                                    </Space>
                                                                </Col>
                                                            </Row>
                                                        </>
                                                    );
                                                    break;
                                                default:
                                                    return null;
                                            }
                                            return (
                                                <div key={question.id} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                    {content}
                                                    <Divider />
                                                </div>
                                            );
                                        }}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </Space>
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            <Row justify="center">
                <Col>
                    <Space>
                        <Button onClick={() => addQuestion("TEXT")} type="primary">
                            Add Text Question
                        </Button>
                        <Button onClick={() => addQuestion("CHOICE")} type="primary">
                            Add Choice Question
                        </Button>
                    </Space>
                </Col>
            </Row>
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
