import React from 'react';
import useFetchUsers from '../useFetchUsers';

const Me = () => {
    const users = useFetchUsers();

    if (!users) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <p>id: {users.user.id}</p>
            <p>Employee ID: {users.user.employeeId}</p>
            <p>Display Name: {users.user.displayName} {users.user.id !== users.me.id ? '(delegate)' : ''}</p>
            <p>Email: {users.user.email}</p>
        </div>
    );
};

export default Me;
