import React, { useEffect, useState, useRef, useMemo } from "react";
import PropTypes from "prop-types";
import { Link, NavLink } from "react-router-dom";
import LocalTableContainer from "../../components/Common/LocalTableContainer";
import {
    Card,
    CardBody,
    Col,
    Container,
    Row,
    Modal,
    ModalHeader,
    ModalBody,
    Label,
    FormFeedback,
    UncontrolledTooltip,
    Input,
    Form,
    Spinner,
    Table,
    Alert,
    Nav,
    NavItem,
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import { withTranslation } from "react-i18next";

import Breadcrumbs from "../../components/Common/Breadcrumb";
import DisableItemModal from "../../components/Common/DisableItemModal";
import EnableItemModal from "../../components/Common/EnableItemModal";
import withRouter from "../../components/Common/withRouter";

import {
    addClinic,
    getClinics,
    disableClinic,
    enableClinic,
    updateClinic,
} from "../../store/clinics/actions";
import {
    clearClinicians,
    getCliniciansByClinic,
} from "../../store/users/actions";
import {
    getClinicStimulations,
    clearClinicStimulations,
} from "../../store/stimulations/actions";
import { useSelector, useDispatch } from "react-redux";
import { getClinicCountries } from "../../util/countries";
import { Country, CreateAt, Email, Name, UpdatedAt } from "../Clinics/clinic-item-list";
import { get } from "../../api/manager";
import axios from "axios";
import classnames from "classnames";
import { use } from "react";

const Treatments = (props) => {
    document.title = `${props.t("Clinics")} | ${props.t("Platoscience")}`;

    const dispatch = useDispatch();
    const [clinic, setClinic] = useState(undefined);
    const [modal, setModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [isLoading, setIsLoading] = useState('hidden');
    const [patients, setPatients] = useState([]);

    const { clinics, loading } = useSelector((state) => ({
        clinics: state.clinics.clinics,
        loading: state.clinics.loading,
    }));
    const NO_CLINIC = props.t("THERE IS NO CLINIC!");
    const NO_CLINICIAN = props.t("THERE IS NO CLINICIAN!");

    const isValidClinic = (value) => value !== NO_CLINIC;
    const [selectedStimulations, setSelectedStimulations] = useState([]);
    const { clinic_stimulations, loadingStimulations, errorStimulations } =
        useSelector((state) => ({
            clinic_stimulations: state.stimulations.clinic_stimulations,
            loadingStimulations: state.stimulations.loading,
            errorStimulations: state.stimulations.error,
        })
        );

    const [selectedClinic, setSelectedClinic] = useState(undefined);
    const [selectedClinician, setSelectedClinician] = useState(undefined);

    const { clinician_users, loadingClinicians, errorClinicians } = useSelector(
        (state) => ({
            clinician_users: state.users.clinician_users,
            loadingClinicians: state.users.loading,
            errorClinicians: state.users.error,
        })
    );
    const [activeTab, setActiveTab] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [searchDefaults, setSeachDefaults] = useState([]);
    const [activePatient, setActivePatient] = useState(-1)
    const [selectedPatient, setSelectedPatient] = useState([])
    const [canAddTreatment, setCanAddTreatment] = useState(false);
    const [isShamState, setShamState] = useState(false)
    const [shamList, setShamList] = useState([])
    const [slideList, setSlideList] = useState([])
    const [allowUpdateCurrentState, setAllowUpdateCurrentState] = useState(false)
    const [oneSessionByDayState, setOneSessionByDayState] = useState(false)

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

    const addSelectedPatient = (patient) => {
        const check = selectedPatient.some(selected => selected === patient.guid);
        if (check) {
            setSelectedPatient(selectedPatient.filter(selected => selected !== patient.guid));
        } else {
            setSelectedPatient([...selectedPatient, patient.guid]);
        }
        console.log(selectedPatient)
    }

    const setForSham = (guid, isChecked, current) => {
        const slideSwitch = document.getElementById(`slideSwitch-${guid}`)
        if (isChecked) {
            if (slideSwitch) {
                slideSwitch.disabled = true
                slideSwitch.checked = false
                setForSlide(guid, false)
            }
        } else {
            if (slideSwitch && current === 120) {
                slideSwitch.disabled = false
            }
        }
        const localShamList = [...shamList]
        const previous = shamList.find((value) => value === guid);
        if (isChecked) {
            if (!previous) {
                localShamList.push(guid)
                setShamList(localShamList)
            }
        } else {
            if (previous) {
                const index = localShamList.indexOf(guid)
                localShamList.splice(index, 1)
                setShamList(localShamList)
            }
        }
    }

    /**
   * Function to set the slide value for the selected stimulation
   * @param {*} guid 
   * @param {*} isChecked 
   */
    const setForSlide = (guid, isChecked) => {
        const localSlideList = [...slideList]
        const previous = slideList.find((value) => value === guid);
        if (isChecked) {
            if (!previous) {
                localSlideList.push(guid)
                setSlideList(localSlideList)
            }
        } else {
            if (previous) {
                const index = localSlideList.indexOf(guid)
                localSlideList.splice(index, 1)
                setSlideList(localSlideList)
            }
        }
    }

    const getPatientsSummary = async (guid) => {

        const baseurl = import.meta.env.VITE_APP_GATEWAY_URL;
        const [data] = await Promise.all([
            await axios.get(`${baseurl}/patients/from-clinic/${guid}`)
        ])
        const sortedData = data.data //data.data.sort((a, b) => a.name.localeCompare(b.name));
        setPatients(sortedData);
        setSeachDefaults(sortedData);
    }

    const checkSignifier = async (signifier) => {
        const baseurl = import.meta.env.VITE_APP_API_URL;
        const [data] = await Promise.all([
            await get(`${baseurl}/plato/clinic/signifier?signifier=${signifier}`, true, {}),
        ])
        return data;
    }

    const getClinicsLabels = () => {
        return (
            <>
                {clinics.length > 0 ? (
                    clinics.map((clinic) => (
                        <option
                            key={clinic.guid}
                            value={isValidClinic(clinic) ? JSON.stringify(clinic) : undefined}
                        >{`${clinic.name} | ${clinic.country}`}</option>
                    ))
                ) : (
                    <option value={undefined}>{NO_CLINIC}</option>
                )}
            </>
        );
    };

    const showClinicians = () => {


        return (
            <Row>
                <Col>
                    <div className="mb-3">
                        <Label className="form-label">{props.t("Clinician")}</Label>
                        <Input
                            type="select"
                            name="clinician"
                            className="form-select"
                            multiple={false}
                            onChange={(e) => setSelectedClinician(JSON.parse(e.target.value))}
                            defaultValue={selectedClinician}
                        >
                            <>
                                {clinician_users.length > 0 ? (
                                    clinician_users.map((clinician) => (
                                        <option
                                            key={clinician.guid}
                                            value={JSON.stringify(clinician)}
                                        >{`${clinician.name} | ${clinician.email}`}</option>
                                    ))
                                ) : (
                                    <option value={undefined}>{NO_CLINICIAN}</option>
                                )}
                            </>
                        </Input>
                    </div>
                </Col>

            </Row>
        );
    };

    const switchStimulation = (guid) => {

        const previous = selectedStimulations.find((value) => value.guid === guid);
        if (!previous) {
            setSelectedStimulations([
                ...selectedStimulations,
                { guid: guid, selected: true },
            ]);
            return;
        }

        const values = selectedStimulations.map((value) => {
            if (value.guid === guid) {
                return { ...value, selected: !value.selected };
            }
            return value;
        });
        setSelectedStimulations(values);
    };

    const isSelectedStimulation = (guid, stimulation) => {
        const value = selectedStimulations.find((value) => value.guid === guid);
        if (!value) return false;
        return value.selected;
    };

    const showStimulations = () => {
        if (
            !selectedClinic ||
            !clinic_stimulations ||
            clinic_stimulations.length === 0
        ) {
            return <>{props.t("Please select the clinic")}</>;
        }

        return (
            <>
                <Col lg={12}>
                    <div className="mb-3">
                        <Label className="form-label">{props.t("Stimulations")}</Label>
                        <div
                            style={{
                                maxHeight: "450px",
                                overflowY: "auto",
                            }}
                        >
                            <Table bordered>
                                <thead className="table-light">
                                    <tr>
                                        <th>{props.t("Title")}</th>
                                        <th>Anode</th>
                                        <th>Cathode</th>
                                        <th>Current</th>
                                        <th>Duration</th>
                                        <th>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                {props.t("Color")}
                                            </div>
                                        </th>
                                        <th>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                {props.t("Original")}
                                            </div>
                                        </th>
                                        <th className="">
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                {props.t("Allow Slide")}
                                            </div>
                                        </th>
                                        <th>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                {props.t("Sham")}
                                            </div>
                                        </th>
                                        <th>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                {props.t("Active")}
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clinic_stimulations.map((stimulation, index) => {
                                        // Adiciona a propriedade 'sham' ao objeto de estimulação
                                        const updatedStimulation = { ...stimulation, sham: false };
                                        return createStimulationRow(updatedStimulation);
                                    })}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </Col>
            </>
        );
    };

    const addSelectedStimulations = async (stimulation, status) => {
        if (status) {
            const check = interventions.some(intervention => intervention.tes_stimulation.guid === stimulation.guid);
            if (check) {
                setMessage('This stimulation is already added')
                setTimeout(() => {
                    setMessage('')
                }, 3000)
                return
            }
            const tes_stimulation = {
                disabled: stimulation.disabled,
                guid: stimulation.guid,
                tes_stimulation: stimulation,
                confirmed: false,
            }
            interventions.push(tes_stimulation)
        } else {
            const index = interventions.findIndex((intervention) => intervention.tes_stimulation.guid === stimulation.guid)
            interventions.findIndex((intervention) => {
                if (intervention.tes_stimulation.guid === stimulation.guid && intervention.confirmed === false) {
                    interventions.splice(index, 1)
                    return
                }
            })

        }
        setInterventionsList(interventions)
    }

    const createStimulationRow = (stimulation) => {
        return (
            <tr key={stimulation.guid}>
                <td>{stimulation.title}</td>
                <td>{stimulation.tes_stimulations_tdcs_parameters[0]?.tdcs_parameter.anode}</td>
                <td>{stimulation.tes_stimulations_tdcs_parameters[0]?.tdcs_parameter.cathode}</td>
                <td>{stimulation.tes_stimulations_tdcs_parameters[0]?.tdcs_parameter.current / 100} mA</td>
                <td>{stimulation.tes_stimulations_tdcs_parameters[0]?.tdcs_parameter.duration / 60} min</td>
                <td>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <div
                            style={{
                                backgroundColor: stimulation.color,
                                height: 20,
                                width: 20,
                            }}
                        ></div>
                    </div>
                </td>
                <td>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {stimulation.original.toString()}
                    </div>
                </td>
                <td className="">
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div className="form-check form-switch ">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id={`slideSwitch-${stimulation.guid}`}
                                onChange={(e) => { setForSlide(stimulation.guid, e.target.checked) }}
                                onBlur={(e) => { setForSlide(stimulation.guid, e.target.checked) }}
                                disabled={stimulation.tes_stimulations_tdcs_parameters[0]?.tdcs_parameter.current !== 120}
                            />
                        </div>
                    </div>
                </td>
                <td>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div className="form-check form-switch">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id={`shamSwitch-${stimulation.guid}`}
                                onChange={(e) => {
                                    setForSham(stimulation.guid, e.target.checked, stimulation.tes_stimulations_tdcs_parameters[0]?.tdcs_parameter.current)
                                }}
                                onBlur={(e) => {
                                    setForSham(stimulation.guid, e.target.checked, stimulation.tes_stimulations_tdcs_parameters[0]?.tdcs_parameter.current)
                                }}
                            />
                        </div>
                    </div>
                </td>
                <td>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div className="form-check form-switch">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="customSwitch2"
                                checked={isSelectedStimulation(stimulation.guid, stimulation)}
                                onChange={(e) => { }}
                                onClick={(e) => switchStimulation(stimulation.guid)}
                            />
                        </div>
                    </div>
                </td>
            </tr>
        );
    };

    const validation = useFormik({
        enableReinitialize: true,

        initialValues: {
            name: (clinic && clinic.name) || "",
            email: (clinic && clinic.email) || "",
            country: (clinic && clinic.country) || "",
            signifier: (clinic && clinic.signifier) || "",
        },
        validationSchema: Yup.object({
            name: Yup.string().required(props.t("Please Enter Your Name")),
            email: Yup.string()
                .matches(
                    /^[\w-\.]+@([\w-]+\.)+[\w-]{2,20}$/,
                    props.t("Please Enter Valid Email")
                )
                .required(props.t("Please Enter Your Email")),
            country: Yup.string().required(props.t("Please Enter Country")),
            signifier: Yup.string().max(12).min(2)
                .required(props.t("Please Enter the Signifier for the Clinic")),
        }),
        onSubmit: async (values) => {
            setIsLoading('');
            const { name, email, country, signifier } = values;
            let data = { name, email, country, signifier };
            const allowSignifier = await checkSignifier(signifier);
            if (allowSignifier) {
                if (editMode && clinic.guid !== allowSignifier.guid) {
                    validation.setErrors({ signifier: `The Significant is already in use by ${allowSignifier.name}` });
                    setIsLoading('hidden');
                    return
                } else if (!editMode) {
                    validation.setErrors({ signifier: `The signifier already exists and is being used by ${allowSignifier.name}` });
                    setIsLoading('hidden');
                    return
                }
            }

            if (editMode) {
                data = {
                    guid: clinic.guid,
                    ...data,
                };
                dispatch(updateClinic(data));
                setIsLoading('hidden');
                validation.resetForm();
                setEditMode(false);
                toggleModal();

            }

            dispatch(addClinic(data));
            setIsLoading('hidden');
            validation.resetForm();
            toggleModal();
        },
    });

    useEffect(() => {
        console.log("selectedPatient", selectedPatient)
    }, [selectedPatient]);

    useEffect(() => {
        const filtered = selectedStimulations.filter(
            (stimulation) => stimulation.selected
        );
        if (filtered.length === 0) {
            setCanAddTreatment(false);
            return;
        }

        setCanAddTreatment(true);
    }, [selectedStimulations]);


    useEffect(() => {
        if (!selectedClinic) {
            setSelectedStimulations([]);
            return;
        }
        setSelectedStimulations([]);
        dispatch(getCliniciansByClinic(selectedClinic.guid));
        dispatch(getClinicStimulations(selectedClinic.guid));
        getPatientsSummary(selectedClinic.guid);
        setSelectedPatient([]);
        setShamList([])
        setSlideList([])
        setShamState(false)
        setAllowUpdateCurrentState(false)
        setOneSessionByDayState(false)
        setSearchTerm('')
    }, [selectedClinic]);

    useEffect(() => {
        if (!clinics || clinics.length === 0) return;
        setSelectedClinic(clinics[0]);
        getPatientsSummary(clinics[0].guid);
    }, [clinics]);

    useEffect(() => {
        if (!clinician_users || clinician_users.length === 0) return;
        setSelectedClinician(clinician_users[0]);
    }, [clinician_users]);

    useEffect(() => {
        setPatients(searchResult)
    }, [searchTerm]);

    useEffect(() => {
        if (!modal) {
            validation.resetForm();
        }
    }, [modal]);

    useEffect(() => {
        dispatch(getClinics());
    }, []);

    const toggleModal = () => setModal(!modal);

    const showPlaceholder = () => {
        return (
            <>
                <div>
                    <p className="placeholder-glow mb-0">
                        <span className="placeholder col-12"></span>
                    </p>
                    <p className="placeholder-glow mb-0">
                        <span className="placeholder col-12"></span>
                    </p>
                    <p className="placeholder-glow mb-0">
                        <span className="placeholder col-12"></span>
                    </p>
                    <p className="placeholder-glow mb-0">
                        <span className="placeholder col-12"></span>
                    </p>
                </div>
            </>
        );
    };

    return (
        <React.Fragment>

            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs
                        title={props.t("Clinic")}
                        breadcrumbItem={props.t("Treatments by Clinic")}
                    />

                    <Card style={{ marginBottom: '-40px' }}>
                        <Label className="form-label" style={{ 'margin': "10px 0px 0px 20px" }}>Create and associate a treatment for multiple patients</Label>
                        <CardBody>
                            {loading ? (
                                showPlaceholder()
                            ) : (
                                <Row>
                                    <Col>
                                        <div className="mb-3">
                                            <Label className="form-label">{props.t("Clinic")}</Label>
                                            <Input
                                                type="select"
                                                name="clinic"
                                                className="form-select"
                                                multiple={false}
                                                onChange={(e) =>
                                                    setSelectedClinic(JSON.parse(e.target.value))
                                                }
                                                defaultValue={selectedClinic}
                                            >
                                                {getClinicsLabels()}
                                            </Input>
                                        </div>
                                    </Col>
                                    <Col>
                                        {showClinicians()}
                                    </Col>
                                </Row>
                            )}

                        </CardBody>
                    </Card>
                    <Card className={"mt-10"}>
                        <CardBody>
                            <Row className="mt-10">
                                <Col xs={2}>
                                    <Row>
                                        <Col xs="">
                                            <Label className="form-label">Patients {selectedPatient.length > 0 ? `( Selected ${selectedPatient.length})` : ''}</Label>
                                        </Col>
                                        <Col xs={12}>
                                            <Card style={{ maxHeight: "450px", overflowY: "auto" }} className="email-leftbar patient-list-content">

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
                                                                            <NavItem className={classnames('patient-item mb-2 w-250', { 'active-background': activePatient === index })} key={patient.guid}>
                                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                                                    <input style={{ marginTop: '-7px' }} type="checkbox" id={`select-patient-${patient.id}`} onChange={() => addSelectedPatient(patient)} />
                                                                                    <NavLink className={classnames({ active: activeTab })}>
                                                                                        <label htmlFor={`select-patient-${patient.id}`} className="fix-text-blue">
                                                                                            {patient.name}
                                                                                        </label>
                                                                                    </NavLink>

                                                                                </div>
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

                                            </Card>

                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={10}>
                                    {showStimulations()}
                                    <Row>
                                        <Col>
                                            <div className="form-check form-switch mb-3 ml-15">
                                                <label className="form-check-label" htmlFor="oneSessionByDayState">One session per day</label>
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="oneSessionByDayState"
                                                    onClick={(e) => setOneSessionByDayState(e.target.checked)}
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>

                            </Row>

                            <Row>
                                <Col>
                                    <div className="text-end">
                                        <button
                                            disabled={!canAddTreatment}
                                            className="btn btn-success save-user"
                                            onClick={() => {
                                                const filtered = selectedStimulations.filter(
                                                    (stimulation) => stimulation.selected
                                                );
                                                //here check if shamList items are in filtered and create a property is_sham to the filtered array items

                                                let filteredWithSham = [];
                                                const isShamSlider = [...shamList, ...slideList]
                                                if (isShamSlider.length > 0) {
                                                    filteredWithSham = filtered.map((value) => {

                                                        if (shamList.includes(value.guid)) {
                                                            return { ...value, is_sham: true }
                                                        } else {
                                                            return { ...value, is_sham: false }
                                                        }
                                                    })
                                                }

                                                const filteredWithShamSlide = filteredWithSham.map((value) => {
                                                    if (slideList.includes(value.guid)) {
                                                        return { ...value, allow_slide: true }
                                                    }
                                                    return { ...value, allow_slide: false }
                                                })

                                                const guids = filtered.map((value) => value.guid);
                                                const data = {
                                                    patient: selectedPatient.length == 1 ? selectedPatient[0] : selectedPatient,
                                                    clinic: selectedClinic.guid,
                                                    clinician: selectedClinician.guid,
                                                    stimulations: guids,
                                                    is_sham: filteredWithShamSlide.length > 0 ? filteredWithShamSlide : isShamState,

                                                    allow_update_electric_current: isShamState ? false : allowUpdateCurrentState,
                                                    sessions_by_day: oneSessionByDayState == true ? 1 : 0
                                                };

                                                console.log(data);


                                                //dispatch(addPatientTreatment(data));
                                                //toggleTreatmentModal();
                                            }}
                                        >
                                            {props.t("Save")}
                                        </button>
                                    </div>
                                </Col>
                            </Row>
                        </CardBody>

                    </Card>

                </Container>
            </div>
        </React.Fragment>
    );
};

Treatments.propTypes = {
    t: PropTypes.any,
};
export default withRouter(withTranslation()(Treatments));
