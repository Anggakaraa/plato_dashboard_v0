import React from "react"
import DataTable from 'react-data-table-component'

const ShowLearnCreate = props => {

    const data = [
        {
            name: 'Learn',
            duration: '30 min',
            current: '120',
            anode: 'left',
            cathode: 'right'
        },
        {
            name: 'Create',
            duration: '30 min',
            current: '120',
            anode: 'right',
            cathode: 'left'
        },
        {
            name: 'Concentrate',
            duration: '30 min',
            current: '120',
            anode: 'left',
            cathode: 'back'
        },
        {
            name: 'Rethink',
            duration: '30 min',
            current: '120',
            anode: 'back',
            cathode: 'left'
        },
        {
            name: 'Clarity',
            duration: '30 min',
            current: '120',
            anode: 'right',
            cathode: 'back'
        },
        {
            name: 'Calm',
            duration: '30 min',
            current: '120',
            anode: 'back',
            cathode: 'right'
        }
    ]
    const columns = [
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true
        },
        {
            name: 'Duration',
            selector: row => row.duration,
            sortable: true
        },
        {
            name: 'Current',
            selector: row => row.current,
            sortable: true
        },
        {
            name: 'Anode',
            selector: row => row.anode,
            sortable: true
        },
        {
            name: 'Cathode',
            selector: row => row.cathode,
            sortable: true
        }
    ]
   
  return (
    <React.Fragment>
        <div className="table-responsive react-table">
            <DataTable bordered hover columns={columns} data={data} />
        </div>
      
    </React.Fragment>
  )
}

export default ShowLearnCreate
