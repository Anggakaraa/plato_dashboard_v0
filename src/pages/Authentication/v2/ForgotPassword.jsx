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
import { forgetPassword, cleanForgetPassword } from "../../../store/actions";
import logo from "../../../assets/images/logo.svg";
import getErrorMessage from "../../../api/error";
import NeuralNetwork from "./NeuralNetwork";
import "./auth-v2.css";

const ForgotPassword = (props) => {
  document.title = `${props.t("Forgot Password")} | ${props.t("Platoscience")}`;

  const dispatch = useDispatch();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { success, error, loading } = useSelector((state) => ({
    success: state.ForgetPassword.success,
    error: state.ForgetPassword.error,
    loading: state.ForgetPassword.loading,
  }));

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: { email: "" },
    validationSchema: Yup.object({
      email: Yup.string()
        .email(props.t("Invalid email format"))
        .required(props.t("Please Enter Your Email")),
    }),
    onSubmit: (values) => {
      setIsSubmitted(true);
      dispatch(forgetPassword(values.email));
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      document.querySelector('.auth-v2-container')?.classList.add('visible');
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleBackToLogin = () => {
    dispatch(cleanForgetPassword());
    props.router.navigate("/login");
  };

  return (
    <div className="auth-v2-wrapper">
      {/* Neural Network Animation */}
      <NeuralNetwork />

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
            <h1 className="brand-title">{props.t("Forgot Password?")}</h1>
            <p className="brand-subtitle">
              {props.t("No worries, we'll send you reset instructions")}
            </p>
          </div>

          <div className="auth-v2-card">
            {success ? (
              <div className="success-state">
                <div className="success-icon">
                  <i className="mdi mdi-check-circle" />
                </div>
                <h3 className="success-title">{props.t("Check your email")}</h3>
                <p className="success-message">
                  {props.t("We've sent password reset instructions to your email address.")}
                </p>
                <button
                  type="button"
                  className="btn-v2 btn-primary-v2"
                  onClick={handleBackToLogin}
                >
                  <i className="mdi mdi-arrow-left me-2" />
                  {props.t("Back to Login")}
                </button>
              </div>
            ) : (
              <>
                <div className="card-header-v2">
                  <h2>{props.t("Reset Password")}</h2>
                  <p>{props.t("Enter your email and we'll send you a reset link")}</p>
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
                      {getErrorMessage(props.t, error)}
                    </Alert>
                  )}

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

                  <button
                    type="submit"
                    disabled={loading}
                    className={`btn-v2 btn-primary-v2 ${loading ? "loading" : ""}`}
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        {props.t("Sending...")}
                      </>
                    ) : (
                      <>
                        {props.t("Send Reset Link")}
                        <i className="mdi mdi-send ms-2" />
                      </>
                    )}
                  </button>

                  <div className="text-center mt-4">
                    <Link to="/login" className="back-link-v2">
                      <i className="mdi mdi-arrow-left me-2" />
                      {props.t("Back to Login")}
                    </Link>
                  </div>
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

ForgotPassword.propTypes = {
  t: PropTypes.any,
  router: PropTypes.any,
  history: PropTypes.object,
};

export default withRouter(withTranslation()(ForgotPassword));
