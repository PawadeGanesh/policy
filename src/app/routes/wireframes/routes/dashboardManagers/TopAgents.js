import React, { useEffect, useState } from "react";
import Aux from "util/Auxiliary.js";
import IntlMessages from "util/IntlMessages";
import PersonIcon from "@material-ui/icons/Person";
import { makeStyles } from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { blue } from "@material-ui/core/colors";
import {numberFormater,currencyWithNameFormater} from "../../../widgets/routes/CommonComponents/formater"

const TopAgents = ({ data }) => {
  const [state, setState] = useState({
    agentList: [],
    checkedAgent: false,
  });

  console.log("agetnList", (state.agentList || []).length);

  useEffect(() => {
    console.log("topAgentsData", data.topAgentsData);
    setState((prevState) => ({
      ...prevState,
      agentList: data.topAgentsData,
    }));
  }, [data]);

  const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 200,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    switchBase: {
      color: blue[900],
    },
  }));
  const classes = useStyles();

  const handleChange = (e) => {
    if (e.target.checked === true) {
      setState((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.checked,
        agentList: data.topAgentsDataByRevenue,
      }));
    } else if (e.target.checked === false) {
      setState((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.checked,
        agentList: data.topAgentsData,
      }));
    }
  };
  return (
    <Aux>
      <div className="jr-card">
        <h2 className="jr-entry-title d-flex flex-row">
          <IntlMessages id="dashboard.topAgents" />
          {(state.agentList || []).length !== 0 ? (
            <>
              <span className="topagent mt-0" style={{ marginLeft: "25%" }}>
                <>
                  {!state.checkedAgent ? (
                    <>
                      <span
                        className="mr-2"
                        style={{ fontSize: "1.125rem", color: "blue" }}
                      ><IntlMessages id="dashboard.ByPolicy" /></span>
                    </>
                  ) : (
                    <>
                      <span className="mr-2"><IntlMessages id="dashboard.ByPolicy" /></span>
                    </>
                  )}
                </>
                <FormControlLabel
                  control={
                    <Switch
                      classes={{
                        switchBase: classes.switchBase,
                      }}
                      checked={state.checkedAgent}
                      onChange={handleChange}
                      color="default"
                      name="checkedAgent"
                    />
                  }
                />
                <>
                  {state.checkedAgent ? (
                    <>
                      <span
                        style={{
                          marginLeft: "-20px",
                          fontSize: "1.125rem",
                          color: "blue",
                        }}
                      >
                        <IntlMessages id="dashboard.ByRevenue" />
                      </span>
                    </>
                  ) : (
                    <>
                      <span
                        style={{ marginLeft: "-20px", fontSize: "1.125rem" }}
                      >
                       <IntlMessages id="dashboard.ByRevenue" />
                      </span>
                    </>
                  )}
                </>
              </span>
              <span className="text-primary jr-font-weight-medium jr-fs-md pointer ml-auto d-none d-sm-block">
                <IntlMessages id="dashboard.goToAgentList" />
                <i className="zmdi zmdi-long-arrow-right jr-fs-xxl ml-2 d-inline-block align-middle" />
              </span>
            </>
          ) : null}
        </h2>

        <ul className="jr-agents-list">
          {(state.agentList || []).map((user, index) => (
            <li key={index}>
              <div
                className="jr-profileon"
                style={{ width: "120px", height: "120px" }}
              >
                {user.imge ? (
                  <div className="jr-profileon-thumb">
                    <img alt={""} src={user.image} />
                  </div>
                ) : (
                  <div className="jr-profileon-thumb">
                    <PersonIcon color="inherit" style={{ fontSize: 120 }} />
                  </div>
                )}

                <div className="jr-profileon-content">
                  <h5 className="mb-0 text-truncate">{user.name}</h5>
                  <p className="mb-0 jr-fs-sm text-truncate">
                    <i className={`zmdi zmdi-star text-orange`} />{" "}
                    {user.feedback}
                    {!state.checkedAgent ? (
                      <>
                        <span>|</span> {numberFormater(user.policies)} <span>Policies</span>
                      </>
                    ) : (
                      <>
                        <span>|</span> {currencyWithNameFormater(user.revenue)}
                      </>
                    )}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <span className="text-primary jr-font-weight-medium jr-fs-md pointer mb-3 d-block d-sm-none">
          Go to agents list{" "}
          <i className="icon icon-long-arrow-right jr-fs-xxl ml-2 d-inline-block align-middle" />
        </span>
      </div>
    </Aux>
  );
};

export default TopAgents;
