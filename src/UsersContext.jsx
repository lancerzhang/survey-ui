import { createContext } from 'react';

const UsersContext = createContext({
    users: null,
    setUsers: () => { },
});

export default UsersContext;
