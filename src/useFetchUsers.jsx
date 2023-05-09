import { useContext, useEffect } from 'react';
import UsersContext from './UsersContext';

const serverDomain = process.env.REACT_APP_SERVER_DOMAIN;

const useFetchMe = () => {
    const { users, setUsers } = useContext(UsersContext);

    useEffect(() => {
        if (!users) {
            const fetchMe = async () => {
                try {
                    const response = await fetch(`${serverDomain}/oauth2/me`);
                    const meData = await response.json();
                    setUsers({ me: meData, user: meData });
                } catch (error) {
                    if (error.response && error.response.status === 401) {
                        window.location.href = `${serverDomain}/oauth2/sso`;
                    } else {
                        console.error('Error fetching user data:', error);
                    }
                }
            };
            fetchMe();
        }
    }, [users, setUsers]);

    return users;
};

export default useFetchMe;
