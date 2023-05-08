import React from "react";
import { Route } from "react-router-dom";
import useFetchMe from './useFetchMe';

const PrivateRoute = ({ component: Component, ...rest }) => {

    const me = useFetchMe();

    if (!me) {
        return <div>Loading...</div>;
    }

    return (
        <Route   {...rest} render={(props) => <Component {...props} />}
        />
    );
};

export default PrivateRoute;
