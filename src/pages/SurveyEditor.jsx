import React, { useState } from "react";
import { Input, Radio, Checkbox, Button, Space, Row, Col } from "antd";
import "antd/dist/antd.css";

const SurveyEditor = () => {
	const [state, setState] = useState({
		nextId: 1,
		elements: [],
	});

	const addElement = (elementType) => {
		setState((prevState) => ({
			...prevState,
			nextId: prevState.nextId + 1,
			elements: [
				...prevState.elements,
				{
					id: prevState.nextId,
					type: elementType,
					label: "",
					value: elementType === "checkbox" ? [] : "",
					options: elementType === "input" ? [] : ["", ""],
				},
			],
		}));
	};

	const removeElement = (id) => {
		setState((prevState) => ({
			...prevState,
			elements: prevState.elements.filter((element) => element.id !== id),
		}));
	};

	const updateElement = (id, newLabel, newValue) => {
		setState((prevState) => {
			const elements = prevState.elements.map((element) => {
				if (element.id === id) {
					return { ...element, label: newLabel, value: newValue };
				}
				return element;
			});
			return { ...prevState, elements };
		});
	};

	const addOption = (id) => {
		setState((prevState) => {
			const elements = prevState.elements.map((element) => {
				if (element.id === id) {
					return { ...element, options: [...element.options, ""] };
				}
				return element;
			});
			return { ...prevState, elements };
		});
	};

	const updateOptions = (id, index, newValue) => {
		setState((prevState) => {
			const elements = prevState.elements.map((element) => {
				if (element.id === id) {
					const newOptions = [...element.options];
					newOptions[index] = newValue;
					return { ...element, options: newOptions };
				}
				return element;
			});
			return { ...prevState, elements };
		});
	};

	return (
		<div>
			<Space direction="vertical" style={{ width: "100%" }} size="large">
				{state.elements.map((element, index) => {
					switch (element.type) {
						case "input":
							return (
								<Row key={element.id} align="middle" gutter={[8, 16]}>
									<Col span={1}>
										<span>Q{index + 1}.</span>
									</Col>
									<Col span={5}>
										<Input
											placeholder="Type your question here."
											value={element.label}
											onChange={(e) =>
												updateElement(element.id, e.target.value, element.value)
											}
										/>
									</Col>
									<Col span={12}>
										<Input
											value={element.value}
											onChange={(e) =>
												updateElement(element.id, element.label, e.target.value)
											}
										/>
									</Col>
									<Col span={6}>
										<Button
											onClick={() => removeElement(element.id)}
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
								<Row key={element.id} align="middle" gutter={[8, 16]}>
									<Col span={1}>
										<span>Q{index + 1}.</span>
									</Col>
									<Col span={5}>
										<Input
											placeholder="Type your question here."
											value={element.label}
											onChange={(e) =>
												updateElement(element.id, e.target.value, element.value)
											}
										/>
									</Col>
									<Col span={12}>
										<Radio.Group
											value={element.value}
											onChange={(e) =>
												updateElement(element.id, element.label, e.target.value)
											}
										>
											{element.options.map((option, index) => (
												<Radio key={index} value={option}>
													<Input
														placeholder="Option text"
														value={option}
														onChange={(e) =>
															updateOptions(element.id, index, e.target.value)
														}
													/>
												</Radio>
											))}
										</Radio.Group>
									</Col>
									<Col span={6}>
										<Space>
											<Button
												onClick={() => addOption(element.id)}
												type="primary"
											>
												Add Option
											</Button>
											<Button
												onClick={() => removeElement(element.id)}
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
								<Row key={element.id} align="middle" gutter={[8, 16]}>
									<Col span={1}>
										<span>Q{index + 1}.</span>
									</Col>
									<Col span={5}>
										<Input
											placeholder="Type your question here."
											value={element.label}
											onChange={(e) =>
												updateElement(element.id, e.target.value, element.value)
											}
										/>
									</Col>
									<Col span={12}>
										<Checkbox.Group
											value={element.value}
											onChange={(checkedValues) =>
												updateElement(element.id, element.label, checkedValues)
											}
										>
											{element.options.map((option, index) => (
												<Checkbox key={index} value={option}>
													<Input
														placeholder="Option text"
														value={option}
														onChange={(e) =>
															updateOptions(element.id, index, e.target.value)
														}
													/>
												</Checkbox>
											))}
										</Checkbox.Group>
									</Col>
									<Col span={6}>
										<Space>
											<Button
												onClick={() => addOption(element.id)}
												type="primary"
											>
												Add Option
											</Button>
											<Button
												onClick={() => removeElement(element.id)}
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
				<Button onClick={() => addElement("input")} type="primary">
					Add Input
				</Button>
				<Button onClick={() => addElement("radio")} type="primary">
					Add Radio
				</Button>
				<Button onClick={() => addElement("checkbox")} type="primary">
					Add Checkbox
				</Button>
			</Space>
		</div>
	);
};

export default SurveyEditor;
