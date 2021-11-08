import React from "react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import IntlMessages from "util/IntlMessages";
import "./style.css";
import Widget from "components/Widget";

const GrowthCard = (props) => {
  return (
    <Widget
      title={<IntlMessages id="dashboard.Growth" />}
      styleName={`jr-card-full pl-4 pt-3 jr-card-metrics`}
    >
      <div className="row">
        <div className="col-xl-4 col-lg-4 col-md-4 col-4">
          <div className="pb-4 mt-2">
            {props.growthPercentage >= 1 ? (
              <h1 className="jr-fs-xxxl font-weight-bold mb-1 jr-chart-up">
                {props.growthPercentage}%
                <i className="zmdi zmdi-caret-up jr-fs-xxl" />
              </h1>
            ) : (
              <h1
                className="jr-fs-xxxl font-weight-bold mb-1 jr-chart-up"
                style={{ color: "red" }}
              >
                {props.growthPercentage}%
                <i className="zmdi zmdi-caret-down jr-fs-xxl" />
              </h1>
            )}

            <p className="mb-0 text-grey">
              <IntlMessages id="dashboard.thisYear" />
            </p>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-xl-11 col-lg-11 col-md-11 col-11">
          <ResponsiveContainer
            className="rounded-bottom-right overflow-hidden"
            width="100%"
            height={150}
          >
            <AreaChart
              data={props.trafficData}
              margin={{ top: 0, right: 0, left: 0, bottom: 50 }}
            >
              <defs>
                <linearGradient id="color1" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="5%" stopColor="#3f51b5" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#1fb6fc" stopOpacity={0.9} />
                </linearGradient>
              </defs>
              <Area
                dataKey="pv"
                strokeWidth={0}
                stackId="2"
                stroke="#867AE5"
                fill="url(#color1)"
                fillOpacity={1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Widget>
  );
};

export default GrowthCard;
