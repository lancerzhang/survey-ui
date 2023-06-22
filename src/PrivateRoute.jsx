import React from "react";
import useFetchUsers from './useFetchUsers';

const PrivateRoute = ({ component: Component, ...rest }) => {

    const users = useFetchUsers();

    if (!users) {
        return <div>Loading...</div>;
    }

    return (users ? <Component /> : null);
};

export { PrivateRoute };

