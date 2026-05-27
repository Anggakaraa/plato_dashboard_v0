import React, { useState, useMemo } from 'react';
import { Table, Input, Button } from 'reactstrap';

const GateTable = ({ columns, data, isLoading, onExport, searchKeys = ['name', 'title', 'short_description'] }) => {
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [globalSearch, setGlobalSearch] = useState('');

  const handleGlobalSearch = (e) => {
    setGlobalSearch(e.target.value);
    setCurrentPage(1); // Reset to page 1 on search
  };

  // Filter data based on global search
  const filteredData = useMemo(() => {
    if (!globalSearch) return data;
    const lowerSearch = globalSearch.toLowerCase();
    
    return data.filter((row) => {
      // Check provided searchKeys, or fallback to all values if searchKeys is empty
      const keysToSearch = searchKeys && searchKeys.length > 0 ? searchKeys : Object.keys(row);
      return keysToSearch.some((key) => {
        const cellValue = row[key];
        if (cellValue == null) return false;
        return String(cellValue).toLowerCase().includes(lowerSearch);
      });
    });
  }, [data, globalSearch, searchKeys]);

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const clampedPage = Math.min(Math.max(1, currentPage), totalPages);

  // Prevent illegal pagination states (if data changes or searches)
  if (currentPage !== clampedPage) {
    setCurrentPage(clampedPage);
  }

  // Get paginated slice
  const paginatedData = useMemo(() => {
    const start = (clampedPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, clampedPage, pageSize]);

  // Page Controls
  const handleNextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const handlePrevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleJumpToFirst = () => setCurrentPage(1);
  const handleJumpToLast = () => setCurrentPage(totalPages);

  const handlePageInputChange = (e) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= 1 && val <= totalPages) {
      setCurrentPage(val);
    }
  };

  return (
    <div className="gate-table-wrapper">
      {/* Top Bar: Global Search & Export */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center bg-white border rounded-pill px-3 py-2 shadow-sm gate-search-pill" style={{ width: "380px" }}>
          <i className="mdi mdi-magnify text-muted me-2" style={{ fontSize: "1.2rem" }}></i>
          <Input 
            type="text" 
            placeholder="Search by internal, display name or description..." 
            className="border-0 shadow-none p-0 gate-global-search"
            value={globalSearch}
            onChange={handleGlobalSearch}
            style={{ backgroundColor: "transparent" }}
          />
        </div>
        
        {onExport && (
          <Button color="light" onClick={() => onExport(filteredData, globalSearch)} className="gate-btn-outline rounded-pill px-4">
             <i className="mdi mdi-download me-1" /> Export
          </Button>
        )}
      </div>

      {/* Main Table */}
      <div className="table-responsive rounded-3 border">
        <Table className="gate-table table-nowrap align-middle mb-0" hover>
          <thead className="table-light bg-white border-bottom-0">
            <tr>
              {columns.map((col, idx) => (
                <th key={col.accessor || idx} style={{ minWidth: col.width || "auto" }}>
                  {col.Header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              // Skeletons
              Array.from({ length: pageSize }).map((_, rIdx) => (
                <tr key={`skel-${rIdx}`}>
                  {columns.map((col, cIdx) => (
                    <td key={`skel-c-${cIdx}`}>
                       <div className="gate-skeleton" style={{ height: "20px", width: "100%", borderRadius: "4px" }}></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedData.length > 0 ? (
              // Data Rows
              paginatedData.map((row, rIdx) => (
                <tr key={row.id || row.guid || `row-${rIdx}`}>
                  {columns.map((col, cIdx) => (
                    <td key={`${row.id || row.guid || rIdx}-${col.accessor || cIdx}`}>
                      {col.Cell ? col.Cell({ value: row[col.accessor], row }) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              // Empty State
              <tr>
                <td colSpan={columns.length} className="text-center py-5 text-muted">
                   <div style={{ opacity: 0.5 }}>
                     <i className="mdi mdi-flask-empty-outline" style={{ fontSize: "3rem" }}></i>
                     <h5 className="mt-2">No results found</h5>
                   </div>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Pagination Footer */}
      <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-3">
         <div className="d-flex align-items-center text-muted" style={{ fontSize: "0.9rem" }}>
             <span className="me-2">Showing {filteredData.length === 0 ? 0 : ((clampedPage - 1) * pageSize) + 1} to {Math.min(clampedPage * pageSize, filteredData.length)} of {filteredData.length} entries</span>
             <Input 
                type="select" 
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="form-select border-0 bg-light rounded-3 shadow-none ms-2"
                style={{ width: "70px", cursor: "pointer", height: "32px", padding: "0 10px" }}
              >
                {[10, 20, 50, 100].map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </Input>
         </div>
         <div className="d-flex align-items-center gate-pagination">
             <Button color="light" className="gate-page-btn" onClick={handlePrevPage} disabled={clampedPage === 1}>
                 <i className="mdi mdi-chevron-left" />
             </Button>
             
             {Array.from({ length: totalPages }).map((_, i) => {
                 const pageNum = i + 1;
                 if (pageNum === 1 || pageNum === totalPages || (pageNum >= clampedPage - 1 && pageNum <= clampedPage + 1)) {
                   return (
                     <Button 
                        key={pageNum}  
                        className={`gate-page-btn ${clampedPage === pageNum ? 'active' : ''}`}
                        onClick={() => setCurrentPage(pageNum)}
                     >
                       {pageNum}
                     </Button>
                   );
                 }
                 if (pageNum === clampedPage - 2 || pageNum === clampedPage + 2) {
                   return <span key={pageNum} className="text-muted mx-1">...</span>;
                 }
                 return null;
             })}

             <Button color="light" className="gate-page-btn" onClick={handleNextPage} disabled={clampedPage === totalPages}>
                 <i className="mdi mdi-chevron-right" />
             </Button>
         </div>
      </div>
    </div>
  );
};

export default GateTable;
