import React, { useState, useEffect } from "react";
import { useHistory, withRouter } from "react-router-dom";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";
import ChartCard from "components/dashboard/Common/ChartCard";
import ContainerHeader from "components/ContainerHeader";
import SalesStatistic from "components/dashboard/eCommerce/SalesStatistic";
import CustomLineChart from "components/CustomLineChart";
import LinearProgress from "@material-ui/core/LinearProgress";
import { withStyles } from "@material-ui/core/styles";
import { defaultDashBoardData } from "./filterData";
import TopAgents from "./TopAgents";
import IntlMessages from "util/IntlMessages";
import GrowthCard from "./GrowthCard";
import LocationFilter from "app/routes/widgets/routes/CommonComponents/LocationFilter";
import { apigetUrl } from "setup/middleware";
import { useSelector } from "react-redux";
import {
  currencyWithNameFormater,
  currencyFormater,
  numberFormater,
} from "../../../widgets/routes/CommonComponents/formater";
import {
  IPPNotification,
  ippNotify,
} from "../../../widgets/routes/CommonComponents/IPPNotification";

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 5,
    borderRadius: 5,
  },
  colorPrimary: {
    backgroundColor:
      theme.palette.grey[theme.palette.type === "light" ? 200 : 700],
  },
  bar: {
    borderRadius: 5,
    backgroundColor: "#3f51b5",
  },
}))(LinearProgress);

