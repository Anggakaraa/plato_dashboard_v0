import { formatDate } from "../../../util/time";

const Disabled = (cell) => {
  const value =
    cell.value === undefined || cell.value === null ? "" : cell.value;
  return value.toString();
};

const Name = (cell) => (cell.value ? cell.value : "");
const Clinic = (item) => {
  return item.clinic_clinician.clinic.name;
};
const Clinician = (item) => {
  return item.clinic_clinician.clinician.email;
};

const StartedAt = (cell) => formatDate(cell.value);
const EndedAt = (cell) => formatDate(cell.value);
const CreateAt = (cell) => formatDate(cell.value);
const UpdatedAt = (cell) => formatDate(cell.value);

const TreatmentType = (item) => {
  return item.research_treatment === 1 ? "Research Treatment" : "Regular";
};

export {
  Name,
  Clinic,
  Clinician,
  StartedAt,
  EndedAt,
  CreateAt,
  UpdatedAt,
  Disabled,
  TreatmentType,
};
