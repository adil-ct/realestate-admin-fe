const series1 = [
  {
    data: [25, 66, 41, 89, 63, 25, 44, 20, 36, 40, 54],
  },
];

const options1 = {
  fill: {
    colors: ['#1A2B4A'],
  },
  colors: ['#1A2B4A'],
  stroke: {
    colors: ['#C9A84C'],
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

// const series2 = [70];

// const options2 = {
//   fill: {
//     colors: ['#34c38f'],
//   },
//   chart: {
//     sparkline: {
//       enabled: !0,
//     },
//   },
//   dataLabels: {
//     enabled: !1,
//   },
//   plotOptions: {
//     radialBar: {
//       hollow: {
//         margin: 0,
//         size: '60%',
//       },
//       track: {
//         margin: 0,
//       },
//       dataLabels: {
//         show: !1,
//       },
//     },
//   },
// };

const calculateChange = data => {
  if (data) {
    const badgeValue =
      data?.previous === 0 || data?.previous === null || !data?.previous
        ? data?.current * 100
        : Math.ceil(((data?.current - data?.previous) * 100) / data?.previous);
    const formattedBadgeValue =
      badgeValue % 1 === 0 // Check if there is no decimal part
        ? badgeValue.toFixed(0)
        : badgeValue.toFixed(2);
    
    return badgeValue === 0
      ? {
        badgeValue: '0%',
        graph: 'straight',
        color: 'info',
        icon: 'mdi mdi-adjust',
      }
      : badgeValue > 0
        ? {
          badgeValue: `${formattedBadgeValue}%`,
          graph: 'up',
          color: 'success',
          icon: 'mdi mdi-arrow-up-bold',
        }
        : {
          badgeValue: `${formattedBadgeValue * -1}%`,
          graph: 'down',
          color: 'danger',
          icon: 'mdi mdi-arrow-down-bold',
        };
  }
  return {
    badgeValue: '0%',
    graph: 'straight',
    icon: 'mdi mdi-adjust',
    color: 'info',
  };
};

// eslint-disable-next-line no-unused-vars
export const DashboardStatisticsData = (data, history) => [
  {
    id: 1,
    title: 'Total Users',
    value: data?.totalUserCount?.total || 0,
    suffix: '',
    decimal: 0,
    badgeValue: '0.5%',
    charttype: 'bar',
    chartheight: 40,
    chartwidth: 70,
    desc: 'than last week',
    series: series1,
    options: options1,
    ...calculateChange(data?.totalUserCount),
    // handleClick: () => {
    //   history('/user-management', {
    //     state: { filterType: 'ACTIVE_USER' },
    //   });
    // },
  },
  {
    id: 2,
    icon: 'mdi mdi-arrow-down-bold',
    title: 'Suspended Users',
    value: data?.suspendedUserCount?.total ?? 0,
    badgeValue: '0.5%',
    decimal: 0,
    charttype: 'bar',
    chartheight: 40,
    chartwidth: 70,
    desc: 'than last week',
    ...calculateChange(data?.suspendedUserCount),
    // handleClick: () => {
    //   history('/user-management', {
    //     pathname: '/user-management',
    //     state: { filterType: 'KYC_PENDING' },
    //   });
    // },
  },
  {
    id: 3,
    title: 'Total Admins',
    value: data?.totalAdminCount?.total || 0,
    badgeValue: '0.5%',
    decimal: 0,
    charttype: 'bar',
    chartheight: 40,
    chartwidth: 70,
    desc: 'than last week',
    ...calculateChange(data?.totalAdminCount),
    // handleClick: () => {
    //   history('/user-management', {
    //     pathname: '/user-management',
    //     state: { filterType: 'SUSPENDED_USER' },
    //   });
    // },
  },
  {
    id: 4,
    title: 'Suspended Admins',
    value: data?.suspendedAdminCount?.total || 0,
    badgeValue: '0.5%',
    decimal: 0,
    charttype: 'bar',
    chartheight: 40,
    chartwidth: 70,
    desc: 'than last week',
    ...calculateChange(data?.suspendedAdminCount),
    // handleClick: () => {
    //   history('/user-management', {
    //     pathname: '/user-management',
    //     state: { filterType: 'SUSPENDED_USER' },
    //   });
    // },
  },
  {
    id: 5,
    title: 'Draft Properties',
    value: data?.draftPropertiesCount?.total || 0,
    badgeValue: '0.5%',
    decimal: 0,
    charttype: 'bar',
    chartheight: 40,
    chartwidth: 70,
    desc: 'than last week',
    ...calculateChange(data?.draftPropertiesCount),
    // handleClick: () => {
    //   history('/user-management', {
    //     pathname: '/user-management',
    //     state: { filterType: 'SUSPENDED_USER' },
    //   });
    // },
  },
  {
    id: 6,
    title: 'Minted Properties',
    value: data?.mintedPropertyCount?.total || 0,
    badgeValue: '0.5%',
    decimal: 0,
    charttype: 'bar',
    chartheight: 40,
    chartwidth: 70,
    desc: 'than last week',
    ...calculateChange(data?.mintedPropertyCount),
    // handleClick: () => {
    //   history('/user-management', {
    //     pathname: '/user-management',
    //     state: { filterType: 'SUSPENDED_USER' },
    //   });
    // },
  },
  {
    id: 7,
    title: 'On Sale Properties',
    value: data?.onSalePropertyCount?.total || 0,
    badgeValue: '0.5%',
    decimal: 0,
    charttype: 'bar',
    chartheight: 40,
    chartwidth: 70,
    desc: 'than last week',
    ...calculateChange(data?.onSalePropertyCount),
    // handleClick: () => {
    //   history('/user-management', {
    //     pathname: '/user-management',
    //     state: { filterType: 'SUSPENDED_USER' },
    //   });
    // },
  },
  {
    id: 8,
    title: 'Total Investments',
    value: data?.totalInvestmentCount?.total || 0,
    badgeValue: '0.5%',
    decimal: 0,
    charttype: 'bar',
    chartheight: 40,
    chartwidth: 70,
    desc: 'than last week',
    ...calculateChange(data?.totalInvestmentCount),
  },
];
export const statisticsValues = [
  {
    id: 1,
    title: 'Total Users',
    value: 0,
    suffix: '',
    decimal: 0,
    badgeValue: '0.5%',
    charttype: 'bar',
    chartheight: 40,
    chartwidth: 70,
    desc: 'than last week',
    series: series1,
    options: options1,
    graph: 'straight',
    color: 'info',
    icon: 'mdi mdi-adjust',
    // ...calculateChange(data?.totalUserCount),
    // handleClick: () => {
    //   history.push({
    //     pathname: '/user-management',
    //     state: { filterType: 'ACTIVE_USER' },
    //   });
    // },
  },
  {
    id: 2,
    title: 'Suspended Users',
    value: 7,
    badgeValue: '0.5%',
    decimal: 0,
    charttype: 'bar',
    chartheight: 40,
    chartwidth: 70,
    desc: 'than last week',
    graph: 'up',
    color: 'success',
    icon: 'mdi mdi-arrow-up-bold'
    // ...calculateChange(data?.suspendedUserCount),
    // handleClick: () => {
    //   history.push({
    //     pathname: '/user-management',
    //     state: { filterType: 'KYC_PENDING' },
    //   });
    // },
  },
  {
    id: 3,
    title: 'Total Admins',
    value: 0,
    badgeValue: '0.5%',
    decimal: 0,
    charttype: 'bar',
    chartheight: 40,
    chartwidth: 70,
    desc: 'than last week',
    graph: 'down',
    color: 'danger',
    icon: 'mdi mdi-arrow-down-bold',
    // ...calculateChange(data?.totalAdminCount),
    // handleClick: () => {
    //   history.push({
    //     pathname: '/user-management',
    //     state: { filterType: 'SUSPENDED_USER' },
    //   });
    // },
  },
  {
    id: 4,
    title: 'Suspended Admins',
    value: 3,
    badgeValue: '-5%',
    decimal: 0,
    charttype: 'bar',
    chartheight: 40,
    chartwidth: 70,
    desc: 'than last week',
    graph: 'down',
    color: 'danger',
    icon: 'mdi mdi-arrow-down-bold',
    // ...calculateChange(data?.suspendedAdminCount),
    // handleClick: () => {
    //   history.push({
    //     pathname: '/user-management',
    //     state: { filterType: 'SUSPENDED_USER' },
    //   });
    // },
  },
  {
    id: 5,
    title: 'Draft Properties',
    value: 0,
    badgeValue: '0%',
    decimal: 0,
    charttype: 'bar',
    chartheight: 40,
    chartwidth: 70,
    desc: 'than last week',
    graph: 'straight',
    color: 'info',
    icon: 'mdi mdi-adjust',
    // ...calculateChange(data?.draftPropertiesCount),
    // handleClick: () => {
    //   history.push({
    //     pathname: '/user-management',
    //     state: { filterType: 'SUSPENDED_USER' },
    //   });
    // },
  },
  {
    id: 6,
    title: 'Minted Properties',
    value: 0,
    badgeValue: '15%',
    decimal: 0,
    charttype: 'bar',
    chartheight: 40,
    chartwidth: 70,
    desc: 'than last week',
    graph: 'up',
    color: 'success',
    icon: 'mdi mdi-arrow-up-bold',
    // ...calculateChange(data?.mintedPropertyCount),
    // handleClick: () => {
    //   history.push({
    //     pathname: '/user-management',
    //     state: { filterType: 'SUSPENDED_USER' },
    //   });
    // },
  },
  {
    id: 7,
    title: 'On Sale Properties',
    value: 5,
    badgeValue: '0%',
    decimal: 0,
    charttype: 'bar',
    chartheight: 40,
    chartwidth: 70,
    desc: 'than last week',
    graph: 'straight',
    color: 'info',
    icon: 'mdi mdi-adjust',
    // ...calculateChange(data?.onSalePropertyCount),
    // handleClick: () => {
    //   history.push({
    //     pathname: '/user-management',
    //     state: { filterType: 'SUSPENDED_USER' },
    //   });
    // },
  },
  {
    id: 8,
    title: 'Total Investments',
    value: 0,
    badgeValue: '0.5%',
    decimal: 0,
    charttype: 'bar',
    chartheight: 40,
    chartwidth: 70,
    desc: 'than last week',
    graph: 'up',
    color: 'success',
    icon: 'mdi mdi-arrow-up-bold',
    // ...calculateChange(data?.totalInvestmentCount),
  },
];
