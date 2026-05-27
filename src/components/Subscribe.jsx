import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Button,
  Input,
  Modal,
  ModalHeader,
} from "reactstrap";

const Subscribe = props => {
    const [subscribeModal, setSubscribeModal] = useState(false);
    const { subscribed } = useSelector(state => true);
    
    useEffect(() => {
        if (subscribed) return;

        setTimeout(() => setSubscribeModal(true), 2000);
    }, []);
    
    return (
        props.disabled ? <></> :
        <>
            <Modal
                isOpen={subscribeModal}
                role="dialog"
                autoFocus={true}
                centered
                data-toggle="modal"
                toggle={() => setSubscribeModal(!subscribeModal)}>
            <div>
                <ModalHeader
                    className="border-bottom-0"
                    toggle={() => setSubscribeModal(!subscribeModal)}/>
            </div>
            <div className="modal-body">
                <div className="text-center mb-4">
                    <div className="avatar-md mx-auto mb-4">
                    <div className="avatar-title bg-light  rounded-circle text-primary h1">
                        <i className="mdi mdi-email-open"></i>
                    </div>
                    </div>

                    <div className="row justify-content-center">
                    <div className="col-xl-10">
                        <h4 className="text-primary">Subscribe !</h4>
                        <p className="text-muted font-size-14 mb-4">
                        Subscribe our newletter and get notification to stay update.
                        </p>

                        <div
                        className="input-group rounded bg-light"
                        >
                        <Input
                            type="email"
                            className="form-control bg-transparent border-0"
                            placeholder="Enter Email address"
                        />
                        <Button color="primary" type="button" id="button-addon2">
                            <i className="bx bxs-paper-plane"></i>
                        </Button>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </Modal>
      </>
    );
};

Subscribe.propTypes = {
    disabled: PropTypes.any,
};

export default Subscribe;