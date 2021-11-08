import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import IconWithTextCard from "./IconWithTextCard";
import ContainerHeader from "components/ContainerHeader";
import RenewalTable from "./RenewalTable";
import RenewalCalendar from "./RenewalCalendar";
import IntlMessages from "util/IntlMessages";
import DealsClosedCard from "./DealsClosedCard";
import { dataMetrics } from "./data";
import Aux from "util/Auxiliary.js";
import axios from "axios";
import { BiShieldAlt2 } from "react-icons/bi";
import Widget from "components/Widget";
import { GiTwoCoins } from "react-icons/gi";
import { FaUsers } from "react-icons/fa";
import { BsQuestionDiamond } from "react-icons/bs";
import apiInstance from "setup";
import "./style.css";
import moment from "moment";
import { events } from "./data";
import Button from "@material-ui/core/Button";
import {
  numberFormater,
  currencyWithNameFormater,
} from "../../../widgets/routes/CommonComponents/formater";
import { apigetUrl } from "setup/middleware";
import {
  IPPNotification,
  ippNotify,
} from "../../../widgets/routes/CommonComponents/IPPNotification";

const config = {
  headers: {
    accept: "application/json",
  },
  data: {},
};

const baseURL = `${process.env.REACT_APP_BASE_URL}`;

const api = axios.create({
  baseURL: baseURL,
});

