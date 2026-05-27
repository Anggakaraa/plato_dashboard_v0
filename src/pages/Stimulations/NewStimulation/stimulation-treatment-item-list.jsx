import { formatDate } from "../../../util/time";

const Disabled = (cell) => {
    const value = cell.value === undefined || cell.value === null ? '' : cell.value;
    return value.toString();
};

const Name = cell => cell.value ? cell.value : '';

const StartedAt = cell => formatDate(cell.value);
const EndedAt = cell => formatDate(cell.value);
const CreateAt = cell => formatDate(cell.value);
const UpdatedAt = cell => formatDate(cell.value);


export { Name, StartedAt, EndedAt, CreateAt, UpdatedAt, Disabled };
