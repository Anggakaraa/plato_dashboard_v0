/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import withRouter from "../../components/Common/withRouter";

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
  Spinner
} from "reactstrap";

// actions
import { cleanResetPassword, resetPassword } from "../../store/actions";

import profileImg from "../../assets/images/profile-img.png";
import logoImg from "../../assets/images/logo.svg";
import Footer from "./Footer";
import { withTranslation } from "react-i18next";

const ResetPassword = (props) => {
  document.title = "Change Password | Platoscience";
  const dispatch = useDispatch();

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string().required(props.t("Please Enter Your Password")).min(6, props.t("Password must be contain 6 characters at least.")),
      confirmPassword: Yup.string().required(props.t("Please Enter Your Password Confirmation")).min(6, props.t("Password must be contain 6 characters at least.")),
    }),
    onSubmit: async (values) => {
      if(props.router.location.search) {
          const param = new URLSearchParams(props.router.location.search)
          const token = param.get('access-token')
          const { password } = values
          dispatch(resetPassword(token, password, props.router.navigate));
          
      }
    },
    validate: async(values) => {
      setConfirmed(values.password === values.confirmPassword);
    }
  });

  const [confirmed, setConfirmed] = useState(false);

  const error = useSelector((state) => (state.ResetPassword.error));
  const loading = useSelector((state) => (state.ResetPassword.loading));
  const success = useSelector((state) => (state.ResetPassword.success));

  const [password, setPassword] = useState("");
  const [type, setType] = useState('password');
  const [typeConfirm, setTypeConfirm] = useState('password');
  const [icon, setIcon] = useState('mdi mdi-eye-off');
  const [iconConfirm, setIconConfirm] = useState('mdi mdi-eye-off');

  const handleToggle = () => {
    if (type==='password'){
       setIcon('mdi mdi-eye');
       setType('text')
    } else {
       setIcon('mdi mdi-eye-off')
       setType('password')
    }
 }

 const handleToggleConfirm = () => {
  if (typeConfirm==='password'){
     setIconConfirm('mdi mdi-eye');
     setTypeConfirm('text')
  } else {
     setIconConfirm('mdi mdi-eye-off')
     setTypeConfirm('password')
  }
}

  useEffect(()  => {
    if(success) setTimeout(() => {
      props.router.navigate('/login')
    }, 6000)
  }, [success])


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
                        <h5 className="text-primary">{props.t('Change Password!')}</h5>
                        <p>{props.t('Please set a new password.')}</p>
                      </div>
                    </Col>
                    <Col className="col-5 align-self-end">
                      <img src={profileImg} alt="" className="img-fluid" />
                    </Col>
                  </Row>
                </div>
                <CardBody className="pt-0">
                  <div>
                    <Link to="/" className="auth-logo-light">
                      <div className="avatar-md profile-user-wid mb-4">
                        <span className="avatar-title rounded-circle bg-light">
                          <img
                            src={logoImg}
                            alt=""
                            className="rounded-circle"
                            height="34"
                          />
                        </span>
                      </div>
                    </Link>
                  </div>
                  <div className="p-2">
                    { !success ? 
                    <Form
                      className="form-horizontal"
                      onSubmit={(e) => {
                        if (confirmed) {
                          e.preventDefault();
                          validation.handleSubmit();
                          return false;
                        }

                        e.preventDefault();
                      }}
                    >
                      {error ? <Alert color="danger">{error}</Alert> : null}

                      <div className="mb-3">
                        <Label className="form-label">{props.t("New Password")}</Label>
                        <div className="input-group">
                          <Input
                            name="password"
                            value={validation.values.password || ""}
                            type={type}
                            placeholder={props.t("type your new Password")}
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            invalid={
                              validation.touched.password &&
                              validation.errors.password
                                ? true
                                : false
                            }
                          />
                          <span className="input-group-text" onClick={handleToggle}>
                              {/*<Icon class="absolute mr-10" icon={icon} size={25}/>*/}
                              <i className={icon}  />
                          </span>
                        </div>
                        {validation.touched.password &&
                        validation.errors.password ? (
                          <FormFeedback type="invalid">
                            {validation.errors.password}
                          </FormFeedback>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <Label className="form-label">{props.t("Confirm the New Password")}</Label>
                        <div className="input-group">
                          <Input
                            name="confirmPassword"
                            value={validation.values.confirmPassword || ""}
                            type={typeConfirm}
                            placeholder={props.t("type you new Password to confirm")}
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            invalid={
                              validation.touched.confirmPassword &&
                              validation.errors.confirmPassword
                                ? true
                                : false
                            }
                          />
                        <span className="input-group-text" onClick={handleToggleConfirm}>
                              {/*<Icon class="absolute mr-10" icon={icon} size={25}/>*/}
                              <i className={iconConfirm}  />
                          </span>
                        </div>
                        {validation.touched.confirmPassword &&
                        validation.errors.confirmPassword ? (
                          <FormFeedback type="invalid">
                            {validation.errors.confirmPassword}
                          </FormFeedback>
                        ) : null}
                      </div>

                      <div className="mt-3 d-grid">
                        <button
                          className="btn btn-primary btn-block"
                          disabled={!confirmed}
                          type="submit"
                          onClick={() => {
                            dispatch(cleanResetPassword());
                          }}
                        >
                          
                          { props.t("Change the password") }
                          {loading ? (
                          <div style={{ float: "right" }}>
                            <Spinner size={"sm"} color="light" />
                          </div>
                        ) : null}
                        </button>
                      </div>

                    </Form>
                    : 
                    <Alert color="success" style={{ marginTop: "13px" }}>
                      {props.t(
                        "Your password has been updated successfully!"
                      )}
                    </Alert>
                    }
                  </div>
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                <Footer/>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withRouter(withTranslation()(ResetPassword));

ResetPassword.propTypes = {
  history: PropTypes.object,
  t: PropTypes.any,
};
