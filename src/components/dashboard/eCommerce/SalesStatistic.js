import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { salesStatisticData } from "../../../app/routes/dashboard/routes/Listing/data";
import SalesGauge from "components/dashboard/eCommerce/SalesGauge";
import { SelectionState } from "draft-js";
import IntlMessages from "util/IntlMessages";

const SalesStatistic = ({
  saleStatisticsDto,
  handleRenewal,
  handleOrder,
  saleStatisticsDtoMonthlyOrder,
  saleStatisticsDtoWeeklyOrder,
  saleStatisticsDtoAverageRevenue,
  saleStatisticsDtoTotalRevenue,
  saleStatisticsDtoTotalOrders,
  saleStatisticsDtorenewals,
  newRevenuePercentage,
  renewalRevenuePercentage,
}) => {
  let history = useHistory();

  return (
    <div className="jr-card">
      <div className="jr-card-header d-flex align-items-center">
        <h3 className="mb-0">
          <IntlMessages id="dashboard.salesStatistic" />
        </h3>
      </div>
      <div className="row mb-3">
        <div className="col-6 col-sm-4 col-md-3 col-lg-2">
          <span className="d-flex align-items-center mb-2">
            <i className="zmdi zmdi-calendar-check text-muted chart-f20" />
            <span className="ml-3 text-dark">
              {saleStatisticsDtoMonthlyOrder}
            </span>
          </span>
          <p className="text-muted">
            <IntlMessages id="dashboard.manager.ordersMonthly" />
          </p>
        </div>
        <div className="col-6 col-sm-4 col-md-3 col-lg-2">
          <span className="d-flex align-items-center mb-2">
            <i className="zmdi zmdi-calendar-note text-muted chart-f20" />
            <span className="ml-3 text-dark">
              {saleStatisticsDtoWeeklyOrder}
            </span>
          </span>
          <p className="text-muted">
            <IntlMessages id="dashboard.manager.ordersWeekly" />
          </p>
        </div>
        <div className="col-6 col-sm-4 col-md-3 col-lg-2">
          <span className="d-flex align-items-center mb-2">
            <i className="zmdi zmdi-money-box text-muted chart-f20" />
            <span className="ml-3 text-dark">
              {saleStatisticsDtoAverageRevenue}
            </span>
          </span>
          <p className="text-muted">
            <IntlMessages id="dashboard.manager.averageRevenue" />
          </p>
        </div>
        <div className="col-6 col-sm-4 col-md-3 col-lg-2">
          <span className="d-flex align-items-center mb-2">
            <i className="zmdi zmdi-money-box text-muted chart-f20" />
            <span className="ml-3 text-dark">
              {saleStatisticsDtoTotalRevenue}
            </span>
          </span>
          <p className="text-muted">
            <IntlMessages id="dashboard.manager.totalRevenue" />
          </p>
        </div>
        <div
          style={{ cursor: "pointer" }}
          className="col-6 col-sm-4 col-md-3 col-lg-2"
          onClick={handleOrder}
        >
          <span className="d-flex align-items-center mb-2">
            <i className="zmdi zmdi-calendar text-muted chart-f20" />
            <span className="ml-3 text-dark">
              {saleStatisticsDtoTotalOrders}
            </span>
          </span>
          <p className="text-muted">
            <IntlMessages id="dashboard.manager.totalOrders" />
          </p>
        </div>
        <div
          style={{ cursor: "pointer" }}
          className="col-6 col-sm-4 col-md-3 col-lg-2"
          onClick={handleRenewal}
        >
          <span className="d-flex align-items-center mb-2">
            <i className="zmdi zmdi-calendar-alt text-muted chart-f20" />
            <span className="ml-3 text-dark">{saleStatisticsDtorenewals}</span>
          </span>
          <p className="text-muted">
            <IntlMessages id="dashboard.manager.totalRenewals" />
          </p>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-7 col-12 mb-5 mb-lg-1">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={(saleStatisticsDto || {}).chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <XAxis dataKey="label" />
              <YAxis type="number" domain={[0, 26000]} />
              <CartesianGrid strokeDasharray="0" stroke="#DCDEDE" />

              <Tooltip />
              <defs>
                <linearGradient id="salesStatistic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4258BC" stopOpacity={1} />
                  <stop offset="95%" stopColor="#FFF" stopOpacity={0.8} />
                </linearGradient>
              </defs>

              <Area
                type="monotone"
                dataKey="value"
                strokeWidth={2}
                stroke="#6F82E5"
                fill="url(#salesStatistic)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="col-lg-5 col-12">
          <ResponsiveContainer width="100%">
            <SalesGauge
              newRevenuePercentage={newRevenuePercentage}
              renewalRevenuePercentage={renewalRevenuePercentage}
            />
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SalesStatistic;
