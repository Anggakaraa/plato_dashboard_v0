import PropTypes from "prop-types"
import React, { useEffect } from "react"
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
} from "reactstrap"

import { getLiveStimulations } from "../../store/stimulations/actions";
import { useDispatch, useSelector } from "react-redux";
let event_list = []
const Activity = () => {

  const dispatch = useDispatch();
  const { live_events } = useSelector((state) => ({
    live_events: state.stimulations.live_events,
  }));

  useEffect(() => {
    dispatch(getLiveStimulations());
    const intervalId = setInterval(() => {
      dispatch(getLiveStimulations());
    }, 5000); 
    return () => clearInterval(intervalId);
  }, [dispatch]);
  

  return (
    <React.Fragment>
      <div className="page">
        <Container fluid>
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <h4 className="card-title mb-4">Live Sessions ({live_events.length}) <span className="text-success"></span></h4>
                  <div className="table-responsive">
                    <table className="table table-nowrap align-middle mb-0">
                     <thead>
                      <tr>
                        <th></th>
                        <th>User ID</th>
                        <th>Session ID</th>
                        <th>Started At</th>
                        <th>App Version</th>
                        <th>Session Name</th>
                        <th>Device</th>
                        <th>Smartphone</th>
                      </tr>
                     </thead>
                      <tbody>
                      
                      { live_events.map((event, key) => (
                        <tr key={key}>
                          <td>
                            <div className="event-timeline-dot">
                              <i className="bx bx-pulse font-size-24 text-success bx-fade-right"></i>
                            </div>
                          </td>
                          <td>
                            {event?.user_id}
                          </td>
                          <td>
                            {event?.session_id}
                          </td>
                          <td>
                            {event?.created_at}
                          </td>
                          <td>
                            <h5 className="text-truncate font-size-14 m-0">
                            {event?.app_version}
                            </h5>
                          </td>
                          <td>
                          {event?.session_name}
                          </td>
                          <td>
                          {event?.device_id}
                          </td>
                          <td>
                          {event?.smartphone}
                          </td>
                        </tr>
                      ))}
                      </tbody>
                    </table>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}
Activity.propTypes = {
  events: PropTypes.array,
}

export default Activity
