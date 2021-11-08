import React, { useState, useEffect, useRef } from "react";
import "./root.component.css";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { Button } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { Alert, AlertTitle } from "@material-ui/lab";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import Box from "@material-ui/core/Box";
import Tooltip from "@material-ui/core/Tooltip";
import IntlMessages from "util/IntlMessages";
import {
  Route,
  Link,
  BrowserRouter as Router,
  Switch,
  useHistory,
  Redirect,
} from "react-router-dom";
import EnhancedTableHead from "../CommonComponents/TableHeadComponent";
import EnhancedTableToolbar from "./EnhancedTableToolbar";
import TablePaginationComponent from "../CommonComponents/TablePaginationComponent";
import SuccessModal from "../Modal/Success";
import ErrorModal from "../Modal/Error";
import Joi from "joi-browser";
import CloseIcon from "@material-ui/icons/Close";
import InfoModal from "../Modal/Info";
import localforage from "localforage";
import {
  apigetUrl,
  apipostUrl,
  apiputUrl,
  apideleteUrl,
} from "../../../../../setup/middleware";
import apiInstance from "setup/index";
import { getRecordsPerPage } from "../../../../../setup/ApplicatoinConfigurations.js";
import "../CommonComponents/tableStyle.css";
import AuditTimeline from "../CommonComponents/AuditTimeline/AuditTimeline";
import { Visibility } from "@material-ui/icons";
import {
  IPPNotification,
  ippNotify,
} from "../CommonComponents/IPPNotification";
import Loader from "../CommonComponents/Loader";
import EditNotificationTemplate from "./EditNotificationTemplate";

let pageNumber = 1;

const advancedSearchValidationSchema = {
  eventId: Joi.string()
    .required()
    .label("Event"),
  typeId: Joi.string()
    .required()
    .label("Type"),
};

// const config = {
//   headers: {
//     "Content-Type": "application/json",
//     accept: "application/json",
//   },
//   data: {},
// };

const baseURL = `${process.env.REACT_APP_BASE_URL}`;
const perPageURL = `/notify/templates`;

const pageURL = new URL(baseURL + perPageURL);

let apiCallParams = new URLSearchParams(pageURL.search);
console.log("apiCallParams = ", apiCallParams);

console.log("pageURL = ", pageURL);

// const api = axios.create({
//   baseURL: baseURL,
// });

