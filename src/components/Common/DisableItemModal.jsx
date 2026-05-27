import PropTypes from 'prop-types';
import React from "react";
import { Modal, ModalBody } from "reactstrap";
import { withTranslation } from "react-i18next";

const DisableItemModal = ({t, show, onDisableClick, itemText, onCloseClick}) => {
  return (
    <Modal size="sm" isOpen={show} toggle={onCloseClick} centered={true}>
      <div className="modal-content">
        <ModalBody className="px-4 py-5 text-center">
          <button type="button" onClick={onCloseClick} className="btn-close position-absolute end-0 top-0 m-3"></button>
          <div className="avatar-sm mb-4 mx-auto">
            <div className="avatar-title bg-danger text-danger bg-opacity-10 font-size-20 rounded-3">
              <i className="mdi mdi-close-circle-outline"></i>
            </div>
          </div>
          <p className="text-muted font-size-16 mb-4">{`${t("Are you sure you want to disable the ")} ${itemText}?`}</p>

          <div className="hstack gap-2 justify-content-center mb-0">
            <button type="button" className="btn btn-danger" onClick={onDisableClick}>{t("Disable Now")}</button>
            <button type="button" className="btn btn-secondary" onClick={onCloseClick}>{t("Close")}</button>
          </div>
        </ModalBody>
      </div>
    </Modal>
  )
}

DisableItemModal.propTypes = {
  t: PropTypes.any,
  show: PropTypes.any,
  onDisableClick: PropTypes.func,
  itemText: PropTypes.string,
  onCloseClick: PropTypes.func
}

export default withTranslation()(DisableItemModal);
