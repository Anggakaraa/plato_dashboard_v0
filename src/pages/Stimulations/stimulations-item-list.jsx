import React from "react";
import { formatDate } from "../../util/time";
import { Link } from "react-router-dom";
import { Badge } from "reactstrap";

const getValue = (cell) => cell.row.original;

const Title = (cell) => {
  const item = getValue(cell);
  return item.title;
};

const Name = (cell) => {
  const item = getValue(cell);
  return item.name || '---';
};

const ShortDescription = (cell) => {
  const item = getValue(cell);
  return item.short_description;
};
const anodeCathodeValues = (value) => {
  switch (value) {
    case 'L':
      return <Badge color="info" className="fs-6 text">Left</Badge>;
    case 'R':
      return <Badge color="secondary" className="fs-6 text">Right</Badge>;
    case 'B':
      return <Badge color="dark" className="fs-6 text">Back</Badge>;
  }
}
const Anode = (cell) => {
  const item = getValue(cell);
  return item.tes_stimulations_tdcs_parameters ? anodeCathodeValues(item.tes_stimulations_tdcs_parameters[0].tdcs_parameter.anode) : '';
};

const Cathode = (cell) => {
  const item = getValue(cell);
  return item.tes_stimulations_tdcs_parameters ? anodeCathodeValues(item.tes_stimulations_tdcs_parameters[0].tdcs_parameter.cathode) : '';
};

const Current = (cell) => {
  const item = getValue(cell);
  return item.tes_stimulations_tdcs_parameters ? item.tes_stimulations_tdcs_parameters[0].tdcs_parameter.current : 0;
};

const Duration = (cell) => {
  const item = getValue(cell);
  return  item.tes_stimulations_tdcs_parameters ? `${item.tes_stimulations_tdcs_parameters[0].tdcs_parameter.duration / 60} min` : '';
};

const CreateAt = (cell) => formatDate(cell.value);
const UpdatedAt = (cell) => formatDate(cell.value);

const Color = (cell) => {
  const item = getValue(cell);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ backgroundColor: item.color, height: 20, width: 20 }}></div>
    </div>
  );
};

const Original = (cell) => {
  const item = getValue(cell);
  const isOriginal = () => item.original;

  const defaults = ['Learn', 'Create', 'Create', 'Rethink', 'Concentrate', 'Calm'];

  const getType = () => 
    
    item.key === 'default' ? 
    <Badge color="info" className="fs-6 text">Default Legacy</Badge> : isOriginal() ?
    <Badge color="primary" className="fs-6 text">Original</Badge> : 
    <Badge color="success" className="fs-6 text">Custom</Badge>

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
     {getType()}
        
    </div>
  );
};

export { Title, Name, ShortDescription, Anode, Cathode, Current, Duration, CreateAt, UpdatedAt, Color, Original };
