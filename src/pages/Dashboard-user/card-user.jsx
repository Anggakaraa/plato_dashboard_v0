import React, { useEffect, useState } from "react";
import { Row, Col, Card, CardBody } from "reactstrap";

//Import Images
import userImg from "../../assets/images/users/no-user.png";
import platoImg from "../../assets/images/logo.svg";
import { useUser } from "../../hooks/user";
function CardUser(props) {
  const { user, isPlato } = useUser();

  return (
    <React.Fragment>
      <Row>
        <Col lg="12">
          <Card>
            <CardBody>
              <span className="text-success"></span>
              <Row>
                <Col lg="4">
                  <div className="d-flex">
                    <div className="me-3">
                      <img
                        src={isPlato() ? platoImg : userImg}
                        alt=""
                        className="avatar-md rounded-circle img-thumbnail"
                      />
                    </div>
                    <div className="flex-grow-1 align-self-center">
                      <div className="text-muted">
                        <p className="mb-2">
                          {isPlato() ? `Welcome to Plato Dashboard` : ""}
                        </p>
                        <h5 className="mb-1">
                          {user !== undefined ? user.username : ""}
                        </h5>
                        <p className="mb-0">
                          {isPlato() ? "Plato Admin" : "Clinician"}
                        </p>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
}

export default CardUser;
