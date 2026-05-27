import PropTypes from "prop-types";
import React from "react";
import {
  Row,
  Col,
  Alert,
  Card,
  CardBody,
  Container,
  FormFeedback,
  Input,
  Label,
  Form,
  Spinner,
} from "reactstrap";

import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import withRouter from "../../components/Common/withRouter";
import { withTranslation } from "react-i18next";

import * as Yup from "yup";
import { useFormik } from "formik";

import { forgetPassword, cleanForgetPassword } from "../../store/actions";

import profile from "../../assets/images/profile-img.png";
import logo from "../../assets/images/logo.svg";
import Footer from "./Footer";
import getErrorMessage from "../../api/error";

const ForgetPassword = (props) => {
  document.title = `${props.t("Forget Password")} | ${props.t("Platoscience")}`;

  const dispatch = useDispatch();

  const { success, error, loading } = useSelector((state) => ({
    success: state.ForgetPassword.success,
    error: state.ForgetPassword.error,
    loading: state.ForgetPassword.loading,
  }));

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: { email: undefined },
    validationSchema: Yup.object({
      email: Yup.string().required(props.t("Please Enter Your Email")),
    }),
    onSubmit: (values) => {
      const { email } = values;
      dispatch(forgetPassword(email));
    },
  });

  const showForm = () => {
    return (
      <>
        <Form
          className="form-horizontal"
          onSubmit={(e) => {
            e.preventDefault();
            validation.handleSubmit();
            return false;
          }}
        >
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
          <Row className="mb-3">
            <Col className="text-end">
              <button
                className="btn btn-primary w-md "
                disabled={loading}
                type="submit"
              >
                {props.t("Reset")}
                {loading ? (
                  <div style={{ float: "right" }}>
                    <Spinner size={"sm"} color="light" />
                  </div>
                ) : null}
              </button>
            </Col>
          </Row>
        </Form>
      </>
    );
  };

  const showResult = () => {
    if (success === undefined) return showForm();

    if (success) {
      return (
        <>
          <Alert color="success" style={{ marginTop: "13px" }}>
            {props.t(
              "Reset link are sended to your mailbox, check there first!"
            )}
          </Alert>
          <Row className="mb">
            <Col className="text-end">
              <button
                className="btn btn-primary w-md "
                onClick={() => {
                  dispatch(cleanForgetPassword());
                  props.router.navigate("/login");
                }}
              >
                {props.t("Ok")}
              </button>
            </Col>
          </Row>
        </>
      );
    }

    return (
      <>
        <Alert color="danger" style={{ marginTop: "13px" }}>
          {getErrorMessage(error)}
        </Alert>
      </>
    );
  };

  return (
    <React.Fragment>
      <div className="home-btn d-none d-sm-block">
        <Link to="/" className="text-dark">
          <i className="bx bx-home h2" />
        </Link>
      </div>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="overflow-hidden">
                <div className="bg-primary bg-soft">
                  <Row>
                    <Col xs={7}>
                      <div className="text-primary p-4">
                        <h5 className="text-primary">{props.t("Please!")}</h5>
                        <p>
                          {props.t(
                            "Inform you email to be able to reset your password."
                          )}
                        </p>
                      </div>
                    </Col>
                    <Col className="col-5 align-self-end">
                      <img src={profile} alt="" className="img-fluid" />
                    </Col>
                  </Row>
                </div>
                <CardBody className="pt-0">
                  <div>
                    <Link to="/">
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
                  <div className="p-2">{showResult()}</div>
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                <p>
                  {props.t("Go back to ")}
                  <Link
                    to="/login"
                    disabled={loading}
                    className="font-weight-medium text-primary"
                  >
                    {props.t("Login")}
                  </Link>
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

ForgetPassword.propTypes = {
  t: PropTypes.any,
  router: PropTypes.any,
  history: PropTypes.object,
};

export default withRouter(withTranslation()(ForgetPassword));
