import React, { useState } from "react";
import "../design-system/theme.css";
import "./DesignSystem.css";

// ─── Helpers ────────────────────────────────────────────────────────────────

const Section = ({ id, title, subtitle, children }) => (
  <section className="ds-section" id={id}>
    <div className="ds-section-header">
      <h2 className="ds-section-title">{title}</h2>
      {subtitle && <p className="ds-section-subtitle">{subtitle}</p>}
    </div>
    {children}
  </section>
);

const Token = ({ name, value, preview }) => (
  <div className="ds-token">
    <div
      className="ds-token-preview"
      style={{ background: preview || value }}
    />
    <div className="ds-token-info">
      <code className="ds-token-name">{name}</code>
      <span className="ds-token-value">{value}</span>
    </div>
  </div>
);

const CodeBlock = ({ code }) => (
  <pre className="ds-code-block">
    <code>{code}</code>
  </pre>
);

// ─── Mock table data ─────────────────────────────────────────────────────────

const MOCK_PATIENTS = [
  {
    id: "P-001",
    name: "John Doe",
    clinic: "Downtown Clinic",
    sessions: 12,
    status: "Active",
  },
  {
    id: "P-002",
    name: "Maria Silva",
    clinic: "Westside Center",
    sessions: 8,
    status: "Inactive",
  },
  {
    id: "P-003",
    name: "Robert Chen",
    clinic: "North Branch",
    sessions: 21,
    status: "Active",
  },
  {
    id: "P-004",
    name: "Ana Torres",
    clinic: "Downtown Clinic",
    sessions: 4,
    status: "Pending",
  },
];

const STATUS_COLORS = {
  Active: "#2ec4b6",
  Inactive: "#adb5bd",
  Pending: "#f77f00",
};
const STATUS_BG = {
  Active: "#e8f8f7",
  Inactive: "#f8f9fa",
  Pending: "#fff3e0",
};

// ─── Main Component ──────────────────────────────────────────────────────────

