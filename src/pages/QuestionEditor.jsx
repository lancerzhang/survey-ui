import React, { useState, useEffect } from "react";
import { Input, Radio, Checkbox, Button, Space, Row, Col, Tooltip, Divider } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";

const QuestionEditor = ({ questions: initialQuestions, onQuestionsChange }) => {

	console.log(initialQuestions)
	const [state, setState] = useState({
		nextId: initialQuestions.length > 0 ? Math.max(...initialQuestions.map((q) => q.id)) + 1 : 1,
		questions: initialQuestions,
	});

	useEffect(() => {
		setState({
			nextId: initialQuestions.length > 0 ? Math.max(...initialQuestions.map(q => q.id)) + 1 : 1,
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

	return (
		<div>
			<h2>Questions</h2>
			<Space direction="vertical" style={{ width: "100%" }} size="large">
				{state.questions.map((question, questionIndex) => {
					let content;
					switch (question.questionType) {
						case "TEXT":
							content = (
								<Row key={questionIndex} align="middle" gutter={[8, 16]}>
									<Col span={1}>
										<span>Q{questionIndex + 1}.</span>
									</Col>
									<Col span={5}>
										<Input
											placeholder="Type your question here."
											value={question.questionText}
											onChange={(e) =>
												updateQuestion(questionIndex, e.target.value)
											}
										/>
									</Col>
									<Col span={6}>
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
							break;
						case "RADIO":
							content = (
								<Row key={questionIndex} align="middle" gutter={[8, 16]}>
									<Col span={1}>
										<span>Q{questionIndex + 1}.</span>
									</Col>
									<Col span={5}>
										<Input
											placeholder="Type your question here."
											value={question.questionText}
											onChange={(e) =>
												updateQuestion(questionIndex, e.target.value)
											}
										/>
									</Col>
									<Col span={12}>
										<Radio.Group>
											{question.options.map((option, optionIndex) => (
												<Radio key={optionIndex}>
													<Input
														placeholder="Option text"
														value={option.optionText}
														onChange={(e) =>
															updateOptions(questionIndex, optionIndex, e.target.value)
														}
													/>
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
									</Col>
									<Col span={6}>
										<Space>
											<Button
												onClick={() => addOption(questionIndex)}
												type="primary"
											>
												Add Option
											</Button>
											<Button
												onClick={() => removeQuestion(questionIndex)}
												type="primary"
												danger
											>
												Remove Question
											</Button>
										</Space>
									</Col>
								</Row>
							);
							break;
						case "CHECKBOX":
							content = (
								<Row key={questionIndex} align="middle" gutter={[8, 16]}>
									<Col span={1}>
										<span>Q{questionIndex + 1}.</span>
									</Col>
									<Col span={5}>
										<Input
											placeholder="Type your question here."
											value={question.questionText}
											onChange={(e) =>
												updateQuestion(questionIndex, e.target.value)
											}
										/>
									</Col>
									<Col span={12}>
										<Checkbox.Group>
											{question.options.map((option, optionIndex) => (
												<Checkbox key={optionIndex}>
													<Input
														placeholder="Option text"
														value={option.optionText}
														onChange={(e) =>
															updateOptions(questionIndex, optionIndex, e.target.value)
														}
													/>
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
									</Col>
									<Col span={6}>
										<Space>
											<Button
												onClick={() => addOption(questionIndex)}
												type="primary"
											>
												Add Option
											</Button>
											<Button
												onClick={() => removeQuestion(questionIndex)}
												type="primary"
												danger
											>
												Remove Question
											</Button>
										</Space>
									</Col>
								</Row>
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
		</div>
	);
};

export default QuestionEditor;
