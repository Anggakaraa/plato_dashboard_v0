import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { isSuperUser } from '../model/user-type';
import { containsToken, decodeToken, getDecodedToken } from '../storage/token';
import { setFirstAccess, removeFirstAccess, getFirstAccess } from '../storage/session';
import { useDispatch, useSelector } from 'react-redux';

// Create the context
const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  const [decodedToken, setDecodedToken] = useState(getDecodedToken());
  const [user, setUser] = useState(decodedToken?.user);
  const firtAccessToken = useSelector((state) => ({ token: state.Login.token }));

  const isSuperAccess = useCallback(() => {
    if (!decodedToken?.user) return false;
    const role = decodedToken?.user.roles ? JSON.parse(decodedToken?.user.roles) : { type: 'user' };

    return isSuperUser(role.type);
  }, [decodedToken]);

  const isAuthenticated = () => containsToken();
  const isFirstAccess = () => getFirstAccess();

  useEffect(() => {
    if (firtAccessToken?.token) {
      setDecodedToken(decodeToken(firtAccessToken?.token));
      setUser(decodedToken?.user);
    }
  }, [firtAccessToken?.token])

  useEffect(() => {
    setUser(decodedToken?.user);
  }, [decodedToken])

  return (
    <UserContext.Provider
      value={{
        user,
        token: decodedToken,
        isAuthenticated,
        isFirstAccess,
        isSuperAccess,
        setDecodedToken
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUserContext = () => {
  return useContext(UserContext);
};