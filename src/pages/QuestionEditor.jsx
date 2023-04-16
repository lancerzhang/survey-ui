import React, { useState } from "react";
import { Input, Radio, Checkbox, Button, Space, Row, Col } from "antd";
import "antd/dist/antd.css";

const QuestionEditor  = ({ questions: initialQuestions, onQuestionsChange }) => {
	const [state, setState] = useState({
	  nextId: initialQuestions.length + 1,
	  questions: initialQuestions,
	});

	const addQuestion = (questionType) => {
		setState((prevState) => {
		  const newState = {
			...prevState,
			nextId: prevState.nextId + 1,
			questions: [
			  ...prevState.questions,
			  {
				id: prevState.nextId,
				type: questionType,
				label: '',
				value: questionType === 'checkbox' ? [] : '',
				options: questionType === 'input' ? [] : ['', ''],
			  },
			],
		  };
		  onQuestionsChange(newState.questions);
		  return newState;
		});
	  };

	  const removeQuestion = (id) => {
		setState((prevState) => {
		  const newState = {
			...prevState,
			questions: prevState.questions.filter((question) => question.id !== id),
		  };
		  onQuestionsChange(newState.questions);
		  return newState;
		});
	  };

	const updateQuestion = (id, newLabel, newValue) => {
		setState((prevState) => {
			const questions = prevState.questions.map((question) => {
				if (question.id === id) {
					return { ...question, label: newLabel, value: newValue };
				}
				return question;
			});
			return { ...prevState, questions };
		});
	};

	const addOption = (id) => {
		setState((prevState) => {
			const questions = prevState.questions.map((question) => {
				if (question.id === id) {
					return { ...question, options: [...question.options, ""] };
				}
				return question;
			});
			return { ...prevState, questions };
		});
	};

	const updateOptions = (id, index, newValue) => {
		setState((prevState) => {
			const questions = prevState.questions.map((question) => {
				if (question.id === id) {
					const newOptions = [...question.options];
					newOptions[index] = newValue;
					return { ...question, options: newOptions };
				}
				return question;
			});
			return { ...prevState, questions };
		});
	};

	return (
		<div>
			<Space direction="vertical" style={{ width: "100%" }} size="large">
				{state.questions.map((question, index) => {
					switch (question.type) {
						case "input":
							return (
								<Row key={question.id} align="middle" gutter={[8, 16]}>
									<Col span={1}>
										<span>Q{index + 1}.</span>
									</Col>
									<Col span={5}>
										<Input
											placeholder="Type your question here."
											value={question.label}
											onChange={(e) =>
												updateQuestion(question.id, e.target.value, question.value)
											}
										/>
									</Col>
									<Col span={12}>
										<Input
											value={question.value}
											onChange={(e) =>
												updateQuestion(question.id, question.label, e.target.value)
											}
										/>
									</Col>
									<Col span={6}>
										<Button
											onClick={() => removeQuestion(question.id)}
											type="primary"
											danger
										>
											Remove
										</Button>
									</Col>
								</Row>
							);
						case "radio":
							return (
								<Row key={question.id} align="middle" gutter={[8, 16]}>
									<Col span={1}>
										<span>Q{index + 1}.</span>
									</Col>
									<Col span={5}>
										<Input
											placeholder="Type your question here."
											value={question.label}
											onChange={(e) =>
												updateQuestion(question.id, e.target.value, question.value)
											}
										/>
									</Col>
									<Col span={12}>
										<Radio.Group
											value={question.value}
											onChange={(e) =>
												updateQuestion(question.id, question.label, e.target.value)
											}
										>
											{question.options.map((option, index) => (
												<Radio key={index} value={option}>
													<Input
														placeholder="Option text"
														value={option}
														onChange={(e) =>
															updateOptions(question.id, index, e.target.value)
														}
													/>
												</Radio>
											))}
										</Radio.Group>
									</Col>
									<Col span={6}>
										<Space>
											<Button
												onClick={() => addOption(question.id)}
												type="primary"
											>
												Add Option
											</Button>
											<Button
												onClick={() => removeQuestion(question.id)}
												type="primary"
												danger
											>
												Remove
											</Button>
										</Space>
									</Col>
								</Row>
							);
						case "checkbox":
							return (
								<Row key={question.id} align="middle" gutter={[8, 16]}>
									<Col span={1}>
										<span>Q{index + 1}.</span>
									</Col>
									<Col span={5}>
										<Input
											placeholder="Type your question here."
											value={question.label}
											onChange={(e) =>
												updateQuestion(question.id, e.target.value, question.value)
											}
										/>
									</Col>
									<Col span={12}>
										<Checkbox.Group
											value={question.value}
											onChange={(checkedValues) =>
												updateQuestion(question.id, question.label, checkedValues)
											}
										>
											{question.options.map((option, index) => (
												<Checkbox key={index} value={option}>
													<Input
														placeholder="Option text"
														value={option}
														onChange={(e) =>
															updateOptions(question.id, index, e.target.value)
														}
													/>
												</Checkbox>
											))}
										</Checkbox.Group>
									</Col>
									<Col span={6}>
										<Space>
											<Button
												onClick={() => addOption(question.id)}
												type="primary"
											>
												Add Option
											</Button>
											<Button
												onClick={() => removeQuestion(question.id)}
												type="primary"
												danger
											>
												Remove
											</Button>
										</Space>
									</Col>
								</Row>
							);
						default:
							return null;
					}
				})}
			</Space>
			<Space style={{ marginTop: "16px" }}>
				<Button onClick={() => addQuestion("input")} type="primary">
					Add Input
				</Button>
				<Button onClick={() => addQuestion("radio")} type="primary">
					Add Radio
				</Button>
				<Button onClick={() => addQuestion("checkbox")} type="primary">
					Add Checkbox
				</Button>
			</Space>
		</div>
	);
};

export default QuestionEditor;