const Listing = ({ match }) => {
  const [state, setState] = useState({
    data: "",
    saleData: [],
    renewal: "0",
    resData: [],
    presentMonth: new Date().getMonth() + 1,
  });

  console.log("res", state.resData);

  useEffect(() => {
    callLocalBaseURL();
    const timer = setTimeout(() => {
      // callLocalBaseURL();
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let find = (state.resData || []).find(
      (n) =>
        moment(n.end).format("DD-MM-yyyy") ===
        moment(new Date()).format("DD-MM-yyyy")
    );

    setState((prevState) => ({
      ...prevState,
      renewal: (find || {}).title,
    }));
  }, [state.resData]);

  const callLocalBaseURL = async () => {
    apigetUrl(`/dashboard/1`)
      .then((res) => {
        console.log("res-agent", res);
        setState((prevState) => ({
          ...prevState,
          data: res.data,
          saleData: res.data.saleData,
        }));
      })
      .catch((err) => ippNotify.error(""));
  };

  const split = (obj) => {
    const keys = Object.keys(obj);
    const res = [];
    for (let i = 0; i < keys.length; i++) {
      res.push({
        title: obj[keys[i]] + " " + "Renewals",
        start: new Date(keys[i].replaceAll("-", ", ").trim()),
        end: new Date(keys[i].replaceAll("-", ", ").trim()),
      });
    }
    setState((prevState) => ({
      ...prevState,
      resData: res,
    }));
    return res;
  };

  useEffect(() => {
    apigetUrl(`/insurance/renewals/${state.presentMonth}`)
      .then((res) => {
        console.log("res", res);
        split(res.data);
      })
      .catch((err) => ippNotify.error(""));
  }, []);

  let history = useHistory();

  const handlePolicy = () => {
    console.log("click");
    history.push({
      pathname: "/app/widgets/ListOfPolicies",
      state: {
        endDate: new Date(),
        type: "1",
      },
    });
  };

  const handleRenewal = () => {
    history.push({
      pathname: "/app/widgets/ListOfPolicies",
      state: {
        endDate: new Date(),
        type: "2",
      },
    });
  };

  const handleEnquiry = () => {
    history.push({
      pathname: "/app/widgets/EnquiryList",
      state: {
        endDate: new Date(),
      },
    });
  };

  const handleCustomer = () => {
    history.push({
      pathname: "/app/widgets/ListOfCustomer",
      state: {
        endDate: new Date(),
      },
    });
  };

  const handleCommission = () => {
    history.push({
      pathname: "/app/widgets/CommissionManagement",
      state: {
        endDate: new Date(),
      },
    });
  };

  const handleClick = () => {
    history.push({
      pathname: "/app/widgets/ListOfPolicies",
      state: {
        endDate: new Date(),
        type: "2",
      },
    });
  };

  return (
    <div className="dashboard animated slideInUpTiny animation-duration-3">
      <ContainerHeader
        match={match}
        title={<IntlMessages id="dashboard.title" />}
      />

      <div className="row">
        <div className="col-xl-6 col-12">
          <div className="row">
            <div className="col-xl-12 col-lg-12 col-md-12 col-12">
              <h2 className="jr-entry-title d-flex flex-row">
                <IntlMessages id="agentdashboard.dashboard.ThisYearSummary" />{" "}
              </h2>
              <div className="row">
                <div className="col-lg-4 col-sm-4 col-6">
                  <Widget styleName="p-3">
                    <div
                      className="media align-items-center flex-nowrap"
                      onClick={handlePolicy}
                    >
                      <div className="mr-lg-3 mr-3">
                        <span>
                          <BiShieldAlt2
                            className="size-40"
                            style={{ color: "orange" }}
                          />
                        </span>
                      </div>
                      <div className="media-body">
                        <h3 className="jr-font-weight-bold mb-0">
                          {numberFormater(state.data.policyNew || 0)}
                        </h3>
                        <p className="text-grey mb-0">
                          <IntlMessages id="agentdashboard.dashboard.Policies" />
                        </p>
                      </div>
                    </div>
                  </Widget>
                </div>

                <div className="col-lg-4 col-sm-4 col-6">
                  <IPPNotification />
                  <Widget styleName="p-3">
                    <div
                      className="media align-items-center flex-nowrap"
                      onClick={handleRenewal}
                    >
                      <div className="mr-lg-3 mr-3">
                        <span>
                          <BiShieldAlt2
                            className="size-40"
                            style={{ color: "red" }}
                          />
                        </span>
                      </div>
                      <div className="media-body">
                        <h3 className="jr-font-weight-bold mb-0">
                          {numberFormater(state.data.policyRenewed || 0)}
                        </h3>
                        <p className="text-grey mb-0">
                          <IntlMessages id="agentdashboard.dashboard.Renewals" />
                        </p>
                      </div>
                    </div>
                  </Widget>
                </div>
                <div className="col-lg-4 col-sm-4 col-6">
                  <Widget styleName="p-3">
                    <div
                      className="media align-items-center flex-nowrap"
                      onClick={handleEnquiry}
                    >
                      <div className="mr-lg-3 mr-3">
                        <span>
                          <BsQuestionDiamond
                            className="size-40"
                            style={{ color: "cyan" }}
                          />
                        </span>
                      </div>
                      <div className="media-body">
                        <h3 className="jr-font-weight-bold mb-0">
                          {numberFormater(state.data.queries || 0)}
                        </h3>
                        <p className="text-grey mb-0">
                          <IntlMessages id="agentdashboard.dashboard.queries" />
                        </p>
                      </div>
                    </div>
                  </Widget>
                </div>
                <div className="col-lg-4 col-sm-4 col-6">
                  <Widget styleName="p-3">
                    <div
                      className="media align-items-center flex-nowrap"
                      onClick={handleCustomer}
                    >
                      <div className="mr-lg-3 mr-3">
                        <span>
                          <FaUsers
                            className="size-40"
                            style={{ color: "teal" }}
                          />
                        </span>
                      </div>
                      <div className="media-body">
                        <h3 className="jr-font-weight-bold mb-0">
                          {numberFormater(state.data.customers || 0)}
                        </h3>
                        <p className="text-grey mb-0">
                          <IntlMessages id="agentdashboard.dashboard.Customers" />
                        </p>
                      </div>
                    </div>
                  </Widget>
                </div>

                <div className="col-lg-4 col-sm-4 col-6">
                  <Widget styleName="p-3">
                    <div
                      className="media align-items-center flex-nowrap"
                      onClick={handleCustomer}
                    >
                      <div className="mr-lg-3 mr-3">
                        <span>
                          <GiTwoCoins
                            className="size-40"
                            style={{ color: "blue" }}
                          />
                        </span>
                      </div>
                      <div className="media-body">
                        <h4 className="jr-font-weight-bold mb-0">
                          {currencyWithNameFormater(
                            state.data.totalRevenue || 0
                          )}
                        </h4>
                        <p className="text-grey mb-0">
                          <IntlMessages id="agentdashboard.dashboard.Revenue" />
                        </p>
                      </div>
                    </div>
                  </Widget>
                </div>

                <div className="col-lg-4 col-sm-4 col-6">
                  <Widget styleName="p-3">
                    <div
                      className="media align-items-center flex-nowrap"
                      onClick={handleCommission}
                    >
                      <div className="mr-lg-3 mr-3">
                        <span>
                          <GiTwoCoins
                            className="size-40"
                            style={{ color: "green" }}
                          />
                        </span>
                      </div>
                      <div className="media-body">
                        <h3 className="jr-font-weight-bold mb-0">
                          {currencyWithNameFormater(
                            state.data.totalCommission || 0
                          )}
                        </h3>
                        <p className="text-grey mb-0">
                          <IntlMessages id="agentdashboard.dashboard.Comission" />
                        </p>
                      </div>
                    </div>
                  </Widget>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-12 col-lg-12 col-md-12 col-12">
              <DealsClosedCard
                saleData={state.saleData}
                policySold={state.data.policyRenewed + state.data.policyNew}
              />
            </div>
          </div>
        </div>

        <div className="col-xl-6 col-12">
          <div className="jr-card">
            <div className="jr-card-header d-flex align-items-center">
              <div className="mr-auto">
                <h3 className="d-inline-block mb-0">
                  <IntlMessages id="insurance.agent.dashboard.upmgRenewals" />
                </h3>
                <span className="text-white badge badge-success">
                  <IntlMessages id="agentdashboard.dashboard.ThisMonth" />
                </span>
              </div>
              <div style={{ float: "right" }}>
                <span
                  className="p-2"
                  style={{
                    backgroundColor: "#3f51b5",
                    color: "white",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                  onClick={handleClick}
                >
                  {state.renewal || "0 Renewals"} Today
                </span>
              </div>
            </div>

            <RenewalCalendar data={state.resData || []} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Listing;
