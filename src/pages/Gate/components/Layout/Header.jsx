import React from "react";
import { useUser } from "../../../../hooks/user";
import { useClinic } from "../../contexts/ClinicContext";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

const Header = ({ toggleSidebar }) => {
  const { user } = useUser();
  const { selectedClinic, clinics, isLoading } = useClinic();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const getClinicName = () => {
    if (isLoading) return "Loading...";
    if (selectedClinic) return selectedClinic.name;
    if (!user) return "PlatoScience Clinic";
    if (Array.isArray(user.clinics) && user.clinics.length > 0) {
      return user.clinics[0].name || "PlatoScience Clinic";
    }
    if (Array.isArray(user.clinic) && user.clinic.length > 0) {
      return user.clinic[0].name || "PlatoScience Clinic";
    }
    if (
      user.clinic &&
      typeof user.clinic === "object" &&
      !Array.isArray(user.clinic)
    ) {
      return user.clinic.name || "PlatoScience Clinic";
    }
    return "PlatoScience Clinic";
  };

  const clinicName = getClinicName();

  return (
    <header className="gate-header">
      <div
        className="gate-header-left"
        style={{ display: "flex", alignItems: "center", gap: "20px" }}
      >
        <button
          onClick={toggleSidebar}
          className="btn btn-sm px-3 font-size-24 header-item waves-effect gate-hamburger-btn"
          id="vertical-menu-btn"
        >
          <i className="mdi mdi-menu"></i>
        </button>
        <h1 className="gate-header-title">{clinicName}</h1>
      </div>

      <div className="gate-header-right">
        <Dropdown
          isOpen={dropdownOpen}
          toggle={toggle}
          className="d-inline-block"
        >
          <DropdownToggle
            tag="button"
            className="btn header-item waves-effect"
            id="page-header-user-dropdown"
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <i
                className="mdi mdi-account-circle-outline"
                style={{ fontSize: "24px" }}
              ></i>
              <span className="d-none d-xl-inline-block ms-1 fw-medium font-size-15">
                {user?.username || "Clinician"}
              </span>
              <i className="mdi mdi-chevron-down d-none d-xl-inline-block"></i>
            </div>
          </DropdownToggle>
          <DropdownMenu className="dropdown-menu-end">
            <DropdownItem tag="a" href="/logout" className="text-danger">
              <i className="bx bx-power-off font-size-16 align-middle me-1 text-danger"></i>
              Logout
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </header>
  );
};

export default Header;