const DesignSystem = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [btnLoading, setBtnLoading] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const triggerToast = () => {
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  };

  const triggerLoader = () => {
    setBtnLoading(true);
    setTimeout(() => setBtnLoading(false), 1800);
  };

  const NAV = [
    { key: "overview", label: "Overview", icon: "mdi-view-dashboard-outline" },
    { key: "colors", label: "Colors", icon: "mdi-palette-outline" },
    { key: "typography", label: "Typography", icon: "mdi-format-font" },
    { key: "buttons", label: "Buttons", icon: "mdi-gesture-tap-button" },
    { key: "cards", label: "Cards", icon: "mdi-card-outline" },
    { key: "tables", label: "Tables", icon: "mdi-table-large" },
    { key: "badges", label: "Badges", icon: "mdi-tag-outline" },
    { key: "icons", label: "Icons", icon: "mdi-shape-outline" },
    { key: "feedback", label: "Feedback", icon: "mdi-bell-outline" },
    { key: "layout", label: "Layout", icon: "mdi-page-layout-body" },
  ];

  return (
    <div className="ds-root">
      {/* ── Sticky top nav ── */}
      <nav className="ds-top-nav">
        <div className="ds-top-nav-brand">
          <i className="mdi mdi-atom-variant" />
          <span>Plato Design System</span>
          <span className="ds-version-badge">v1.0</span>
        </div>
        <div className="ds-top-nav-links">
          {NAV.map((n) => (
            <button
              key={n.key}
              className={`ds-top-nav-btn ${activeTab === n.key ? "active" : ""}`}
              onClick={() => setActiveTab(n.key)}
            >
              <i className={`mdi ${n.icon}`} />
              {n.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ── Hero ── */}
      <div className="ds-hero">
        <div className="ds-hero-content">
          <div className="ds-hero-badge">
            <i className="mdi mdi-hospital-building" /> Clinician Template
          </div>
          <h1 className="ds-hero-title">Plato Design System</h1>
          <p className="ds-hero-subtitle">
            A comprehensive UI reference for external clinician-facing
            interface. Built with consistency, accessibility, and clinical
            clarity in mind.
          </p>
          <div className="ds-hero-stats">
            <div className="ds-hero-stat">
              <span>12</span> Components
            </div>
            <div className="ds-hero-stat">
              <span>7</span> Color Tokens
            </div>
            <div className="ds-hero-stat">
              <span>4</span> Button Variants
            </div>
          </div>
        </div>
        <div className="ds-hero-visual" aria-hidden="true">
          <div className="ds-hero-ring ds-hero-ring-1" />
          <div className="ds-hero-ring ds-hero-ring-2" />
          <div className="ds-hero-ring ds-hero-ring-3" />
          <i className="mdi mdi-atom-variant ds-hero-icon" />
        </div>
      </div>

      {/* ── Body ── */}
      <div className="ds-body">
        {/* ──────────────── OVERVIEW ──────────────── */}
        {activeTab === "overview" && (
          <div className="ds-overview-grid">
            {NAV.filter((n) => n.key !== "overview").map((n) => (
              <button
                key={n.key}
                className="ds-overview-card"
                onClick={() => setActiveTab(n.key)}
              >
                <i className={`mdi ${n.icon} ds-overview-icon`} />
                <span className="ds-overview-label">{n.label}</span>
                <i className="mdi mdi-arrow-right ds-overview-arrow" />
              </button>
            ))}
          </div>
        )}

        {/* ──────────────── COLORS ──────────────── */}
        {activeTab === "colors" && (
          <Section
            id="colors"
            title="Color Palette"
            subtitle="CSS custom properties consumed across the entire Gate area."
          >
            <h3 className="ds-subsection-title">Brand Colors</h3>
            <div className="ds-token-grid">
              <Token name="--gate-primary" value="#4361ee" preview="#4361ee" />
              <Token
                name="--gate-primary-light"
                value="#eef0fd"
                preview="#eef0fd"
              />
              <Token
                name="--gate-secondary"
                value="#2ec4b6"
                preview="#2ec4b6"
              />
              <Token
                name="--gate-secondary-light"
                value="#e8f8f7"
                preview="#e8f8f7"
              />
              <Token name="--gate-accent" value="#f77f00" preview="#f77f00" />
              <Token
                name="--gate-accent-light"
                value="#fff3e0"
                preview="#fff3e0"
              />
            </div>

            <h3 className="ds-subsection-title" style={{ marginTop: "2rem" }}>
              Neutrals
            </h3>
            <div className="ds-token-grid">
              <Token name="--gate-bg-main" value="#f8f9fa" preview="#f8f9fa" />
              <Token
                name="--gate-bg-sidebar"
                value="#ffffff"
                preview="#ffffff"
              />
              <Token
                name="--gate-text-primary"
                value="#212529"
                preview="#212529"
              />
              <Token
                name="--gate-text-secondary"
                value="#6c757d"
                preview="#6c757d"
              />
              <Token
                name="--gate-text-muted"
                value="#adb5bd"
                preview="#adb5bd"
              />
              <Token name="--gate-border" value="#e9ecef" preview="#e9ecef" />
            </div>

            <h3 className="ds-subsection-title" style={{ marginTop: "2rem" }}>
              Gradient — Primary Action
            </h3>
            <div className="ds-gradient-demo">
              <div
                className="ds-gradient-swatch"
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
              />
              <div className="ds-gradient-info">
                <code className="ds-token-name">gate-gradient-primary</code>
                <span className="ds-token-value">
                  linear-gradient(135deg, #667eea → #764ba2)
                </span>
                <span className="ds-token-usage">
                  Used in: .gate-btn-gradient-primary ·
                  .gate-sidebar-header-gradient · LoadingOverlay
                </span>
              </div>
            </div>

            <h3 className="ds-subsection-title" style={{ marginTop: "2rem" }}>
              Status Semantic Colors
            </h3>
            <div className="ds-token-grid">
              <Token name="status-active" value="#2ec4b6" preview="#2ec4b6" />
              <Token name="status-inactive" value="#adb5bd" preview="#adb5bd" />
              <Token name="status-pending" value="#f77f00" preview="#f77f00" />
            </div>

            <h3 className="ds-subsection-title" style={{ marginTop: "2rem" }}>
              Usage Code
            </h3>
            <CodeBlock
              code={`// Reference a color token in CSS
.my-element {
  color: var(--gate-primary);              /* #4361ee */
  background: var(--gate-primary-light);   /* #eef0fd */
  border-color: var(--gate-border);        /* #e9ecef */
}

// Gradient — primary action (button, sidebar header, overlay)
.my-gradient-element {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

// Status colors (inline via JS object)
const STATUS_COLORS = {
  Active:   { color: "#2ec4b6", bg: "#e8f8f7" },
  Inactive: { color: "#adb5bd", bg: "#f8f9fa" },
  Pending:  { color: "#f77f00", bg: "#fff3e0" },
};

<span style={{ color: STATUS_COLORS[status].color, backgroundColor: STATUS_COLORS[status].bg }}>
  {status}
</span>`}
            />
          </Section>
        )}

        {/* ──────────────── TYPOGRAPHY ──────────────── */}
        {activeTab === "typography" && (
          <Section
            id="typography"
            title="Typography"
            subtitle="Inter is the typeface for the entire Gate area."
          >
            <div className="ds-type-stack">
              <div className="ds-type-row">
                <span className="ds-type-tag">h1 / Page Title</span>
                <h1
                  className="ds-type-sample"
                  style={{
                    fontSize: "2rem",
                    fontWeight: 700,
                    letterSpacing: "-0.5px",
                  }}
                >
                  Patient Management
                </h1>
                <code className="ds-type-spec">700 · 2rem · −0.5px</code>
              </div>
              <div className="ds-type-row">
                <span className="ds-type-tag">h2 / Section</span>
                <h2
                  className="ds-type-sample"
                  style={{ fontSize: "1.5rem", fontWeight: 600 }}
                >
                  Treatment Overview
                </h2>
                <code className="ds-type-spec">600 · 1.5rem</code>
              </div>
              <div className="ds-type-row">
                <span className="ds-type-tag">h3 / Card Title</span>
                <h3
                  className="ds-type-sample"
                  style={{ fontSize: "1.1rem", fontWeight: 700 }}
                >
                  Session Details
                </h3>
                <code className="ds-type-spec">700 · 1.1rem</code>
              </div>
              <div className="ds-type-row">
                <span className="ds-type-tag">Body</span>
                <p
                  className="ds-type-sample"
                  style={{
                    fontSize: "0.92rem",
                    fontWeight: 500,
                    color: "#6c757d",
                  }}
                >
                  The patient completed 12 sessions with consistent progress
                  noted across all metrics.
                </p>
                <code className="ds-type-spec">
                  500 · 0.92rem · color-secondary
                </code>
              </div>
              <div className="ds-type-row">
                <span className="ds-type-tag">Table Header (TH)</span>
                <span
                  className="ds-type-sample"
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    textTransform: "capitalize",
                  }}
                >
                  Patient Name
                </span>
                <code className="ds-type-spec">700 · 0.95rem · capitalize</code>
              </div>
              <div className="ds-type-row">
                <span className="ds-type-tag">Label / Caption</span>
                <span
                  className="ds-type-sample"
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    color: "#6c757d",
                  }}
                >
                  Status
                </span>
                <code className="ds-type-spec">
                  600 · 0.8rem · UPPERCASE · +0.5px
                </code>
              </div>
            </div>

            <h3 className="ds-subsection-title" style={{ marginTop: "2rem" }}>
              Font Stack
            </h3>
            <CodeBlock
              code={`--gate-font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;`}
            />

            <h3 className="ds-subsection-title" style={{ marginTop: "2rem" }}>
              Usage Code
            </h3>
            <CodeBlock
              code={`// Page title  — font-size: 2rem, font-weight: 700, letter-spacing: -0.5px
<h1 style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.5px" }}>
  Patient Management
</h1>

// Section heading — font-size: 1.5rem, font-weight: 600
<h2 style={{ fontSize: "1.5rem", fontWeight: 600 }}>Treatment Overview</h2>

// Body text — font-size: 0.92rem, font-weight: 500, color: secondary
<p style={{ fontSize: "0.92rem", fontWeight: 500, color: "var(--gate-text-secondary)" }}>
  The patient completed 12 sessions.
</p>

// Table column header — already applied via .gate-table th
<th>Patient Name</th>   {/* 700 · 0.95rem · capitalize */}

// Label / caption — uppercase badge-style text
<span style={{ fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
  Status
</span>`}
            />
          </Section>
        )}

        {/* ──────────────── BUTTONS ──────────────── */}
        {activeTab === "buttons" && (
          <Section
            id="buttons"
            title="Buttons"
            subtitle="Four variants cover all Gate use cases."
          >
            <div className="ds-btn-showcase">
              <div className="ds-btn-row">
                <span className="ds-btn-label">
                  Gradient Primary
                  <br />
                  <code>.gate-btn-gradient-primary</code>
                </span>
                <div className="ds-btn-demos">
                  <button className="btn gate-btn-gradient-primary">
                    <i className="mdi mdi-plus me-2" /> New Treatment
                  </button>
                  <button
                    className="btn gate-btn-gradient-primary"
                    onClick={triggerLoader}
                    disabled={btnLoading}
                  >
                    {btnLoading ? (
                      <>
                        <i className="mdi mdi-loading mdi-spin me-2" />{" "}
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="mdi mdi-content-save-outline me-2" /> Save
                      </>
                    )}
                  </button>
                  <button className="btn gate-btn-gradient-primary" disabled>
                    Disabled
                  </button>
                </div>
              </div>

              <div className="ds-btn-row">
                <span className="ds-btn-label">
                  Outline
                  <br />
                  <code>.gate-btn-outline</code>
                </span>
                <div className="ds-btn-demos">
                  <button className="btn gate-btn-outline">
                    <i className="mdi mdi-export-variant me-2" /> Export
                  </button>
                  <button className="btn gate-btn-outline">
                    <i className="mdi mdi-filter-outline me-2" /> Filter
                  </button>
                  <button className="btn gate-btn-outline" disabled>
                    Disabled
                  </button>
                </div>
              </div>

              <div className="ds-btn-row">
                <span className="ds-btn-label">
                  Outline Primary
                  <br />
                  <code>.gate-btn-outline-primary</code>
                </span>
                <div className="ds-btn-demos">
                  <button className="btn gate-btn-outline-primary text-white">
                    <i className="mdi mdi-download me-2" /> Download PDF
                  </button>
                </div>
              </div>

              <div className="ds-btn-row">
                <span className="ds-btn-label">
                  Support / Docs
                  <br />
                  <code>.gate-support-btn</code>
                </span>
                <div className="ds-btn-demos">
                  <button className="gate-support-btn">
                    <i className="mdi mdi-file-document-outline me-1" /> View
                    Guide
                  </button>
                </div>
              </div>

              <div className="ds-btn-row">
                <span className="ds-btn-label">
                  Icon Action
                  <br />
                  <code>.gate-stimulation-actions .btn</code>
                </span>
                <div className="ds-btn-demos">
                  <div className="gate-stimulation-actions">
                    <button className="btn" title="Edit">
                      <i className="mdi mdi-pencil-outline" />
                    </button>
                    <button className="btn" title="View">
                      <i className="mdi mdi-eye-outline" />
                    </button>
                    <button className="btn" title="Delete">
                      <i className="mdi mdi-delete-outline" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <h3 className="ds-subsection-title" style={{ marginTop: "2rem" }}>
              Usage Code
            </h3>
            <CodeBlock
              code={`// Primary gradient action
<button className="btn gate-btn-gradient-primary">
  <i className="mdi mdi-plus me-2" /> New Treatment
</button>

// Outline secondary action
<button className="btn gate-btn-outline">
  <i className="mdi mdi-export-variant me-2" /> Export
</button>

// Circular icon action
<div className="gate-stimulation-actions">
  <button className="btn"><i className="mdi mdi-pencil-outline" /></button>
</div>`}
            />
          </Section>
        )}

        {/* ──────────────── CARDS ──────────────── */}
        {activeTab === "cards" && (
          <Section
            id="cards"
            title="Cards"
            subtitle="Structural containers used throughout Gate pages."
          >
            <h3 className="ds-subsection-title">Widget Card</h3>
            <div className="ds-card-row">
              {[
                {
                  icon: "mdi-account-group-outline",
                  label: "Total Patients",
                  value: "128",
                  color: "#4361ee",
                  bg: "#eef0fd",
                },
                {
                  icon: "mdi-flash-outline",
                  label: "Active Sessions",
                  value: "34",
                  color: "#2ec4b6",
                  bg: "#e8f8f7",
                },
                {
                  icon: "mdi-clipboard-check-outline",
                  label: "Completed",
                  value: "89",
                  color: "#f77f00",
                  bg: "#fff3e0",
                },
              ].map((w) => (
                <div key={w.label} className="gate-widget-card">
                  <div
                    className="gate-widget-icon"
                    style={{ color: w.color, backgroundColor: w.bg }}
                  >
                    <i className={`mdi ${w.icon}`} />
                  </div>
                  <div className="gate-widget-content">
                    <h5>{w.label}</h5>
                    <p className="gate-widget-value">{w.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="ds-subsection-title" style={{ marginTop: "2rem" }}>
              Welcome Card
            </h3>
            <div className="gate-welcome-card" style={{ padding: "40px" }}>
              <div className="gate-welcome-icon-box">
                <i className="mdi mdi-hospital-building" />
              </div>
              <h2 className="gate-welcome-title">Welcome to Gate</h2>
              <p className="gate-welcome-subtitle">
                Your clinical workspace. Manage patients, sessions, and
                stimulation protocols from a single interface.
              </p>
            </div>

            <h3 className="ds-subsection-title" style={{ marginTop: "2rem" }}>
              Stimulation Card
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px,1fr))",
                gap: "1rem",
              }}
            >
              {[
                {
                  name: "Alpha Wave",
                  display: "TMS-A",
                  desc: "Standard transcranial magnetic stimulation protocol for depression treatment.",
                  freq: "10 Hz",
                  dur: "30 min",
                  color: "#4361ee",
                },
                {
                  name: "Beta Burst",
                  display: "TBS-B",
                  desc: "Theta burst protocol optimised for motor cortex modulation.",
                  freq: "50 Hz",
                  dur: "20 min",
                  color: "#2ec4b6",
                },
              ].map((s) => (
                <div key={s.name} className="gate-stimulation-card">
                  <div
                    className="gate-stimulation-card-color-bar"
                    style={{ backgroundColor: s.color }}
                  />
                  <div className="gate-stimulation-header">
                    <div>
                      <h4>{s.name}</h4>
                      <span className="gate-stimulation-display-name">
                        {s.display}
                      </span>
                    </div>
                  </div>
                  <p className="gate-stimulation-desc">{s.desc}</p>
                  <div className="gate-stimulation-metrics">
                    <span className="gate-stimulation-metric">
                      <i className="mdi mdi-sine-wave" />
                      {s.freq}
                    </span>
                    <span className="gate-stimulation-metric">
                      <i className="mdi mdi-clock-outline" />
                      {s.dur}
                    </span>
                  </div>
                  <div className="gate-stimulation-footer">
                    <span style={{ fontSize: "0.8rem", color: "#6c757d" }}>
                      Protocol ID: {s.display}
                    </span>
                    <div className="gate-stimulation-actions">
                      <button className="btn">
                        <i className="mdi mdi-eye-outline" />
                      </button>
                      <button className="btn">
                        <i className="mdi mdi-pencil-outline" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="ds-subsection-title" style={{ marginTop: "2rem" }}>
              Usage Code
            </h3>
            <CodeBlock
              code={`// ── Widget Card ──────────────────────────────────────────────────────────────
<div className="gate-widget-card">
  <div className="gate-widget-icon" style={{ color: "#4361ee", backgroundColor: "#eef0fd" }}>
    <i className="mdi mdi-account-group-outline" />
  </div>
  <div className="gate-widget-content">
    <h5>Total Patients</h5>
    <p className="gate-widget-value">128</p>
  </div>
</div>

// ── Welcome Card ──────────────────────────────────────────────────────────────
<div className="gate-welcome-card" style={{ padding: "40px" }}>
  <div className="gate-welcome-icon-box">
    <i className="mdi mdi-hospital-building" />
  </div>
  <h2 className="gate-welcome-title">Welcome to Gate</h2>
  <p className="gate-welcome-subtitle">Your clinical workspace.</p>
</div>

// ── Stimulation Card ──────────────────────────────────────────────────────────
<div className="gate-stimulation-card">
  <div className="gate-stimulation-card-color-bar" style={{ backgroundColor: "#4361ee" }} />
  <div className="gate-stimulation-header">
    <h4>Alpha Wave</h4>
    <span className="gate-stimulation-display-name">TMS-A</span>
  </div>
  <p className="gate-stimulation-desc">Standard TMS protocol for depression treatment.</p>
  <div className="gate-stimulation-metrics">
    <span className="gate-stimulation-metric"><i className="mdi mdi-sine-wave" /> 10 Hz</span>
    <span className="gate-stimulation-metric"><i className="mdi mdi-clock-outline" /> 30 min</span>
  </div>
  <div className="gate-stimulation-footer">
    <span>Protocol ID: TMS-A</span>
    <div className="gate-stimulation-actions">
      <button className="btn"><i className="mdi mdi-eye-outline" /></button>
      <button className="btn"><i className="mdi mdi-pencil-outline" /></button>
    </div>
  </div>
</div>`}
            />
          </Section>
        )}

        {/* ──────────────── TABLES ──────────────── */}
        {activeTab === "tables" && (
          <Section
            id="tables"
            title="Tables"
            subtitle="Two table modes are used in Gate: basic and paginated."
          >
            <h3 className="ds-subsection-title">Standard Gate Table</h3>
            <div className="gate-table-card">
              <div
                className="card-header"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h4>
                  Patients{" "}
                  <span
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 400,
                      color: "#6c757d",
                      marginLeft: "8px",
                    }}
                  >
                    4 records
                  </span>
                </h4>
                <button
                  className="btn gate-btn-gradient-primary"
                  style={{ fontSize: "0.85rem", padding: "6px 16px" }}
                >
                  <i className="mdi mdi-plus me-1" /> Add Patient
                </button>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table className="gate-table table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Clinic</th>
                      <th>Sessions</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_PATIENTS.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <code style={{ fontSize: "0.8rem" }}>{p.id}</code>
                        </td>
                        <td style={{ fontWeight: 600 }}>{p.name}</td>
                        <td>{p.clinic}</td>
                        <td>{p.sessions}</td>
                        <td>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "5px",
                              fontSize: "0.78rem",
                              fontWeight: 600,
                              padding: "3px 10px",
                              borderRadius: "20px",
                              color: STATUS_COLORS[p.status],
                              backgroundColor: STATUS_BG[p.status],
                            }}
                          >
                            <i
                              className={`mdi mdi-circle`}
                              style={{ fontSize: "7px" }}
                            />
                            {p.status}
                          </span>
                        </td>
                        <td>
                          <div className="gate-stimulation-actions">
                            <button className="btn">
                              <i className="mdi mdi-eye-outline" />
                            </button>
                            <button className="btn">
                              <i className="mdi mdi-pencil-outline" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <h3 className="ds-subsection-title" style={{ marginTop: "2rem" }}>
              Paginated Table (gate-table-wrapper)
            </h3>
            <div className="gate-table-wrapper">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <h4 style={{ margin: 0, fontWeight: 700 }}>Stimulations</h4>
                <div style={{ display: "flex", gap: "10px" }}>
                  <input
                    className="form-control gate-global-search"
                    placeholder="Search stimulations..."
                    style={{
                      width: "220px",
                      borderRadius: "8px",
                      border: "1px solid #e9ecef",
                    }}
                    readOnly
                  />
                  <button
                    className="btn gate-btn-gradient-primary"
                    style={{ fontSize: "0.85rem", padding: "6px 16px" }}
                  >
                    <i className="mdi mdi-plus me-1" /> Add
                  </button>
                </div>
              </div>
              <table className="gate-table table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Display Name</th>
                    <th>Sessions</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {["Alpha Wave", "Beta Burst", "Gamma Pulse"].map((n, i) => (
                    <tr key={n}>
                      <td style={{ fontWeight: 600 }}>{n}</td>
                      <td>
                        <code style={{ fontSize: "0.8rem" }}>
                          TMS-{String.fromCharCode(65 + i)}
                        </code>
                      </td>
                      <td>{10 + i * 7}</td>
                      <td>
                        <div className="gate-stimulation-actions">
                          <button className="btn">
                            <i className="mdi mdi-eye-outline" />
                          </button>
                          <button className="btn">
                            <i className="mdi mdi-pencil-outline" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "20px",
                }}
              >
                <span style={{ fontSize: "0.85rem", color: "#6c757d" }}>
                  Showing 1-3 of 3
                </span>
                <div className="gate-pagination" style={{ display: "flex" }}>
                  <button className="gate-page-btn" disabled>
                    <i className="mdi mdi-chevron-left" />
                  </button>
                  <button className="gate-page-btn active">1</button>
                  <button className="gate-page-btn">2</button>
                  <button className="gate-page-btn">3</button>
                  <button className="gate-page-btn">
                    <i className="mdi mdi-chevron-right" />
                  </button>
                </div>
              </div>
            </div>

            <h3 className="ds-subsection-title" style={{ marginTop: "2rem" }}>
              Usage Code
            </h3>
            <CodeBlock
              code={`// ── Standard table inside a card container ───────────────────────────────────────────────
<div className="gate-table-card">
  <div className="card-header" style={{ display: "flex", justifyContent: "space-between" }}>
    <h4>Patients</h4>
    <button className="btn gate-btn-gradient-primary">
      <i className="mdi mdi-plus me-1" /> Add Patient
    </button>
  </div>
  <table className="gate-table table">
    <thead>
      <tr>
        <th>ID</th><th>Name</th><th>Status</th><th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {patients.map((p) => (
        <tr key={p.id}>
          <td><code>{p.id}</code></td>
          <td style={{ fontWeight: 600 }}>{p.name}</td>
          <td>{/* Status pill */}</td>
          <td>
            <div className="gate-stimulation-actions">
              <button className="btn"><i className="mdi mdi-eye-outline" /></button>
              <button className="btn"><i className="mdi mdi-pencil-outline" /></button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

// ── Paginated table (gate-table-wrapper) ───────────────────────────────────────────────
<div className="gate-table-wrapper">
  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
    <h4>Stimulations</h4>
    <input className="form-control gate-global-search" placeholder="Search..." />
  </div>
  <table className="gate-table table">...</table>
  {/* Pagination */}
  <div className="gate-pagination" style={{ display: "flex" }}>
    <button className="gate-page-btn" disabled><i className="mdi mdi-chevron-left" /></button>
    <button className="gate-page-btn active">1</button>
    <button className="gate-page-btn">2</button>
    <button className="gate-page-btn"><i className="mdi mdi-chevron-right" /></button>
  </div>
</div>`}
            />
          </Section>
        )}

        {/* ──────────────── BADGES ──────────────── */}
        {activeTab === "badges" && (
          <Section
            id="badges"
            title="Badges & Status"
            subtitle="Status pills and semantic badges used in tables and cards."
          >
            <h3 className="ds-subsection-title">Status Pills</h3>
            <div className="ds-badge-row">
              {Object.entries(STATUS_COLORS).map(([k, c]) => (
                <span
                  key={k}
                  className="ds-status-pill"
                  style={{ color: c, backgroundColor: STATUS_BG[k] }}
                >
                  <i className="mdi mdi-circle" style={{ fontSize: "7px" }} />
                  {k}
                </span>
              ))}
              {[
                { label: "Completed", color: "#4361ee", bg: "#eef0fd" },
                { label: "Cancelled", color: "#e63946", bg: "#fde8ea" },
                { label: "Draft", color: "#6c757d", bg: "#f8f9fa" },
              ].map((b) => (
                <span
                  key={b.label}
                  className="ds-status-pill"
                  style={{ color: b.color, backgroundColor: b.bg }}
                >
                  <i className="mdi mdi-circle" style={{ fontSize: "7px" }} />
                  {b.label}
                </span>
              ))}
            </div>

            <h3 className="ds-subsection-title" style={{ marginTop: "2rem" }}>
              Metric Tags
            </h3>
            <div className="ds-badge-row">
              {[
                { icon: "mdi-sine-wave", text: "10 Hz" },
                { icon: "mdi-clock-outline", text: "30 min" },
                { icon: "mdi-flash", text: "1.5 mT" },
                { icon: "mdi-map-marker", text: "Left Motor Cortex" },
              ].map((m) => (
                <span key={m.text} className="gate-stimulation-metric">
                  <i className={`mdi ${m.icon}`} />
                  {m.text}
                </span>
              ))}
            </div>

            <h3 className="ds-subsection-title" style={{ marginTop: "2rem" }}>
              Code
            </h3>
            <CodeBlock
              code={`// Status pill (Active)
<span style={{
  display: "inline-flex", alignItems: "center", gap: "5px",
  fontSize: "0.78rem", fontWeight: 600, padding: "3px 10px", borderRadius: "20px",
  color: "#2ec4b6", backgroundColor: "#e8f8f7"
}}>
  <i className="mdi mdi-circle" style={{ fontSize: "7px" }} />
  Active
</span>

// Metric tag
<span className="gate-stimulation-metric">
  <i className="mdi mdi-clock-outline" /> 30 min
</span>`}
            />
          </Section>
        )}

        {/* ──────────────── ICONS ──────────────── */}
        {activeTab === "icons" && (
          <Section
            id="icons"
            title="Icon Library"
            subtitle="MDI (Material Design Icons) via mdi class. Prefix: mdi-*"
          >
            <div className="ds-icon-grid">
              {[
                "mdi-account-group-outline",
                "mdi-clipboard-check-outline",
                "mdi-flash-outline",
                "mdi-hospital-building",
                "mdi-sine-wave",
                "mdi-clock-outline",
                "mdi-map-marker-outline",
                "mdi-pencil-outline",
                "mdi-eye-outline",
                "mdi-delete-outline",
                "mdi-check-circle",
                "mdi-alert-circle-outline",
                "mdi-download",
                "mdi-upload",
                "mdi-filter-outline",
                "mdi-plus",
                "mdi-close",
                "mdi-magnify",
                "mdi-reload",
                "mdi-dots-vertical",
                "mdi-chevron-left",
                "mdi-chevron-right",
                "mdi-arrow-right",
                "mdi-lock-outline",
                "mdi-shield-check-outline",
                "mdi-cog-outline",
                "mdi-bell-outline",
                "mdi-logout",
                "mdi-home-outline",
                "mdi-table-large",
                "mdi-chart-bar",
                "mdi-export-variant",
                "mdi-content-save-outline",
                "mdi-file-document-outline",
                "mdi-atom-variant",
                "mdi-shape-outline",
                "mdi-palette-outline",
                "mdi-format-font",
                "mdi-card-outline",
              ].map((ic) => (
                <div key={ic} className="ds-icon-item" title={ic}>
                  <i className={`mdi ${ic} ds-icon-preview`} />
                  <code className="ds-icon-name">{ic.replace("mdi-", "")}</code>
                </div>
              ))}
            </div>
            <CodeBlock
              code={`// Usage
<i className="mdi mdi-account-group-outline" />
<i className="mdi mdi-flash-outline" style={{ fontSize: "24px", color: "var(--gate-primary)" }} />`}
            />
          </Section>
        )}

        {/* ──────────────── FEEDBACK ──────────────── */}
        {activeTab === "feedback" && (
          <Section
            id="feedback"
            title="Feedback & Loading"
            subtitle="Skeleton loaders, toast notifications, and inline alerts."
          >
            <h3 className="ds-subsection-title">Skeleton Loader</h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <div
                className="gate-skeleton"
                style={{ height: "40px", width: "300px", borderRadius: "8px" }}
              />
              <div
                className="gate-skeleton"
                style={{ height: "120px", width: "100%", borderRadius: "12px" }}
              />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "12px",
                }}
              >
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="gate-skeleton"
                    style={{ height: "80px", borderRadius: "10px" }}
                  />
                ))}
              </div>
            </div>

            <h3 className="ds-subsection-title" style={{ marginTop: "2rem" }}>
              Top Loading Bar
            </h3>
            <div
              style={{
                position: "relative",
                height: "36px",
                background: "#f8f9fa",
                borderRadius: "8px",
                overflow: "hidden",
                border: "1px solid #e9ecef",
              }}
            >
              <div
                className="gate-top-loading-bar"
                style={{ position: "absolute" }}
              />
            </div>
            <p
              style={{ fontSize: "0.8rem", color: "#6c757d", marginTop: "8px" }}
            >
              Shown during page transitions inside <code>GateLayout</code>
            </p>

            <h3 className="ds-subsection-title" style={{ marginTop: "2rem" }}>
              Toast Notification
            </h3>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <button
                className="btn gate-btn-gradient-primary"
                onClick={triggerToast}
              >
                Trigger Toast
              </button>
              {toastVisible && (
                <div className="ds-toast">
                  <i
                    className="mdi mdi-check-circle"
                    style={{ color: "#2ec4b6", fontSize: "20px" }}
                  />
                  <span>Changes saved successfully!</span>
                </div>
              )}
            </div>

            <h3 className="ds-subsection-title" style={{ marginTop: "2rem" }}>
              Inline Alerts
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {[
                {
                  icon: "mdi-check-circle-outline",
                  color: "#2ec4b6",
                  bg: "#e8f8f7",
                  msg: "Patient record updated successfully.",
                },
                {
                  icon: "mdi-alert-circle-outline",
                  color: "#f77f00",
                  bg: "#fff3e0",
                  msg: "Session limit approaching for this patient.",
                },
                {
                  icon: "mdi-close-circle-outline",
                  color: "#e63946",
                  bg: "#fde8ea",
                  msg: "Failed to load stimulation data. Please retry.",
                },
                {
                  icon: "mdi-information-outline",
                  color: "#4361ee",
                  bg: "#eef0fd",
                  msg: "This protocol requires clinical approval before use.",
                },
              ].map((a) => (
                <div
                  key={a.msg}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    backgroundColor: a.bg,
                    border: `1px solid ${a.color}22`,
                  }}
                >
                  <i
                    className={`mdi ${a.icon}`}
                    style={{ color: a.color, fontSize: "20px" }}
                  />
                  <span style={{ fontSize: "0.9rem", color: "#212529" }}>
                    {a.msg}
                  </span>
                </div>
              ))}
            </div>

            <h3 className="ds-subsection-title" style={{ marginTop: "2rem" }}>
              Usage Code
            </h3>
            <CodeBlock
              code={`// ── Skeleton loader ────────────────────────────────────────────────────────────────
// Use while data is loading  —  replace with real content once ready
<div className="gate-skeleton" style={{ height: "40px", width: "300px", borderRadius: "8px" }} />
<div className="gate-skeleton" style={{ height: "120px", width: "100%", borderRadius: "12px" }} />

// Grid of skeleton cards
<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
  {[1, 2, 3].map((i) => (
    <div key={i} className="gate-skeleton" style={{ height: "80px", borderRadius: "10px" }} />
  ))}
</div>

// ── Top loading bar (page transition) ───────────────────────────────────────────────
// GateLayout renders this automatically on route change — no extra code needed.
// To show it manually:
{isTransitioning && <div className="gate-top-loading-bar" />}

// ── Toast notification (React state pattern) ──────────────────────────────────────────
const [toast, setToast] = useState(false);
const showToast = () => { setToast(true); setTimeout(() => setToast(false), 2500); };

{toast && (
  <div className="ds-toast">
    <i className="mdi mdi-check-circle" style={{ color: "#2ec4b6", fontSize: "20px" }} />
    <span>Changes saved successfully!</span>
  </div>
)}

// ── Inline alerts ──────────────────────────────────────────────────────────────────
// Success
<div style={{ display:"flex", alignItems:"center", gap:"10px", padding:"12px 16px",
  borderRadius:"8px", backgroundColor:"#e8f8f7", border:"1px solid #2ec4b622" }}>
  <i className="mdi mdi-check-circle-outline" style={{ color:"#2ec4b6", fontSize:"20px" }} />
  <span>Patient record updated successfully.</span>
</div>

// Warning
<div style={{ backgroundColor:"#fff3e0", border:"1px solid #f77f0022", ... }}>
  <i className="mdi mdi-alert-circle-outline" style={{ color:"#f77f00" }} />
  <span>Session limit approaching.</span>
</div>

// Error
<div style={{ backgroundColor:"#fde8ea", border:"1px solid #e6394622", ... }}>
  <i className="mdi mdi-close-circle-outline" style={{ color:"#e63946" }} />
  <span>Failed to load data. Please retry.</span>
</div>

// Info
<div style={{ backgroundColor:"#eef0fd", border:"1px solid #4361ee22", ... }}>
  <i className="mdi mdi-information-outline" style={{ color:"#4361ee" }} />
  <span>Clinical approval required before use.</span>
</div>`}
            />
          </Section>
        )}

        {/* ──────────────── LAYOUT ──────────────── */}
        {activeTab === "layout" && (
          <Section
            id="layout"
            title="Layout System"
            subtitle="The Gate layout is composed of Sidebar + Header + Content Area + Footer."
          >
            <div className="ds-layout-diagram">
              <div className="ds-layout-sidebar">
                <div className="ds-layout-logo" />
                {["Home", "Patients", "Stimulations", "Resources"].map((l) => (
                  <div key={l} className="ds-layout-nav-item">
                    {l}
                  </div>
                ))}
              </div>
              <div className="ds-layout-main">
                <div className="ds-layout-header">
                  <span>Page Title</span>
                  <span style={{ fontSize: "0.8rem", opacity: 0.6 }}>
                    Header actions
                  </span>
                </div>
                <div className="ds-layout-content">
                  <div className="ds-layout-content-label">
                    gate-content-area
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gap: "8px",
                      marginTop: "10px",
                    }}
                  >
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="ds-layout-widget" />
                    ))}
                  </div>
                  <div className="ds-layout-table" />
                </div>
                <div className="ds-layout-footer">Footer</div>
              </div>
            </div>

            <h3 className="ds-subsection-title" style={{ marginTop: "2rem" }}>
              CSS Tokens
            </h3>
            <CodeBlock
              code={`--gate-sidebar-width:           260px;  /* expanded */
--gate-sidebar-collapsed-width:  80px;  /* collapsed (sidebar-collapsed class) */
--gate-header-height:            70px;
--gate-shadow-sm:   0 2px 4px rgba(0,0,0,0.02);
--gate-shadow-md:   0 4px 12px rgba(0,0,0,0.05);
--gate-shadow-lg:   0 8px 24px rgba(0,0,0,0.08);
--gate-transition-fast:   0.2s ease-in-out;
--gate-transition-normal: 0.3s ease-in-out;`}
            />

            <h3 className="ds-subsection-title" style={{ marginTop: "2rem" }}>
              Route Structure
            </h3>
            <CodeBlock
              code={`// Each Gate page is wrapped by GateGuard → GateLayout + ClinicProvider
<GateGuard>            // handles 401 interception
  <GateLayout>         // Sidebar + Header + Footer
    <ClinicProvider>   // clinic context
      <YourPage />
    </ClinicProvider>
  </GateLayout>
</GateGuard>

// Clinician-only routes registered in routes/index.jsx:
{ path: "/gate/home",          component: <GateHome /> }
{ path: "/gate/patients",      component: <GatePatients /> }
{ path: "/gate/stimulations",  component: <GateStimulations /> }
{ path: "/gate/resources",     component: <GateResources /> }
{ path: "/gate/design",        component: <DesignSystem /> }`}
            />
          </Section>
        )}
      </div>

      {/* Toast rendered globally */}
    </div>
  );
};

export default DesignSystem;
