import React, { useState, useEffect, useRef } from "react";
import { FormHelperText } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Grid from "@material-ui/core/Grid";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import AccordionActions from "@material-ui/core/AccordionActions";
import Divider from "@material-ui/core/Divider";
import "react-datepicker/dist/react-datepicker.css";
import DynamicDate from "./DynamicDate";
import DynamicCheckBox from "./DynamicCheckBox";
import DynamicRadioButton from "./DynamicRadioButton";
import DynamicBooleanSwitch from "./DynamicBooleanSwitch";
import DynamicDropDown from "./DynamicDropDown";
import DynamicTextfield from "./DynamicTextfield";
import DynamicPassword from "./DynamicPassword";
import DynamicNumberTextfield from "./DynamicNumberTextfield";
import DynamicDateTime from "./DynamicDateTime";
import localforage from "localforage";
import SuccessModal from "../Modal/Success";
import ErrorModal from "../Modal/Error";
import _ from "lodash";
import apiInstance from "../../../../../setup/index";
import InputSaveButton from "../CommonComponents/SaveButton";
import { apigetUrl, apiputUrl } from "setup/middleware";
import {
  IPPNotification,
  ippNotify,
} from "../CommonComponents/IPPNotification";
import InfoModal from "../Modal/Info";
import "./style.css";
// import Editor from "../CommonComponents/Editor";
import CKEditor from "react-ckeditor-component";
import { object } from "prop-types";

const baseURL = `${process.env.REACT_APP_BASE_URL}`;

// const config = {
//   headers: {
//     "Content-Type": "application/json",
//     accept: "application/json",
//   },
//   data: {},
// };

