import React, { useEffect, useState, useRef, useMemo } from "react";
import PropTypes from "prop-types";
import {
    Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Row,
} from "reactstrap";
import withRouter from "../../components/Common/withRouter";
import { withTranslation } from "react-i18next";

import Breadcrumbs from "../../components/Common/Breadcrumb";
import axios from "axios";
import CurrentChart from "./currentchart";
import { useNavigate } from "react-router-dom";
import ResistanceChart from "./resistanceChart";
import { t } from "i18next";
import { GoBack } from "../../components/Common/GoBack";

const PlatoReportDetails = (props) => {
  document.title = `${props.t("Patient")} | ${props.t("Reports")}`;
  const guid = props.router.params.session_id;
  
  const [current, setCurrent] = useState([]);
  const [resistance, setResistance] = useState([]);
  const [loading, setLoading] = useState(false);

  const getSessionDetails = async () => {
    setLoading(true);
    const baseurl = (import.meta as any).env.VITE_APP_GATEWAY_URL;
    const [data] = await Promise.all([
        await axios.get(`${baseurl}/session/details/${guid}`)
    ])
    setCurrent( data.data.graphsData.current);
    setResistance( data.data.graphsData.resistance);
    setLoading(false);

  }
  
  const navigate = useNavigate()
  
  useEffect(() => {
    getSessionDetails();
  }, []);
  

  return (
    <React.Fragment>
      
      <div className="page-content">
        <div className="container-fluid">
          <GoBack/>
          <Breadcrumbs
            title={props.t("Patients")}
            breadcrumbItem={props.t(`Session Details`)}
          />
          
          <Card>
              <CardBody>
                  <h4 className="mb-4">Current</h4>
                  {
                      loading ? (
                          <div className="text-center">
                              <div className="spinner-border" role="status">
                              <span className="visually-hidden">Loading...</span>
                              </div>
                          </div>
                        
                      ) : (
                          
                        <div className="row-fluid">
                        <div className="">
                          <div className="row align-items-start">
                            <div className="col-1 fix-width">
                              <div className="col vertical-text">current [mA]</div>
                            </div>
                            <div className="col">
                              <CurrentChart data={current}/>
                            </div>
                          </div>
                        </div>
                        <div className="col text-center">Time [s]</div>
                      </div>
                      )
                  }
                  
              </CardBody>
          </Card>
          <Card>
              <CardBody>
                  <h4 className="text font-bold">Resistance</h4>
                  {
                    loading ? (
                        <div className="text-center">
                            <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                      
                    ) : (
                      <div className="row-fluid">
                        <div className="">
                          <div className="row align-items-start">
                            <div className="col-1 fix-width">
                              <div className="col vertical-text">resitante [kOhm]</div>
                            </div>
                            <div className="col">
                              <ResistanceChart data={resistance}/>
                            </div>
                          </div>
                        </div>
                        <div className="col text-center">Time [s]</div>
                      </div>
                      
                    )
                  }
                  
              </CardBody>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

PlatoReportDetails.propTypes = {
  t: PropTypes.any,
};

export default withRouter(withTranslation()(PlatoReportDetails));
