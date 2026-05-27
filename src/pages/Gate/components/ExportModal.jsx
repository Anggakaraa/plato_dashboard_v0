import React from 'react';
import { Modal, ModalHeader, ModalBody, Button, Spinner } from 'reactstrap';

const ExportModal = ({ isOpen, toggle, onExportCsv, onExportPdf, isExporting }) => {
  const handleExportCsv = () => {
    onExportCsv();
  };

  const handleExportPdf = () => {
    onExportPdf();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      toggle={!isExporting ? toggle : undefined}
      centered
      size="md"
      style={{ maxWidth: '450px' }}
      backdrop={isExporting ? "static" : true}
      keyboard={!isExporting}
    >
      <ModalHeader 
        toggle={!isExporting ? toggle : undefined}
        className="border-0 pb-0"
        style={{ 
          fontSize: '1.25rem',
          fontWeight: 600,
          color: 'var(--gate-text-primary)'
        }}
      >
        {isExporting ? (
          <div className="d-flex align-items-center gap-2">
            <span>Exporting Data...</span>
          </div>
        ) : (
          'Export Data'
        )}
      </ModalHeader>
      
      <ModalBody className="px-4 pb-4">
        {isExporting ? (
          <div className="text-center py-4">
            <Spinner color="primary" style={{ width: '3rem', height: '3rem' }} />
            <p className="text-muted mt-3 mb-0">
              Fetching all patients data and generating file...
            </p>
            <small className="text-muted mt-2 d-block">
              Please wait, this may take a few moments.
            </small>
          </div>
        ) : (
          <>
            <p className="text-muted mb-4" style={{ fontSize: '0.9rem' }}>
              Please select your desired export format
            </p>

            <div className="d-flex gap-3 justify-content-between">
              {/* Export to Excel (CSV) Button */}
              <Button
                color="light"
                onClick={handleExportCsv}
                className="flex-fill d-flex flex-column align-items-center justify-content-center py-3 px-3"
                style={{
                  border: '2px solid var(--gate-border)',
                  borderRadius: '12px',
                  minHeight: '100px',
                  transition: 'all 0.2s ease',
                  fontSize: '0.9rem',
                  fontWeight: 500
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--bs-primary)';
                  e.currentTarget.style.backgroundColor = '#f0f7ff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--gate-border)';
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                <i className="mdi mdi-file-excel-outline text-success mb-2" style={{ fontSize: '2rem' }} />
                <span className="text-dark">Export to Excel</span>
                <small className="text-muted mt-1">(CSV)</small>
              </Button>

              {/* Export to PDF Button */}
              <Button
                color="light"
                onClick={handleExportPdf}
                className="flex-fill d-flex flex-column align-items-center justify-content-center py-3 px-3"
                style={{
                  border: '2px solid var(--gate-border)',
                  borderRadius: '12px',
                  minHeight: '100px',
                  transition: 'all 0.2s ease',
                  fontSize: '0.9rem',
                  fontWeight: 500
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--bs-primary)';
                  e.currentTarget.style.backgroundColor = '#f0f7ff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--gate-border)';
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                <i className="mdi mdi-file-pdf-outline text-danger mb-2" style={{ fontSize: '2rem' }} />
                <span className="text-dark">Export to PDF</span>
                <small className="text-muted mt-1" style={{ visibility: 'hidden' }}>()</small>
              </Button>
            </div>
          </>
        )}
      </ModalBody>
    </Modal>
  );
};

export default ExportModal;
