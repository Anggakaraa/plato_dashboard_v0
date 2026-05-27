import React from "react"
import {version} from '../../../package.json';
import { Container, Row, Col } from "reactstrap"

const Footer = () => {
  return (
    <React.Fragment>
      <footer className="footer">
        <Container fluid={true}>
          <Row>
            <Col md={6}>{version} - {new Date().getFullYear()} ©PlatoScience.</Col>
          </Row>
        </Container>
      </footer>
    </React.Fragment>
  )
}

export default Footer
