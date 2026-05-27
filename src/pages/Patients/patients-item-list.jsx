import { formatDate } from "../../util/time";

const Name = (cell) => cell.value ? cell.value : '';
const Email = (cell) => {
    /*if(cell.value.includes('plato')){
        return cell.value.split('@')[0];
    };*/
    return cell.value;
} 
const Id =  (cell) => cell.value ? 'patient' + cell.value+ '@platoscience.clinic' : '';

const Disabled = (cell) => {
    const value = cell.value === undefined || cell.value === null ? '' : cell.value;
    return value.toString();
};

const hasActiveTreatment = (cell) => {
    const treatments = cell.value.length > 0 ? cell.value : [];
    console.log(cell);
    treatments.forEach(treatment => {
        if(treatment.started_at != null && treatment.ended_at === null){
            return <Badge color="sucess" className="fs-6 text">Yes</Badge>
        }else{
            return <Badge color="danger" className="fs-6 text">No</Badge>
        }
    });
}

const CreateAt = (cell) => formatDate(cell.value);
const UpdatedAt = (cell) => formatDate(cell.value);

export {
    Id,
    Name,
    Email,
    Disabled,
    CreateAt,
    UpdatedAt,
    hasActiveTreatment
};