import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import CardBox from "../../../../../components/CardBox/index";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField, Button, Grid, Card } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import DialogActions from "@material-ui/core/DialogActions";
import SmsTabContent from "./SmsTabContent";
import EmailTabContent from "./EmailTabContent";
import InappTabContent from "./InappTabContent";
import PushTabContent from "./PushTabContent";
import localforage from "localforage";
import { BrowserRouter as Router, useHistory } from "react-router-dom";
import Joi from "joi-browser";
import axios from "axios";
import IntlMessages from "util/IntlMessages";
import InputField from "../CommonComponents/TextField";
import apiInstance from "setup";
import InputSubmitButton from "../CommonComponents/SubmitButton";
import InputCancelButton from "../CommonComponents/CancelButton";
import InputAutocomplete from "../CommonComponents/Autocomplete";
import {
  IPPNotification,
  ippNotify,
} from "../CommonComponents/IPPNotification";
import { apigetUrl, apiputUrl } from "setup/middleware";
import "./root.component.css";

const editNotificationTemplateSchema = {
  eventName: Joi.string()
    .required()
    .label("Event"),
  code: Joi.string()
    .required()
    .label("Code"),
  type: Joi.string()
    .required()
    .label("Type"),
  name: Joi.string()
    .required()
    .label("Name"),
  description: Joi.string()
    .required()
    .label("Description"),
};

let caller = "";

const config = {
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
  data: {},
};

const baseURL = `${process.env.REACT_APP_BASE_URL}`;

