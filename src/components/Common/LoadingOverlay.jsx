import React, { useState, useEffect, useRef } from "react";
import "./LoadingOverlay.css";

const STEP_ICONS = ["mdi-lock-outline", "mdi-shield-search", "mdi-cog-outline"];

/**
 * LoadingOverlay
 *
 * @param {boolean} isLoading - controls visibility
 * @param {string}  message   - fallback message when there is no verificationStep
 * @param {{ message: string, index: number, total: number } | null} verificationStep
 */
const LoadingOverlay = ({
  isLoading,
  message = "Loading...",
  verificationStep = null,
}) => {
  const [shouldRender, setShouldRender] = useState(isLoading);
  const [displayMessage, setDisplayMessage] = useState("");
  const prevStepIndexRef = useRef(null);

  useEffect(() => {
    if (isLoading) {
      setShouldRender(true);
    }
  }, [isLoading]);

  // Update the displayed message with a smooth fade when changing steps
  useEffect(() => {
    if (verificationStep) {
      setDisplayMessage(verificationStep.message);
      prevStepIndexRef.current = verificationStep.index;
    } else {
      setDisplayMessage(message);
    }
  }, [verificationStep, message]);

  const handleAnimationEnd = () => {
    if (!isLoading) {
      setShouldRender(false);
    }
  };

  if (!shouldRender) return null;

  const hasSteps = !!verificationStep;
  const currentIndex = verificationStep?.index ?? 0;
  const total = verificationStep?.total ?? 3;

  return (
    <div
      className={`page-loading-overlay ${!isLoading ? "fade-out" : ""}`}
      onAnimationEnd={handleAnimationEnd}
      role="status"
      aria-live="polite"
      aria-label={displayMessage}
    >
      <div className="loading-content">
        {/* Logo / Brand */}
        <div className="loading-brand">
          <div className="loading-logo-ring">
            <div className="loading-logo-spinner" />
          </div>
        </div>

        {/* Verification steps */}
        {hasSteps ? (
          <div className="loading-steps-wrapper">
            {/* Progress bar */}
            <div className="loading-progress-track" aria-hidden="true">
              <div
                className="loading-progress-bar"
                style={{ width: `${(currentIndex / total) * 100}%` }}
              />
            </div>

            {/* Step icons */}
            <div className="loading-step-icons" aria-hidden="true">
              {Array.from({ length: total }, (_, i) => {
                const stepNum = i + 1;
                const isDone = stepNum < currentIndex;
                const isActive = stepNum === currentIndex;
                return (
                  <div
                    key={stepNum}
                    className={`loading-step-icon ${isDone ? "done" : ""} ${isActive ? "active" : ""}`}
                  >
                    {isDone ? (
                      <i className="mdi mdi-check-circle" />
                    ) : (
                      <i
                        className={`mdi ${STEP_ICONS[i] || "mdi-circle-outline"}`}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Current step message */}
            <p className="loading-step-message" key={currentIndex}>
              {displayMessage}
            </p>

            {/* Step counter */}
            <span className="loading-step-counter">
              {currentIndex} / {total}
            </span>
          </div>
        ) : (
          /* Fallback: simple spinner */
          <>
            <div className="page-loading-spinner" />
            {displayMessage && (
              <p className="loading-message">{displayMessage}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LoadingOverlay;
