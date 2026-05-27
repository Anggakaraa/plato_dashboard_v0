import { formatDate } from "../../util/time";

const Name = (cell) => cell.value ? cell.value : '';
const Email = (cell) => cell.value ? cell.value : '';

const Disabled = (cell) => {
    const value = cell.value === undefined || cell.value === null ? '' : cell.value;
    return value.toString();
};

const Country = (cell) => cell.value ? cell.value : '';
const CreateAt = (cell) => formatDate(cell.value);
const UpdatedAt = (cell) => formatDate(cell.value);

export {
    Name,
    Email,
    Country,
    Disabled,
    CreateAt,
    UpdatedAt
};