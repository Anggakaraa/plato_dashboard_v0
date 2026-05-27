import PropTypes from 'prop-types';
import React from "react";
import { Modal, ModalBody } from "reactstrap";
import { withTranslation } from "react-i18next";

const QuestionItemModal = ({t, visible, positive = true, onPositiveText, onPositiveClick, onNegativeText, onNegativeClick, questionText}) => {
  return (
    <Modal size="sm" isOpen={visible} toggle={onNegativeClick} centered={true}>
      <div className="modal-content">
        <ModalBody className="px-4 py-5 text-center">
          <button type="button" onClick={onNegativeClick} className="btn-close position-absolute end-0 top-0 m-3"></button>
          {
            positive 
            ? <div className="avatar-sm mb-4 mx-auto">
                <div className="avatar-title bg-primary text-primary bg-opacity-10 font-size-20 rounded-3">
                  <i className="mdi mdi-check-circle-outline"></i>
                </div>
              </div> 
            : <div className="avatar-sm mb-4 mx-auto">
                <div className="avatar-title bg-danger text-danger bg-opacity-10 font-size-20 rounded-3">
                  <i className="mdi mdi-close-circle-outline"></i>
                </div>
              </div>
          }
          <p className="text-muted font-size-16 mb-4">{questionText}</p>
          <div className="hstack gap-2 justify-content-center mb-0">
            <button type="button" className={ positive ? "btn btn-primary" : "btn btn-danger"} onClick={onPositiveClick}>{onPositiveText}</button>
            <button type="button" className="btn btn-secondary" onClick={onNegativeClick}>{onNegativeText}</button>
          </div>
        </ModalBody>
      </div>
    </Modal>
  )
}

QuestionItemModal.propTypes = {
  t: PropTypes.any,
  visible: PropTypes.bool,
  positive: PropTypes.bool,
  onPositiveText: PropTypes.string,
  onPositiveClick: PropTypes.func,
  onNegativeText: PropTypes.string,
  onNegativeClick: PropTypes.func,
  questionText: PropTypes.string,
}

export default withTranslation()(QuestionItemModal);
