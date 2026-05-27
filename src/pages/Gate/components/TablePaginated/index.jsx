import React, { useState } from "react";
import { Table, Input, Button } from "reactstrap";

/**
 * GateTablePaginated
 *
 * Versão do GateTable para paginação server-side (API)
 * Mantém o mesmo design system mas delega paginação e busca para o backend
 */
const GateTablePaginated = ({
  columns,
  data,
  isLoading,
  onExport,
  // Paginação server-side
  currentPage,
  totalPages,
  totalRecords,
  pageSize,
  onPageChange,
  onPageSizeChange,
  // Busca server-side
  searchValue,
  onSearchChange,
  onSearchSubmit,
  searchPlaceholder = "Search...",
  // Expandable rows
  expandedRows = {},
  renderExpandedRow,
}) => {
  const [searchInput, setSearchInput] = useState(searchValue || "");

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
    if (onSearchChange) onSearchChange(e.target.value);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter" && onSearchSubmit) {
      onSearchSubmit(searchInput);
    }
  };

  const clampedPage = Math.min(Math.max(1, currentPage), totalPages);

  // Page Controls
  const handleNextPage = () => {
    if (clampedPage < totalPages && onPageChange) {
      onPageChange(clampedPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (clampedPage > 1 && onPageChange) {
      onPageChange(clampedPage - 1);
    }
  };

  return (
    <div className="gate-table-wrapper">
      {/* Top Bar: Global Search & Export */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div
          className="d-flex align-items-center bg-white border rounded-pill px-3 py-2 shadow-sm gate-search-pill"
          style={{ width: "380px" }}
        >
          <i
            className="mdi mdi-magnify text-muted me-2"
            style={{ fontSize: "1.2rem" }}
          ></i>
          <Input
            type="text"
            placeholder={searchPlaceholder}
            className="border-0 shadow-none p-0 gate-global-search"
            value={searchInput}
            onChange={handleSearchInputChange}
            onKeyPress={handleSearchKeyPress}
            style={{ backgroundColor: "transparent" }}
          />
        </div>

        {onExport && (
          <Button
            color="light"
            onClick={() => onExport(data)}
            className="gate-btn-outline rounded-pill px-4"
          >
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
                <th
                  key={col.accessor || idx}
                  style={{ minWidth: col.width || "auto" }}
                >
                  {col.Header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              // Skeletons
              Array.from({ length: pageSize || 10 }).map((_, rIdx) => (
                <tr key={`skel-${rIdx}`}>
                  {columns.map((col, cIdx) => (
                    <td key={`skel-c-${cIdx}`}>
                      <div
                        className="gate-skeleton"
                        style={{
                          height: "20px",
                          width: "100%",
                          borderRadius: "4px",
                        }}
                      ></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length > 0 ? (
              // Data Rows with expandable support
              data.map((row, rIdx) => {
                const rowKey = row.guid || row.id || `row-${rIdx}`;
                const isExpanded = expandedRows[rowKey];

                return (
                  <React.Fragment key={rowKey}>
                    <tr
                      className={isExpanded ? "gate-row-expanded" : ""}
                      style={{ transition: "background-color 0.2s ease" }}
                    >
                      {columns.map((col, cIdx) => (
                        <td key={`${rowKey}-${col.accessor || cIdx}`}>
                          {col.Cell
                            ? col.Cell({ value: row[col.accessor], row })
                            : row[col.accessor]}
                        </td>
                      ))}
                    </tr>
                    {/* Expanded Row */}
                    {isExpanded && renderExpandedRow && (
                      <tr className="expanded-row">
                        <td
                          colSpan={columns.length}
                          className="p-0"
                          style={{
                            backgroundColor: "#F9F7F4",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            className="expanded-content"
                            style={{
                              animation: "expandRow 0.3s ease-out",
                              transformOrigin: "top",
                              backgroundColor: "#F9F7F4",
                            }}
                          >
                            {renderExpandedRow(row)}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              // Empty State
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-5 text-muted"
                >
                  <div style={{ opacity: 0.5 }}>
                    <i
                      className="mdi mdi-flask-empty-outline"
                      style={{ fontSize: "3rem" }}
                    ></i>
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
        <div
          className="d-flex align-items-center text-muted"
          style={{ fontSize: "0.9rem" }}
        >
          <span className="me-2">
            Showing {data.length === 0 ? 0 : (clampedPage - 1) * pageSize + 1}{" "}
            to {Math.min(clampedPage * pageSize, totalRecords)} of{" "}
            {totalRecords} entries
          </span>
          {onPageSizeChange && (
            <Input
              type="select"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="form-select border-0 bg-light rounded-3 shadow-none ms-2"
              style={{
                width: "70px",
                cursor: "pointer",
                height: "32px",
                padding: "0 10px",
              }}
            >
              {[10, 20, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </Input>
          )}
        </div>
        <div className="d-flex align-items-center gate-pagination">
          <Button
            color="light"
            className="gate-page-btn"
            onClick={handlePrevPage}
            disabled={clampedPage === 1}
          >
            <i className="mdi mdi-chevron-left" />
          </Button>

          {Array.from({ length: totalPages }).map((_, i) => {
            const pageNum = i + 1;
            if (
              pageNum === 1 ||
              pageNum === totalPages ||
              (pageNum >= clampedPage - 1 && pageNum <= clampedPage + 1)
            ) {
              return (
                <Button
                  key={pageNum}
                  className={`gate-page-btn ${clampedPage === pageNum ? "active" : ""}`}
                  onClick={() => onPageChange && onPageChange(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            }
            if (pageNum === clampedPage - 2 || pageNum === clampedPage + 2) {
              return (
                <span key={pageNum} className="text-muted mx-1">
                  ...
                </span>
              );
            }
            return null;
          })}

          <Button
            color="light"
            className="gate-page-btn"
            onClick={handleNextPage}
            disabled={clampedPage === totalPages}
          >
            <i className="mdi mdi-chevron-right" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GateTablePaginated;
