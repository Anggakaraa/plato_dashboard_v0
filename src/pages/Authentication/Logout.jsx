import React, { useEffect } from "react";
import PropTypes from "prop-types";
import withRouter from "../../components/Common/withRouter";
import { logoutUser } from "../../store/actions";

//redux
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeToken } from "../../storage/token";
import { useUserContext } from "../../context/user-access.context";

const Logout = () => {
  const history = useNavigate();
  const dispatch = useDispatch();
  const {setDecodedToken} = useUserContext();
  
  useEffect(() => {
    dispatch(logoutUser(history));
    removeToken();
    setDecodedToken(null);
  }, [dispatch, history]);

  return <></>;
};

Logout.propTypes = {
  history: PropTypes.object,
};

export default withRouter(Logout);
