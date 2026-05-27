import React, { useState } from 'react';
// ...existing imports...
import ExportModal from './ExportModal';

const StimulationsTab = ({ clinicGuid, clinicName }) => {
  // ...existing state...
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // ...existing functions...

  return (
    <div className="card">
      {/* ...existing header... */}
      <div className="card-header border-0 pt-6">
        <div className="card-title">
          {/* ...existing search input... */}
        </div>
        <div className="card-toolbar">
          <button
            type="button"
            className="btn btn-sm btn-light-primary me-3"
            onClick={() => setIsExportModalOpen(true)}
          >
            <i className="bi bi-download fs-4 me-2"></i>
            Export
          </button>
          {/* ...existing add button... */}
        </div>
      </div>

      {/* ...existing card body... */}

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        data={filteredStimulations}
        totalCount={stimulations.length}
        clinicName={clinicName}
        entityType="stimulations"
        isFiltered={searchTerm.length > 0}
        filterTerm={searchTerm}
      />
    </div>
  );
};

export default StimulationsTab;
