import React from 'react';
import useFetchMe from '../useFetchMe';

const Me = () => {
    const me = useFetchMe();

    if (!me) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <p>Employee ID: {me.employeeId}</p>
            <p>Display Name: {me.displayName}</p>
            <p>Email: {me.email}</p>
        </div>
    );
};

export default Me;
