import React from 'react'
import {data1,signUpData, totalRevenueData, userImageList, trafficData} from "./data";
import IntlMessages from 'util/IntlMessages';
import {useSelector} from "react-redux";
import AppLocale from "../../../../../../src/lngProvider";


// export const {themeColor, darkTheme, locale, isDirectionRTL} = useSelector(({settings}) => settings);
// export const currentAppLocale = AppLocale[locale.locale];

// console.log("currentAppLocale"+currentAppLocale);

export const trafficData1 = [
    {name: 'Page A', pv: 100},
    {name: 'Page B', pv: 1000},
    {name: 'Page C', pv: 200},
    {name: 'Page D', pv: 300},
    {name: 'Page D', pv: 600},
    {name: 'Page H', pv: 1500},
  ];

  export const trafficData2 = [
    {name: 'Page A', pv: 100},
    {name: 'Page B', pv: 300},
    {name: 'Page C', pv: 500},
    {name: 'Page D', pv: 900},
    {name: 'Page D', pv: 500},
    {name: 'Page H', pv: 1000},
  ];

  export const trafficData3 = [
    {name: 'Page A', pv: 600},
    {name: 'Page B', pv: 1000},
    {name: 'Page C', pv: 800},
    {name: 'Page D', pv: 900},
    {name: 'Page D', pv: 1000},
    {name: 'Page H', pv: 1500},
  ];

export const signUpData1 = {
    chartData: [ 10, 75, 300, 40, 20, 70],
    labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  }

  export const signUpData2 = {
    chartData: [ 120, 45, 30, 170, 100, 40],
    labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  }

  export const signUpData3 = {
    chartData: [ 55, 145, 100, 70, 90, 80],
    labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  }

  export const totalRevenueData1 = {
    chartData: [100, 75, 150, 100, 70, 90],
    labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  }
  export const totalRevenueData2 = {
    chartData: [200, 150, 250, 230, 270, 100],
    labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  }
  export const totalRevenueData3 = {
    chartData: [100, 50, 150, 90, 70, 100],
    labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  }



  export const userImageList1 = [
    {
      id: 1,
      image: require('assets/images/insurance/user_blank.png'),
      name: 'Rahul Verma',
      rating: '4.7',
      deals: '45 Policies'
    },
    {
      id: 2,
      image: require('assets/images/insurance/man2.jpg'),
      name: 'Venkatesh R',
      rating: '5.0',
      deals: '39 Policies'
    },
    {
      id: 5,
      image: require('assets/images/insurance/woman2.jpg'),
      name: 'Sushma Reddy',
      rating: '5.0',
      deals: '27 Policies'
    },
    {
      id: 3,
      image: require('assets/images/insurance/user_blank.png'),
      name: 'Mohammed Siraj',
      rating: '4.1',
      deals: '22 Policies'
    },
    {
      id: 4,
      image: require('assets/images/insurance/user_blank.png'),
      name: 'Victor O',
      rating: '3.9',
      deals: '18 Policies'
    }
  ];


  export const userImageList2 = [
    {
      id: 1,
      image: require('assets/images/insurance/woman3.jpg'),
      name: 'Geetha A',
      rating: '4.8',
      deals: '39 Policies'
    },
    {
      id: 2,
      image: require('assets/images/insurance/user_blank.png'),
      name: 'Rohit R',
      rating: '5.0',
      deals: '30 Policies'
    },
    {
      id: 5,
      image: require('assets/images/insurance/user_blank.png'),
      name: 'Alan S',
      rating: '3.9',
      deals: '21 Policies'
    },
    {
      id: 3,
      image: require('assets/images/insurance/user_blank.png'),
      name: 'Preetham',
      rating: '4.1',
      deals: '19 Policies'
    },
    {
      id: 4,
      image: require('assets/images/insurance/user_blank.png'),
      name: 'Amir Pasha',
      rating: '3.9',
      deals: '13 Policies'
    }
  ];


  


  export const userImageList3 = [
    {
      id: 1,
      image: require('assets/images/insurance/user_blank.png'),
      name: 'Geetha A',
      rating: '4.8',
      deals: '39 Policies'
    },
    {
      id: 2,
      image: require('assets/images/insurance/man3.jpg'),
      name: 'Rohit R',
      rating: '5.0',
      deals: '30 Policies'
    },
    {
      id: 5,
      image: require('assets/images/insurance/user_blank.png'),
      name: 'Alan S',
      rating: '3.9',
      deals: '21 Policies'
    },
    {
      id: 3,
      image: require('assets/images/insurance/user_blank.png'),
      name: 'Preetham',
      rating: '4.1',
      deals: '19 Policies'
    },
    {
      id: 4,
      image: require('assets/images/insurance/user_blank.png'),
      name: 'Amir Pasha',
      rating: '3.9',
      deals: '13 Policies'
    }
  ];

  export const saleStatistics1 = {
      ordersMonthly:'151',
      ordersWeekly:'38',
      averageRevenue:'78,735',
      totalRevenue:'7,87,356',
      totalOrders:'1,510',
      renewals:'453'
  }

  export const saleStatistics2 = {
      ordersMonthly:'379',
      ordersWeekly:'57',
      averageRevenue:'2,10,213',
      totalRevenue:'10,87,356',
      totalOrders:'3,728',
      renewals:'1,134'
  }

  export const saleStatistics3 = {
      ordersMonthly:'379',
      ordersWeekly:'57',
      averageRevenue:'2,10,213',
      totalRevenue:'10,87,356',
      totalOrders:'3,728',
      renewals:'1,134'
  }