const EditNotificationTemplate = (props) => {
  const location = useLocation();

  const [localForageData, setLocalForageData] = useState("");

  useEffect(() => {
    apigetUrl(
      `/config/core-data?page=1&limit=10&typeId=40&sortBy=name&sortType=asc`
    )
      .then((res) => {
        console.log("res-langauge", res);
        if (`${res.data.responseCode}` === "200") {
          setState((prevState) => ({
            ...prevState,
            langData: res.data.dataList,
          }));
        }
      })
      .catch((err) => console.log("err", err));
  }, []);

  useEffect(() => {
    localforage
      .getItem("editNotificationTemplateData")
      .then(function(editNotificationTemplateData) {
        apigetUrl(`/notify/events?page=1&limit=100`)
          .then(function(response) {
            console.log("list of notification events = ", response);

            setState((prevState) => ({
              ...prevState,
              dynamicEventIdList: response.data.dataList,
            }));
          })
          .catch((error) => {
            //console.log("error = ", error);
            if (error.response) {
              if (error.response.responseMessage) {
                getErrorUpdate(error, null);
              } else {
                getErrorUpdate(
                  error,
                  "Some unexpected error happened, please try again later"
                );
              }
            } else {
              console.log("Looks like you have lost connectivity");
              getErrorUpdate(error, "Looks like you have lost connectivity");
            }
          });

        // axios
        //   .get(
        //     baseURL +
        //       "/notify/templates/" +
        //       editNotificationTemplateData.selectedEditId,
        //     apiInstance
        //   )
        apigetUrl(
          `/notify/templates/${editNotificationTemplateData.selectedEditId}`
        )
          .then(function(response) {
            console.log("get response = ", response);
            setState((prevState) => ({
              ...prevState,
              // dynamicEventIdList:
              //   editNotificationTemplateData.dynamicEventIdList,
              selectedEditId: editNotificationTemplateData.selectedEditId,
              eventName:
                editNotificationTemplateData.selected_EditForm_EventName_Value,
              eventId:
                editNotificationTemplateData.selected_EditForm_EventId_Value,
              editNotificationTemplateValidation: {
                eventName:
                  editNotificationTemplateData.selected_EditForm_EventName_Value,
                code: editNotificationTemplateData.selected_EditForm_Code_Value,
                type: editNotificationTemplateData.selected_EditForm_Type_Value,
                name: editNotificationTemplateData.selected_EditForm_Name_Value,
                description:
                  editNotificationTemplateData.selected_EditForm_Description_Value,
              },
              rowVersion:
                editNotificationTemplateData.selected_EditForm_RowVersion_Value,
              templateData: editNotificationTemplateData.templateData,
              tabHeaderData: editNotificationTemplateData.templateData,
              //tabValue: editNotificationTemplateData.templateData.id,
            }));
          })
          .catch((error) => {
            //console.log("error = ", error);
            if (error.response) {
              if (error.response.responseMessage) {
                getErrorUpdate(error, null);
              } else {
                getErrorUpdate(
                  error,
                  "Some unexpected error happened, please try again later"
                );
              }
            } else {
              console.log("Looks like you have lost connectivity");
              getErrorUpdate(error, "Looks like you have lost connectivity");
            }
          });

        populateTableRowData_EachMode(
          editNotificationTemplateData.templateData
        );
        // console.log(
        //   "editNotificationTemplateData.templateData = ",
        //   editNotificationTemplateData.templateData
        // );
      });
  }, [localForageData]);

  const eventID_AutoComplete_Ref = useRef();

  const smsTabRef = useRef();
  const emailTabRef = useRef();
  const inappTabRef = useRef();
  const pushTabRef = useRef();

  const [state, setState] = useState({
    data: [],
    selectedEditId: "",
    tabHeaderData: [],
    tabGroupData: [],
    editNotificationTemplate_AvailableLanguages_Value: "",
    dynamicEventIdList: [],
    addLanguageContent_Value: "",
    tabValue: 1,
    extractedData_OnTabClick: "",
    templateData: "",
    handleAutoCompleteInputReset: false,
    editNotificationTemplateValidation: {
      eventName: "",
      eventId: "",
      code: "",
      type: "",
      name: "",
      description: "",
    },
    eventName: "",
    eventId: "",
    editNotificationTemplateValidationErrors: {},
    editNotificationTemplateValidationText: true,
    rowVersion: "",
    langData: [],
  });

  console.log(
    "editNotificationTemplateValidation",
    state.editNotificationTemplateValidation
  );

  const assignID_To_Each_Tab = (mode) => {
    switch (mode) {
      case "sms":
        return 1;
      case "email":
        return 2;
      case "inapp":
        return 3;
      case "push":
        return 4;
    }
  };

  const getErrorUpdate = (err, customMessage) => {
    //console.log("error before slice", err.response);
    console.log(" err.response = ", err.response);
    if (`${err.response.data.responseStatus}` === "failure") {
      ippNotify.error((err || {}).response.data.responseMessage);
    }

    if (customMessage) {
      try {
        if (!err.response.data) {
          setState((prevState) => ({
            ...prevState,
            errorMsg:
              err.response.status +
              " - " +
              err.response.statusText +
              " - " +
              customMessage,
            isErrorAlert: true,
          }));
        } else if (!err.response) {
          setState((prevState) => ({
            ...prevState,
            errorMsg: customMessage,
            isErrorAlert: true,
          }));
        }
      } catch (err) {
        setState((prevState) => ({
          ...prevState,
          // errorMsg: err.response + " - " + customMessage,
          errorMsg: customMessage,
          isErrorAlert: true,
        }));
      }
    } else {
      let error = err.response.data.responseMessage;
      let errMessage = error.slice(10);

      setState((prevState) => ({
        ...prevState,
        errorMsg: errMessage,
        isErrorAlert: true,
      }));
    }
  };

  const populateTableRowData_EachMode = (tabHeaderData) => {
    setState((prevState) => ({
      ...prevState,
      extractedData_OnTabClick: tabHeaderData[0],
    }));

    tabHeaderData.map((m) => {
      return (m["id"] = assignID_To_Each_Tab(m.mode));
    });

    tabHeaderData.map((n) => {
      n.contentDetails.map((a) => {
        return (a["isEditMode"] = false);
      });
      //DRY !!!!!
      n.contentDetails.map((a) => {
        return (a["id"] = a.language);
      });
    });
  };

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };

  function isObjEmpty(obj) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }

    return JSON.stringify(obj) === JSON.stringify({});
  }

  const editNotificationTemplateValidateProperty = (
    { name, value },
    autoCompleteValue,
    ref
  ) => {
    let obj;
    let propertySchema;

    if (ref) {
      autoCompleteValue
        ? (obj = { [ref.current.getAttribute("name")]: autoCompleteValue.name })
        : (obj = { [ref.current.getAttribute("name")]: autoCompleteValue });

      propertySchema = {
        [ref.current.getAttribute("name")]: editNotificationTemplateSchema[
          ref.current.getAttribute("name")
        ],
      };
    } else {
      obj = { [name]: value };
      propertySchema = { [name]: editNotificationTemplateSchema[name] };
    }

    const { error } = Joi.validate(obj, propertySchema);

    return error ? error.details[0].message : null;
  };

  const checkAreAllEditFormFieldsPopulated = (obj) => {
    return !Object.values(obj).some((x) => x === "");
  };

  const onEditFormChange = (event, ref) => {
    const { target: input } = event;
    //console.log("input = ", input);
    const inputID = input.id.split("-");
    const numericInputID = parseInt(inputID[inputID.length - 1]);
    //console.log("numericInputID = ", numericInputID);

    const errors = { ...state.editNotificationTemplateValidationErrors };
    const validation = { ...state.editNotificationTemplateValidation };
    if (ref) {
      const errorMessage = editNotificationTemplateValidateProperty(input, ref);
      if (errorMessage) errors[ref.current.getAttribute("name")] = errorMessage;
      else delete errors[ref.current.getAttribute("name")];

      validation.eventId = numericInputID;
    } else {
      const errorMessage = editNotificationTemplateValidateProperty(input);
      if (errorMessage) errors[input.name] = errorMessage;
      else delete errors[input.name];
      validation[input.name] = input.value;
    }

    const allFormFieldsPopulated = checkAreAllEditFormFieldsPopulated(
      validation
    );

    console.log("validation = ", allFormFieldsPopulated);

    setState((prevState) => ({
      ...prevState,
      editNotificationTemplateValidation: validation,
      editNotificationTemplateValidationErrors: errors,
      editNotificationTemplateValidationText: allFormFieldsPopulated,
    }));
  };

  const storeEachTabToLocalStorage = (tabValue) => {
    console.log("res-2", tabValue);
    //console.log("tabValue storeEachTabToLocalStorage = ", tabValue);
    switch (tabValue) {
      case 1:
        get_SMS_TabData();
        return;
      case 2:
        get_EMAIL_TabData();
        return;
      case 3:
        get_INAPP_TabData();
        return;
      case 4:
        get_PUSH_TabData();
        return;
    }
  };

  const handleTabChange = (event, value) => {
    console.log("tab name value = ", value);
    // storeEachTabToLocalStorage(state.tabValue);
    setState((prevState) => ({
      ...prevState,
      tabValue: value,
    }));

    const onTabClickedIndex = state.tabHeaderData
      .map(function(e) {
        return e.id;
      })
      .indexOf(value);

    setState((prevState) => ({
      ...prevState,
      extractedData_OnTabClick: state.tabHeaderData[onTabClickedIndex],
    }));
  };

  const get_SMS_TabData = (smsData) => {
    console.log("res-3", smsData);
    smsTabRef.current.joinAllSMS_TabData();
  };

  const get_EMAIL_TabData = (emailData) => {
    console.log("res-3", emailData);
    emailTabRef.current.joinAllEMAIL_TabData();
  };

  const get_INAPP_TabData = (inappData) => {
    console.log("res-3", inappData);
    inappTabRef.current.joinAllINAPP_TabData();
  };

  const get_PUSH_TabData = (pushData) => {
    console.log("res-3", pushData);
    pushTabRef.current.joinAllPUSH_TabData();
  };

  const resumeSaveAllClickButtonWork = () => {
    console.log("res-4");
    const templateArray = [];
    Promise.all([
      localforage.getItem("smsTabData"),
      localforage.getItem("emailTabData"),
      localforage.getItem("inappTabData"),
      localforage.getItem("pushTabData"),
    ])
      .then(function(results) {
        console.log("res-5", results);
        results.map((item) => {
          console.log("res-6", item);
          if (!item) {
            //console.log("if item null = ", item);
          } else if (item) {
            if (
              item.contentDetails &&
              item.toExpression &&
              item.notifyLanguage
            ) {
              templateArray.push(item);
              //console.log("item pushed = ", item);
            } else {
              if (item.mode === "sms") {
                try {
                  //console.log("item.mode = ", item.mode);
                  var index = results.findIndex((p) => p.mode === "sms");
                  //console.log("index sms = ", index);
                  templateArray.push(state.templateData[index]);
                } catch (err) {
                  //console.log("sms err", err);
                }
              }
              if (item.mode === "email") {
                try {
                  //console.log("item.mode = ", item.mode);
                  var index = results.findIndex((p) => p.mode === "email");
                  // console.log("index email = ", index);
                  templateArray.push(state.templateData[index]);
                } catch (err) {
                  // console.log("email err", err);
                }
              }
              if (item.mode === "inapp") {
                try {
                  //console.log("item.mode = ", item.mode);
                  var index = results.findIndex((p) => p.mode === "inapp");
                  //console.log("index inapp = ", index);
                  templateArray.push(state.templateData[index]);
                } catch (err) {
                  //console.log("inapp err", err);
                }
              }
              if (item.mode === "push") {
                try {
                  //console.log("item.mode = ", item.mode);
                  var index = results.findIndex((p) => p.mode === "push");
                  //console.log("index push = ", index);
                } catch (err) {
                  //console.log("push err", err);
                  var index = state.templateData.findIndex(
                    (p) => p.mode == "push"
                  );
                  templateArray.push(state.templateData[index]);
                }
              }
            }
          }
        });

        //console.log("templateArray after push = ", templateArray);

        const emptyEmptyModeCheckArr = [];

        state.templateData.map((eachItem) => {
          const modeCheck = templateArray.find(
            (item) => item.mode === eachItem.mode
          );

          ////console.log("modeCheck = ", modeCheck);

          if (!modeCheck) {
            emptyEmptyModeCheckArr.push(eachItem);
          }
        });

        //console.log("emptyEmptyModeCheckArr = ", emptyEmptyModeCheckArr);

        emptyEmptyModeCheckArr.map((item) => {
          templateArray.push(item);
        });

        //console.log("templateArray after all done = ", templateArray);
      })
      .then(function() {
        const finalUpdateObject = {
          eventId: state.eventId,
          eventName: state.eventName,
          code: state.editNotificationTemplateValidation.code,
          type: state.editNotificationTemplateValidation.type,
          name: state.editNotificationTemplateValidation.name,
          description: state.editNotificationTemplateValidation.description,
          template: templateArray,
          rowVersion: state.rowVersion,
        };
        console.log("finalUpdateObject = ", finalUpdateObject);

        apiputUrl(
          `/notify/templates/${state.selectedEditId}`,
          finalUpdateObject
        )
          .then(function(response) {
            if (response.data.responseStatus === "success") {
              history.push({
                pathname: "/app/widgets/NotificationTemplate",
                state: {
                  getSuccessUpdate: true,
                },
              });
            }
          })
          .catch((error) => {
            //console.log("error = ", error);
            if (error.response) {
              if (error.response.responseMessage) {
                getErrorUpdate(error, null);
              } else {
                getErrorUpdate(
                  error,
                  "Some unexpected error happened, please try again later"
                );
              }
            } else {
              console.log("Looks like you have lost connectivity");
              getErrorUpdate(error, "Looks like you have lost connectivity");
            }
          });
      });
  };

  const localForageSaveStatus = (saveStatus) => {
    //console.log("saveStatus = ", saveStatus);
    //console.log("caller = ", caller);

    if (caller) {
      resumeSaveAllClickButtonWork();
    }
  };

  const renderCorrespondingTabContent = () => {
    switch (state.tabValue) {
      case 1:
        return (
          <SmsTabContent
            tabValue={state.tabValue}
            template={state.extractedData_OnTabClick}
            ref={smsTabRef}
            localForageSaveStatus={localForageSaveStatus}
            langData={state.langData}
          />
        );
      case 2:
        return (
          <EmailTabContent
            tabValue={state.tabValue}
            template={state.extractedData_OnTabClick}
            ref={emailTabRef}
            localForageSaveStatus={localForageSaveStatus}
            langData={state.langData}
          />
        );
      case 3:
        return (
          <InappTabContent
            tabValue={state.tabValue}
            template={state.extractedData_OnTabClick}
            ref={inappTabRef}
            localForageSaveStatus={localForageSaveStatus}
            langData={state.langData}
          />
        );
      case 4:
        return (
          <PushTabContent
            tabValue={state.tabValue}
            template={state.extractedData_OnTabClick}
            ref={pushTabRef}
            localForageSaveStatus={localForageSaveStatus}
            langData={state.langData}
          />
        );
    }
  };

  let history = useHistory();

  const handleCancelClick = () => {
    history.push({
      pathname: "/app/widgets/NotificationTemplate",
    });
  };

  const handleSaveAllClick = () => {
    console.log("res-1", state.tabValue);
    caller = "handleSaveAllClick";
    storeEachTabToLocalStorage(state.tabValue);
  };

  const handleEditChange = (event, value) => {
    let findEventId = (state.dynamicEventIdList || []).find(
      (n) => n.name === value
    );
    console.log("value", value);
    if (value === null) {
      setState((prevState) => ({
        ...prevState,
        eventName: value,
        eventId: (findEventId || {}).id,
        error: true,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        eventName: value,
        eventId: (findEventId || {}).id,
        error: false,
      }));
    }
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
      <div className="row">
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <div className="audit-master-box">
              <div className="row">
                <div className="col-lg-4">
                  {state.error ? (
                    <>
                      <InputAutocomplete
                        id="eventName"
                        name="eventName"
                        onChange={handleEditChange}
                        options={(state.dynamicEventIdList || []).map(
                          (n) => n.name
                        )}
                        value={state.eventName}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            error
                            required
                            label={
                              <IntlMessages id="notificationtempalet.master.modal.edit.felid.Event" />
                            }
                            helperText="EventName is Required"
                            variant="outlined"
                          />
                        )}
                      />
                    </>
                  ) : (
                    <>
                      <InputAutocomplete
                        id="eventName"
                        name="eventName"
                        onChange={handleEditChange}
                        options={(state.dynamicEventIdList || []).map(
                          (n) => n.name
                        )}
                        value={state.eventName}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            required
                            label={
                              <IntlMessages id="notificationtempalet.master.modal.edit.felid.Event" />
                            }
                            variant="outlined"
                          />
                        )}
                      />
                    </>
                  )}
                </div>
                <div className="col-lg-4">
                  <InputField
                    required
                    id="code"
                    error={state.editNotificationTemplateValidationErrors.code}
                    helperText={
                      state.editNotificationTemplateValidationErrors.code
                    }
                    label={
                      <IntlMessages id="notificationtempalet.master.modal.edit.felid.Code" />
                    }
                    name="code"
                    className="mb-4"
                    onChange={(e) => onEditFormChange(e)}
                    value={state.editNotificationTemplateValidation.code}
                    fullWidth
                  />
                </div>
                <div className="col-lg-4">
                  <InputField
                    required
                    id="type"
                    error={state.editNotificationTemplateValidationErrors.type}
                    helperText={
                      state.editNotificationTemplateValidationErrors.type
                    }
                    label={
                      <IntlMessages id="notificationtempalet.master.modal.edit.felid.Type" />
                    }
                    name="type"
                    className="mb-4"
                    onChange={(e) => onEditFormChange(e)}
                    value={state.editNotificationTemplateValidation.type}
                    fullWidth
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-lg-4">
                  <InputField
                    required
                    id="name"
                    error={state.editNotificationTemplateValidationErrors.name}
                    helperText={
                      state.editNotificationTemplateValidationErrors.name
                    }
                    label={
                      <IntlMessages id="notificationtempalet.master.modal.edit.felid.Name" />
                    }
                    name="name"
                    className="mb-4"
                    onChange={(e) => onEditFormChange(e)}
                    value={state.editNotificationTemplateValidation.name}
                    fullWidth
                  />
                </div>
                <div className="col-lg-4">
                  <InputField
                    id="description"
                    // error={
                    //   state.editNotificationTemplateValidationErrors.description
                    // }
                    // helperText={
                    //   state.editNotificationTemplateValidationErrors.description
                    // }
                    label={
                      <IntlMessages id="notificationtempalet.master.modal.edit.felid.Description" />
                    }
                    name="description"
                    className="mb-4"
                    onChange={(e) => onEditFormChange(e)}
                    value={state.editNotificationTemplateValidation.description}
                    fullWidth
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  {/* <Container fixed maxWidth="xl" style={{ borderRadius: 0 }}> */}
                  <AppBar position="relative" color="default">
                    <Tabs
                      //indicatorColor="primary"
                      //textColor="primary"
                      value={state.tabValue}
                      onChange={handleTabChange}
                      variant="scrollable"
                      scrollButtons="on"
                      // initialselectedIndex="0"
                    >
                      {state.tabHeaderData.map((n) => {
                        return (
                          <Tab
                            key={n.id}
                            value={n.id}
                            label={n.mode}
                            // id={n.id}
                            index={n.id}
                            // typeId={n.typeId}
                          />
                        );
                      })}
                    </Tabs>
                  </AppBar>

                  {renderCorrespondingTabContent()}

                  <DialogActions>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      className="mr-3 mt-2"
                      color="error"
                    >
                      {/* {!state.editNotificationTemplateValidationText
                        ? "All Mandatory fields should be filled"
                        : null} */}
                    </Typography>
                    <InputCancelButton onClick={(e) => handleCancelClick(e)} />
                    <InputSubmitButton onClick={(e) => handleSaveAllClick(e)} />
                  </DialogActions>
                  {/* </Container> */}
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default EditNotificationTemplate;