function App() {
  const setAdvancedSearchError = (isErrorTrue, errorMessage) => {
    if (isErrorTrue) {
      setState((prevState) => ({
        ...prevState,
        data: [],
        isInfoAlert: true,
        inTableErrorMessageContent: "Your query did not match any results",
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        isInfoAlert: false,
        errorMsg: "",
      }));
    }
  };

  const setAdvancedSearchData = (data) => {
    pageNumber = 1;
    setState((prevState) => ({
      ...prevState,
      data: data,
      page: 1,
      from: 1,
      to: state.limit,
    }));
  };

  const setResetData = (data) => {
    pageNumber = 1;
    setState((prevState) => ({
      ...prevState,
      data: data,
      isInfoAlert: false,
      inTableErrorMessageContent: "",
      page: 1,
      from: 1,
      to: state.limit,
    }));
  };

  const setCurrentUrl = (currentUrl) => {
    setState((prevState) => ({ ...prevState, currentUrl }));
  };

  const [state, setState] = useState({
    isLoading: true,
    sortType: "asc",
    sortBy: "name",
    selected: [],
    page: 1,
    rowsPerPage: 5,
    data: [],
    formDialogOpen: false,
    selectedEditId: "",

    selected_EditForm_Name_Value: "",
    selected_EditForm_Description_Value: "",
    selected_EditForm_EventId_Value: "",

    isSortAsc: true,
    deleteFormDialogOpen: false,

    dynamicEventIdList: [],
    selectedDeleteId: "",
    from: 1,
    to: 0,
    pageCount: 0,
    limit: getRecordsPerPage(),
    advancedSearch_EventID_DataArray: [],
    advancedSearch_TypeID_DataArray: [],

    selected_AddForm_Name_Value: "",
    selected_AddForm_Description_Value: "",
    selected_AddForm_CategoryId_Value: "",

    isSuccessAlert: false,
    successMsg: "",
    isErrorAlert: false,
    errorMsg: "",
    isInfoAlert: false,
    infoMsg: "",
    error: "",
    inTableErrorMessageContent: "Unable to fetch data!",
    searchedProperty: "",
    currentUrl: "",
    isSearchActive: false,
    isNoTableDataAlertVisible: true,
    advancedSearchValidation: {
      eventId: "",
      typeId: "",
    },
    advancedSearchValidationErrors: {},
    isAdvancedSearchValidationText: false,
    handleAutoCompleteInputReset: false,
    isAuditTimelineActive: false,
    eventId: "",
    referenceId: "",
    auditEventId: "",
    isEditNotificationTemplateActive: false,
    selectedId: "",
    EventData: [],
    headCells: [
      {
        id: "name",
        isActive: true,
        label: "notificationtempalet.master.tableheader.Name.label",
      },
      {
        id: "description",
        isActive: false,
        label: "notificationtempalet.master.tableheader.Description.label",
      },
      {
        id: "eventName",
        isActive: true,
        label: "notificationtempalet.master.tableheader.Event.label",
      },
      {
        id: "code",
        isActive: true,
        label: "notificationtempalet.master.tableheader.Code.label",
      },
      {
        id: "type",
        isActive: false,
        label: "notificationtempalet.master.tableheader.Type.label",
      },
      {
        id: "actions",
        isActive: false,
        label: "notificationtempalet.master.tableheader.Actions.label",
      },
    ],
  });

  const location = useLocation();

  // useEffect(() => {
  //   if ((location.state || {}).getSuccessUpdate === true) {
  //     ippNotify.success("Notification Template is Updated successfully");
  //   }
  // }, [location]);

  useEffect(() => {
    callEventNameData();
  }, []);

  const callEventNameData = () => {
    apigetUrl(`/notify/events?page=1&limit=100`)
      .then((res) => {
        console.log("res-provider", res);
        let response = res.data.dataList;
        setState((prevState) => ({
          ...prevState,
          EventData: response,
        }));
      })
      .catch((err) => console.log("err", err));
  };

  const getEventIdList = (apiData) => {
    console.log("state.data = ", apiData);
    const dynamicArray = apiData.map((item) => {
      return { eventId: item["name"].toString() };
    });

    setState((prevState) => ({
      ...prevState,
      dynamicEventIdList: dynamicArray,
    }));

    console.log("state.dynamicEventIdList = ", state.dynamicEventIdList);
    console.log("dynamicArray = ", dynamicArray);
  };

  const showApiData = (apiData) => {
    console.log("apidata = ", apiData);
    console.log("after page number update = ", state.page);
    getEventIdList(apiData);
  };

  const populateAdvancedSearchFields = (apiData) => {
    const eventID_DataArray = apiData.map((item) => {
      return { name: item.name.toString() };
    });

    let tempArray = apiData.map((item) => {
      return item.type;
    });

    // tempArray = tempArray.filter(function(item, index, inputArray) {
    //   return inputArray.indexOf(item) == index;
    // });

    //console.log("after removing duplicates", tempArray);

    const typeID_DataArray = tempArray.map((item) => {
      return { name: returnMatchingTypeInString(item) };
    });

    console.log("eventID_DataArray = ", eventID_DataArray);
    console.log("typeID_DataArray = ", typeID_DataArray);

    setState((prevState) => ({
      ...prevState,
      advancedSearch_EventID_DataArray: eventID_DataArray,
      advancedSearch_TypeID_DataArray: typeID_DataArray,
    }));
  };

  const getErrorUpdate = (err, customMessage) => {
    //console.log("error before slice", err.response);
    console.log(" err.response = ", err.response);

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

  useEffect(() => {
    apiCallParams.set("page", state.page);
    apiCallParams.set("limit", state.limit);
    apiCallParams.set("sortBy", state.sortBy);
    apiCallParams.set("sortType", state.sortType);

    setCurrentUrl(pageURL);

    pageURL.search = apiCallParams.toString();

    console.log("pageURL = ", pageURL.href);
    callLocalBaseURL();
  }, []);

  const callLocalBaseURL = async () => {
    const result = await apigetUrl(
      `/notify/templates?page=${state.page}&limit=${state.limit}&sortBy=${state.sortBy}&sortType=${state.sortType}`,
      apiInstance
    );
    if (result.data.responseCode === "200") {
      setTimeout(() => {
        setState((prevState) => ({
          ...prevState,
          data: result.data.dataList,
          page: result.data.pagination.page,
          pageCount: result.data.pagination.count,
          to: result.data.pagination.limit,
          limit: result.data.pagination.limit,
          auditEventId: (result.data || {}).auditEventId,
          isLoading: false,
        }));
        populateAdvancedSearchFields(result.data.dataList);
        showApiData(result.data.dataList);
      }, 1000);
    } else {
      ippNotify.error(result.data.responseMessage);
      showLoader();
    }
  };

  const showLoader = () => {
    setTimeout(() => {
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
      }));
    }, 5000);
  };

  const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));

  const requestSortData = async (sortBy, sortType) => {
    const { eventId, typeId } = state.advancedSearchValidation;
    let name = `${eventId}`;
    apiCallParams.set("page", state.page);
    apiCallParams.set("limit", state.limit);
    apiCallParams.set("sortBy", sortBy);
    apiCallParams.set("sortType", sortType);

    let tempArr = [];
    if (!isEmpty(name)) tempArr.push({ name });
    if (!isEmpty(typeId))
      tempArr.push({
        typeId: reverseReturnMatchingTypeInString(typeId),
      });
    tempArr.map((p) => {
      for (var key in p) {
        if (p.hasOwnProperty(key)) {
          console.log(key + " -> " + p[key]);
          apiCallParams.set(key, p[key]);
        }
      }
    });

    let searchParam = apiCallParams.toString();
    pageURL.search = apiCallParams.toString();
    console.log("pageURL = ", pageURL.href);

    setCurrentUrl(pageURL);

    const result = await apigetUrl(`/notify/templates?` + searchParam);
    if (result.data.responseCode === "200") {
      setTimeout(() => {
        setState((prevState) => ({
          ...prevState,
          data: result.data.dataList,
          isLoading: false,
        }));
      }, 1000);
    } else {
      ippNotify.error(result.data.responseMessage);
      showLoader();
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = state.sortBy === property && state.sortType === "desc";
    let currentSortOrder = isAsc ? "asc" : "desc";
    setState((prevState) => ({
      ...prevState,
      sortType: isAsc ? "asc" : "desc",
      sortBy: property,
      isLoading: true,
    }));

    requestSortData(property, currentSortOrder);
  };

  const requestPageLimitCountChange = async (count) => {
    console.log("count = ", count);
    let res = "";

    apiCallParams.set("page", 1);
    apiCallParams.set("limit", count);
    apiCallParams.set("sortBy", state.sortBy);
    apiCallParams.set("sortType", state.sortType);

    pageURL.search = apiCallParams.toString();

    setCurrentUrl(pageURL);
    let getUrl = pageURL.pathname + pageURL.search;

    const result = await apigetUrl(`${getUrl}`);
    if (result.data.responseCode === "200") {
      setTimeout(() => {
        update_to(count);
        update_from(1);
        setState((prevState) => ({
          ...prevState,
          data: result.data.dataList,
          page: 1,
          pageCount: result.data.pagination.count,
          limit: result.data.pagination.limit,
          isLoading: false,
        }));
        pageNumber = 1;
      }, 1000);
    } else {
      ippNotify.error(result.data.responseMessage);
      showLoader();
    }
  };

  const handleChangeRowsPerPage = (event) => {
    let target = event.target;
    setState((prevState) => ({
      ...prevState,
      page: 1,
      isLoading: true,
    }));
    requestPageLimitCountChange(target.value);
  };
  const isSelectedFunc = (id) => {
    return state.selected.indexOf(id) !== -1;
  };

  const isEnabledTextReturn = (isEnabled) => {
    switch (isEnabled) {
      case 0:
        return "No";
      case 1:
        return "Yes";
      case "":
        return "";
    }
  };

  const onTableDeleteButtonClick = (event) => {
    console.log("delete clicked", event.currentTarget.id);
    setState((prevState) => ({
      ...prevState,
      deleteFormDialogOpen: true,
      selectedDeleteId: event.currentTarget.id,
    }));
  };

  let history = useHistory();

  const onTableEditButtonClick = async (event, id) => {
    setState((prevState) => ({
      ...prevState,
      selectedId: id,
      isEditNotificationTemplateActive: true,
    }));
  };

  const handleRequestClose = () => {
    setState((prevState) => ({
      ...prevState,
      isEditNotificationTemplateActive: false,
    }));
  };

  const classes = useStyles();

  const setPageData = (data) => {
    setState((prevState) => ({
      ...prevState,
      data: data,
    }));
  };

  const setPageNumber = (pageNumber) => {
    setState((prevState) => ({
      ...prevState,
      page: pageNumber,
    }));
  };
  const setPageCount = (pageCount) => {
    setState((prevState) => ({
      ...prevState,
      pageCount: pageCount,
    }));
  };

  const update_to = (to) => {
    setState((prevState) => ({
      ...prevState,
      to: to,
    }));
  };

  const update_from = (from) => {
    setState((prevState) => ({
      ...prevState,
      from: from,
    }));
  };

  const onNoTableDataAlertCloseClick = () => {
    setState((prevState) => ({
      ...prevState,
      isNoTableDataAlertVisible: !state.isNoTableDataAlertVisible,
    }));
  };

  const noDataAlert_UseStyles = makeStyles((theme) => ({
    root: {
      marginLeft: "10%",
      width: "250%",
      "& > * + *": {
        marginTop: theme.spacing(2),
      },
    },
  }));

  const noDataAlert_Classes = noDataAlert_UseStyles();

  const styles = useStyles();

  const onNotificationTemplate_DeleteConfirm = async () => {
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    const result = await apideleteUrl(
      `/notify/templates/${state.selectedDeleteId}`
    );

    if (result.status === 200) {
      setState((prevState) => ({
        ...prevState,
        deleteFormDialogOpen: false,
      }));
      callLocalBaseURL();
      setTimeout(() => {
        ippNotify.success("Deleted Successfully");
        setState((prevState) => ({
          ...prevState,
          isLoading: false,
        }));
      }, 1000);
    } else {
      ippNotify.error(result.data.responseMessage);
      setState((prevState) => ({
        ...prevState,
        deleteFormDialogOpen: true,
      }));
      showLoader();
    }
  };
  const returnMatchingTypeInString = (type) => {
    switch (type) {
      case 0:
        return "Success";
      case 1:
        return "Info";
      case 2:
        return "Warning";
      case 3:
        return "Error";
    }
  };

  const reverseReturnMatchingTypeInString = (type) => {
    switch (type) {
      case "Success":
        return 0;
      case "Info":
        return 1;
      case "Warning":
        return 2;
      case "Error":
        return 3;
    }
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

  const callResetData = async () => {
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    apiCallParams.set("page", 1);
    apiCallParams.set("limit", state.limit);
    apiCallParams.set("sortBy", state.sortBy);
    apiCallParams.set("sortType", state.sortType);

    apiCallParams.delete("eventId");
    apiCallParams.delete("typeId");

    pageURL.search = apiCallParams.toString();

    console.log("pageURL.href = ", pageURL.href);

    const result = await apigetUrl(
      `/notify/templates?page=${1}&limit=${state.limit}&sortBy=${
        state.sortBy
      }&sortType=${state.sortType}`
    );
    if (result.data.responseCode === "200") {
      setTimeout(() => {
        setResetData(result.data.dataList);
        setPageNumber(1);
        setPageCount(result.data.pagination.count);
        setCurrentUrl(pageURL);
        setState((prevState) => ({
          ...prevState,
          isLoading: false,
        }));
      }, 1000);
    } else {
      ippNotify.error(result.data.responseMessage);
      showLoader();
    }
  };

  function isObjEmpty(obj) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }

    return JSON.stringify(obj) === JSON.stringify({});
  }

  const handleResetClick = (e) => {
    setState((prevState) => ({
      ...prevState,
      advancedSearchValidation: {
        eventId: "",
        typeId: "",
      },
      advancedSearchValidationErrors: {},
      isAdvancedSearchValidationText: false,
      handleAutoCompleteInputReset: !state.handleAutoCompleteInputReset,
    }));

    callResetData();
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

  const setSearchedProperty = (searchProperty) => {
    setState((prevState) => ({
      ...prevState,
      searchedProperty: searchProperty,
    }));
  };

  const search = async (searchURL) => {
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    console.log("search url = ", searchURL);
    const res = await apigetUrl("/notify/templates?" + searchURL);
    console.log("result-12345", res);
    if (res.data.responseCode === "200") {
      setTimeout(() => {
        setAdvancedSearchData(res.data.dataList);
        showApiData(res.data.dataList);
        setAdvancedSearchError(false, "");
        setPageNumber(res.data.pagination.page);
        setPageCount(res.data.pagination.count);
        setState((prevState) => ({
          ...prevState,
          isLoading: false,
        }));
      }, 1000);
    } else if (res.status === 400) {
      ippNotify.error(res.statusText);
      showLoader();
    } else {
      setState((prevState) => ({
        ...prevState,
        to: 0,
        pageCount: 0,
        isInfoAlert: true,
        errorMsg: ((res.response || {}).data || {}).responseMessage,
      }));
      showLoader();
    }
  };

  const isEmpty = (str) => {
    return !str || 0 === str.length;
  };

  const handleSearchClick = (e) => {
    const { eventId, typeId } = state.advancedSearchValidation;
    console.log("eventId-12345", eventId);
    console.log("typeId-12345", typeId);
    //validation
    if (eventId === "" && typeId === "") {
      console.log("when no data entered");
      setState((prevState) => ({
        ...prevState,
        isAdvancedSearchValidationText: true,
      }));
      return;
    } else if (eventId === "" || typeId === "") {
      console.log("when any data entered");
      setState((prevState) => ({
        ...prevState,
        isAdvancedSearchValidationText: false,
        advancedSearchValidationErrors: {},
      }));
    } else {
      console.log("when both data entered");
      setState((prevState) => ({
        ...prevState,
        isAdvancedSearchValidationText: false,
        advancedSearchValidationErrors: {},
      }));
    }

    // const { selectedEventID, selectedTypeID } = state;

    console.log(`"eventId = "${eventId},"typeId = " ${typeId}`);
    // let name = `${eventId}`;
    let type = `${typeId}`;
    let tempArr = [];
    if (!isEmpty(eventId)) tempArr.push({ eventId });
    if (!isEmpty(type))
      tempArr.push({
        type: reverseReturnMatchingTypeInString(type),
      });

    apiCallParams.set("page", 1);
    apiCallParams.set("limit", state.limit);
    apiCallParams.set("sortBy", state.sortBy);
    apiCallParams.set("sortType", state.sortType);

    tempArr.map((p) => {
      for (var key in p) {
        if (p.hasOwnProperty(key)) {
          console.log(key + " -> " + p[key]);
          apiCallParams.set(key, p[key]);
        }
      }
    });
    // params.append("archiveIn", "182");

    // console.log("to string = ", params.toString());
    console.log("to string = ", apiCallParams.toString());
    pageURL.search = apiCallParams.toString();

    console.log("pageURL = ", pageURL);

    search(apiCallParams.toString());
  };

  const advanceSearchValidateProperty = (
    { name, value },
    autoCompleteValue,
    ref
  ) => {
    let obj;
    autoCompleteValue
      ? (obj = {
          [ref.current.getAttribute("name")]: autoCompleteValue.name,
        })
      : (obj = {
          [ref.current.getAttribute("name")]: autoCompleteValue,
        });
    const propertySchema = {
      [ref.current.getAttribute("name")]: advancedSearchValidationSchema[
        ref.current.getAttribute("name")
      ],
    };

    const { error } = Joi.validate(obj, propertySchema);

    return error ? error.details[0].message : null;
  };

  const handleAdvancedSearchOnChange = (event, autoCompleteValue, ref) => {
    let findItem = state.data.find(
      (n) => n.name === (autoCompleteValue || {}).name
    );

    const { target: input } = event;
    //console.log("input = ", input);
    const errors = { ...state.advancedSearchValidationErrors };
    const errorMessage = advanceSearchValidateProperty(
      input,
      autoCompleteValue,
      ref
    );
    if (errorMessage) errors[ref.current.getAttribute("name")] = errorMessage;
    else delete errors[ref.current.getAttribute("name")];

    //console.log("errors = ", errors);

    const validation = { ...state.advancedSearchValidation };
    autoCompleteValue
      ? (validation[ref.current.getAttribute("name")] =
          (findItem || {}).eventId || autoCompleteValue.name)
      : (validation[ref.current.getAttribute("name")] = autoCompleteValue);

    // const allFormFieldsPopulated = checkAreAllEditFormFieldsPopulated(
    //   validation
    // );

    let isAnyFormFieldsPopulated = false;
    isAnyFormFieldsPopulated =
      validation.eventId !== null || validation.typeId !== null;

    if (isAnyFormFieldsPopulated && isObjEmpty(errors)) {
      setState((prevState) => ({
        ...prevState,
        advancedSearchValidation: validation,
        advancedSearchValidationErrors: errors,
        isAdvancedSearchValidationText: false,
      }));
    } else if (!isAnyFormFieldsPopulated && !isObjEmpty(errors)) {
      //console.log("both false");
      setState((prevState) => ({
        ...prevState,
        advancedSearchValidation: validation,
        advancedSearchValidationErrors: errors,
        isAdvancedSearchValidationText: true,
      }));
    } else if (isAnyFormFieldsPopulated && !isObjEmpty(errors)) {
      setState((prevState) => ({
        ...prevState,
        advancedSearchValidation: validation,
        advancedSearchValidationErrors: errors,
        isAdvancedSearchValidationText: false,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        advancedSearchValidation: validation,
        advancedSearchValidationErrors: errors,
        isAdvancedSearchValidationText: true,
      }));
    }
  };

  const getPageFromBackEnd = async (
    pageNumber,
    limit,
    temp_from,
    temp_to,
    pageCount,
    actionType
  ) => {
    const { eventId, typeId } = state.advancedSearchValidation;
    if (!isEmpty(eventId)) {
    } else {
      apiCallParams.delete("eventId");
    }
    if (!isEmpty(typeId)) {
    } else {
      apiCallParams.delete("typeId");
    }
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));

    //console.log("currentUrl = ", state.currentUrl, typeof state.currentUrl);

    apiCallParams.set("page", pageNumber);
    apiCallParams.set("limit", limit);

    pageURL.search = apiCallParams.toString();
    let getUrl = pageURL.pathname + pageURL.search;
    console.log("pageURL.href = ", pageURL.href);

    const result = await apigetUrl(`${getUrl}`);
    if (result.data.responseCode === "200") {
      setTimeout(() => {
        if (actionType === "handleNextButtonClick") {
          update_from(temp_from);
          if (temp_to >= pageCount) {
            update_to(pageCount);
          } else {
            update_to(temp_to);
          }
        } else if (actionType === "handleBackButtonClick") {
          update_from(temp_from);
          update_to(temp_to);
        }
        setPageData(result.data.dataList);
        setPageNumber(result.data.pagination.page);
        setPageCount(result.data.pagination.count);
        setState((prevState) => ({
          ...prevState,
          page: pageNumber,
          isLoading: false,
        }));
      }, 1000);
    } else {
      ippNotify.error(result.data.responseMessage);
      showLoader();
    }
  };

  const handleDeleteDialogClose = () => {
    setState((prevState) => ({
      ...prevState,
      deleteFormDialogOpen: false,
    }));
  };

  // To call the Audit Timeline
  const onTableViewClick = async (e, eventId) => {
    let result = await apigetUrl(
      `/audit/details?page=1&limit=100&sortBy=when&sortType=desc&eventId=${eventId}`
    );
    if (result.data.responseCode === "200") {
      setState((prevState) => ({
        ...prevState,
        eventId: eventId,
        referenceId: (result.data.dataList[0] || {}).referenceId,
        isAuditTimelineActive: true,
      }));
    } else {
      ippNotify.error(result.data.responseMessage);
    }
  };

  // close the Audit Timeline
  const handleCloseAuditTimeline = () => {
    setState((prevState) => ({
      ...prevState,
      isAuditTimelineActive: false,
    }));
  };

  const getSuccessUpdate = () => {
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    setTimeout(() => {
      setTimeout(() => {
        ippNotify.success("Notification Template is Updated successfully");
      }, 100);
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
      }));
    }, 1000);
  };

  return (
    <>
      {state.isAuditTimelineActive ? (
        <AuditTimeline
          closeAuditTimeline={handleCloseAuditTimeline}
          eventId={state.eventId}
          referenceId={state.referenceId}
        />
      ) : state.isEditNotificationTemplateActive ? (
        <EditNotificationTemplate
          selectedId={state.selectedId}
          eventData={state.EventData}
          handleRequestClose={handleRequestClose}
          getSuccessUpdate={getSuccessUpdate}
          callLocalBaseURL={callLocalBaseURL}
        />
      ) : (
        <Router>
          <div className="App">
            <Dialog
              maxWidth="md"
              open={state.deleteFormDialogOpen}
              onClose={handleDeleteDialogClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {
                  <IntlMessages id="ipp.common.modal.deleteconfirmation.title" />
                }
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  <IntlMessages id="notificationtempalet.master.modal.deleteconfrimation.message" />
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDeleteDialogClose} color="primary">
                  <IntlMessages id="ipp.common.Cancel.button" />
                </Button>
                <Button
                  onClick={onNotificationTemplate_DeleteConfirm}
                  color="secondary"
                  autoFocus
                >
                  <IntlMessages id="ipp.common.Delete.button" />
                </Button>
              </DialogActions>
            </Dialog>

            <Grid container spacing={1}>
              <Grid item xs={12}>
                {/* <div>
              {iserror && (
                <Alert severity="error">
                  {errorMessages.map((msg, i) => {
                    return <div key={i}>{msg}</div>;
                  })}
                </Alert>
              )}
            </div> */}
                <div className="row">
                  <div className="col-lg-4"></div>
                  <div className="col-lg-4"></div>
                  <div className="col-lg-4">
                    <IPPNotification />
                  </div>
                </div>

                <div className="audit-master-box">
                  <EnhancedTableToolbar
                    // setAdvancedSearchData={setAdvancedSearchData}
                    // setResetData={setResetData}
                    numSelected={state.selected.length}
                    advancedSearch_EventID_DataArray={
                      state.advancedSearch_EventID_DataArray
                    }
                    callLocalBaseURL={callLocalBaseURL}
                    advancedSearch_TypeID_DataArray={
                      state.advancedSearch_TypeID_DataArray
                    }
                    pageNumber={state.page}
                    limit={state.limit}
                    page={state.page}
                    sortBy={state.sortBy}
                    sortType={state.sortType}
                    setAdvancedSearchError={setAdvancedSearchError}
                    setSearchedProperty={setSearchedProperty}
                    advancedSearchValidation={state.advancedSearchValidation}
                    isAdvancedSearchValidationText={
                      state.isAdvancedSearchValidationText
                    }
                    advancedSearchValidationErrors={
                      state.advancedSearchValidationErrors
                    }
                    handleResetClick={handleResetClick}
                    handleSearchClick={handleSearchClick}
                    handleAdvancedSearchOnChange={handleAdvancedSearchOnChange}
                    handleAutoCompleteInputReset={
                      state.handleAutoCompleteInputReset
                    }
                  />

                  <div className="flex-auto">
                    <div className="table-responsive-material">
                      <Table>
                        <EnhancedTableHead
                          numSelected={state.selected.length}
                          order={state.sortType}
                          orderBy={state.sortBy}
                          // onSelectAllClick={handleSelectAllClick}
                          onRequestSort={handleRequestSort}
                          rowCount={state.data.length}
                          headCell={state.headCells}
                        />
                        {state.isLoading ? <Loader /> : null}
                        {state.data.length === 0 &&
                        state.isLoading === false ? (
                          <InfoModal message="Your Query did not match any result" />
                        ) : (
                          <TableBody>
                            {state.data.map((n) => {
                              const isSelected = isSelectedFunc(n.id);
                              return (
                                <TableRow
                                  hover
                                  // onClick={(event) => handleClick(event, n.id)}
                                  // onKeyDown={(event) => handleKeyDown(event, n.id)}
                                  role="checkbox"
                                  aria-checked={isSelected}
                                  tabIndex={-1}
                                  key={n.id}
                                  selected={isSelected}
                                >
                                  {/* <TableCell padding="checkbox">
                            <Checkbox color="primary" checked={isSelected} />
                          </TableCell> */}
                                  <TableCell>{n.name}</TableCell>
                                  <TableCell>{n.description}</TableCell>
                                  <TableCell>
                                    {n.eventName || n.eventId}
                                  </TableCell>
                                  <TableCell>{n.code}</TableCell>
                                  <TableCell>
                                    {returnMatchingTypeInString(n.type)}
                                  </TableCell>
                                  <TableCell padding="none">
                                    <Tooltip
                                      title={
                                        <IntlMessages id="NotificationTemplate.Tooltip.Edit" />
                                      }
                                    >
                                      <IconButton
                                        id={n.id}
                                        onClick={(e) =>
                                          onTableEditButtonClick(e, n.id)
                                        }
                                      >
                                        <EditIcon color="primary" />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip
                                      title={
                                        <IntlMessages id="NotificationTemplate.Tooltip.Delete" />
                                      }
                                    >
                                      <IconButton
                                        style={{ marginLeft: "-10px" }}
                                        id={n.id}
                                        onClick={(e) =>
                                          onTableDeleteButtonClick(e)
                                        }
                                      >
                                        <DeleteIcon color="secondary" />
                                      </IconButton>
                                    </Tooltip>
                                    {state.auditEventId >= 1 ? (
                                      <Tooltip title="View Audit Timeline">
                                        <IconButton
                                          style={{ marginLeft: "-10px" }}
                                          onClick={(e) =>
                                            onTableViewClick(
                                              e,
                                              state.auditEventId
                                            )
                                          }
                                        >
                                          <Visibility color="primary" />
                                        </IconButton>
                                      </Tooltip>
                                    ) : null}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        )}
                        <TableFooter>
                          <TableRow>
                            <TablePaginationComponent
                              rowsPerPage={state.limit}
                              count={state.data.length}
                              page={state.page}
                              from={state.from}
                              to={state.to}
                              limit={state.limit}
                              pageCount={state.pageCount}
                              data={state.data}
                              onChangeRowsPerPage={handleChangeRowsPerPage}
                              setPageData={setPageData}
                              setPageNumber={setPageNumber}
                              setPageCount={setPageCount}
                              update_from={update_from}
                              update_to={update_to}
                              property={state.sortBy}
                              sortType={state.sortType}
                              currentUrl={state.currentUrl}
                              getPageFromBackEnd={getPageFromBackEnd}
                            />
                          </TableRow>
                        </TableFooter>
                      </Table>
                    </div>
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>
        </Router>
      )}
    </>
  );
}

export default App;
