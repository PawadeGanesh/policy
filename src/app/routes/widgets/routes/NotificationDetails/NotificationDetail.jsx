import React, { useState } from "react";
import EnhancedTableToolbar from "./EnhancedTableToolbar";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import Alert from "@material-ui/lab/Alert";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import SMSTable from "./SMSTable";
import EmailTable from "./EmailTable";
import Button from "@material-ui/core/Button";
import InAppTable from "./InApp";
import PushTable from "./PushTable";
import "./master.css";
import IntlMessages from "util/IntlMessages";
import InputSelect from "../CommonComponents/Select";
import "../CommonComponents/tableStyle.css";
import Loader from "../CommonComponents/Loader";

const App = () => {
  const [state, setState] = useState({
    isLoading: false,
    modes: "",
    sms: true,
    email: false,
    inapp: false,
    push: false,
    startdate: "",
    endDate: "",
  });

  const handleChange = (event) => {
    event.preventDefault();
    console.log(event.target.value);
    setState((prevState) => ({
      ...prevState,
      modes: event.target.value,
    }));
  };

  const getLoadingValue = (value) => {
    console.log("isLoading-123", value);
    setState((prevState) => ({
      ...prevState,
      isLoading: value,
    }));
  };

  const showTable = (event) => {
    switch (event) {
      case "sms":
        setState({ sms: true });
        break;
      case "email":
        setState({ email: true });
        break;
      case "inapp":
        setState({ inapp: true });
        break;
      case "push":
        setState({ push: true });
    }
    setState((prevState) => ({ ...prevState, modes: event }));
  };

  const handleTable = () => {
    showTable(state.modes);
  };
  return (
    <React.Fragment>
      {state.isLoading ? <Loader /> : null}
      <div className="App">
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <div className="audit-master-box">
              <div className="row mt-5">
                <div className="col-lg-4 col-sm-6 col-12"></div>
                <div className="col-lg-3 col-sm-6 col-12">
                  <FormControl variant="outlined" className="w-100 mb-3">
                    <InputLabel id="isEnabled">
                      <IntlMessages id="notificationdetails.report.dropdown.mode" />
                    </InputLabel>
                    <InputSelect
                      native
                      labelId="isEnabled"
                      id="isEnabled"
                      value={state.modes}
                      onChange={(event) => handleChange(event)}
                      defaultValue={"SMS"}
                      label="Is Enabled"
                      name="isEnabled"
                    >
                      <option value="sms">SMS</option>
                      <option value="email">E-Mail</option>
                      <option value="inapp">InApp</option>
                      <option value="push">Push</option>
                    </InputSelect>
                  </FormControl>
                </div>
                <div className="col-lg-3 col-sm-6 col-12 pt-2 ml-2">
                  <Button
                    variant="contained"
                    color="primary"
                    className="mx-2"
                    onClick={(e) => handleTable(e)}
                  >
                    <IntlMessages id="ipp.common.search.button" />
                  </Button>
                </div>
              </div>

              {state.sms ? (
                <SMSTable getLoadingValue={getLoadingValue} />
              ) : state.email ? (
                <EmailTable getLoadingValue={getLoadingValue} />
              ) : state.inapp ? (
                <InAppTable getLoadingValue={getLoadingValue} />
              ) : state.push ? (
                <PushTable getLoadingValue={getLoadingValue} />
              ) : null}
            </div>
          </Grid>
        </Grid>
      </div>
    </React.Fragment>
  );
};

export default App;
