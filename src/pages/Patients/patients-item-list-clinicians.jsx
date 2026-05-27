import { formatDate } from "../../util/time";

const Name = (cell) => cell.value ? cell.value : '';
const Email = (cell) => {
    if(cell.value.includes('platoscience.clinic')){
        return cell.value.split('@')[0];
    }else{
        return cell.value;
    }
    
} 
const Id =  (cell) => cell.value ? 'patient' + cell.value+ '@platoscience.clinic' : '';

const Disabled = (cell) => {
    const value = cell.value === undefined || cell.value === null ? '' : cell.value;
    return value.toString();
};

const CreateAt = (cell) => formatDate(cell.value);
const UpdatedAt = (cell) => formatDate(cell.value);

export {
    Id,
    Name,
    Email,
    Disabled,
    CreateAt,
    UpdatedAt
};