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
import { createPassword } from "../../../store/actions";
import logo from "../../../assets/images/logo.svg";
import NeuralNetwork from "./NeuralNetwork";
import "./auth-v2.css";

const CreatePasswordV2 = (props) => {
  document.title = `${props.t("Create Password")} | ${props.t("Platoscience")}`;

  const dispatch = useDispatch();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const { error, loading } = useSelector((state) => ({
    error: state.CreatePassword.error,
    loading: state.CreatePassword.loading,
  }));

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 10;
    return Math.min(strength, 100);
  };

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(6, props.t("Password must be at least 6 characters"))
        .required(props.t("Please Enter Your Password")),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], props.t("Passwords must match"))
        .required(props.t("Please confirm your password")),
    }),
    onSubmit: async (values) => {
      dispatch(createPassword(values, props.router.navigate));
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      document.querySelector('.auth-v2-container')?.classList.add('visible');
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (validation.values.password) {
      setPasswordStrength(calculatePasswordStrength(validation.values.password));
    }
  }, [validation.values.password]);

  const getStrengthLabel = () => {
    if (passwordStrength < 30) return { label: props.t("Weak"), color: "#ef4444" };
    if (passwordStrength < 60) return { label: props.t("Fair"), color: "#f59e0b" };
    if (passwordStrength < 80) return { label: props.t("Good"), color: "#3b82f6" };
    return { label: props.t("Strong"), color: "#10b981" };
  };

  const passwordsMatch = validation.values.password === validation.values.confirmPassword;
  const isFormValid = validation.values.password && validation.values.confirmPassword && passwordsMatch;

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
          <div className="auth-v2-brand">
            <div className="logo-wrapper">
              <img src={logo} alt="Platoscience" className="brand-logo" />
            </div>
            <h1 className="brand-title">{props.t("Welcome!")}</h1>
            <p className="brand-subtitle">
              {props.t("Create your password to get started")}
            </p>
          </div>

          <div className="auth-v2-card">
            <div className="card-header-v2">
              <h2>{props.t("First Access")}</h2>
              <p>{props.t("Set up your secure password to access your account")}</p>
            </div>

            <Form
              className="auth-v2-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (isFormValid) {
                  validation.handleSubmit();
                }
                return false;
              }}
            >
              {error && (
                <Alert color="danger" className="auth-v2-alert slide-down">
                  <i className="mdi mdi-alert-circle-outline me-2" />
                  {error}
                </Alert>
              )}

              <div className="form-group-v2">
                <Label className="form-label-v2">
                  <i className="mdi mdi-lock-outline me-2" />
                  {props.t("Password")}
                </Label>
                <div className="input-wrapper-v2 password-wrapper">
                  <Input
                    name="password"
                    type={passwordVisible ? "text" : "password"}
                    placeholder={props.t("Create a strong password")}
                    disabled={loading}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.password}
                    className={`input-v2 ${
                      validation.touched.password && validation.errors.password
                        ? "is-invalid"
                        : ""
                    }`}
                  />
                  <button
                    type="button"
                    className="password-toggle-v2"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    disabled={loading}
                  >
                    <i className={`mdi ${passwordVisible ? "mdi-eye-off" : "mdi-eye"}`} />
                  </button>
                </div>
                {validation.touched.password && validation.errors.password && (
                  <FormFeedback className="error-message-v2" type="invalid" style={{ display: 'block' }}>
                    {validation.errors.password}
                  </FormFeedback>
                )}
                
                {validation.values.password && (
                  <div className="password-strength-v2">
                    <div className="strength-bar">
                      <div
                        className="strength-fill"
                        style={{
                          width: `${passwordStrength}%`,
                          backgroundColor: getStrengthLabel().color,
                        }}
                      />
                    </div>
                    <span className="strength-label" style={{ color: getStrengthLabel().color }}>
                      {getStrengthLabel().label}
                    </span>
                  </div>
                )}

                <div className="password-requirements">
                  <p className="requirements-title">{props.t("Password must contain:")}</p>
                  <ul className="requirements-list">
                    <li className={validation.values.password.length >= 6 ? "valid" : ""}>
                      <i className={`mdi ${validation.values.password.length >= 6 ? "mdi-check-circle" : "mdi-circle-outline"}`} />
                      {props.t("At least 6 characters")}
                    </li>
                    <li className={/[A-Z]/.test(validation.values.password) && /[a-z]/.test(validation.values.password) ? "valid" : ""}>
                      <i className={`mdi ${/[A-Z]/.test(validation.values.password) && /[a-z]/.test(validation.values.password) ? "mdi-check-circle" : "mdi-circle-outline"}`} />
                      {props.t("Upper & lowercase letters")}
                    </li>
                    <li className={/[0-9]/.test(validation.values.password) ? "valid" : ""}>
                      <i className={`mdi ${/[0-9]/.test(validation.values.password) ? "mdi-check-circle" : "mdi-circle-outline"}`} />
                      {props.t("At least one number")}
                    </li>
                  </ul>
                </div>
              </div>

              <div className="form-group-v2">
                <Label className="form-label-v2">
                  <i className="mdi mdi-lock-check-outline me-2" />
                  {props.t("Confirm Password")}
                </Label>
                <div className="input-wrapper-v2 password-wrapper">
                  <Input
                    name="confirmPassword"
                    type={confirmPasswordVisible ? "text" : "password"}
                    placeholder={props.t("Confirm your password")}
                    disabled={loading}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.confirmPassword}
                    className={`input-v2 ${
                      validation.touched.confirmPassword && validation.errors.confirmPassword
                        ? "is-invalid"
                        : validation.touched.confirmPassword && passwordsMatch
                        ? "is-valid"
                        : ""
                    }`}
                  />
                  <button
                    type="button"
                    className="password-toggle-v2"
                    onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                    disabled={loading}
                  >
                    <i className={`mdi ${confirmPasswordVisible ? "mdi-eye-off" : "mdi-eye"}`} />
                  </button>
                  {validation.touched.confirmPassword && passwordsMatch && (
                    <i className="mdi mdi-check-circle input-icon-success" />
                  )}
                </div>
                {validation.touched.confirmPassword && validation.errors.confirmPassword && (
                  <FormFeedback className="error-message-v2" type="invalid" style={{ display: 'block' }}>
                    {validation.errors.confirmPassword}
                  </FormFeedback>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !isFormValid}
                className={`btn-v2 btn-primary-v2 ${loading ? "loading" : ""}`}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    {props.t("Creating...")}
                  </>
                ) : (
                  <>
                    {props.t("Create Password")}
                    <i className="mdi mdi-arrow-right ms-2" />
                  </>
                )}
              </button>
            </Form>

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

CreatePasswordV2.propTypes = {
  t: PropTypes.any,
  router: PropTypes.any,
  history: PropTypes.object,
};

export default withRouter(withTranslation()(CreatePasswordV2));
