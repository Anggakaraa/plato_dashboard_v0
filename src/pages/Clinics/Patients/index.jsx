import React, { useEffect, useState, useRef, useMemo } from "react";
import PropTypes from "prop-types";
import {
    Alert,
    Button,
  Card,
  Col,
  Container,
  Input,
  Nav,
  NavItem,
  Offcanvas,
  OffcanvasBody,
  OffcanvasHeader,
  Row,
  Table,
} from "reactstrap";
import withRouter from "../../../components/Common/withRouter";
import { withTranslation } from "react-i18next";
import Rating from "react-rating";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { GoBack } from "../../../components/Common/GoBack";
import classnames from "classnames";
import { useSelector } from "react-redux";
const PatientSummary = (props) => {
    document.title = `${props.t("Patient")} | ${props.t("Reports")}`;
    const guid = props.router.params.clinic_id;

    const [patients, setPatients] = useState([]);
    const [clinicName, setClinicName] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingClassification, setLoadingClassification] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [activePatient, setActivePatient] = useState(-1)
    const [patientClassifications, setPatientClassifications] = useState([])
    const [patient, setPatient] = useState('');
    const [isBottom, setIsBottom] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [searchDefaults, setSeachDefaults] = useState([]);

    const { clinics } = useSelector((state) => state.clinics);
    

    const getPatientsSummary = async () => {
        setLoading(true);
        
        const baseurl = import.meta.env.VITE_APP_GATEWAY_URL;
        const [data] = await Promise.all([
            await axios.get(`${baseurl}/patients/from-clinic/${guid}`)
        ])
        const sortedData = data.data //data.data.sort((a, b) => a.name.localeCompare(b.name));
        setPatients(sortedData);
        setSeachDefaults(sortedData); 
        setLoadingClassification(false);   
        setLoading(false);
        setClinicName(`${sortedData[0].clinic} - Summary`); 
    }

    const setClassifications = async (index) => {
       
        const baseurl = import.meta.env.VITE_APP_GATEWAY_URL;
        const patient = patients[index];
        setPatient(patient);
        if(patient){
            const [data] = await Promise.all([
                await axios.get(`${baseurl}/patients/from-patient/${patient.firebaseId}`)
            ])
            setPatientClassifications(data.data);
        }
        
    }

    useEffect(() => {
        getPatientsSummary();
    }, []);

    useEffect(() => {
        setClassifications(activePatient);
    }, [activePatient]);

   useEffect(() => {
        setPatients(searchResult)
    }, [searchTerm]);

    const toggleBottomCanvas = () => {
        setIsBottom(!isBottom);
    };

    /**
     * 
     * @param {*} date 
     * @returns 
     */
    const parsetime = (date) => {
        const formatedTime = new Date(date*1000).toLocaleString();
        return formatedTime.split(',')[1];
    }

    /**
     * 
     * @param {*} date 
     * @returns 
     */
    const parseDate = (date) => {
        const formatedDate = new Date(date*1000).toLocaleString();
        return formatedDate.split(',')[0];
    }

    /**
     * 
     * @param {*} event 
     */
    const searchByName = (event) => {
        const currentInput = event.target.value;
        setSearchTerm(currentInput); 
        if (currentInput.trim().length) {
            const result = patients.filter(patient =>
                patient.name.toLowerCase().includes(currentInput.toLowerCase())
            );
            setSearchResult(result); 
        } else {
            setSearchResult(searchDefaults);
        }
    };


    return (
    <React.Fragment>
        <div className="page-content">
        <Container fluid>
            <Breadcrumbs title="Patients" breadcrumbItem={clinicName}/>
            <Row>
            <Col  xs="12">
                <Card className="email-leftbar patient-list-content">
                <Alert type="" color="primary" >Patients</Alert>
                <Input type="text" className="form-control mb-2" placeholder="Search by name" value={searchTerm} onChange={searchByName} />
                <div className="mail-list">
                    <Nav tabs className="nav-tabs-custom" vertical role="tablist">
                    {
                        loading ? (
                            <div className="text-center mt-10 mb-10">
                                <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        
                        ) : (
                        <>
                        {patients.length > 0 ? (
                          patients.map((patient, index) => (
                            <NavItem 
                            className={classnames('patient-item mb-2', { 'active-background': activePatient === index })}
                            key={patient.guid}>
                              <NavLink
                                className={classnames({
                                  active: activeTab === index,
                                })}
                                onClick={() => {
                                  setActiveTab(index);
                                  setActivePatient(index);
                                }}
                              >
                                <span className="fix-text-blue">{patient.name}</span>
                              </NavLink>
                            </NavItem>
                          ))
                        ) : (
                          <NavItem>
                            <Alert color="info">No patients available</Alert>
                          </NavItem>
                        )}
                        </>
                    )
                }
                    </Nav>
                </div>
                <GoBack className="pt-10"/>
                </Card>
                <div className="email-rightbar mb-3">
                    { patient && patient.name  ? (
                        <Alert color="primary"><h4 className="text-muted">Showing classifications for {patient.name}</h4></Alert>
                    ) : (
                        <Alert color="secondary"><h4 className="text-muted">Classifications</h4></Alert>
                    )}
                    <div className="table-responsive">
                        <Table className="table">
                            <thead className="table-light">
                            <tr>
                                <th>#</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Mode</th>
                                <th>kΩ</th>
                                <th>mA</th>
                                <th>Minutes</th>
                                <th>Classification</th>
                                <th>Rating</th>
                                <th className="hidden">Details</th>
                            </tr>
                            </thead>
                            <tbody>
                                
                            {patientClassifications && patientClassifications.length > 0 ? (
                                patientClassifications.map((classification, index) => (
                                    <tr key={index} className="table-item-hover">
                                        <th scope="row">{index + 1}</th>
                                        <td>{parseDate(classification.created_at)}</td>
                                        <td>{parsetime(classification.created_at)}</td>
                                        <td>{classification.session_name}</td>
                                        <td>{classification.analysis.resistance_median}</td>
                                        <td>{classification.analysis.current_median}</td>
                                        <td>{parseInt(classification.analysis.time_duration / 60)}</td>
                                        <td>
                                            <Rating
                                                stop={5}
                                                emptySymbol="mdi mdi-star-outline text-primary "
                                                fullSymbol="mdi mdi-star text-success"
                                                className="rating-symbol-background"
                                                initialRating={classification.analysis.classification}
                                                readonly
                                            />
                                        </td>
                                        <td>
                                            <Rating
                                                stop={5}
                                                emptySymbol="mdi mdi-star-outline text-primary "
                                                fullSymbol="mdi mdi-star text-warning "
                                                className="rating-symbol-background"
                                                initialRating={classification.post_rating.rating}
                                                readonly
                                            />
                                        </td>
                                    
                                    </tr>
                                ))
                            ) : (
                        
                            <tr>
                                <td colSpan="10"> 
                                    <>
                                    <Alert color="info" >No classifications available</Alert>
                                    </>
                                </td>
                            </tr>
                            )}
                            </tbody>
                        </Table>
                    </div>
                    <Offcanvas
                        isOpen={isBottom}
                        direction="bottom"
                        toggle={toggleBottomCanvas}>
                        <OffcanvasHeader toggle={toggleBottomCanvas}>
                            Offcanvas Bottom
                        </OffcanvasHeader>
                        <OffcanvasBody className="pop-bottom">
                           
                        </OffcanvasBody>
                    </Offcanvas>
                </div>
            </Col>
            </Row>
            </Container>
            </div>
    </React.Fragment>
    );
};

PatientSummary.propTypes = {
    t: PropTypes.any,
};

export default withRouter(withTranslation()(PatientSummary));
