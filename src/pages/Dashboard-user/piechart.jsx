import React, { useEffect } from "react";
import ReactEcharts from "echarts-for-react";
import getChartColorsArray from "../../components/Common/ChartsDynamicColor";
import { Card, CardBody, Col } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { getSessionReportsList } from "../../store/reports/actions";

const Pie = ({ dataColors, data }) => {

  const dispatch = useDispatch();
  const { chart_reports } = useSelector((state) => ({
    chart_reports: state.Reports.chart_reports
  }));
  
  useEffect(() => {
    dispatch(getSessionReportsList())
  }, []);

  const PieEChartColors = getChartColorsArray(dataColors);
  const options = {
    toolbox: {
      show: false,
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b} : {c} ({d}%)",
    },
    legend: {
      orient: "vertical",
      left: "left",
      data: chart_reports.labels,
      textStyle: {
        color: ["#8791af"],
      },
    },
    color: PieEChartColors,
    series: [
      {
        name: "Total of type",
        type: "pie",
        radius: "55%",
        center: ["50%", "60%"],
        data: chart_reports.original,
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };
  return (
    <React.Fragment>
      <Col xl="6">
        <Card>
          <CardBody>
            <h4 className="card-title mb-4">Total by Session Type <span className="text-success"></span></h4>

            <div>
              <div id="session-chart">
              <ReactEcharts style={{ height: "350px" }} option={options} />
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  );
};
export default Pie;
