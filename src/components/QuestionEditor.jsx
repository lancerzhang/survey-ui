import { DeleteOutlined } from "@ant-design/icons";
import { Button, Checkbox, Col, Divider, Form, Input, Modal, Radio, Row, Space, Tooltip } from "antd";
import "antd/dist/antd.css";
import React, { useEffect, useState } from "react";
const { TextArea } = Input;
const QuestionEditor = ({ form, questions: initialQuestions, onQuestionsChange }) => {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [pastedOptions, setPastedOptions] = useState('');
	const [activeQuestionIndex, setActiveQuestionIndex] = useState(null);

	const showPasteOptionsModal = (questionIndex) => {
		setActiveQuestionIndex(questionIndex);
		setIsModalVisible(true);
	};

	const handleAddPastedOptions = (questionIndex, pastedOptions) => {
		const newOptions = pastedOptions.split('\n');
		setState((prevState) => {
			const questions = prevState.questions.map((question, idx) => {
				if (idx === questionIndex) {
					return {
						...question,
						options: [...question.options, ...newOptions.map((opt) => ({ optionText: opt }))],
					};
				}
				return question;
			});

			onQuestionsChange(questions);
			return { ...prevState, questions };
		});
		setIsModalVisible(false);
	};

	const [state, setState] = useState({
		questions: initialQuestions,
	});

	useEffect(() => {
		setState({
			questions: initialQuestions,
		});
	}, [initialQuestions]);

	useEffect(() => {
		onQuestionsChange(state.questions);
	}, [state.questions]);

	const addQuestion = (questionType) => {
		setState((prevState) => {
			const newState = {
				...prevState,
				questions: [
					...prevState.questions,
					{
						questionType: questionType,
						questionText: '',
						options: questionType === 'TEXT' ? [] : ['', ''],
					},
				],
			};
			onQuestionsChange(newState.questions);
			return newState;
		});
	};

	const removeQuestion = (questionIndex) => {
		setState((prevState) => {
			const newState = {
				...prevState,
				questions: prevState.questions.filter(
					(_, index) => index !== questionIndex
				),
			};
			onQuestionsChange(newState.questions);
			return newState;
		});
	};

	const updateQuestion = (questionIndex, newQuestionText) => {
		setState((prevState) => {
			const questions = prevState.questions.map((question, index) => {
				if (index === questionIndex) {
					return { ...question, questionText: newQuestionText };
				}
				return question;
			});
			onQuestionsChange(questions);
			return { ...prevState, questions };
		});
	};

	const addOption = (questionIndex) => {
		setState((prevState) => {
			const questions = prevState.questions.map((question, idx) => {
				if (idx === questionIndex) {
					return {
						...question,
						options: [
							...question.options,
							{ optionText: '' },
						],
					};
				}
				return question;
			});

			onQuestionsChange(questions);
			return { ...prevState, questions };
		});
	};


	const updateOptions = (questionIndex, optionIndex, newOptionText) => {
		setState((prevState) => {
			const questions = prevState.questions.map((question, idx) => {
				if (idx === questionIndex) {
					return {
						...question,
						options: question.options.map((option, optIdx) => {
							if (optIdx === optionIndex) {
								return { ...option, optionText: newOptionText };
							}
							return option;
						}),
					};
				}
				return question;
			});

			onQuestionsChange(questions);
			return { ...prevState, questions };
		});
	};


	const removeOption = (questionIndex, optionIndex) => {
		setState((prevState) => {
			const questions = prevState.questions.map((question, idx) => {
				if (idx === questionIndex) {
					return {
						...question,
						options: question.options.filter((_, optIdx) => optIdx !== optionIndex),
					};
				}
				return question;
			});

			onQuestionsChange(questions);
			return { ...prevState, questions };
		});
	};

	const QuestionRow = ({ questionIndex, question, updateQuestion, removeQuestion }) => {
		return (
			<Row align="top">
				<Col span={2}>
					<span>Q{questionIndex + 1}.</span>
				</Col>
				<Col span={18}>
					<Form.Item
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
		);
	};


	return (
		<div >
			<h2>Questions</h2>
			<Space direction="vertical" style={{ width: "100%" }} size="large">
				{state.questions.map((question, questionIndex) => {
					let content;
					switch (question.questionType) {
						case "TEXT":
							content = (
								<QuestionRow
									key={questionIndex}
									questionIndex={questionIndex}
									question={question}
									updateQuestion={updateQuestion}
									removeQuestion={removeQuestion}
								/>
							);
							break;
						case "RADIO":
							content = (
								<>
									<QuestionRow
										key={questionIndex}
										questionIndex={questionIndex}
										question={question}
										updateQuestion={updateQuestion}
										removeQuestion={removeQuestion}
									/>
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
											onClick={() => showPasteOptionsModal(questionIndex)}
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
									<QuestionRow
										key={questionIndex}
										questionIndex={questionIndex}
										question={question}
										updateQuestion={updateQuestion}
										removeQuestion={removeQuestion}
									/>
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
											onClick={() => showPasteOptionsModal(questionIndex)}
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
							<Modal
								title="Paste Options"
								visible={isModalVisible}
								onCancel={() => setIsModalVisible(false)}
								footer={null}
								destroyOnClose
							>
								<Form layout="vertical">
									<Form.Item label="Each line is an option">
										<TextArea
											placeholder="Each line is an option"
											autoSize={{ minRows: 5 }}
											onChange={(e) => setPastedOptions(e.target.value)}
										/>
									</Form.Item>
									<Form.Item>
										<Button
											type="primary"
											onClick={() => handleAddPastedOptions(activeQuestionIndex, pastedOptions)}
										>
											Add Options
										</Button>
									</Form.Item>
								</Form>
							</Modal>

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
		</div>
	);
};

export default QuestionEditor;
