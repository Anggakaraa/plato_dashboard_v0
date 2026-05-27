import React, { Fragment, useState, useEffect } from "react";
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

const PlatoTableContainer = ({
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
  isPaginated = false,
  paginationData,
  onPageChange,
  onSearch,
  isLoading = false,
  emptyStateTitle,
  emptyStateMessage,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [hasActiveSearch, setHasActiveSearch] = useState(false);

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
    state,
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
      manualPagination: isPaginated,
      pageCount:
        isPaginated && paginationData ? paginationData.totalPages : undefined,
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
    if (isPaginated && onPageChange) {
      onPageChange(page + 1); // Backend uses 1-indexed pages
    } else {
      gotoPage(page);
    }
  };

  const handlePreviousPage = () => {
    if (isPaginated && onPageChange && paginationData) {
      onPageChange(paginationData.page - 1);
    } else {
      previousPage();
    }
  };

  const handleNextPage = () => {
    if (isPaginated && onPageChange && paginationData) {
      onPageChange(paginationData.page + 1);
    } else {
      nextPage();
    }
  };

  const handleFirstPage = () => {
    if (isPaginated && onPageChange) {
      onPageChange(1);
    } else {
      gotoPage(0);
    }
  };

  const handleLastPage = () => {
    if (isPaginated && onPageChange && paginationData) {
      onPageChange(paginationData.totalPages);
    } else {
      gotoPage(pageCount - 1);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
  };

  const handleSearchSubmit = () => {
    if (onSearch) {
      onSearch(searchValue);
      setHasActiveSearch(searchValue.trim() !== "");
    }
  };

  const handleSearchClear = () => {
    setSearchValue("");
    setHasActiveSearch(false);
    if (onSearch) {
      onSearch("");
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  const getCurrentPage = () => {
    return isPaginated && paginationData ? paginationData.page : pageIndex + 1;
  };

  const getTotalPages = () => {
    return isPaginated && paginationData
      ? paginationData.totalPages
      : pageOptions.length;
  };

  const getCanPreviousPage = () => {
    return isPaginated && paginationData
      ? paginationData.page > 1
      : canPreviousPage;
  };

  const getCanNextPage = () => {
    return isPaginated && paginationData
      ? paginationData.page < paginationData.totalPages
      : canNextPage;
  };

  const showPagination = () => {
    return (
      <>
        <Row className="justify-content-md-end justify-content-center align-items-center">
          <Col className="col-md-auto">
            <div className="d-flex gap-1">
              <Button
                color="primary"
                onClick={handleFirstPage}
                disabled={!getCanPreviousPage()}
              >
                {"<<"}
              </Button>
              <Button
                color="primary"
                onClick={handlePreviousPage}
                disabled={!getCanPreviousPage()}
              >
                {"<"}
              </Button>
            </div>
          </Col>
          <Col className="col-md-auto d-none d-md-block">
            {t("Page")}{" "}
            <strong>
              {getCurrentPage()} - {getTotalPages()}
            </strong>
          </Col>
          <Col className="col-md-auto">
            {isPaginated ? (
              <Input
                type="number"
                min={1}
                style={{ width: 70 }}
                max={getTotalPages()}
                value={getCurrentPage()}
                onChange={onChangeInInput}
              />
            ) : (
              <Input
                key={pageIndex}
                type="number"
                min={1}
                style={{ width: 70 }}
                max={getTotalPages()}
                defaultValue={pageIndex + 1}
                onChange={onChangeInInput}
              />
            )}
          </Col>

          <Col className="col-md-auto">
            <div className="d-flex gap-1">
              <Button
                color="primary"
                onClick={handleNextPage}
                disabled={!getCanNextPage()}
              >
                {">"}
              </Button>
              <Button
                color="primary"
                onClick={handleLastPage}
                disabled={!getCanNextPage()}
              >
                {">>"}
              </Button>
            </div>
          </Col>
          {isPaginated && paginationData && (
            <Col className="col-md-auto d-none d-md-block">
              <small className="text-muted">
                {t("Total")}: {paginationData.total} {t("records")}
              </small>
            </Col>
          )}
        </Row>
      </>
    );
  };

  const showPageQuantity = () => {
    return (
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
    );
  };

  const showSearchBox = () => {
    if (!onSearch) return null;

    return (
      <Col md={6}>
        <div className="d-flex gap-2">
          <Input
            type="text"
            placeholder={t("Search by name or email...")}
            value={searchValue}
            onChange={handleSearchChange}
            onKeyPress={handleSearchKeyPress}
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
    );
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
        {!isPaginated && showPageQuantity()}
        {showSearchBox()}
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
                    {!isPaginated && <Filter column={column} />}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps()}>
            {isLoading
              ? // Show skeleton rows when loading
                Array.from({ length: customPageSize || 10 }).map((_, index) => (
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
              : // Show actual data when not loading
                page.map((row) => {
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

        {/* Empty state — shown when not loading and no rows returned */}
        {!isLoading && page.length === 0 && (
          <EmptyState
            title={emptyStateTitle}
            message={emptyStateMessage}
            actionText={onAddItemText ? `+ ${onAddItemText}` : undefined}
            onAction={onAddItemClick}
          />
        )}
      </div>

      {showPagination()}
    </Fragment>
  );
};

PlatoTableContainer.propTypes = {
  t: PropTypes.any,
  preGlobalFilteredRows: PropTypes.any,
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
  isPaginated: PropTypes.bool,
  paginationData: PropTypes.shape({
    total: PropTypes.number,
    page: PropTypes.number,
    limit: PropTypes.number,
    totalPages: PropTypes.number,
  }),
  onPageChange: PropTypes.func,
  onSearch: PropTypes.func,
  isLoading: PropTypes.bool,
  emptyStateTitle: PropTypes.string,
  emptyStateMessage: PropTypes.string,
};

export default withTranslation()(PlatoTableContainer);
