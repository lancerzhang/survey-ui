import { useContext, useEffect } from 'react';
import UserContext from './UserContext';

const serverDomain = process.env.REACT_APP_SERVER_DOMAIN;

const useFetchMe = () => {
    const { me, setMe } = useContext(UserContext);

    useEffect(() => {
        if (!me) {
            const fetchMe = async () => {
                try {
                    const response = await fetch(`${serverDomain}/oauth2/me`);
                    const data = await response.json();
                    setMe(data);
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
    }, [me, setMe]);

    return me;
};

export default useFetchMe;
