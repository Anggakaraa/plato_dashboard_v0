import React, { useMemo } from "react";
import DataTable from "react-data-table-component";

const ShowLeftRight = (props) => {
  const data = [
    {
      name: "Left [Standard]",
      duration: "30 min",
      current: "1.2 mA",
      anode: "left",
      cathode: "right",
    },
    {
      name: "Right [Standard]",
      duration: "30 min",
      current: "1.2 mA",
      anode: "right",
      cathode: "left",
    },
    {
      name: "Left [Alternative]",
      duration: "30 min",
      current: "1.2 mA",
      anode: "left",
      cathode: "back",
    },
    {
      name: "Right [Alternative]",
      duration: "30 min",
      current: "1.2 mA",
      anode: "right",
      cathode: "back",
    },
  ];
  const columns = [
    {
      name: "Title",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Anode",
      selector: (row) => row.anode,
      sortable: true,
    },
    {
      name: "Cathode",
      selector: (row) => row.cathode,
      sortable: true,
    },
    {
      name: "Current",
      selector: (row) => row.current,
      sortable: true,
    },
    {
      name: "Duration",
      selector: (row) => row.duration,
      sortable: true,
    },
  ];

  return (
    <React.Fragment>
      <div className="table-responsive react-table">
        <DataTable columns={columns} data={data} />
      </div>
    </React.Fragment>
  );
};

export default ShowLeftRight;