export const defaultDashBoardData =  {                
    "newCust": "3,781",
    "lastMonth": "78,260",
    "totalRevenue": "10,87,356",
    "totalPolicies": {
        "total": "3,782",
        "new": "69",
        "renewal": "31",
    },
    signUpData: signUpData,
    totalRevenueData:totalRevenueData,
    agentData: userImageList,
    trafficData:trafficData,
    growthPercentage:'37%',
    saleStatistics:{
        ordersMonthly:'379',
        ordersWeekly:'57',
        averageRevenue:'2,10,213',
        totalRevenue:'10,87,356',
        totalOrders:'3,728',
        renewals:'1,134'
    }
};

export const defaultChooseCity = {
    name: '-- All Districts --',
    dashBoardData: defaultDashBoardData
}

export const defaultChooseState = {
    name: '-- All States --', 
    dashBoardData: defaultDashBoardData, 
    cities: [
        defaultChooseCity
    ]
}

export const areasList = [
    { 
        name: '-- All Zones --',
        dashBoardData: defaultDashBoardData,
        states: [ 
            defaultChooseState
        ]
    },
    { 
        name: 'North',
        dashBoardData: defaultDashBoardData, 
        states: [ 
            defaultChooseState,
            {
                name: 'A', 
                dashBoardData: defaultDashBoardData, 
                cities: [
                    {
                        name: 'Duesseldorf', 
                        dashBoardData: defaultDashBoardData, 
                    }, {
                        name: 'Leinfelden-Echterdingen', 
                        dashBoardData: defaultDashBoardData, 
                    }, {
                        name:'Eschborn', 
                        dashBoardData: defaultDashBoardData, 
                    }
                ]
            } 
        ] 
    },
    { 
        name: 'South',
        dashBoardData: {                
            "newCust": "3,781",
            "lastMonth": "78,260",
            "totalRevenue": "7,87,356",
            "totalPolicies": {
                "total": "1,510",
                "new": "72",
                "renewal": "28",
            },
            signUpData: signUpData1,
            totalRevenueData:totalRevenueData1,
            agentData: userImageList1,
            trafficData:trafficData1,
            growthPercentage:'21%',
            saleStatistics: saleStatistics1
        }, 
        states: [ 
            defaultChooseState,

            {
                name: 'Karnataka', 
                dashBoardData: {                
                    "newCust": "1,781",
                    "lastMonth": "48,260",
                    "totalRevenue": "2,30,196",
                    "totalPolicies": {
                        "total": "610",
                        "new": "60",
                        "renewal": "40",
                    },
                    signUpData: signUpData2,
                    totalRevenueData:totalRevenueData2,
                    agentData: userImageList2,
                    trafficData:trafficData2,
                    growthPercentage:'18%',
                    saleStatistics: saleStatistics2
                },
                cities: [
                    defaultChooseCity,
                    {
                        name: 'Bagalkot', 
                        dashBoardData: {
                            "newCust": "281",
                            "lastMonth": "33,260",
                            "totalRevenue": "10,87,356",
                            "totalPolicies": {
                                "total": "930",
                                "new": "83",
                                "renewal": "17",
                            },
                            signUpData: signUpData3,
                            totalRevenueData:totalRevenueData3,
                            agentData: userImageList3,
                            trafficData:trafficData3,
                            growthPercentage:'28%',
                            saleStatistics: saleStatistics3
                        }, 
                    },
                    {
                        name: 'Bellari', 
                        dashBoardData: {
                            "newCust": "281",
                            "lastMonth": "33,260",
                            "totalRevenue": "10,87,356",
                            "totalPolicies": {
                                "total": "930",
                                "new": "83",
                                "renewal": "17",
                            },
                            signUpData: signUpData3,
                            totalRevenueData:totalRevenueData3,
                            agentData: userImageList3,
                            trafficData:trafficData3,
                            growthPercentage:'22%',
                            saleStatistics: saleStatistics3
                        }, 
                    },
                    {
                        name: 'Belagavi', 
                        dashBoardData: {
                            "newCust": "281",
                            "lastMonth": "33,260",
                            "totalRevenue": "10,87,356",
                            "totalPolicies": {
                                "total": "930",
                                "new": "83",
                                "renewal": "17",
                            },
                            signUpData: signUpData3,
                            totalRevenueData:totalRevenueData3,
                            agentData: userImageList3,
                            trafficData:trafficData3,
                            growthPercentage:'15%',
                            saleStatistics: saleStatistics3
                        }, 
                    },
                    {
                        name: 'Bangalore', 
                        dashBoardData: {
                            "newCust": "281",
                            "lastMonth": "33,260",
                            "totalRevenue": "10,87,356",
                            "totalPolicies": {
                                "total": "930",
                                "new": "83",
                                "renewal": "17",
                            },
                            signUpData: signUpData3,
                            totalRevenueData:totalRevenueData3,
                            agentData: userImageList3,
                            trafficData:trafficData3,
                            growthPercentage:'19%',
                            saleStatistics: saleStatistics3
                        }, 
                    }
                ]
            } ,
            {
                name: 'Goa', 
                dashBoardData: defaultDashBoardData, 
                cities: [
                    defaultChooseCity,
                    {
                        name: 'Panaji', 
                        dashBoardData: defaultDashBoardData, 
                    }
                ]
            } ,
            {
                name: 'Tamil Nadu', 
                dashBoardData: defaultDashBoardData, 
                cities: [
                    defaultChooseCity,
                    {
                        name: 'Chennai', 
                        dashBoardData: defaultDashBoardData, 
                    }
                ]
            } ,
            {
                name: 'Kerala', 
                dashBoardData: defaultDashBoardData, 
                cities: [
                    defaultChooseCity,
                    {
                        name: 'Cochin', 
                        dashBoardData: defaultDashBoardData, 
                    }
                ]
            } ,
            {
                name: 'Andhra', 
                dashBoardData: defaultDashBoardData, 
                cities: [
                    defaultChooseCity,
                    {
                        name: 'Vizag', 
                        dashBoardData: defaultDashBoardData, 
                    }
                ]
            } ,
            {
                name: 'Telangana', 
                dashBoardData: defaultDashBoardData, 
                cities: [
                    defaultChooseCity,
                    {
                        name: 'Hydrabad', 
                        dashBoardData: defaultDashBoardData, 
                    }
                ]
            } 
        ] 
    },{ 
        name: 'East',
        dashBoardData: defaultDashBoardData, 
        states: [ 
            defaultChooseState,
            {
                name: 'A', 
                dashBoardData: defaultDashBoardData, 
                cities: [
                    {
                        name: 'Duesseldorf', 
                        dashBoardData: defaultDashBoardData, 
                    }, 
                    {
                        name: 'Leinfelden-Echterdingen', 
                        dashBoardData: defaultDashBoardData, 
                    }, 
                    {
                        name:'Eschborn', 
                        dashBoardData: defaultDashBoardData, 
                    }
                ]
            } 
        ] 
    },{ 
        name: 'West',
        dashBoardData: defaultDashBoardData, 
        states: [ 
            defaultChooseState,
            {
                name: 'A', 
                dashBoardData: defaultDashBoardData, 
                cities: [
                    {
                        name: 'Duesseldorf', 
                        dashBoardData: defaultDashBoardData, 
                    }, 
                    {
                        name: 'Leinfelden-Echterdingen', 
                        dashBoardData: defaultDashBoardData, 
                    }, 
                    {
                        name:'Eschborn', 
                        dashBoardData: defaultDashBoardData, 
                    }
                ]
            } 
        ] 
    },{ 
        name: 'Central',
        dashBoardData: defaultDashBoardData, 
        states: [ 
            defaultChooseState,
            {
                name: 'A', 
                dashBoardData: defaultDashBoardData, 
                cities: [
                    {
                        name: 'Duesseldorf', 
                        dashBoardData: defaultDashBoardData, 
                    }, 
                    {
                        name: 'Leinfelden-Echterdingen', 
                        dashBoardData: defaultDashBoardData, 
                    }, 
                    {
                        name:'Eschborn', 
                        dashBoardData: defaultDashBoardData, 
                    }
                ]
            } 
        ] 
    }
];