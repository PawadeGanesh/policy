import React, { useState, useEffect } from "react";
import FormControl from "@material-ui/core/FormControl";
import Paper from "@material-ui/core/Paper";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import IntlMessages from "util/IntlMessages";
import axios from "axios";
import apiInstance from "setup";
import SaveIcon from "@material-ui/icons/Save";
import IconButton from "@material-ui/core/IconButton";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { apigetUrl, apiputUrl } from "setup/middleware";
import {
  IPPNotification,
  ippNotify,
} from "../CommonComponents/IPPNotification";

const baseURL = `${process.env.REACT_APP_BASE_URL}`;

const Preferences = ({ name, categoryId, eventId, successData, errorData }) => {
  const [state, setState] = useState({
    sms: false,
    email: false,
    push: false,
    inapp: false,
    data: "",
    isSuucessAlert: false,
    isErrorAlert: false,
    isEdit: false,
  });

  useEffect(() => {
    getSpecificUserPrefernces();
  }, []);

  const getSpecificUserPrefernces = () => {
    // axios
    //   .get(
    //     `${baseURL}/notify/preferences/${categoryId}/${eventId}`,
    //     apiInstance
    //   )
    apigetUrl(`/notify/preferences/${categoryId}/${eventId}`)
      .then((res) => {
        console.log("RES-getSpecificUserPrefernces", res);
        let response = res.data;
        if (`${response.data.responseStatus}` === "400") {
          getSpecificEvent();
        }
        setState((prevState) => ({
          ...prevState,
          data: res.data,
          sms: preferencesTextReturn(response.preferences.sms),
          email: preferencesTextReturn(response.preferences.email),
          inapp: preferencesTextReturn(response.preferences.inapp),
          push: preferencesTextReturn(response.preferences.push),
        }));
      })
      .catch((err) => {
        console.log("Err-getSpecificUserPrefernces", err.response);
        if (((err.response || {}).data || {}).responseStatus === "failure") {
          getSpecificEvent();
        }
      });
  };

  const getSpecificEvent = () => {
    // axios
    //   .get(`${baseURL}/notify/events/${eventId}`, apiInstance)
    apigetUrl(`/notify/events/${eventId}`)
      .then((res) => {
        console.log("RES-getSpecificEvent", res);
        const response = res.data;
        setState((prevState) => ({
          ...prevState,
          data: res.data,
          sms: preferencesTextReturn(response.preferences.sms),
          email: preferencesTextReturn(response.preferences.email),
          inapp: preferencesTextReturn(response.preferences.inapp),
          push: preferencesTextReturn(response.preferences.push),
        }));
      })
      .catch((err) => console.log("Err", err));
  };

  const preferencesTextReturn = (preferences) => {
    switch (preferences) {
      case "N":
        return false;
      case "y":
        return true;
      case "":
        return "";
    }
  };

  const preferencesNumberReturn = (preferences) => {
    switch (preferences) {
      case true:
        return "y";
      case false:
        return "N";
      case "":
        return "";
    }
  };

  const handleSubmit = async () => {
    console.log("EDIT ID", state.selectedId);
    let putDataObj = {
      preferences: {
        sms: preferencesNumberReturn(state.sms),
        email: preferencesNumberReturn(state.email),
        inapp: preferencesNumberReturn(state.inapp),
        push: preferencesNumberReturn(state.push),
      },
    };

    console.log("Edit-Response", putDataObj);
    // axios
    //   .put(
    //     `${baseURL}/notify/preferences/${categoryId}/${eventId}`,
    //     putDataObj,
    //     apiInstance
    //   )
    apiputUrl(`/notify/preferences/${categoryId}/${eventId}`, putDataObj)
      .then((res) => {
        console.log("Response of Edit Submit", res.data.responseStatus);
        setState((prevState) => ({
          ...prevState,
          isEdit: false,
        }));
        successData(res);
      })
      .catch((err) => {
        console.log("err", err.response);
        setState((prevState) => ({
          ...prevState,
          isEdit: false,
          sms: preferencesTextReturn(state.sms),
          email: preferencesTextReturn(state.email),
          inapp: preferencesTextReturn(state.inapp),
          push: preferencesTextReturn(state.push),
        }));
        errorData(err);
      });
  };

  const handleCheck = (e) => {
    console.log("EVET", e.target.checked);
    setState((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.checked,
      isEdit: true,
    }));
  };

  return (
    <>
      <div className="row">
        <div className="col-lg-4"></div>
        <div className="col-lg-4"></div>
        <div className="col-lg-4">
          <IPPNotification />
        </div>
      </div>
      <TableContainer component={Paper} className="ml-4">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell width="15%">
                <b>{name}</b>
              </TableCell>
              <TableCell width="10%">
                <FormControlLabel
                  name="sms"
                  control={
                    <Switch
                      color="primary"
                      checked={state.sms}
                      name="sms"
                      onClick={(e) => handleCheck(e, "sms")}
                      renderValue={(value) =>
                        console.log("value", value)`${value}`
                      }
                    />
                  }
                />
              </TableCell>
              <TableCell width="10%">
                <FormControlLabel
                  name="email"
                  control={
                    <Switch
                      color="primary"
                      checked={state.email}
                      onClick={(e) => handleCheck(e, "email")}
                      renderValue={(value) =>
                        console.log("value", value)`${value}`
                      }
                    />
                  }
                />
              </TableCell>
              <TableCell width="10%">
                <FormControlLabel
                  name="push"
                  control={
                    <Switch
                      color="primary"
                      checked={state.push}
                      onClick={(e) => handleCheck(e, "push")}
                      renderValue={(value) =>
                        console.log("value", value)`${value}`
                      }
                    />
                  }
                />
              </TableCell>
              <TableCell width="10%">
                <FormControlLabel
                  name="inapp"
                  control={
                    <Switch
                      color="primary"
                      checked={state.inapp}
                      onClick={(e) => handleCheck(e, "inapp")}
                      renderValue={(value) =>
                        console.log("value", value)`${value}`
                      }
                    />
                  }
                />
              </TableCell>
              <TableCell width="10%">
                {state.isEdit ? (
                  <IconButton onClick={handleSubmit}>
                    <SaveIcon color="primary" />
                  </IconButton>
                ) : (
                  <IconButton onClick={handleSubmit}>
                    <SaveIcon color="disable" />
                  </IconButton>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Preferences;
