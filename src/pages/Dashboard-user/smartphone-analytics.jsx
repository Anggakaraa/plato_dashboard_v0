import React, { useEffect } from "react";
import ReactEcharts from "echarts-for-react";
import getChartColorsArray from "../../components/Common/ChartsDynamicColor";
import { Card, CardBody, Col } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { getSessionReportsList } from "../../store/reports/actions";

const SmartphoneAnalytics = ({ dataColors, data }) => {

  const dispatch = useDispatch();
  const { chart_reports } = useSelector((state) => ({
    chart_reports: state.Reports.chart_reports
  }));

  
  
  useEffect(() => {
    dispatch(getSessionReportsList())
  }, []);

  const doughnutEChartColors = getChartColorsArray(dataColors);
  const optionss = {
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
      data: chart_reports.smartphone?.labels,
      textStyle: {
        color: ["#8791af"],
      },
    },
    color: doughnutEChartColors,
    series: [
      {
        name: "Total of smartphone",
        type: "pie",
        radius: "55%",
        center: ["50%", "60%"],
        data: chart_reports.smartphone?.data,
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
  const options = {
    toolbox: {
      show: false,
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)",
    },
    legend: {
      orient: "vertical",
      x: "left",
      data: chart_reports.smartphone?.labels,
      textStyle: {
        color: ["#8791af"],
      },
    },
    color: doughnutEChartColors,
    series: [
      {
        name: "Total devices",
        type: "pie",
        radius: ["50%", "70%"],
        avoidLabelOverlap: false,
        label: {
          normal: {
            show: false,
            position: "center",
          },
          emphasis: {
            show: true,
            textStyle: {
              fontSize: "30",
              fontWeight: "bold",
            },
          },
        },
        labelLine: {
          normal: {
            show: false,
          },
        },
        data: chart_reports.smartphone?.data,
      },
    ],
  };
  return (
    <React.Fragment>
      <Col xl="6">
        <Card>
          <CardBody>
            <h4 className="card-title mb-4">Total by Smartphone type <span className="text-success"></span></h4>

            <div>
              <div id="donut-chart">
              <ReactEcharts style={{ height: "350px" }} option={options} />
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  );
};
export default SmartphoneAnalytics;
