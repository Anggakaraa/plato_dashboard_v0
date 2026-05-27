import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Input, Row, Col } from "reactstrap";
import { withTranslation } from "react-i18next";

/**
 * PatientsTable
 *
 * A lightweight, purpose‑built table for the patients list.
 * Intentionally avoids react‑table and Reactstrap UncontrolledTooltip to
 * prevent the CPU/memory spikes that were crashing the browser tab.
 *
 * Props
 * ─────
 * columns        – [{ key, header, render(row) }]
 * data           – rows for the current page (already paginated by server)
 * isLoading      – show skeleton rows
 * pageSize       – number of skeleton rows to show while loading
 * paginationData – { page, totalPages, total }
 * onPageChange   – (page: number) => void
 * onSearch       – (term: string) => void
 * actions        – optional JSX buttons rendered in the toolbar (right side)
 */
const PatientsTable = ({
  t,
  columns = [],
  data = [],
  isLoading = false,
  pageSize = 10,
  paginationData,
  onPageChange,
  onSearch,
  actions,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [hasActiveSearch, setHasActiveSearch] = useState(false);

  const currentPage = paginationData?.page ?? 1;
  const totalPages = paginationData?.totalPages ?? 1;
  const totalRecords = paginationData?.total;

  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  const handleSearchSubmit = () => {
    if (onSearch) {
      onSearch(searchValue);
      setHasActiveSearch(searchValue.trim() !== "");
    }
  };

  const handleSearchClear = () => {
    setSearchValue("");
    setHasActiveSearch(false);
    if (onSearch) onSearch("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearchSubmit();
  };

  const handlePageInput = (e) => {
    const val = Number(e.target.value);
    if (val >= 1 && val <= totalPages && onPageChange) onPageChange(val);
  };

  return (
    <div>
      {/* Toolbar */}
      <Row className="mb-2 align-items-center">
        {/* Search */}
        {onSearch && (
          <Col md={6}>
            <div className="d-flex gap-2">
              <Input
                type="text"
                placeholder={t("Search by name or email...")}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              {hasActiveSearch && (
                <Button
                  color="secondary"
                  outline
                  onClick={handleSearchClear}
                  title={t("Clear search")}
                >
                  <i className="mdi mdi-close" />
                </Button>
              )}
              <Button color="primary" onClick={handleSearchSubmit}>
                <i className="mdi mdi-magnify" />
              </Button>
            </div>
          </Col>
        )}

        {/* Action buttons (Export, Add, etc.) */}
        {actions && (
          <Col md="auto" className="ms-auto">
            <div className="d-flex gap-2 justify-content-end">{actions}</div>
          </Col>
        )}
      </Row>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-light">
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: pageSize }).map((_, i) => (
                <tr key={`sk-${i}`}>
                  {columns.map((col) => (
                    <td key={col.key}>
                      <div className="placeholder-glow">
                        <span className="placeholder col-12" />
                      </div>
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center text-muted py-4"
                >
                  {t("No records found")}
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) =>
                row ? (
                  <tr key={row.guid ?? rowIdx}>
                    {columns.map((col) => (
                      <td key={col.key}>
                        {col.render ? col.render(row, rowIdx) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                ) : null,
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {paginationData && (
        <Row className="justify-content-md-end justify-content-center align-items-center">
          <Col className="col-md-auto">
            <div className="d-flex gap-1">
              <Button
                color="primary"
                onClick={() => onPageChange?.(1)}
                disabled={!canPrev}
              >
                {"<<"}
              </Button>
              <Button
                color="primary"
                onClick={() => onPageChange?.(currentPage - 1)}
                disabled={!canPrev}
              >
                {"<"}
              </Button>
            </div>
          </Col>

          <Col className="col-md-auto d-none d-md-block">
            {t("Page")}{" "}
            <strong>
              {currentPage} - {totalPages}
            </strong>
          </Col>

          <Col className="col-md-auto">
            <Input
              type="number"
              min={1}
              max={totalPages}
              style={{ width: 70 }}
              value={currentPage}
              onChange={handlePageInput}
            />
          </Col>

          <Col className="col-md-auto">
            <div className="d-flex gap-1">
              <Button
                color="primary"
                onClick={() => onPageChange?.(currentPage + 1)}
                disabled={!canNext}
              >
                {">"}
              </Button>
              <Button
                color="primary"
                onClick={() => onPageChange?.(totalPages)}
                disabled={!canNext}
              >
                {">>"}
              </Button>
            </div>
          </Col>

          {totalRecords !== undefined && (
            <Col className="col-md-auto d-none d-md-block">
              <small className="text-muted">
                {t("Total")}: {totalRecords} {t("records")}
              </small>
            </Col>
          )}
        </Row>
      )}
    </div>
  );
};

PatientsTable.propTypes = {
  t: PropTypes.any,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      header: PropTypes.string,
      render: PropTypes.func,
    }),
  ),
  data: PropTypes.array,
  isLoading: PropTypes.bool,
  pageSize: PropTypes.number,
  paginationData: PropTypes.shape({
    page: PropTypes.number,
    totalPages: PropTypes.number,
    total: PropTypes.number,
  }),
  onPageChange: PropTypes.func,
  onSearch: PropTypes.func,
  actions: PropTypes.node,
};

export default withTranslation()(PatientsTable);
