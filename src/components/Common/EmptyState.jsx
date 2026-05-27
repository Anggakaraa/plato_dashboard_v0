import React from "react";
import PropTypes from "prop-types";
import { Button } from "reactstrap";

/**
 * PlatoScience empty state pattern.
 *
 * Usage:
 *   <EmptyState
 *     title="No patients yet."
 *     message="Add your first patient to get started."
 *     actionText="+ Add Patient"
 *     onAction={handleOpenAdd}
 *   />
 *
 * All props are optional — renders a minimal message-only state if omitted.
 */
const EmptyState = ({ title, message, actionText, onAction }) => {
  return (
    <div className="ps-empty-state">
      {/* Dot matrix texture */}
      <div className="ps-empty-state__texture" aria-hidden="true" />

      {/* Icon */}
      <div className="ps-empty-state__icon">
        <i className="mdi mdi-inbox-outline" />
      </div>

      {/* Text */}
      <p className="ps-empty-state__title">
        {title || "Nothing here yet."}
      </p>
      {message && (
        <p className="ps-empty-state__message">{message}</p>
      )}

      {/* CTA */}
      {actionText && onAction && (
        <Button color="primary" onClick={onAction} className="mt-1">
          {actionText}
        </Button>
      )}
    </div>
  );
};

EmptyState.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  actionText: PropTypes.string,
  onAction: PropTypes.func,
};

export default EmptyState;
