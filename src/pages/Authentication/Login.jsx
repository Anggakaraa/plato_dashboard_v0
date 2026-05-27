import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import withRouter from "../../components/Common/withRouter";
import { withTranslation } from "react-i18next";

//redux
import { useSelector, useDispatch } from "react-redux";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

import {
  Row,
  Col,
  CardBody,
  Card,
  Alert,
  Container,
  Form,
  Input,
  FormFeedback,
  Label,
  Spinner,
} from "reactstrap";
import Footer from "./Footer";

import { loginUser, clearLoginError } from "../../store/actions";

import profile from "../../assets/images/profile-img.png";
import logo from "../../assets/images/logo.svg";
import getErrorMessage from "../../api/error";
import { useUserContext } from "../../context/user-access.context";

const Login = (props) => {
  const { setDecodedToken } = useUserContext();

  document.title = `${props.t("Login")} | ${props.t("Platoscience")}`;

  const dispatch = useDispatch();

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      email: undefined,
      password: undefined,
    },

    validationSchema: Yup.object({
      email: Yup.string().required("Please Enter Your Email"),
      password: Yup.string().required("Please Enter Your Password"),
    }),

    onSubmit: async (values) => {
      dispatch(loginUser(values, props.router.navigate));
    },
  });

  const { loading, error } = useSelector((state) => ({
    loading: state.Login.loading,
    error: state.Login.error,
  }));

  // Auto-dismiss error after 5 seconds by clearing it from Redux
  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => dispatch(clearLoginError()), 5000);
    return () => clearTimeout(timer);
  }, [error]);

  const [passwordVisible, setPasswordVisible] = useState(false);
  const handleToggle = () => setPasswordVisible((v) => !v);

  return (
    <React.Fragment>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="overflow-hidden">
                <div className="bg-primary bg-soft">
                  <Row>
                    <Col xs={7}>
                      <div className="text-primary p-4">
                        <h5 className="text-primary">
                          {props.t("Welcome Back !")}
                        </h5>
                        <p>{props.t("Sign in to continue at PlatoScience.")}</p>
                      </div>
                    </Col>
                    <Col className="col-5 align-self-end">
                      <img src={profile} alt="" className="img-fluid" />
                    </Col>
                  </Row>
                </div>
                <CardBody className="pt-0">
                  <div>
                    <Link to="/" className="auth-logo-light">
                      <div className="avatar-md profile-user-wid mb-4">
                        <span className="avatar-title rounded-circle bg-light">
                          <img
                            src={logo}
                            alt=""
                            className="rounded-circle"
                            height="34"
                          />
                        </span>
                      </div>
                    </Link>
                  </div>
                  <div className="p-2">
                    <Form
                      className="form-horizontal"
                      onSubmit={(e) => {
                        e.preventDefault();
                        setDecodedToken(undefined);

                        validation.handleSubmit();
                        return false;
                      }}
                    >
                      {error ? (
                        <Alert color="danger" className="mb-3">
                          <i className="mdi mdi-alert-circle me-2" />
                          {getErrorMessage(props.t, error)}
                        </Alert>
                      ) : null}
                      <div className="mb-3">
                        <Label className="form-label">{props.t("Email")}</Label>
                        <Input
                          name="email"
                          className="form-control"
                          placeholder="Enter email"
                          type="email"
                          disabled={loading}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.email || ""}
                          invalid={
                            validation.touched.email && validation.errors.email
                              ? true
                              : false
                          }
                        />
                        {validation.touched.email && validation.errors.email ? (
                          <FormFeedback type="invalid">
                            {validation.errors.email}
                          </FormFeedback>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <Label className="form-label">
                          {props.t("Password")}
                        </Label>
                        <div className="input-group">
                          <Input
                            name="password"
                            value={validation.values.password || ""}
                            type={passwordVisible ? "text" : "password"}
                            disabled={loading}
                            placeholder="Enter Password"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            invalid={
                              validation.touched.password &&
                              validation.errors.password
                                ? true
                                : false
                            }
                          />
                          <span
                            className="input-group-text"
                            onClick={handleToggle}
                            style={{ cursor: "pointer" }}
                          >
                            <i
                              className={
                                passwordVisible
                                  ? "mdi mdi-eye"
                                  : "mdi mdi-eye-off"
                              }
                            />
                          </span>
                        </div>

                        {validation.touched.password &&
                        validation.errors.password ? (
                          <FormFeedback type="invalid">
                            {validation.errors.password}
                          </FormFeedback>
                        ) : null}
                      </div>

                      <div className="mt-3 d-grid">
                        <button
                          disabled={loading}
                          className="btn btn-primary btn-block w-100 d-flex align-items-center justify-content-center gap-2"
                          type="submit"
                        >
                          {loading && <Spinner size="sm" color="light" />}
                          {loading
                            ? props.t("Signing in...")
                            : props.t("Log In")}
                        </button>
                      </div>

                      <div className="mt-4 text-center">
                        <Link
                          disabled={loading}
                          to="/forgot-password"
                          className="text-muted"
                        >
                          <i className="mdi mdi-lock me-1" />
                          {props.t("Forgot your password?")}
                        </Link>
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                <p>
                  {props.t("")}
                  <Link
                    to="/register-contact"
                    disabled={loading}
                    className="fw-medium text-primary"
                  >
                    {" "}
                    {props.t("")}
                  </Link>{" "}
                </p>
                <Footer />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

Login.propTypes = {
  t: PropTypes.any,
  router: PropTypes.any,
  history: PropTypes.object,
};

export default withRouter(withTranslation()(Login));
