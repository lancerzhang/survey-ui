import { Button, Input, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import useDebounce from '../utils/useDebounce';

const serverDomain = process.env.REACT_APP_SERVER_DOMAIN;

const PublisherDelegates = () => {
  const [delegates, setDelegates] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchString, setSearchString] = useState('');
  const debouncedSearchString = useDebounce(searchString, 500);

  const userId = 1;

  useEffect(() => {
    const fetchDelegates = async () => {
      const response = await fetch(`${serverDomain}/api/delegates/delegator/${userId}`);
      const data = await response.json();
      setDelegates(data);
    };

    fetchDelegates();
  }, [serverDomain]);

  useEffect(() => {
    if (debouncedSearchString && debouncedSearchString.length > 2) {
      // Call the search API here
      handleSearch(debouncedSearchString);
    }
  }, [debouncedSearchString]);

  const handleSearch = async (searchString) => {
    if (debouncedSearchString.length > 2) {
      const response = await fetch(`${serverDomain}/api/users/search?searchString=${searchString}`);
      const data = await response.json();
      setSearchResults(data);
    } else {
      setSearchResults([]);
    }
  };

  const addDelegate = async (delegate) => {
    console.log("delegate", delegate)
    const requestBody = {
      delegatorId: userId,
      delegate: {
        id: delegate.id
      },
    };

    const response = await fetch(`${serverDomain}/api/delegates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      const newDelegate = await response.json();
      setDelegates([...delegates, { newDelegate, delegate: delegate }]);
    }
  };

  const removeDelegate = async (delegateId) => {
    const response = await fetch(`${serverDomain}/api/delegates/${delegateId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setDelegates(delegates.filter((delegate) => delegate.id !== delegateId));
    }
  };

  const columns = [
    {
      title: 'Staff ID',
      dataIndex: ['delegate', 'staffId'],
      key: 'staffId',
    },
    {
      title: 'Username',
      dataIndex: ['delegate', 'username'],
      key: 'username',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        const isDelegate = delegates.find(
          (delegate) => delegate.delegate.id === record.delegate.id
        );

        if (isDelegate) {
          return (
            <Button
              type="primary"
              danger
              onClick={() => removeDelegate(record.id)}
            >
              Remove Delegate
            </Button>
          );
        } else {
          return (
            <Button
              type="primary"
              onClick={() => addDelegate(record.delegate)}
            >
              Add as Delegate
            </Button>
          );
        }
      },
    },
  ];

  return (
    <div>
      <p>Only registered users can be found.</p>
      <Input
        placeholder="Search by username or staff ID"
        value={searchString}
        onChange={(e) => {
          setSearchString(e.target.value);
        }}
        style={{ marginBottom: 20 }}
      />
      <Table
        dataSource={[
          ...delegates.map((delegate) => ({ ...delegate, key: delegate.delegate.id })),
          ...searchResults
            .filter((result) => !delegates.find((delegate) => delegate.delegate.id === result.id))
            .map((result) => ({ delegate: result, key: result.id })),
        ]}
        columns={columns}
      />

    </div>
  );
};

export default PublisherDelegates;
