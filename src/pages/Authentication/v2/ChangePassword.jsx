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
import { resetPassword, resetPasswordError } from "../../../store/actions";
import logo from "../../../assets/images/logo.svg";
import NeuralNetwork from "./NeuralNetwork";
import "./auth-v2.css";

const ChangePasswordV2 = (props) => {
  document.title = `${props.t("Change Password")} | ${props.t("Platoscience")}`;

  const dispatch = useDispatch();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const { error, loading, success } = useSelector((state) => ({
    error: state.ResetPassword.error,
    loading: state.ResetPassword.loading,
    success: state.ResetPassword.success,
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
      const param = new URLSearchParams(props.router.location.search);
      const token = param.get("access-token");
      if (token) {
        dispatch(resetPassword(token, values.password, props.router.navigate));
      } else {
        dispatch(resetPasswordError(props.t("Invalid or expired reset link. Please request a new password reset.")));
      }
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      document.querySelector('.auth-v2-container')?.classList.add('visible');
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        props.router.navigate("/login");
      }, 3000);
    }
  }, [success, props.router]);

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
            <h1 className="brand-title">{props.t("Change Password")}</h1>
            <p className="brand-subtitle">
              {props.t("Create a strong and secure password")}
            </p>
          </div>

          <div className="auth-v2-card">
            {success ? (
              <div className="success-state">
                <div className="success-icon">
                  <i className="mdi mdi-check-circle" />
                </div>
                <h3 className="success-title">{props.t("Password Changed!")}</h3>
                <p className="success-message">
                  {props.t("Your password has been successfully updated. Redirecting to login...")}
                </p>
              </div>
            ) : (
              <>
                <div className="card-header-v2">
                  <h2>{props.t("Set New Password")}</h2>
                  <p>{props.t("Your new password must be different from previous passwords")}</p>
                </div>

                <Form
                  className="auth-v2-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    validation.handleSubmit();
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
                      {props.t("New Password")}
                    </Label>
                    <div className="input-wrapper-v2 password-wrapper">
                      <Input
                        name="password"
                        type={passwordVisible ? "text" : "password"}
                        placeholder={props.t("Enter new password")}
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
                        placeholder={props.t("Confirm new password")}
                        disabled={loading}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.confirmPassword}
                        className={`input-v2 ${
                          validation.touched.confirmPassword && validation.errors.confirmPassword
                            ? "is-invalid"
                            : validation.touched.confirmPassword &&
                              validation.values.password === validation.values.confirmPassword
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
                    </div>
                    {validation.touched.confirmPassword && validation.errors.confirmPassword && (
                      <FormFeedback className="error-message-v2" type="invalid" style={{ display: 'block' }}>
                        {validation.errors.confirmPassword}
                      </FormFeedback>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`btn-v2 btn-primary-v2 ${loading ? "loading" : ""}`}
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        {props.t("Changing...")}
                      </>
                    ) : (
                      <>
                        {props.t("Change Password")}
                        <i className="mdi mdi-check ms-2" />
                      </>
                    )}
                  </button>
                </Form>
              </>
            )}

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

ChangePasswordV2.propTypes = {
  t: PropTypes.any,
  router: PropTypes.any,
  history: PropTypes.object,
};

export default withRouter(withTranslation()(ChangePasswordV2));