const accordianStyles = (theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  icon: {
    verticalAlign: "bottom",
    height: 20,
    width: 20,
  },
  details: {
    alignItems: "center",
  },
  descriptionColumn: {
    //flexBasis: "50%",
    width: "60%",
  },
  fieldColumns: {
    //flexBasis: "60%",
    width: "40%",
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.text.lightDivider}`,
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  link: {
    color: theme.palette.primary[500],
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
});

function isObjEmpty(obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      return false;
    }
  }

  return JSON.stringify(obj) === JSON.stringify({});
}

const Configuration = () => {
  const accordionRefs = useRef([]);

  const [state, setState] = useState({
    tabValue: "",
    tabHeaderData: [],
    tabGroupData: [],
    configData: [],
    expansionPanelOpen: false,
    dynamicAccordionFieldData: [],
    apiAccordionData: [],
    page: 1,
    limit: 100,
    typeId: 10,
    date: null,
    startDate: new Date(),
    endDate: null,
    checkedC: true,
    dropDownField_ApiDataArray: [],
    checkBox: [],
    fieldsData: [],
    isSuccessAlert: false,
    successMsg: "",
    isErrorAlert: false,
    errorMsg: "",
    isInfoAlert: false,
    infoMsg: "",
    error: "",
    isLoading: false,
    expansionPanelValue: "",
    saveAllResponseData: [],
    forRefApiAccordionData: [],
    dynamicComponentRefObj: [],
    content: "",
  });

  const [forRefApiAccordionData, setForRefApiAccordionData] = useState([]);
  const [dynamicComponentRefObj, setDynamicComponentRefObj] = useState({});

  useEffect(() => {
    if (isObjEmpty(dynamicComponentRefObj)) {
      let someObj = {};

      (forRefApiAccordionData || []).map((item) => {
        someObj[`${item.id}`] = React.createRef();
        someObj[`${item.id}`].current = {
          id: item.id,
          responseCode: "",
          responseMessage: "",
        };
      });

      setDynamicComponentRefObj(someObj);
    }
  }, [forRefApiAccordionData]);

  useEffect(() => {
    contructElementsDynamically(forRefApiAccordionData);
  }, [dynamicComponentRefObj]);

  const callAccordionPanelApiData = (panelId, isExpanded) => {
    (state.apiAccordionData || []).length = 0;
    (forRefApiAccordionData || []).length = 0;
    let someObj = {};
    setDynamicComponentRefObj(someObj);
    apigetUrl(
      `/configs?groupId=${panelId}&page=${state.page}&limit=${state.limit}`
    )
      .then((response) => {
        if (`${response.data.responseStatus}` === "failure") {
          ippNotify.error(response.data.responseMessage);
        }
        setState((prevState) => ({
          ...prevState,
          apiAccordionData: response.data.dataList,
        }));
        setForRefApiAccordionData(response.data.dataList);
      })
      .catch((error) => {
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
          getErrorUpdate(error, "Looks like you have lost connectivity");
        }
      });
  };

  const getErrorUpdate = (err, customMessage) => {
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

  const callTabData = (tabValue) => {
    apigetUrl(
      `/config/groups?categoryId=${tabValue}&page=${state.page}&limit=${state.limit}`
    )
      .then(function(response) {
        setState((prevState) => ({
          ...prevState,
          tabGroupData: response.data.dataList,
        }));
      })
      .catch((error) => {
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
          getErrorUpdate(error, "Looks like you have lost connectivity");
        }
      });
  };

  useEffect(() => {
    apigetUrl(
      `/config/core-data?typeId=${state.typeId}&page=${state.page}&limit=${state.limit}`
    )
      .then(function(response) {
        setState((prevState) => ({
          ...prevState,
          tabHeaderData: response.data.dataList,
          tabValue: response.data.dataList[0].id,
        }));

        callTabData(response.data.dataList[0].id);
      })
      .catch((error) => {
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
          getErrorUpdate(error, "Looks like you have lost connectivity");
        }
      });
  }, []);

  const retractCurrentTabOpenAccordians = (currentTabValue) => {};

  const handleTabChange = (event, value) => {
    retractCurrentTabOpenAccordians(state.tabValue);

    setState((prevState) => ({
      ...prevState,
      tabValue: value,
    }));
    callTabData(value);
  };

  const closeSuccessAlert = () => {
    setState((prevState) => ({
      ...prevState,
      isSuccessAlert: false,
    }));
  };

  const closeErrorAlert = () => {
    setState((prevState) => ({
      ...prevState,
      isErrorAlert: false,
    }));
  };

  const dataTypeIdElementReturner = ({
    dataType,
    id,
    description,
    isEditable,
    key,
    name,
    value,
    isVisible,
    dataListTypeId,
    rowVersion,
  }) => {
    if (parseInt(dataType) === 2001) {
      return (
        <DynamicTextfield
          dataType={dataType}
          id={id}
          description={description}
          isEditable={isEditable}
          key={key}
          name={name}
          value={value}
          isVisible={isVisible}
          dataListTypeId={dataListTypeId}
          rowVersion={rowVersion}
          ref={dynamicComponentRefObj[id]}
        />
      );
    }

    if (parseInt(dataType) === 2002) {
      return (
        <DynamicNumberTextfield
          dataType={dataType}
          id={id}
          description={description}
          isEditable={isEditable}
          key={key}
          name={name}
          value={value}
          isVisible={isVisible}
          dataListTypeId={dataListTypeId}
          rowVersion={rowVersion}
          ref={dynamicComponentRefObj[id]}
        />
      );
    }

    if (parseInt(dataType) === 2003) {
      return (
        <DynamicDate
          dataType={dataType}
          id={id}
          description={description}
          isEditable={isEditable}
          key={key}
          name={name}
          value={value}
          isVisible={isVisible}
          dataListTypeId={dataListTypeId}
          rowVersion={rowVersion}
          ref={dynamicComponentRefObj[id]}
        />
      );
    }

    if (parseInt(dataType) === 2004) {
      return (
        <DynamicDateTime
          dataType={dataType}
          id={id}
          description={description}
          isEditable={isEditable}
          key={key}
          name={name}
          value={value}
          isVisible={isVisible}
          dataListTypeId={dataListTypeId}
          rowVersion={rowVersion}
          ref={dynamicComponentRefObj[id]}
        />
      );
    }

    if (parseInt(dataType) === 2005) {
      return (
        <DynamicRadioButton
          dataType={dataType}
          id={id}
          description={description}
          isEditable={isEditable}
          key={key}
          name={name}
          value={value}
          isVisible={isVisible}
          dataListTypeId={dataListTypeId}
          rowVersion={rowVersion}
          ref={dynamicComponentRefObj[id]}
        />
      );
    }

    if (parseInt(dataType) === 2006) {
      return (
        <DynamicCheckBox
          dataType={dataType}
          id={id}
          description={description}
          isEditable={isEditable}
          key={key}
          name={name}
          value={value}
          isVisible={isVisible}
          dataListTypeId={dataListTypeId}
          rowVersion={rowVersion}
          ref={dynamicComponentRefObj[id]}
        />
      );
    }

    if (parseInt(dataType) === 2007) {
      return (
        <DynamicPassword
          dataType={dataType}
          id={id}
          description={description}
          isEditable={isEditable}
          key={key}
          name={name}
          value={value}
          isVisible={isVisible}
          dataListTypeId={dataListTypeId}
          rowVersion={rowVersion}
          ref={dynamicComponentRefObj[id]}
        />
      );
    }

    if (parseInt(dataType) === 2008) {
      return (
        <DynamicDropDown
          dataType={dataType}
          id={id}
          description={description}
          isEditable={isEditable}
          key={key}
          name={name}
          value={value}
          isVisible={isVisible}
          dataListTypeId={dataListTypeId}
          rowVersion={rowVersion}
          ref={dynamicComponentRefObj[id]}
        />
      );
    }

    if (parseInt(dataType) === 2009) {
      return (
        <DynamicBooleanSwitch
          dataType={dataType}
          id={id}
          description={description}
          isEditable={isEditable}
          key={key}
          name={name}
          value={value}
          isVisible={isVisible}
          dataListTypeId={dataListTypeId}
          rowVersion={rowVersion}
          ref={dynamicComponentRefObj[id]}
        />
      );
    }
  };

  const contructElementsDynamically = (apiAccordionData) => {
    let dynamicElementArray = (apiAccordionData || []).map((n) => {
      return (
        <AccordionDetails className={accordianStyles.details}>
          {dataTypeIdElementReturner(n)}
        </AccordionDetails>
      );
    });

    setState((prevState) => ({
      ...prevState,
      dynamicAccordionFieldData: dynamicElementArray,
    }));
  };

  const onExpansionPanelChange = (panel) => (event, expanded) => {
    setState((prevState) => ({
      ...prevState,
      expansionPanelOpen: expanded ? panel : false,
      expansionPanelValue: panel,
    }));

    if (expanded) {
      callAccordionPanelApiData(panel, expanded);
    }
  };

  const populateEachTypeOfComponent = (saveAllResponseData) => {
    var deepForRefApiAccordionData = _.cloneDeep(forRefApiAccordionData);
    var deepDynamicComponentRefObj = _.cloneDeep(dynamicComponentRefObj);
    for (var key of Object.keys(deepDynamicComponentRefObj)) {
      deepDynamicComponentRefObj[key].current = {
        id: key,
        responseCode: "",
        responseMessage: "",
      };
    }

    saveAllResponseData.map((item) => {
      var foundItem = deepForRefApiAccordionData.findIndex(
        (eachItem) => eachItem.id === item.id
      );
      if (deepForRefApiAccordionData[foundItem])
        deepForRefApiAccordionData[foundItem].value = item.value;

      if (
        deepDynamicComponentRefObj[item.id] &&
        item.id == deepDynamicComponentRefObj[item.id].current["id"]
      ) {
        deepDynamicComponentRefObj[item.id].current["responseMessage"] =
          item.responseMessage;
        deepDynamicComponentRefObj[item.id].current["responseStatus"] =
          item.responseStatus;
      }
    });

    setForRefApiAccordionData(deepForRefApiAccordionData);
    setDynamicComponentRefObj(deepDynamicComponentRefObj);
  };

  const onSaveButtonClick = (event) => {
    const dataList = [];

    Promise.all([
      localforage.getItem("dynamicBooleanSwitch"),
      localforage.getItem("dynamicCheckBox"),
      localforage.getItem("dynamicDate"),
      localforage.getItem("dynamicDateTime"),
      localforage.getItem("dynamicDropDown"),
      localforage.getItem("dynamicNumberTextfield"),
      localforage.getItem("dynamicPassword"),
      localforage.getItem("dynamicRadioButton"),
      localforage.getItem("dynamicTextfield"),
      localforage.getItem("dynamicEditor"),
    ])
      .then(function(results) {
        results.map((item) => {
          if (item) {
            if (item.typeOfComponent === "dynamicBooleanSwitch") {
              let booleanValue = "";
              for (var key of Object.keys(item.booleanSwitch)) {
                booleanValue = item.booleanSwitch[key];
              }
              const tempDynamicBooleanSwitch = {
                id: item.id,
                value: booleanValue,
                rowVersion: item.rowVersion,
              };

              dataList.push(tempDynamicBooleanSwitch);
            }
            if (item.typeOfComponent === "dynamicCheckBox") {
              let checkBoxValueArray = [];
              for (var key of Object.keys(item.checkBox)) {
                let checkBoxValue = item.checkBox[key]["checked"];
                if (checkBoxValue) {
                  checkBoxValueArray.push(item.checkBox[key]["id"]);
                }
              }

              const tempDynamicCheckBox = {
                id: item.id,
                value: checkBoxValueArray.join(),
                rowVersion: item.rowVersion,
              };

              dataList.push(tempDynamicCheckBox);
            }
            if (item.typeOfComponent === "dynamicDate") {
              const tempDynamicDate = {
                id: item.id,
                value: item.date,
                rowVersion: item.rowVersion,
              };

              dataList.push(tempDynamicDate);
            }

            if (item.typeOfComponent === "dynamicDateTime") {
              const tempDynamicDateTime = {
                id: item.id,
                value: item.date,
                rowVersion: item.rowVersion,
              };

              dataList.push(tempDynamicDateTime);
            }

            if (item.typeOfComponent === "dynamicDropDown") {
              const tempDynamicDropDown = {
                id: item.id,
                value: item.dropDownValue,
                rowVersion: item.rowVersion,
              };

              dataList.push(tempDynamicDropDown);
            }

            if (item.typeOfComponent === "dynamicNumberTextfield") {
              let numberTextFieldValue = "";
              for (var key of Object.keys(item.validation)) {
                numberTextFieldValue = item.validation[key];
              }

              const tempDynamicNumberTextfield = {
                id: item.id,
                value: numberTextFieldValue,
                rowVersion: item.rowVersion,
              };

              dataList.push(tempDynamicNumberTextfield);
            }

            if (item.typeOfComponent === "dynamicPassword") {
              const tempDynamicPassword = {
                id: item.id,
                value: item.validation.password,
                rowVersion: item.rowVersion,
              };

              dataList.push(tempDynamicPassword);
            }

            if (item.typeOfComponent === "dynamicRadioButton") {
              const tempDynamicRadioButton = {
                id: item.id,
                value: item.radioButtonValue.toString(),
                rowVersion: item.rowVersion,
              };

              dataList.push(tempDynamicRadioButton);
            }

            if (item.typeOfComponent === "dynamicTextfield") {
              let textFieldValue = "";
              for (var key of Object.keys(item.validation)) {
                textFieldValue = item.validation[key];
              }
              const tempDynamicTextfield = {
                id: item.id,
                value: textFieldValue,
                rowVersion: item.rowVersion,
              };

              dataList.push(tempDynamicTextfield);
            }

            if (item.typeOfComponent === "dynamicEditor") {
              const filteredData = item.list.filter(
                (n) => n.typeOfComponent === "dynamicEditor"
              );
              for (let n of filteredData) {
                const tempDynamicEditor = {
                  id: n.id,
                  value: n.value,
                  rowVersion: n.rowVersion,
                };
                dataList.push(tempDynamicEditor);
              }
              return item;
            }
          }
        });
      })
      .then(function() {
        const putConfigData = { dataList };
        apiputUrl(`/configs`, putConfigData)
          .then((res) => {
            if (res.data.dataList.map((n) => n.dataType !== 2010)) {
              setState((prevState) => ({
                ...prevState,
                saveAllResponseData: res.data.dataList,
              }));
              populateEachTypeOfComponent(res.data.dataList);
            }
            if (res.data.dataList.map((n) => n.dataType === 2010)) {
              let a1 = state.apiAccordionData;
              let a2 = res.data.dataList;
              const updatedArr = a1.map((t1) => ({
                ...t1,
                ...a2.find((t) => t.key === t1.key),
              }));

              setState((prevState) => ({
                ...prevState,
                apiAccordionData: updatedArr,
              }));
            }
          })
          .catch((error) => {
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
              getErrorUpdate(error, "Looks like you have lost connectivity");
            }
          });
      });
  };

  const handleChange = (e, index) => {
    const list = [...state.apiAccordionData];
    if (e) {
      list[index]["value"] = e.editor.getData();
      list[index]["isActive"] = true;
      list[index]["typeOfComponent"] = "dynamicEditor";
      const obj = {
        typeOfComponent: "dynamicEditor",
        list,
      };

      localforage
        .setItem("dynamicEditor", obj)
        .then(function() {
          return localforage.getItem("dynamicEditor");
        })
        .then(function(value) {})
        .catch(function(err) {
          // we got an error
          console.log("Data store error on initial run = ", err);
        });
    } else {
      localforage.removeItem("dynamicEditor", function(err, value) {
        localforage.getItem("dynamicEditor", function(err, value) {});
      });
    }
  };

  return (
    <div className="App">
      <div className="row">
        <div className="col-lg-4"></div>
        <div className="col-lg-4"></div>
        <div className="col-lg-4">
          <IPPNotification />
        </div>
      </div>
      <div className="row">
        <div className="col-lg-4"></div>
        <div className="col-lg-4"></div>
        <div className="col-lg-4">
          {state.isSuccessAlert === true ? (
            <SuccessModal
              message={state.successMsg}
              closeSuccess={closeSuccessAlert}
            />
          ) : null}
          {state.isErrorAlert === true ? (
            <ErrorModal message={state.errorMsg} closeError={closeErrorAlert} />
          ) : null}
        </div>
      </div>
      <div className="App">
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <div className="audit-master-box">
              <AppBar position="static" color="default">
                <Tabs
                  //indicatorColor="primary"
                  //textColor="primary"
                  value={state.tabValue}
                  onChange={handleTabChange}
                  variant="scrollable"
                  scrollButtons="on"
                >
                  {state.tabHeaderData.map((n) => {
                    return <Tab value={n.id} label={n.name} id={n.id} />;
                  })}
                </Tabs>
              </AppBar>

              {state.tabGroupData.length === 0 ? (
                <div className="tabData">
                  <InfoModal message="Your Query did not match any result" />
                </div>
              ) : (
                <div className={accordianStyles.root}>
                  {(state.tabGroupData || []).map((n) => {
                    return (
                      <Accordion
                        ref={(el) => (accordionRefs.current[n] = el)}
                        id={n.id}
                        className="my-2"
                        onChange={onExpansionPanelChange(n.id)}
                        expanded={state.expansionPanelOpen === n.id}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1c-content"
                          id="panel1c-header"
                        >
                          <div className={accordianStyles.column}>
                            <Typography className={accordianStyles.heading}>
                              {n.name}
                            </Typography>
                          </div>
                        </AccordionSummary>

                        {state.dynamicAccordionFieldData}
                        {(state.apiAccordionData || []).map((n, index) => {
                          return (
                            <>
                              {n.dataType === 2010 ? (
                                <>
                                  <div className="w-100 mt-0">
                                    <div class="row px-3 pt-0 pb-4">
                                      <div class="col-xl-5 col-sm-12">
                                        <Typography>
                                          {n.name}
                                          <br></br>
                                          <Typography variant="caption">
                                            {n.description}
                                          </Typography>
                                        </Typography>
                                      </div>
                                      <div class="col-xl-7 col-sm-12">
                                        <CKEditor
                                          activeClass="p10"
                                          content={n.value}
                                          events={{
                                            change: (e) =>
                                              handleChange(e, index),
                                          }}
                                        />

                                        {n.responseStatus === "success" ? (
                                          <FormHelperText
                                            style={{ color: "green" }}
                                          >{`${n.responseStatus} - ${n.responseMessage}`}</FormHelperText>
                                        ) : null}
                                        {navigator.responseStatus ===
                                        "failure" ? (
                                          <FormHelperText
                                            style={{ color: "red" }}
                                          >{`${n.responseStatus} - ${n.responseMessage}`}</FormHelperText>
                                        ) : null}
                                        {!n.responseStatus ? (
                                          <FormHelperText
                                            style={{ color: "red" }}
                                          ></FormHelperText>
                                        ) : null}
                                      </div>
                                    </div>
                                  </div>
                                </>
                              ) : null}
                            </>
                          );
                        })}

                        <Divider />
                        <AccordionActions>
                          <InputSaveButton
                            onClick={(e) => {
                              onSaveButtonClick(e);
                            }}
                          />
                        </AccordionActions>
                      </Accordion>
                    );
                  })}
                </div>
              )}
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default Configuration;
