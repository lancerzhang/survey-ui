import { Button, Input, Table } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import UsersContext from '../UsersContext';
import useFetchUsers from '../useFetchUsers';
import useDebounce from '../utils/useDebounce';

const serverDomain = process.env.REACT_APP_SERVER_DOMAIN;

const PublisherDelegates = () => {
  const users = useFetchUsers();
  const me = users.me;
  const user = users.user;
  const [delegates, setDelegates] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchString, setSearchString] = useState('');
  const debouncedSearchString = useDebounce(searchString, 500);
  const { setUsers } = useContext(UsersContext);
  const [delegators, setDelegators] = useState([]);

  useEffect(() => {
    const fetchDelegates = async () => {
      const [delegateResponse, delegatorResponse] = await Promise.all([
        fetch(`${serverDomain}/delegates/delegator/${me.id}`),
        fetch(`${serverDomain}/delegates/delegate/${me.id}`),
      ]);
      const delegateData = await delegateResponse.json();
      setDelegates(delegateData);
      const delegatorData = await delegatorResponse.json();
      setDelegators([{ id: 0, delegator: me, delegate: me }, ...delegatorData]);
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
      const response = await fetch(`${serverDomain}/users/search?searchString=${searchString}`);
      const data = await response.json();
      setSearchResults(data);
    } else {
      setSearchResults([]);
    }
  };

  const addDelegate = async (delegate) => {
    const requestBody = {
      delegator: {
        id: me.id
      },
      delegate: {
        id: delegate.id
      },
    };

    const response = await fetch(`${serverDomain}/delegates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      const newDelegate = await response.json();
      const updatedDelegate = { ...newDelegate, delegate: delegate };
      setDelegates([...delegates, updatedDelegate]);
    }
  };

  const removeDelegate = async (delegateId) => {
    const response = await fetch(`${serverDomain}/delegates/${delegateId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setDelegates(delegates.filter((delegate) => delegate.id !== delegateId));
    }
  };

  const columns = [
    {
      title: 'Employee ID',
      dataIndex: ['delegate', 'employeeId'],
      key: 'employeeId',
    },
    {
      title: 'Display Name',
      dataIndex: ['delegate', 'displayName'],
      key: 'displayName',
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

  const switchUser = (newUser) => {
    const newUsers = { ...users, user: newUser }
    setUsers(newUsers);
  };

  const delegatorColumns = [
    {
      title: 'Employee ID',
      dataIndex: ['delegator', 'employeeId'],
      key: 'employeeId',
    },
    {
      title: 'Display Name',
      dataIndex: ['delegator', 'displayName'],
      key: 'displayName',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        const isCurrentUser = record.delegator.id === user.id;
        if (!isCurrentUser) {
          return (
            <Button type="primary" onClick={() => switchUser(record.delegator)}>
              Switch User
            </Button>
          );
        }
      },
    }
  ];

  return (
    <div>
      <h2>Delegates (Someone who is chosen to represent me)</h2>
      <p>Only registered users can be found.</p>
      <Input
        placeholder="Search by display name or employee ID"
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
      <h2>Delegators (I can represent to them)</h2>
      <Table
        dataSource={delegators.map((delegator) => ({ ...delegator, key: delegator.delegator.id }))}
        columns={delegatorColumns}
      />
    </div>
  );
};

export default PublisherDelegates;
