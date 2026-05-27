import React, { useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  Row,
  Col,
  Alert,
} from 'reactstrap';
import { withTranslation } from 'react-i18next';
import { exportAllPatientsToExcel } from '../../../api/patient';

const ExportAllPatientsModal = ({ isOpen, toggle, t }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState(null);

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);

    try {
      await exportAllPatientsToExcel(1000); // Limite de 1000 pacientes
      toggle();
    } catch (err) {
      console.error('Error exporting patients:', err);
      setError(err.message || t('Failed to export patients'));
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle} tag="h4">
        {t('Export All Patients')}
      </ModalHeader>
      <ModalBody>
        {isExporting && (
          <div className="text-center mb-3">
            <i className="bx bx-loader-circle bx-spin font-size-24"></i>
            <p className="mt-2">{t('Exporting patients, please wait...')}</p>
          </div>
        )}
        
        {error && (
          <Alert color="danger" className="mb-3">
            {error}
          </Alert>
        )}

        {!isExporting && (
          <>
            <p>
              {t('This will export up to 1000 patients to an Excel file. Do you want to continue?')}
            </p>
            <Row>
              <Col>
                <div className="text-end">
                  <Button
                    color="secondary"
                    onClick={toggle}
                    className="me-2"
                    disabled={isExporting}
                  >
                    {t('Cancel')}
                  </Button>
                  <Button
                    color="secondary"
                    onClick={handleExport}
                    disabled={isExporting}
                  >
                    {t('Export')}
                  </Button>
                </div>
              </Col>
            </Row>
          </>
        )}
      </ModalBody>
    </Modal>
  );
};

export default withTranslation()(ExportAllPatientsModal);
