import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { useUser } from "../../../hooks/user";

export default function ResistanceChart({ data }) {

  const { isPlato, isClinician } = useUser();
  
  function CustomTooltip({ payload, label, active }) {
    if (active) {
    
      return (
        <div className="custom-tooltip">
          <ul>
            <li className="label">{`Status : ${payload[0].payload.raw.split(',')[0]}`}</li>
            <li className="label">{`Elasped Time : ${parseInt(payload[0].payload.raw.split(',')[1])} Seconds`}</li>
            <li className="label">{`Batery : ${parseInt(payload[0].payload.raw.split(',')[2])/100} V`}</li>
            <li className="label">{`Current : ${parseInt(payload[0].payload.raw.split(',')[3])/100} mA`}</li>
            <li className="label">{`Electrode Voltage : ${parseInt(payload[0].payload.raw.split(',')[4])/100} Volt`}</li>
            <li className="label">{`Resistance: ${payload[0].payload.resistance.toFixed(0)} `}</li>
            <li className={`label fix-text-white ${isClinician() ? 'hidden':''}`}>{`Raw : ${payload[0].payload.raw}`}</li>
          </ul>
        </div>
      );
    }
  
    return null;
  }

  return (
    <div className="col" style={{ width: '100%', height: 300, marginLeft: -50 }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 5,
            left: 20,
            bottom: 0
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis autoReverse={true} dataKey="time"/>
          <YAxis name="resistance" padding={{top: 0, bottom: 10}} dataKey="resistance"  />
          <Tooltip content={<CustomTooltip />}/>
          <Legend />
          <Line legendType="none" dataKey="resistance" type="monotoneX"/>
          <Line legendType="none" dataKey="good" type="basisClosed" dot={false} stroke="#000099" />
          <Line legendType="none" dataKey="bad" type="basisClosed" dot={false} stroke="#009900" />
        </LineChart>
        
      </ResponsiveContainer>
    </div>
  );
}
