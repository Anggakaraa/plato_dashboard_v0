import { useState, useEffect, useMemo } from 'react';
import { isClinicianUser, isPlatoUser, isSuperUser } from '../model/user-type';
import { containsToken, decodeToken, getDecodedToken } from '../storage/token';
import { setFirstAccess, removeFirstAccess, getFirstAccess } from '../storage/session';
import { useDispatch, useSelector } from 'react-redux';
import { checkClinicianAdmin } from '../store/users/actions';

export function useUser() {
  const dispatch = useDispatch();
  
  const { isClinicianAdmin } = useSelector((state) => ({ isClinicianAdmin: state.users.is_admin }));

  // Subscreve ao token do Redux para reagir a novos logins sem precisar de F5.
  // state.Login.token é o token raw (string JWT) gravado no reducer em LOGIN_SUCCESS.
  const loginToken = useSelector((state) => state.Login.token);

  // Recomputa decodedToken de forma reativa: usa o token do Redux se disponível,
  // caso contrário faz fallback ao localStorage (sessões já existentes na carga inicial).
  const decodedToken = useMemo(
    () => (loginToken ? decodeToken(loginToken) : getDecodedToken()),
    [loginToken]
  );

  const [user, setUser] = useState(() => decodedToken?.user ?? undefined);

  useEffect(() => {
    if (decodedToken) {
      const _user = decodedToken.user;
      setUser(_user);
      if (isClinicianUser(_user?.type) && !isFirstAccess()) {
        dispatch(checkClinicianAdmin());
      }
    }
  }, [decodedToken]);

  const isPlato = () => {
    const currentUser = user || decodedToken?.user;
    if (!currentUser) return false;
    return isPlatoUser(currentUser.type);
  }

  const isClinician = () => {
    const currentUser = user || decodedToken?.user;
    if (!currentUser) return false;
    return isClinicianUser(currentUser.type);
  }

  const isAuthenticated = () => containsToken();
  const isFirstAccess = () => getFirstAccess();

  return {
    user,
    isClinicianAdmin,
    token: decodedToken,
    isAuthenticated,
    isFirstAccess,
    isPlato,
    isClinician
  };
}

