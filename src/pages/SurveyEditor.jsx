import React, { useState } from 'react';
import { Input, Radio, Checkbox, Button, Space, Row, Col } from 'antd';

const SurveyEditor = () => {
    const [state, setState] = useState({
        elements: [],
    });

    const addElement = (type) => {
        setState((prevState) => ({
            ...prevState,
            elements: [
                ...prevState.elements,
                {
                    id: Math.random().toString(36).substr(2, 9),
                    type: type,
                    label: '',
                    value: '',
                    options: ['Option 1', 'Option 2'],
                },
            ],
        }));
    };

    const updateElement = (id, label, value) => {
        setState((prevState) => ({
            ...prevState,
            elements: prevState.elements.map((element) =>
                element.id === id ? { ...element, label: label, value: value } : element
            ),
        }));
    };

    const removeElement = (id) => {
        setState((prevState) => ({
            ...prevState,
            elements: prevState.elements.filter((element) => element.id !== id),
        }));
    };

    const updateOptions = (id, index, option) => {
        setState((prevState) => ({
            ...prevState,
            elements: prevState.elements.map((element) =>
                element.id === id
                    ? { ...element, options: element.options.map((opt, idx) => (idx === index ? option : opt)) }
                    : element
            ),
        }));
    };

    const addOption = (id) => {
        setState((prevState) => ({
            ...prevState,
            elements: prevState.elements.map((element) =>
                element.id === id ? { ...element, options: [...element.options, 'New Option'] } : element
            ),
        }));
    };

    const removeOption = (id, index) => {
        setState((prevState) => ({
            ...prevState,
            elements: prevState.elements.map((element) =>
                element.id === id
                    ? { ...element, options: element.options.filter((_, idx) => idx !== index) }
                    : element
            ),
        }));
    };

    return (
        <div>
            <Space direction="vertical" style={{ width: '100%' }}>
                {state.elements.map((element) => {
                    switch (element.type) {
                        case 'input':
                            return (
                                <Space key={element.id} style={{ width: '100%' }} align="baseline">
                                    <Row>
                                        <Col span={6}>
                                            <Input
                                                placeholder="Type your question here."
                                                value={element.label}
                                                onChange={(e) => updateElement(element.id, e.target.value, element.value)}
                                            />
                                        </Col>
                                        <Col span={12}>
                                            <Input
                                                value={element.value}
                                                onChange={(e) => updateElement(element.id, element.label, e.target.value)}
                                            />
                                        </Col>
                                        <Col span={6}>
                                            <Button onClick={() => removeElement(element.id)} type="primary" danger>
                                                Remove
                                            </Button>
                                        </Col>
                                    </Row>
                                </Space>
                            );
                        case 'radio':
                            return (
                                <Space key={element.id} style={{ width: '100%' }} align="baseline">
                                    <Row>
                                        <Col span={6}>
                                            <Input
                                                placeholder="Type your question here."
                                                value={element.label}
                                                onChange={(e) => updateElement(element.id, e.target.value, element.value)}
                                            />
                                        </Col>
                                        <Col span={12}>
                                            <Radio.Group
                                                value={element.value}
                                                onChange={(e) => updateElement(element.id, element.label, e.target.value)}
                                            >
                                                {element.options.map((option, index) => (
                                                    <Radio key={index} value={option}>
                                                        <Input
                                                            value={option}
                                                            onChange={(e) => updateOptions(element.id, index, e.target.value)}
                                                        />
                                                    </Radio>
                                                ))}
                                            </Radio.Group>
                                        </Col>
                                        <Col span={6}>
                                            <Space>
                                                <Button onClick={() => addOption(element.id)} type="primary">
                                                    Add Option
                                                </Button>
                                                <Button onClick={() => removeElement(element.id)} type="primary" danger>
                                                    Remove
                                                </Button>
                                            </Space>
                                        </Col>
                                    </Row>
                                </Space>
                            );
                        case 'checkbox':
                            return (
                                <Space key={element.id} style={{ width: '100%' }} align="baseline">
                                    <Row>
                                        <Col span={6}>
                                            <Input
                                                placeholder="Type your question here."
                                                value={element.label}
                                                onChange={(e) => updateElement(element.id, e.target.value, element.value)}
                                            />
                                        </Col>
                                        <Col span={12}>
                                            <Checkbox.Group
                                                value={element.value}
                                                onChange={(checkedValues) => updateElement(element.id, element.label, checkedValues)}
                                            >
                                                {element.options.map((option, index) => (
                                                    <Checkbox key={index} value={option}>
                                                        <Input
                                                            value={option}
                                                            onChange={(e) => updateOptions(element.id, index, e.target.value)}
                                                        />
                                                    </Checkbox>
                                                ))}
                                            </Checkbox.Group>
                                        </Col>
                                        <Col span={6}>
                                            <Space>
                                                <Button onClick={() => addOption(element.id)} type="primary">
                                                    Add Option
                                                </Button>
                                                <Button onClick={() => removeElement(element.id)} type="primary" danger>
                                                    Remove
                                                </Button>
                                            </Space>
                                        </Col>
                                    </Row>
                                </Space>
                            );
                        default:
                            return null;
                    }
                })}
            </Space>
            <Space>
                <Button onClick={() => addElement('input')} type="primary">
                    Add Input
                </Button>
                <Button onClick={() => addElement('radio')} type="primary">
                    Add Radio
                </Button>
                <Button onClick={() => addElement('checkbox')} type="primary">
                    Add Checkbox
                </Button>
            </Space>
        </div>
    );
};

export default SurveyEditor;