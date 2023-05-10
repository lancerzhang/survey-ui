import React from "react";
import { Route } from "react-router-dom";
import useFetchUsers from './useFetchUsers';

const PrivateRoute = ({ component: Component, ...rest }) => {

    const users = useFetchUsers();

    if (!users) {
        return <div>Loading...</div>;
    }

    return (
        <Route   {...rest} render={(props) => <Component {...props} />}
        />
    );
};

export default PrivateRoute;
