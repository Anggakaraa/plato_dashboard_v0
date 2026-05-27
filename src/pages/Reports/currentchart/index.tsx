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

export default function CurrentChart({ data }) {

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
            <li className={`label fix-text-white ${isClinician() ? 'hidden':''}`}>{`Raw : ${payload[0].payload.raw}`}</li>
          </ul>
        </div>
      );
    }
  
    return null;
  }
  return (
    <div style={{ width: '100%', height: 300, marginLeft: -50 }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time"/>
          <YAxis dataKey="current"/>
          <Tooltip content={<CustomTooltip />}/>
          <Legend />
          <Line legendType="none" type="monotone" dataKey="current" stroke="#8884d8" />          
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
