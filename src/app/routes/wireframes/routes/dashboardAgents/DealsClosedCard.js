import React from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, Tooltip } from "recharts";
import Widget from "components/Widget/index";
import IntlMessages from "util/IntlMessages";
// const data = [
//   { name: "Apr", uv: 800, pv: 1300 },
//   { name: "May", uv: 700, pv: 1200 },
//   { name: "Jun", uv: 500, pv: 900 },
//   { name: "Jul", uv: 600, pv: 200 },
//   { name: "Aug", uv: 200, pv: 800 },
//   { name: "Sep", uv: 400, pv: 400 },
//   { name: "Oct", uv: 400, pv: 500 },
//   { name: "Nov", uv: 400, pv: 1200 },
//   { name: "Dec", uv: 200, pv: 800 },
//   { name: "Jan", uv: 200, pv: 800 },
//   { month: "Jan", queries: 200, sold: 800 },
// ];

const DealsClosedCard = ({ saleData , policySold}) => {
  return (
    <Widget>
      <div className="jr-dealclose-header">
        <div>
          <h4 className="mb-0">{policySold} <IntlMessages id="agentdashboard.dashboard.PoliciesSold"/></h4>
          <p className="text-grey mb-1"><IntlMessages id="agentdashboard.dashboard.Thisyear"/></p>
        </div>
        <div className="jr-dealclose-header-right">
          <p className="mb-2">
            <span className="size-8 bg-secondary rounded-circle d-inline-block mr-1" />{" "}
            <IntlMessages id="agentdashboard.dashboard.Queries"/>
          </p>
          <p className="ml-2 mb-2">
            <span className="size-8 bg-primary rounded-circle d-inline-block mr-1" />{" "}
            <IntlMessages id="agentdashboard.dashboard.Sold"/>
          </p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={120}>
        <BarChart
          data={saleData}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          <Tooltip
            isAnimationActive={true }
            separator={": "}
          />
          <XAxis dataKey="month" />
          <Bar dataKey="sold" stackId="a" fill="#3f51b5" barSize={8} />
          <Bar dataKey="queries" stackId="a" fill="#ff4081" barSize={8} />
        </BarChart>
      </ResponsiveContainer>
    </Widget>
  );
};

export default DealsClosedCard;
