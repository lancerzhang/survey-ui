import { createContext } from 'react';

const UserContext = createContext({
    me: null,
    setMe: () => { },
});

export default UserContext;
