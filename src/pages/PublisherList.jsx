import { List, Pagination } from 'antd';
import moment from 'moment-timezone';
import React, { useEffect, useState } from 'react';

const PublisherList = ({
    fetchDataUrl,
    onItemClick,
    renderItemActions = () => [],
    refresh,
    pageNumber = 0,
    pageSize = 10,
}) => {
    const [items, setItems] = useState([]);
    const [pagination, setPagination] = useState({ current: pageNumber + 1, pageSize, total: 0 });

    const fetchItems = async (pageNumber, pageSize) => {
        const response = await fetch(`${fetchDataUrl}&page=${pageNumber}&size=${pageSize}`);
        const data = await response.json();
        setItems(data.content);
        setPagination({ ...pagination, total: data.totalElements });
    };

    useEffect(() => {
        fetchItems(pagination.current - 1, pagination.pageSize);
    }, [pagination.current, pagination.pageSize, refresh]);

    const handlePaginationChange = (page, pageSize) => {
        setPagination({ ...pagination, current: page, pageSize: pageSize || 10 });
    };

    return (
        <div>
            <List
                itemLayout="vertical"
                dataSource={items}
                renderItem={(item) => (
                    <List.Item
                        key={item.id}
                        onClick={() => onItemClick(item.id)}
                        actions={renderItemActions(item)}
                    >
                        <List.Item.Meta
                            title={item.title}
                            description={moment(item.createdAt).local().format('YYYY-MM-DD HH:mm:ss')}
                        />
                        {item.description}
                    </List.Item>
                )}
            />
            <Pagination
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={pagination.total}
                onChange={handlePaginationChange}
            />
        </div>
    );
};

export default PublisherList;
