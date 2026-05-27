import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  useFilters,
  useExpanded,
  usePagination,
} from "react-table";
import { Table, Row, Col, Button, Input } from "reactstrap";
import { Filter, DefaultColumnFilter } from "./filters";
import { withTranslation } from "react-i18next";
import EmptyState from "./EmptyState";

/**
 * LocalTableContainer
 *
 * Clean client-side pagination table using react-table's built-in pagination.
 * Use this for all pages that load ALL data at once (no server-side pagination).
 *
 * For server-side / database pagination, use PlatoTableContainer with isPaginated={true}.
 */
const LocalTableContainer = ({
  t,
  columns,
  data,
  onAddItemText,
  onAddItemClick,
  onAddCustomItemText,
  onAddCustomItemClick,
  onAddExportButtonText,
  onAddExportButtonClick,
  customPageSize,
  className,
  customPageSizeOptions,
  customOrder,
  isLoading = false,
  isGlobalFilter = false,
  emptyStateTitle,
  emptyStateMessage,
}) => {
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const getInitialSortBy = () => {
    if (!customOrder)
      return [
        {
          desc: true,
        },
      ];

    return Object.keys(customOrder).map((columnId) => ({
      id: columnId,
      desc: customOrder[columnId] === "desc",
    }));
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    preGlobalFilteredRows,
    setGlobalFilter,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn: { Filter: DefaultColumnFilter },
      initialState: {
        pageIndex: 0,
        pageSize: customPageSize,
        sortBy: getInitialSortBy(),
      },
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination,
  );

  const generateSortingIndicator = (column) => {
    return column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : "";
  };

  const onChangeInSelect = (event) => {
    setPageSize(Number(event.target.value));
  };

  const onChangeInInput = (event) => {
    const page = event.target.value ? Number(event.target.value) - 1 : 0;
    gotoPage(page);
  };

  const showAddButton = () => {
    if (!onAddItemClick) return null;

    return (
      <Col md="auto" className="ms-auto">
        <div className="d-flex gap-2 justify-content-end">
          {showExportButton()}
          {showAddCustomButton()}

          <Button
            type="button"
            color="primary"
            className="btn"
            onClick={onAddItemClick}
          >
            <i className="mdi mdi-plus me-1" />
            {onAddItemText}
          </Button>
        </div>
      </Col>
    );
  };

  const showAddCustomButton = () => {
    if (!onAddCustomItemClick) return null;

    return (
      <Button
        type="button"
        color="info"
        className="btn"
        onClick={onAddCustomItemClick}
      >
        <i className="mdi mdi-plus me-1" />
        {onAddCustomItemText}
      </Button>
    );
  };

  const showExportButton = () => {
    if (!onAddExportButtonClick) return null;

    return (
      <Button
        type="button"
        color="secondary"
        className="btn"
        onClick={onAddExportButtonClick}
      >
        <i className="mdi mdi-download me-1" />
        {onAddExportButtonText}
      </Button>
    );
  };

  return (
    <Fragment>
      <Row className="mb-2">
        <Col md={2}>
          <select
            className="form-select"
            value={pageSize}
            onChange={onChangeInSelect}
          >
            {[10, 20, 30].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {t("Show")} {pageSize}
              </option>
            ))}
          </select>
        </Col>
        {isGlobalFilter && (
          <Col md={4}>
            <Input
              type="text"
              placeholder={t("Search...")}
              value={globalFilterValue}
              onChange={(e) => {
                setGlobalFilterValue(e.target.value);
                setGlobalFilter(e.target.value || undefined);
              }}
            />
          </Col>
        )}
        {showAddButton()}
      </Row>

      <div className="table-responsive react-table">
        <Table bordered hover {...getTableProps()} className={className}>
          <thead className="table-light table-nowrap">
            {headerGroups.map((headerGroup) => (
              <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th key={column.id}>
                    <div {...column.getSortByToggleProps()}>
                      {column.render("Header")}
                      {generateSortingIndicator(column)}
                    </div>
                    {!isGlobalFilter && <Filter column={column} />}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps()}>
            {isLoading
              ? Array.from({ length: customPageSize || 10 }).map((_, index) => (
                  <tr key={`skeleton-${index}`}>
                    {columns.map((column, colIndex) => (
                      <td key={`skeleton-${index}-${colIndex}`}>
                        <div className="placeholder-glow">
                          <span className="placeholder col-12"></span>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))
              : page.map((row) => {
                  prepareRow(row);
                  return (
                    <Fragment key={row.getRowProps().key}>
                      <tr>
                        {row.cells.map((cell) => {
                          return (
                            <td key={cell.id} {...cell.getCellProps()}>
                              {cell.render("Cell")}
                            </td>
                          );
                        })}
                      </tr>
                    </Fragment>
                  );
                })}
          </tbody>
        </Table>

        {/* Empty state — shown when not loading and no rows */}
        {!isLoading && page.length === 0 && (
          <EmptyState
            title={emptyStateTitle}
            message={emptyStateMessage}
            actionText={onAddItemText ? `+ ${onAddItemText}` : undefined}
            onAction={onAddItemClick}
          />
        )}
      </div>

      {/* Pagination */}
      <Row className="justify-content-md-end justify-content-center align-items-center">
        <Col className="col-md-auto">
          <div className="d-flex gap-1">
            <Button
              color="primary"
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
            >
              {"<<"}
            </Button>
            <Button
              color="primary"
              onClick={previousPage}
              disabled={!canPreviousPage}
            >
              {"<"}
            </Button>
          </div>
        </Col>
        <Col className="col-md-auto d-none d-md-block">
          {t("Page")}{" "}
          <strong>
            {pageIndex + 1} - {pageOptions.length}
          </strong>
        </Col>
        <Col className="col-md-auto">
          <Input
            key={pageIndex}
            type="number"
            min={1}
            style={{ width: 70 }}
            max={pageOptions.length}
            defaultValue={pageIndex + 1}
            onChange={onChangeInInput}
          />
        </Col>

        <Col className="col-md-auto">
          <div className="d-flex gap-1">
            <Button color="primary" onClick={nextPage} disabled={!canNextPage}>
              {">"}
            </Button>
            <Button
              color="primary"
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
            >
              {">>"}
            </Button>
          </div>
        </Col>
      </Row>
    </Fragment>
  );
};

LocalTableContainer.propTypes = {
  t: PropTypes.any,
  columns: PropTypes.any,
  data: PropTypes.any,
  onAddCustomItemText: PropTypes.string,
  onAddCustomItemClick: PropTypes.any,
  onAddItemText: PropTypes.string,
  onAddItemClick: PropTypes.any,
  onAddExportButtonText: PropTypes.string,
  onAddExportButtonClick: PropTypes.any,
  customPageSize: PropTypes.any,
  className: PropTypes.any,
  customPageSizeOptions: PropTypes.any,
  customOrder: PropTypes.object,
  isLoading: PropTypes.bool,
  isGlobalFilter: PropTypes.bool,
  emptyStateTitle: PropTypes.string,
  emptyStateMessage: PropTypes.string,
};

export default withTranslation()(LocalTableContainer);
