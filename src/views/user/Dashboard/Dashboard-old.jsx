import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Button,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  ButtonDropdown,
} from 'reactstrap';

import Breadcrumb from 'components/UI/Common/Breadcrumb';

import BarChart from 'components/chart/BarChart';
import PieChart from 'components/chart/PieChart';
import MiniWidget from 'components/MiniWidget';
import { GetUserProfile } from 'store/actions';
import { useDispatch } from 'react-redux';
import "./dashboard.css"

// import setupanalytics from "../../assets/images/setup-analytics-amico.svg";

const series1 = [
  {
    data: [25, 66, 41, 89, 63, 25, 44, 20, 36, 40, 54],
  },
];

const options1 = {
  fill: {
    colors: ['#34c38f'],
  },
  chart: {
    width: 70,
    sparkline: {
      enabled: !0,
    },
  },
  plotOptions: {
    bar: {
      columnWidth: '50%',
    },
  },
  labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  xaxis: {
    crosshairs: {
      width: 1,
    },
  },
  tooltip: {
    fixed: {
      enabled: !1,
    },
    x: {
      show: !1,
    },
    y: {
      title: {
        // formatter: function (seriesName) {
        //   return '';
        // }
      },
    },
    marker: {
      show: !1,
    },
  },
};

const series2 = [70];

const options2 = {
  fill: {
    colors: ['#34c38f'],
  },
  chart: {
    sparkline: {
      enabled: !0,
    },
  },
  dataLabels: {
    enabled: !1,
  },
  plotOptions: {
    radialBar: {
      hollow: {
        margin: 0,
        size: '60%',
      },
      track: {
        margin: 0,
      },
      dataLabels: {
        show: !1,
      },
    },
  },
};

const series3 = [55];

const options3 = {
  fill: {
    colors: ['#34c38f'],
  },
  chart: {
    sparkline: {
      enabled: !0,
    },
  },
  dataLabels: {
    enabled: !1,
  },
  plotOptions: {
    radialBar: {
      hollow: {
        margin: 0,
        size: '60%',
      },
      track: {
        margin: 0,
      },
      dataLabels: {
        show: !1,
      },
    },
  },
};

const series4 = [
  {
    data: [25, 66, 41, 89, 63, 25, 44, 12, 36, 9, 54],
  },
];

const options4 = {
  fill: {
    colors: ['#f1b44c'],
  },
  chart: {
    width: 70,
    sparkline: {
      enabled: !0,
    },
  },
  plotOptions: {
    bar: {
      columnWidth: '50%',
    },
  },
  labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  xaxis: {
    crosshairs: {
      width: 1,
    },
  },
  tooltip: {
    fixed: {
      enabled: !1,
    },
    x: {
      show: !1,
    },
    y: {
      title: {
        // formatter: function (seriesName) {
        //   return '';
        // }
      },
    },
    marker: {
      show: !1,
    },
  },
};

const DashboardOld = () => {
  const [drpPrimary2, setDrpPrimary2] = useState(false);
  const reports = [
    {
      id: 1,
      icon: 'mdi mdi-arrow-up-bold',
      title: 'Total Revenue',
      value: 34152,
      prefix: '$',
      suffix: '',
      badgeValue: '2.65%',
      decimal: 0,
      charttype: 'bar',
      chartheight: 40,
      chartwidth: 70,
      color: 'success',
      desc: 'since last week',
      series: series1,
      options: options1,
    },
    {
      id: 2,
      icon: 'mdi mdi-arrow-down-bold',
      title: 'Orders',
      value: 5643,
      decimal: 0,
      charttype: 'radialBar',
      chartheight: 45,
      chartwidth: 45,
      prefix: '',
      suffix: '',
      badgeValue: '0.82%',
      color: 'danger',
      desc: 'since last week',
      series: series2,
      options: options2,
    },
    {
      id: 3,
      icon: 'mdi mdi-arrow-down-bold',
      title: 'Customers',
      value: 45254,
      decimal: 0,
      prefix: '',
      suffix: '',
      charttype: 'radialBar',
      chartheight: 45,
      chartwidth: 45,
      badgeValue: '6.24%',
      color: 'danger',
      desc: 'since last week',
      series: series3,
      options: options3,
    },
    {
      id: 4,
      icon: 'mdi mdi-arrow-up-bold',
      title: 'Growth',
      value: 12.58,
      decimal: 2,
      prefix: '+',
      suffix: '%',
      charttype: 'bar',
      chartheight: 40,
      chartwidth: 70,
      badgeValue: '10.51%',
      color: 'success',
      desc: 'since last week',
      series: series4,
      options: options4,
    },
  ];

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(GetUserProfile());
  }, []);

  return (
    <>
      <div className="page-content">
        <Container fluid >
          <div className="d-flex justify-content-between">
            <Breadcrumb name="Dashboard" />
            <div className="d-flex">
              <div className="btn-group me-1 mb-4">
                <ButtonDropdown isOpen={drpPrimary2} toggle={() => setDrpPrimary2(!drpPrimary2)}>
                  <Button id="caret" color="primary" className="dropdownColor">
                    Filter
                  </Button>
                  <DropdownToggle
                    caret
                    color="primary"
                    className="dropdown-toggle-split dropdownColor"
                  >
                    <i className="mdi mdi-chevron-down" />
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem>7 Days</DropdownItem>
                    <DropdownItem>14 Days</DropdownItem>
                    <DropdownItem>1 month</DropdownItem>
                  </DropdownMenu>
                </ButtonDropdown>
              </div>
              <div style={{ marginTop: '10px' }}>
                <i className="fas fa-undo mx-4" style={{ fontSize: '20px', color: '#34c38f' }} />
              </div>
            </div>
          </div>
          <Row>
            <MiniWidget reports={reports} />
          </Row>

          <Row>
            <Col xl={6}>
              <Card>
                <CardBody>
                  <CardTitle className="mb-4">Bar Chart</CardTitle>
                  <BarChart />
                </CardBody>
              </Card>
            </Col>
            <Col xl={6}>
              <Card>
                <CardBody>
                  <CardTitle className="mb-4">Pie Chart</CardTitle>
                  <PieChart />
                </CardBody>
              </Card>
            </Col>
          </Row>
          {/* <LatestTransaction /> */}
        </Container>
      </div>
    </>
  );
};

export default DashboardOld;
