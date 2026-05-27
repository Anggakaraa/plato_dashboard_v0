import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import withRouter from "../../../components/Common/withRouter";
import { withTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import * as Yup from "yup";
import { useFormik } from "formik";
import {
  Alert,
  Container,
  Form,
  Input,
  FormFeedback,
  Label,
  Spinner,
} from "reactstrap";
import { loginUser } from "../../../store/actions";
import logo from "../../../assets/images/logo.svg";
import getErrorMessage from "../../../api/error";
import { useUserContext } from "../../../context/user-access.context";
import NeuralNetwork from "./NeuralNetwork";
import "./auth-v2.css";

const LoginV2 = (props) => {
  const { setDecodedToken } = useUserContext();
  document.title = `${props.t("Login")} | ${props.t("Platoscience")}`;

  const dispatch = useDispatch();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email(props.t("Invalid email format"))
        .required(props.t("Please Enter Your Email")),
      password: Yup.string()
        .min(6, props.t("Password must be at least 6 characters"))
        .required(props.t("Please Enter Your Password")),
    }),
    onSubmit: async (values) => {
      setIsAnimating(true);
      dispatch(loginUser(values, props.router.navigate));
      setTimeout(() => setIsAnimating(false), 2000);
    },
  });

  const { loading, error } = useSelector((state) => ({
    loading: state.Login.loading,
    error: state.Login.error,
  }));

  const handleTogglePassword = () => setPasswordVisible((v) => !v);

  useEffect(() => {
    // Add entrance animation
    const timer = setTimeout(() => {
      document.querySelector('.auth-v2-container')?.classList.add('visible');
    }, 100);
    
   
    
    return () => {
      clearTimeout(timer);
     
    };
  }, []);

  return (
    <div className="auth-v2-wrapper">
      {/* Neural Network Animation */}
      <NeuralNetwork />

      {/* Animated Background */}
      <div className="auth-v2-background">
        <div className="gradient-sphere sphere-1"></div>
        <div className="gradient-sphere sphere-2"></div>
        <div className="gradient-sphere sphere-3"></div>
      </div>

      <Container>
        <div className="auth-v2-container">
          {/* Logo and Brand */}
          <div className="auth-v2-brand">
            <div className="logo-wrapper">
              <img src={logo} alt="Platoscience" className="brand-logo" />
            </div>
            <h1 className="brand-title">{props.t("Welcome Back")}</h1>
            <p className="brand-subtitle">
              {props.t("Sign in to continue to your dashboard")}
            </p>
          </div>

          {/* Login Card */}
          <div className="auth-v2-card">
            <div className="card-header-v2">
              <h2>{props.t("Sign In")}</h2>
              <p>{props.t("Enter your credentials to access your account")}</p>
            </div>

            <Form
              className="auth-v2-form"
              onSubmit={(e) => {
                e.preventDefault();
                setDecodedToken(undefined);
                validation.handleSubmit();
                return false;
              }}
            >
              {error && (
                <Alert color="danger" className="auth-v2-alert slide-down">
                  <i className="mdi mdi-alert-circle-outline me-2" />
                  {getErrorMessage(props.t, error)}
                </Alert>
              )}

              {/* Email Input */}
              <div className="form-group-v2">
                <Label className="form-label-v2">
                  <i className="mdi mdi-email-outline me-2" />
                  {props.t("Email Address")}
                </Label>
                <div className="input-wrapper-v2">
                  <Input
                    name="email"
                    type="email"
                    placeholder={props.t("your.email@example.com")}
                    disabled={loading}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.email}
                    className={`input-v2 ${
                      validation.touched.email && validation.errors.email
                        ? "is-invalid"
                        : validation.touched.email
                        ? "is-valid"
                        : ""
                    }`}
                  />
                  {validation.touched.email && !validation.errors.email && (
                    <i className="mdi mdi-check-circle input-icon-success" />
                  )}
                </div>
                {validation.touched.email && validation.errors.email && (
                  <FormFeedback className="error-message-v2" type="invalid" style={{ display: 'block' }}>
                    {validation.errors.email}
                  </FormFeedback>
                )}
              </div>

              {/* Password Input */}
              <div className="form-group-v2">
                <Label className="form-label-v2">
                  <i className="mdi mdi-lock-outline me-2" />
                  {props.t("Password")}
                </Label>
                <div className="input-wrapper-v2 password-wrapper">
                  <Input
                    name="password"
                    type={passwordVisible ? "text" : "password"}
                    placeholder={props.t("Enter your password")}
                    disabled={loading}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.password}
                    className={`input-v2 ${
                      validation.touched.password && validation.errors.password
                        ? "is-invalid"
                        : validation.touched.password
                        ? "is-valid"
                        : ""
                    }`}
                  />
                  <button
                    type="button"
                    className="password-toggle-v2"
                    onClick={handleTogglePassword}
                    disabled={loading}
                  >
                    <i
                      className={`mdi ${
                        passwordVisible ? "mdi-eye-off" : "mdi-eye"
                      }`}
                    />
                  </button>
                </div>
                {validation.touched.password && validation.errors.password && (
                  <FormFeedback className="error-message-v2" type="invalid" style={{ display: 'block' }}>
                    {validation.errors.password}
                  </FormFeedback>
                )}
              </div>

              {/* Forgot Password Link */}
              <div className="form-footer-v2">
                <Link to="/forgot-password" className="forgot-link-v2">
                  {props.t("Forgot your password?")}
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`btn-v2 btn-primary-v2 ${
                  loading || isAnimating ? "loading" : ""
                }`}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    {props.t("Signing in...")}
                  </>
                ) : (
                  <>
                    {props.t("Sign In")}
                    <i className="mdi mdi-arrow-right ms-2" />
                  </>
                )}
              </button>
            </Form>

            {/* Footer */}
            <div className="auth-v2-footer">
              <p className="copyright-text">
                © {new Date().getFullYear()} Platoscience. {props.t("All rights reserved")}.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

LoginV2.propTypes = {
  t: PropTypes.any,
  router: PropTypes.any,
  history: PropTypes.object,
};

export default withRouter(withTranslation()(LoginV2));