const Listing = ({ match }) => {
  const { authUser } = useSelector(({ auth }) => auth);
  console.log("authUser", authUser);
  const [state, setState] = useState({
    userId: "",
    data: "",
    newCustomersChartData: "",
    lastMonthSalesChartData: "",
    totalRevenueChartData: "",
    topAgentsData: [],
    saleStatisticsDto: "",
    saleStatisticsDtoMonthlyOrder: 0,
    saleStatisticsDtoWeeklyOrder: 0,
    saleStatisticsDtoAverageRevenue: 0,
    saleStatisticsDtoTotalRevenue: 0,
    saleStatisticsDtoTotalOrders: 0,
    saleStatisticsDtorenewals: 0,
    dashboardData: defaultDashBoardData,
    signUpData: defaultDashBoardData.signUpData,
    totalRevenueData: defaultDashBoardData.totalRevenueData,
    agentData: defaultDashBoardData.agentData,
    growthPercentage: 0,
    trafficData: defaultDashBoardData.trafficData,
    saleStatistics: defaultDashBoardData.saleStatistics,
    inputId: [{ locationId: "" }],
    level0: 1,
    level1: "",
    level2: "",
    level3: "",
    level4: "",
    level5: "",
    level6: "",
    newCustomers: 0,
    lastMonthSales: 0,
    totalRevenue: 0,
    totalPolicies: 0,
    newRevenuePercentage: 0,
    renewalRevenuePercentage: 0,
  });

  useEffect(() => {
    let locationFilter = authUser.locationFilters;
    let locations = (locationFilter || []).map((n) => n.defaultId);
    let levels = locations.reverse().slice(0);
    console.log("locationFilter", levels);
    setState((prevState) => ({
      ...prevState,
      level1: levels[0] || "",
      level2: levels[1] || "",
      level3: levels[3] || "",
      level4: levels[4] || "",
    }));
  }, []);

  useEffect(() => {
    let userId = (authUser.userDetails || {}).username;
    setState((prevState) => ({
      ...prevState,
      userId: userId,
    }));
    apigetUrl(
      `/stats/${userId}?level1=${state.level1}&level2=${state.level2}&level3=${state.level3}&level4=${state.level4}`
    )
      .then((res) => {
        let totalCustomer = numberFormater(res.data.newCustomers);
        let totallastMonthSales = currencyWithNameFormater(
          res.data.lastMonthSales
        );
        let totalRev = currencyWithNameFormater(res.data.totalRevenue);
        let totalRevPolic = numberFormater(
          res.data.totalNewPolicies + res.data.totalRenewedPolicies
        );
        let MonthlyOrder = numberFormater(
          res.data.saleStatisticsDto.ordersMonthly
        );
        let WeeklyOrder = numberFormater(
          res.data.saleStatisticsDto.ordersWeekly
        );
        let AverageRevenue = currencyWithNameFormater(
          res.data.saleStatisticsDto.averageRevenue
        );
        let TotalRevenue = currencyWithNameFormater(
          res.data.saleStatisticsDto.totalRevenue
        );
        let TotalOrders = numberFormater(
          res.data.saleStatisticsDto.totalOrders
        );
        let renewals = numberFormater(res.data.saleStatisticsDto.renewals);

        let growthPercentage = Math.round(
          res.data.saleStatisticsDto.growthPercentage
        );

        let newRevenue =
          res.data.saleStatisticsDto.totalRevenue -
          res.data.saleStatisticsDto.totalRenewalRevenue;

        let revenue =
          (newRevenue / res.data.saleStatisticsDto.totalRevenue) * 100;

        let newRevenuePercentage = Math.round(revenue);

        console.log("renewal-123", newRevenuePercentage);

        let renewalRevenue =
          res.data.saleStatisticsDto.renewals /
          res.data.saleStatisticsDto.totalOrders;

        let renewal = renewalRevenue * 100;

        let renewalRevenuePercentage = Math.round(renewal);

        console.log("renewal", renewalRevenuePercentage);

        setState((prevState) => ({
          ...prevState,

          data: res.data,
          newCustomersChartData: res.data.newCustomersChartData,
          lastMonthSalesChartData: res.data.lastMonthSalesChartData,
          totalRevenueChartData: res.data.totalRevenueChartData,
          topAgentsData: res.data.topAgentsData,
          saleStatisticsDto: res.data.saleStatisticsDto,
          newCustomers: totalCustomer,
          lastMonthSales: totallastMonthSales,
          totalRevenue: totalRev,
          totalPolicies: totalRevPolic,
          saleStatisticsDtoMonthlyOrder: MonthlyOrder,
          saleStatisticsDtoWeeklyOrder: WeeklyOrder,
          saleStatisticsDtoAverageRevenue: AverageRevenue,
          saleStatisticsDtoTotalRevenue: TotalRevenue,
          saleStatisticsDtoTotalOrders: TotalOrders,
          saleStatisticsDtorenewals: renewals,
          growthPercentage: growthPercentage,
          newRevenuePercentage: newRevenuePercentage,
          renewalRevenuePercentage: renewalRevenuePercentage,
        }));
      })
      .catch((err) => ippNotify.error(""));
  }, [state.level1, state.level2, state.level3, state.level4, state.level5]);

  const handlingDefaultValue = (e) => {
    console.log("e", e.target.value);

    if (e.target.value === "Zone") {
      apigetUrl(
        `/stats/${state.userId}?level1=${state.level1}&level2=${state.level2}&level3=${state.level3}&level4=${state.level4}`
      )
        .then((res) => {
          setState((prevState) => ({
            ...prevState,
            level1: "",
            level2: "",
            level3: "",
            level4: "",
            data: res.data,
            newCustomersChartData: res.data.newCustomersChartData,
            lastMonthSalesChartData: res.data.lastMonthSalesChartData,
            totalRevenueChartData: res.data.totalRevenueChartData,
            topAgentsData: res.data.topAgentsData,
            saleStatisticsDto: res.data.saleStatisticsDto,
          }));
        })
        .catch((err) => ippNotify.error(""));
    }

    if (e.target.value === "State") {
      apigetUrl(
        `/stats/${state.userId}?level1=${state.level1}&level2=${state.level2}&level3=${state.level3}&level4=${state.level4}`
      )
        .then((res) => {
          setState((prevState) => ({
            ...prevState,
            level2: "",
            level3: "",
            level4: "",
            data: res.data,
            newCustomersChartData: res.data.newCustomersChartData,
            lastMonthSalesChartData: res.data.lastMonthSalesChartData,
            totalRevenueChartData: res.data.totalRevenueChartData,
            topAgentsData: res.data.topAgentsData,
            saleStatisticsDto: res.data.saleStatisticsDto,
          }));
        })
        .catch((err) => ippNotify.error(""));
    }

    if (e.target.value === "Cluster") {
      apigetUrl(
        `/stats/${state.userId}?level1=${state.level1}&level2=${state.level2}&level3=${state.level3}&level4=${state.level4}`
      )
        .then((res) => {
          setState((prevState) => ({
            ...prevState,
            level3: "",
            level4: "",
            data: res.data,
            newCustomersChartData: res.data.newCustomersChartData,
            lastMonthSalesChartData: res.data.lastMonthSalesChartData,
            totalRevenueChartData: res.data.totalRevenueChartData,
            topAgentsData: res.data.topAgentsData,
            saleStatisticsDto: res.data.saleStatisticsDto,
          }));
        })
        .catch((err) => ippNotify.error(""));
    }

    if (e.target.value === "District") {
      apigetUrl(
        `/stats/${state.userId}?level1=${state.level1}&level2=${state.level2}&level3=${state.level3}&level4=${state.level4}`
      )
        .then((res) => {
          setState((prevState) => ({
            ...prevState,
            level4: "",
            data: res.data,
            newCustomersChartData: res.data.newCustomersChartData,
            lastMonthSalesChartData: res.data.lastMonthSalesChartData,
            totalRevenueChartData: res.data.totalRevenueChartData,
            topAgentsData: res.data.topAgentsData,
            saleStatisticsDto: res.data.saleStatisticsDto,
          }));
        })
        .catch((err) => ippNotify.error(""));
    }
  };

  const handler = (id, value) => {
    if (value === "Zone") {
      setState((prevState) => ({
        ...prevState,
        level1: id,
      }));
    }
    if (value === "State") {
      setState((prevState) => ({
        ...prevState,
        level2: id,
      }));
    }
    if (value === "Cluster") {
      setState((prevState) => ({
        ...prevState,
        level3: id,
      }));
    }
    if (value === "District") {
      setState((prevState) => ({
        ...prevState,
        level4: id,
      }));
    }
    if (value === "City") {
      setState((prevState) => ({
        ...prevState,
        level5: id,
      }));
    }
    if (value === "Area") {
      setState((prevState) => ({
        ...prevState,
        level6: id,
      }));
    }
  };

  let history = useHistory();

  const handleCustomer = () => {
    const { level0, level1, level2, level3, level4, level5, level6 } = state;
    console.log("click");
    history.push({
      pathname: "/app/widgets/ListOfCustomer",
      state: {
        locationData: [level0, level1, level2, level3, level4, level5, level6],
        endDate: new Date(),
      },
    });
  };

  const handlePolicy = () => {
    const { level0, level1, level2, level3, level4, level5, level6 } = state;
    console.log("click");
    history.push({
      pathname: "/app/widgets/ListOfPolicies",
      state: {
        locationData: [level0, level1, level2, level3, level4, level5, level6],
        endDate: new Date(),
      },
    });
  };

  const handleRenewal = () => {
    const { level0, level1, level2, level3, level4, level5, level6 } = state;
    console.log("click");
    history.push({
      pathname: "/app/widgets/ListOfPolicies",
      state: {
        locationData: [level0, level1, level2, level3, level4, level5, level6],
        endDate: new Date(),
        type: "2",
      },
    });
  };

  const handleOrder = () => {
    const { level0, level1, level2, level3, level4, level5, level6 } = state;
    console.log("click");
    history.push({
      pathname: "/app/widgets/ListOfPolicies",
      state: {
        locationData: [level0, level1, level2, level3, level4, level5, level6],
        endDate: new Date(),
        type: "1",
      },
    });
  };

  //const Listing = ({match}) => {
  const {
    data,
    newCustomersChartData,
    lastMonthSalesChartData,
    totalRevenueChartData,
    topAgentsData,
    saleStatisticsDto,
  } = state;

  let label = (lastMonthSalesChartData || {}).labels;
  let chartData = (lastMonthSalesChartData || {}).chartData;

  let data1 = [0];
  if (chartData) {
    data1 = [chartData.length];
    for (var i = 0; i < chartData.length; i++) {
      data1[i] = {
        name: label && label[i],
        pv: chartData && chartData[i],
        amt: chartData && chartData[i],
      };
    }
  }

  let newPolicies = data.totalNewPolicies;
  let renewedPolicies = data.totalRenewedPolicies;
  let total = data.totalNewPolicies + data.totalRenewedPolicies;
  let newAverage = newPolicies / total;
  let renewedAverage = renewedPolicies / total;
  let newPercentage = newAverage * 100;
  let renewedPercentage = renewedAverage * 100;
  let newPolicy = Math.ceil(newPercentage);
  let renewedPolicy = Math.floor(renewedPercentage);

  return (
    <div className="dashboard animated slideInUpTiny animation-duration-3">
      <ContainerHeader
        match={match}
        title={<IntlMessages id="menu.dashboard" />}
      />
      <LocationFilter
        handler={handler}
        handlingDefaultValue={handlingDefaultValue}
      />
      <IPPNotification />
      <div className="row">
        <div
          className="col-lg-3 col-sm-6 col-12"
          style={{ cursor: "pointer" }}
          onClick={handleCustomer}
        >
          <ChartCard styleName="bg-gradient-primary text-white">
            <div className="chart-title">
              <h2 className="mb-1">{state.newCustomers}</h2>
              <p>
                <IntlMessages id="dashboard.newCustomers" />
              </p>
            </div>

            <ResponsiveContainer width="100%" height={75}>
              <CustomLineChart
                chartData={(newCustomersChartData || {}).chartData}
                labels={(newCustomersChartData || {}).labels}
                borderColor="#FFF"
                pointBorderColor="#FFF"
                pointBackgroundColor="#FF9800"
                pointBorderWidth={2}
                pointRadius={4}
                lineTension={0}
              />
            </ResponsiveContainer>
          </ChartCard>
        </div>
        <div className="col-lg-3 col-sm-6 col-12">
          <ChartCard styleName="bg-cyan text-white">
            <div className="chart-title">
              <h2 className="mb-1"> {state.lastMonthSales}</h2>
              <p>
                <IntlMessages id="dashboard.lastMonthSale" />
              </p>
            </div>

            <ResponsiveContainer width="100%" height={75}>
              <AreaChart
                data={data1}
                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
              >
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="pv"
                  stroke="rgba(255,255,255,0.5)"
                  activeDot={{ r: 8 }}
                  fillOpacity={0.5}
                  fill="rgba(255,255,255,0.8)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
        <div className="col-lg-3 col-sm-6 col-12">
          <ChartCard styleName="bg-secondary text-white">
            <div className="chart-title">
              <h2 className="mb-1">{state.totalRevenue}</h2>
              <p>
                <IntlMessages id="dashboard.totalRevenue" />
              </p>
            </div>

            <ResponsiveContainer width="100%" height={75}>
              <CustomLineChart
                chartData={(totalRevenueChartData || {}).chartData}
                labels={(totalRevenueChartData || {}).labels}
                borderColor="#FFF"
                pointBorderColor="#FFF"
                pointBackgroundColor="#FFF"
                pointBorderWidth={2}
                pointRadius={0}
                pointHoverBorderColor="#F53E7B"
                lineTension={0.4}
                shadowColor="rgba(0,0,0,0.6)"
              />
            </ResponsiveContainer>
          </ChartCard>
        </div>
        <div
          className="col-lg-3 col-sm-6 col-12"
          style={{ cursor: "pointer" }}
          onClick={handlePolicy}
        >
          <ChartCard styleName="bg-warning text-white">
            <div className="chart-title pb-0">
              <h2 className="mb-1">{state.totalPolicies + ""}</h2>
              <p>
                <IntlMessages id="dashboard.totalPolicies" />
              </p>
            </div>
            {state.totalPolicies === "0" ? (
              <>
                <div className="pl-3 pr-3 pt-1">
                  <div className="d-flex flex-row p-0">
                    <p className="text-white m-0">
                      <IntlMessages id="dashboard.newPolicies" />
                    </p>
                    <p className="text-white ml-auto m-0">0%</p>
                  </div>
                  <BorderLinearProgress
                    className="shadow-lg mb-2 my-1"
                    variant="determinate"
                    value={"0"}
                  />
                  <div className="d-flex flex-row">
                    <p className="text-white m-0">
                      <IntlMessages id="dashboard.renewalPolicies" />
                    </p>
                    <p className="text-white ml-auto m-0">0%</p>
                  </div>
                  <BorderLinearProgress
                    className="shadow-lg mb-2 my-1"
                    variant="determinate"
                    value={"0"}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="pl-3 pr-3 pt-1">
                  <div className="d-flex flex-row p-0">
                    <p className="text-white m-0">
                      <IntlMessages id="dashboard.newPolicies" />
                    </p>
                    <p className="text-white ml-auto m-0">{newPolicy}%</p>
                  </div>
                  <BorderLinearProgress
                    className="shadow-lg mb-2 my-1"
                    variant="determinate"
                    value={newPolicy}
                  />
                  <div className="d-flex flex-row">
                    <p className="text-white m-0">
                      <IntlMessages id="dashboard.renewalPolicies" />
                    </p>
                    <p className="text-white ml-auto m-0">{renewedPolicy}%</p>
                  </div>
                  <BorderLinearProgress
                    className="shadow-lg mb-2 my-1"
                    variant="determinate"
                    value={renewedPolicy}
                  />
                </div>
              </>
            )}
          </ChartCard>
        </div>
      </div>
      <div className="row">
        <div className="col-xl-8 col-lg-8 col-md-12 col-12 order-lg-1">
          <TopAgents topAgentsData={topAgentsData} data={state.data} />
        </div>
        <div className="col-xl-4 col-lg-4 col-md-12 col-12">
          <div className="col-xl-12 col-lg-12 col-md-12 col-12">
            <GrowthCard
              growthPercentage={state.growthPercentage}
              trafficData={state.trafficData}
            />
          </div>
          {/* <div className="col-xl-12 col-lg-12 col-md-12 col-12">
            <GrowthCard
              growthPercentage={state.growthPercentage}
              trafficData={state.trafficData}
            />
          </div> */}
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <SalesStatistic
            saleStatisticsDto={saleStatisticsDto}
            handleRenewal={handleRenewal}
            handleOrder={handleOrder}
            saleStatisticsDtoMonthlyOrder={state.saleStatisticsDtoMonthlyOrder}
            saleStatisticsDtoWeeklyOrder={state.saleStatisticsDtoWeeklyOrder}
            saleStatisticsDtoAverageRevenue={
              state.saleStatisticsDtoAverageRevenue
            }
            saleStatisticsDtoTotalRevenue={state.saleStatisticsDtoTotalRevenue}
            saleStatisticsDtoTotalOrders={state.saleStatisticsDtoTotalOrders}
            saleStatisticsDtorenewals={state.saleStatisticsDtorenewals}
            newRevenuePercentage={state.newRevenuePercentage}
            renewalRevenuePercentage={state.renewalRevenuePercentage}
          />
        </div>
      </div>
    </div>
  );
};

export default Listing;
