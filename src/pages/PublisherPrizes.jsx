import { Button, Form, Input, InputNumber, List, message, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const serverDomain = process.env.REACT_APP_SERVER_DOMAIN;

const PublisherPrizes = () => {
    const { id } = useParams();
    const [prizes, setPrizes] = useState([]);
    const [replyCount, setReplyCount] = useState(0);
    const [form] = Form.useForm();

    const fetchPrizes = async () => {
        const response = await fetch(`${serverDomain}/prizes?surveyId=${id}`);
        const data = await response.json();
        setPrizes(data);
    };

    const fetchReplyCount = async () => {
        const response = await fetch(`${serverDomain}/survey-replies/surveys/${id}/count`);
        const count = await response.json();
        setReplyCount(count);
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchPrizes();
            await fetchReplyCount();
        };

        fetchData();
    }, []);

    const handleSubmit = async (values) => {
        const response = await fetch(`${serverDomain}/prizes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...values,
                surveyId: parseInt(id),
            }),
        });

        if (response.ok) {
            message.success('Prize created successfully');
            form.resetFields();
            await fetchPrizes();
        } else {
            message.error('Failed to create prize');
        }
    };

    const columns = [
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Staff ID',
            dataIndex: 'staffId',
            key: 'staffId',
        },
    ];

    return (
        <div>
            <h2>Prizes</h2>
            <List
                itemLayout="vertical"
                dataSource={prizes}
                renderItem={(prize) => (
                    <List.Item>
                        <List.Item.Meta
                            title={prize.name}
                            description={`${prize.description} (Quantity: ${prize.quantity})`}
                        />
                        <Table
                            columns={columns}
                            dataSource={prize.winners.map((winner) => ({
                                key: winner.id,
                                username: winner.user.username,
                                staffId: winner.user.staffId,
                            }))}
                            pagination={false}
                        />
                    </List.Item>
                )}
            />
            {replyCount > 0 && (
                <div>
                    <h2>Create Prize</h2>
                    <Form form={form} onFinish={handleSubmit}>
                        <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input a prize name!' }]}>
                            <Input placeholder='Input a prize name' />
                        </Form.Item>
                        <Form.Item
                            label="Description"
                            name="description"
                            rules={[{ required: true, message: 'Please input a prize description!' }]}
                        >
                            <Input.TextArea placeholder='Input a prize description' />
                        </Form.Item>
                        <Form.Item
                            label="Quantity"
                            name="quantity"
                            initialValue={1}
                            rules={[{ required: true, message: 'Please input a prize quantity!', type: 'number' }]}
                        >
                            <InputNumber min={1} />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Create Prize
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            )}
        </div>
    );
};

export default PublisherPrizes;
