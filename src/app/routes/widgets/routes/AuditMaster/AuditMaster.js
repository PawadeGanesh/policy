/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./master.css";
import FormDialog from "./FormDialog";
import { makeStyles } from "@material-ui/core/styles";
import IntlMessages from "util/IntlMessages";
import {
  TableFooter,
  TableCell,
  TableBody,
  TableRow,
  Button,
  Grid,
  Table,
  Tooltip,
  IconButton,
} from "@material-ui/core";

import EnhancedTableHead from "../CommonComponents/TableHeadComponent";
import EnhancedTableToolbar from "./EnhancedTableToolbar";
import TablePaginationComponent from "../CommonComponents/TablePaginationComponent";
import "../CommonComponents/tableStyle.css";
import moment from "moment";
import Joi from "joi-browser";
import SuccessModal from "../Modal/Success";
import ErrorModal from "../Modal/Error";
import ValidationError from "./ValidationError";
import { apigetUrl, apiputUrl } from "../../../../../setup/middleware";
import InfoModal from "../Modal/Info";
import VisibilityIcon from "@material-ui/icons/Visibility";
import SettingsApplicationsIcon from "@material-ui/icons/SettingsApplications";
import { getRecordsPerPage } from "../../../../../setup/ApplicatoinConfigurations.js";
import {
  IPPNotification,
  ippNotify,
} from "../CommonComponents/IPPNotification";
import Loader from "../CommonComponents/Loader";

const schema = {
  eventId: Joi.number()
    .required()
    .label("Name"),
  description: Joi.string()
    .required()
    .label("Description"),
  actionType: Joi.string()
    .required()
    .label("Action Type"),
  userName: Joi.string()
    .required()
    .label("UserName"),
  startDate: Joi.string()
    .required()
    .label("Start Date"),
  startTime: Joi.string()
    .required()
    .label("Start Time"),
  endDate: Joi.string()
    .required()
    .label("End Date"),
  endTime: Joi.string()
    .required()
    .label("End Time"),
  includeArchive: Joi.boolean()
    .required()
    .label("Include Archive"),
  referenceId: Joi.string()
    .required()
    .label("Reference"),
};

// const config = {
//   headers: {
//     "Content-Type": "application/json",
//     accept: "application/json",
//   },
//   data: {},
// };

const baseURL = `${process.env.REACT_APP_BASE_URL}`;

const perPageURL = `/audit/details`;

const pageURL = new URL(baseURL + perPageURL);

let apiCallParams = new URLSearchParams(pageURL.search);
// const api = axios.create({
//   baseURL: baseURL,
// });

function App() {
  const [selectedRowdata, setSelectedRowData] = useState({ id: 1 });

  //for error handling
  // const [iserror, setIserror] = useState(false);
  // const [errorMessages, setErrorMessages] = useState([]);

  const setAdvancedSearchError = (isErrorTrue) => {
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
    setState((prevState) => ({
      ...prevState,
      data: data,
      page: 1,
      from: 1,
      to: state.limit,
    }));
  };

  const setResetData = (data) => {
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
    sortBy: "when",
    selected: [],
    page: 1,
    data: [],
    formOpen: false,
    isSortAsc: true,
    from: 1,
    to: 0,
    pageCount: 0,
    limit: getRecordsPerPage(),
    isNoTableDataAlertVisible: true,
    isSuccessAlert: false,
    successMsg: "",
    isErrorAlert: false,
    errorMsg: "",
    isInfoAlert: false,
    infoMsg: "",
    error: "",
    inTableErrorMessageContent: "Unable to fetch data!",
    searchedProperty: "",
    isEventIdEmpty: false,
    idNameData: [],
    advancedSearchValidation: {
      eventId: [],
      actionType: "",
      userName: "",
      referenceId: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      includeArchive: false,
      description: "",
    },
    advancedSearchValidationErrors: {},
    isAdvancedSearchValidationText: false,
    isSearchActive: false,
    handleAutoCompleteInputReset: false,
    startDate: null,
    endDate: null,
    isStartDateActive: false,
    isEndDateDisabled: true,
    headCells: [
      {
        id: "event",
        isActive: true,
        label: "auditmaster.master.tableheader.Event.label",
      },
      {
        id: "description",
        isActive: false,
        label: "auditmaster.master.tableheader.Description.label",
      },
      {
        id: "action",
        isActive: true,
        label: "auditmaster.master.tableheader.ActionType.label",
      },
      {
        id: "user",
        isActive: true,
        label: "auditmaster.master.tableheader.Who.label",
      },
      {
        id: "when",
        isActive: true,
        label: "auditmaster.master.tableheader.When.label",
      },
      {
        id: "referenceId",
        isActive: false,
        label: "auditmaster.master.tableheader.Reference.label",
      },
      {
        id: "auditDetails",
        isActive: false,
        label: "auditmaster.master.tableheader.AuditDetails.label",
      },
    ],
  });

  //apiData.sort((a, b) => (a.id < b.id ? -1 : 1)),

  const useStyles = makeStyles((theme) => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
  }));

  const classes = useStyles();

  const handleRequestClose = () => {
    setState((prevState) => ({
      ...prevState,
      formOpen: false,
    }));
  };

  const handleClickOpen = (data) => {
    setState((prevState) => ({
      ...prevState,
      formOpen: true,
    }));
    setSelectedRowData(data);
  };
  const showApiData = () => {
    //console.log("apidata = ", apiData);
  };

  useEffect(() => {
    console.log("getRecordsPerPage", getRecordsPerPage);
  }, []);

  useEffect(() => {
    apiCallParams.set("page", state.page);
    apiCallParams.set("limit", state.limit);
    apiCallParams.set("sortBy", state.sortBy);
    apiCallParams.set("sortType", state.sortType);

    pageURL.search = apiCallParams.toString();
    console.log(apiCallParams.toString());
    // setCurrentUrl(
    //   `${baseURL}/audit/details?page=${state.page}&limit=${state.limit}`
    // );
    setCurrentUrl(pageURL);
    callLocalBaseURL();
  }, []);

  useEffect(() => {}, []);

  const callLocalBaseURL = async () => {
    const result = await apigetUrl(
      `/audit/details?page=${state.page}&limit=${state.limit}&sortBy=${state.sortBy}&sortType=${state.sortType}`
    );
    console.log("result", result);
    if (result.status === 200) {
      setTimeout(() => {
        setState((prevState) => ({
          ...prevState,
          data: result.data.dataList[0].dataList,
          page: result.data.dataList[0].pagination.page,
          pageCount: result.data.dataList[0].pagination.count,
          to: result.data.dataList[0].pagination.limit,
          limit: result.data.dataList[0].pagination.limit,
          isLoading: false,
        }));
        showApiData(result.data.dataList);
      }, 1000);
    } else {
      ippNotify.error(result.data.responseMessage);
      showLoader();
    }

    const result1 = await apigetUrl(`/audit/events?page=1&limit=100`);
    if (result1.data.responseCode === "200") {
      setState((prevState) => ({
        ...prevState,
        idNameData: result1.data.dataList,
        // page: res.data.pagination.page,
        // pageCount: res.data.pagination.count,
        // to: res.data.pagination.limit,
        // limit: res.data.pagination.limit,
      }));

      showApiData(result1.data.dataList);
    } else {
      ippNotify.error(result.data.responseMessage);
    }
  };

  const showLoader = () => {
    setTimeout(() => {
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
      }));
    }, 1000);
  };

  const requestSortData = async (sortBy, sortType) => {
    const {
      eventId,
      description,
      actionType,
      userName,
      includeArchive,
      referenceId,
      startDate,
      startTime,
      endDate,
      endTime,
    } = state.advancedSearchValidation;
    apiCallParams.set("page", state.page);
    apiCallParams.set("limit", state.limit);
    apiCallParams.set("sortBy", sortBy);
    apiCallParams.set("sortType", sortType);
    const searchKeyArr = [];
    if (!isEmpty(eventId)) searchKeyArr.push({ eventId: eventId });
    if (!isEmpty(actionType))
      searchKeyArr.push({ actionType: actionType.toString() });
    if (!isEmpty(userName)) searchKeyArr.push({ userName: userName });

    if (!isEmpty(startDate)) searchKeyArr.push({ startDate });

    if (!isEmpty(endDate)) searchKeyArr.push({ endDate });

    searchKeyArr.push({
      includeArchive: includeArchiveChangeBooleanToBinary(includeArchive),
    });

    if (!isEmpty(referenceId)) searchKeyArr.push({ referenceId: referenceId });
    searchKeyArr.map((p) => {
      for (var key in p) {
        // eslint-disable-next-line no-prototype-builtins
        if (p.hasOwnProperty(key)) {
          apiCallParams.set(key, p[key]);
        }
      }
    });
    let searchParam = apiCallParams.toString();
    pageURL.search = apiCallParams.toString();
    setCurrentUrl(pageURL);

    // setCurrentUrl(
    //   `${baseURL}/audit/details?page=${state.page}&limit=${state.limit}&sortBy=${property}&sortType=${sortType}`
    // );
    const result = await apigetUrl(`/audit/details?` + searchParam);
    if (result.status === 200) {
      setTimeout(() => {
        setState((prevState) => ({
          ...prevState,
          data: result.data.dataList[0].dataList,
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
    let res = "";

    apiCallParams.set("page", 1);
    apiCallParams.set("limit", count);
    apiCallParams.set("sortBy", state.sortBy);
    apiCallParams.set("sortType", state.sortType);

    pageURL.search = apiCallParams.toString();
    setCurrentUrl(pageURL);
    //let getUrl = pageURL.pathname+"/??" + pageURL.search;
    let getUrl = pageURL.pathname + pageURL.search;
    console.log("pageURL", pageURL);
    console.log("pageURL-123", getUrl);
    console.log("pageURL-123", pageURL.href);
    // const result = await apigetUrl(
    //   `/audit/details?page=${1}&limit=${count}&sortBy=${
    //     state.sortBy
    //   }&sortType=${state.sortType}`
    // );

    const result = await apigetUrl(`${getUrl}`);
    if (result.status === 200) {
      update_to(count);
      update_from(1);
      setTimeout(() => {
        setState((prevState) => ({
          ...prevState,
          data: result.data.dataList[0].dataList,
          page: 1,
          pageCount: result.data.dataList[0].pagination.count,
          limit: result.data.dataList[0].pagination.limit,
          isLoading: false,
        }));
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

  const getDisplayName = (actionType) => {
    switch (actionType) {
      case 0:
        return "Add";
      case 1:
        return "Modify";
      case 2:
        return "View";
      case 3:
        return "Delete";
    }
  };

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

  const handleAdvancedSearchValidateProperty = (
    input,
    autoCompleteValue,
    ref,
    dateTimeValue,
    dateTimeName
  ) => {
    let obj;
    let propertySchema;

    if (ref) {
      autoCompleteValue
        ? (obj = { [ref.current.getAttribute("name")]: autoCompleteValue.id })
        : (obj = { [ref.current.getAttribute("name")]: autoCompleteValue });

      propertySchema = {
        [ref.current.getAttribute("name")]: schema[
          ref.current.getAttribute("name")
        ],
      };
    } else if (dateTimeValue) {
      var now = moment().format("DD-MM-YYYY hh:mm:ss");

      if (dateTimeName === "startDate_Time") {
        if (now > dateTimeValue) {
          const error = null;
          return error;
        } else {
          const error = new ValidationError(
            "Future date is not allowed for start date"
          );
          return error;
        }
      } else if (
        dateTimeName === "startDate_Time" &&
        state.advancedSearchValidation.endDate_Time
      ) {
        if (state.advancedSearchValidation.endDate_Time > dateTimeValue) {
          const error = null;
          return error;
        } else {
          const error = new ValidationError(
            "End date cannot be before start date"
          );
          return error;
        }
      } else if (
        dateTimeName === "endDate_Time" &&
        state.advancedSearchValidation.startDate_Time
      ) {
        if (dateTimeValue > state.advancedSearchValidation.startDate_Time) {
          const error = null;
          return error;
        } else {
          const error = new ValidationError(
            "End date cannot be before start date"
          );
          return error;
        }
      } else if (dateTimeName === "endDate_Time") {
        if (now > dateTimeValue) {
          const error = null;
          return error;
        } else {
          const error = new ValidationError(
            "Future date is not allowed for end date"
          );
          return error;
        }
      }
    } else if (input.checked) {
      const { name, checked } = input;
      obj = { [name]: checked };
      propertySchema = { [name]: schema[name] };
    } else {
      const { name, value } = input;
      obj = { [name]: value };
      propertySchema = { [name]: schema[name] };
    }
    const { error } = Joi.validate(obj, propertySchema);
    return error ? error.details[0].message : null;
  };

  const handleAdvancedSearchChange = (event, value) => {
    console.log(
      "value-2",
      value.map((n) => n.id)
    );
    if (value.length !== 0) {
      setState((prevState) => ({
        ...prevState,
        advancedSearchValidation: {
          eventId: (value || []).map((n) => n.id),
        },
        isEventIdEmpty: false,
        // idNameData: value,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        advancedSearchValidation: {
          eventId: (value || []).map((n) => n.id),
        },
        isEventIdEmpty: true,
        // idNameData: value,
      }));
    }
  };

  const handleAdvancedSearchOnChange = (
    event,
    autoCompleteValue,
    ref,
    dateTimeValue,
    dateTimeName
  ) => {
    const errors = { ...state.advancedSearchValidationErrors };
    const validation = { ...state.advancedSearchValidation };

    if (dateTimeValue) {
      validation[dateTimeName] = dateTimeValue;
    } else {
      const { target: input } = event;

      if (ref) {
        const errorMessage = handleAdvancedSearchValidateProperty(
          input,
          autoCompleteValue,
          ref
        );
        if (errorMessage)
          errors[ref.current.getAttribute("name")] = errorMessage;
        else delete errors[ref.current.getAttribute("name")];

        autoCompleteValue
          ? (validation[ref.current.getAttribute("name")] =
              autoCompleteValue.id)
          : (validation[ref.current.getAttribute("name")] = autoCompleteValue);
      } else if (input.name === "includeArchive") {
        //for includeArchive checked box
        const errorMessage = handleAdvancedSearchValidateProperty(input);
        if (errorMessage) errors[input.name] = errorMessage;
        else delete errors[input.name];
        validation[input.name] = input.checked;
      } else {
        const errorMessage = handleAdvancedSearchValidateProperty(input);
        if (errorMessage) errors[input.name] = errorMessage;
        else delete errors[input.name];
        validation[input.name] = input.value;
      }
    }

    setState((prevState) => ({
      ...prevState,
      advancedSearchValidation: validation,
      advancedSearchValidationErrors: errors,
    }));
  };

  const handleStartDate = (date) => {
    setState((prevState) => ({
      ...prevState,
      startDate: date,
      isStartDateActive: true,
      isEndDateDisabled: false,
    }));

    handleAdvancedSearchOnChange(
      null,
      null,
      null,
      moment(date).format("DD-MM-YYYY HH:mm:ss"),
      "startDate"
    );
  };

  const handleEndDate = (date) => {
    setState((prevState) => ({
      ...prevState,
      endDate: date,
    }));
    handleAdvancedSearchOnChange(
      null,
      null,
      null,
      moment(date).format("DD-MM-YYYY HH:mm:ss"),
      "endDate"
    );
  };

  const isEmpty = (str) => {
    return !str || 0 === str.length;
  };

  //new Date("2014-08-18T21:11:54")
  const [selectedStartDate_Time, setSelectedStartDate_Time] = React.useState(
    null
  );
  const [selectedEndDate_Time, setSelectedEndDate_Time] = React.useState(null);

  const handleStartDate_TimeChange = (dateTimeValue, dateTimeName) => {
    handleAdvancedSearchOnChange(
      null,
      null,
      null,
      moment(dateTimeValue).format("DD-MM-YYYY hh:mm:ss"),
      dateTimeName
    );

    setTimeout(function() {
      setSelectedStartDate_Time(dateTimeValue);
    }, 250);
  };

  const handleEndDate_TimeChange = (dateTimeValue, dateTimeName) => {
    handleAdvancedSearchOnChange(
      null,
      null,
      null,
      moment(dateTimeValue).format("DD-MM-YYYY hh:mm:ss"),
      dateTimeName
    );

    setTimeout(function() {
      setSelectedEndDate_Time(dateTimeValue);
    }, 250);
  };

  const search = async (searchURL) => {
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    console.log("searchURL:::::" + searchURL);
    // setCurrentUrl(searchURL);
    const result = await apigetUrl(`/audit/details?` + searchURL);
    if (result.data.responseCode === "200") {
      setTimeout(() => {
        setAdvancedSearchData(result.data.dataList[0].dataList);
        showApiData(result.data.dataList[0].dataList);
        setAdvancedSearchError(false, "");
        setPageNumber(result.data.dataList[0].pagination.page);
        setPageCount(result.data.dataList[0].pagination.count);
        setState((prevState) => ({
          ...prevState,
          isLoading: false,
        }));
      }, 1000);
    } else {
      setState((prevState) => ({
        ...prevState,
        formDialogOpen: false,
        isErrorAlert: true,
        errorMsg: result.data.responseMessage,
      }));

      showLoader();
    }
  };

  const includeArchiveChangeBooleanToBinary = (includeArchiveValue) => {
    switch (includeArchiveValue) {
      case true:
        return 1;
      case false:
        return 0;
      case undefined:
        return 0;
    }
  };

  const handleSearchClick = () => {
    //e.preventDefault();
    apiCallParams.delete("startDate");
    apiCallParams.delete("endDate");
    apiCallParams.delete("description");
    apiCallParams.delete("eventId");
    apiCallParams.delete("userName");
    apiCallParams.delete("actionType");
    apiCallParams.delete("referenceId");
    apiCallParams.delete("includeArchive");

    const {
      eventId,
      actionType,
      userName,
      includeArchive,
      referenceId,
      startDate,
      startTime,
      endDate,
      endTime,
      description,
    } = state.advancedSearchValidation;

    if (
      eventId === [] &&
      description === "" &&
      actionType === "" &&
      userName === "" &&
      includeArchive === false &&
      referenceId === "" &&
      startDate === "" &&
      startTime === "" &&
      endDate === "" &&
      endTime === ""
    ) {
      setState((prevState) => ({
        ...prevState,
        isAdvancedSearchValidationText: true,
        advancedSearchValidationErrors: {},
      }));
      return;
    } else if (
      eventId === [] ||
      description === "" ||
      actionType === "" ||
      userName === "" ||
      includeArchive === false ||
      referenceId === "" ||
      startDate === "" ||
      startTime === "" ||
      endDate === "" ||
      endTime === ""
    ) {
      setState((prevState) => ({
        ...prevState,
        isAdvancedSearchValidationText: false,
        advancedSearchValidationErrors: {},
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        isAdvancedSearchValidationText: false,
        advancedSearchValidationErrors: {},
      }));
    }

    // const startDate_Time = selectedStartDate_Time.toString();
    // const endDate_Time = selectedEndDate_Time.toString();

    let id_params = (eventId || [])
      .map((id) => {
        return `${id}`;
      })
      .join(",");

    const searchKeyArr = [];
    if (!isEmpty(eventId)) searchKeyArr.push({ eventIds: id_params });
    if (!isEmpty(actionType))
      searchKeyArr.push({ actionType: actionType.toString() });
    if (!isEmpty(userName)) searchKeyArr.push({ userName: userName });
    if (!isEmpty(description)) searchKeyArr.push({ description: description });
    // if (!isEmpty(startDate)) tempArr.push({ startDate: startDate });
    // if (!isEmpty(startTime)) tempArr.push({ startTime: startTime });

    //const formatStartDate = moment(startDate).format("dd-MM-yyyy HH:mm:ss");
    //const formatEndDate = moment(endDate).format("dd-MM-yyyy HH:mm:ss");

    if (!isEmpty(startDate)) searchKeyArr.push({ startDate });
    // if (!isEmpty(endDate)) tempArr.push({ endDate: formatEndDate });

    if (!isEmpty(endDate)) searchKeyArr.push({ endDate });
    // if (!isEmpty(endTime)) tempArr.push({ endTime: endTime });

    searchKeyArr.push({
      includeArchive: includeArchiveChangeBooleanToBinary(includeArchive),
    });

    if (!isEmpty(referenceId)) searchKeyArr.push({ referenceId: referenceId });

    //let tempURL = `${baseURL}/audit/details?page=${state.page}&limit=${state.limit}`;
    apiCallParams.set("page", 1);
    apiCallParams.set("limit", state.limit);
    apiCallParams.set("sortBy", state.sortBy);
    apiCallParams.set("sortType", state.sortType);

    //let url = new URL(tempURL);

    //let params = new URLSearchParams(url.search);

    searchKeyArr.map((p) => {
      for (var key in p) {
        // eslint-disable-next-line no-prototype-builtins
        if (p.hasOwnProperty(key)) {
          apiCallParams.set(key, p[key]);
        }
      }
    });
    //searchedProperty(tempArr);

    // url.search = params.toString();
    pageURL.search = apiCallParams.toString();

    // search(url.href);
    search(apiCallParams.toString());
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

    apiCallParams.delete("startDate");
    apiCallParams.delete("endDate");

    apiCallParams.delete("eventId");
    apiCallParams.delete("userName");
    apiCallParams.delete("description");
    apiCallParams.delete("actionType");
    apiCallParams.delete("referenceId");
    apiCallParams.delete("includeArchive");

    pageURL.search = apiCallParams.toString();
    const result = await apigetUrl(
      `/audit/details?page=${1}&limit=${state.limit}&sortBy=${
        state.sortBy
      }&sortType=${state.sortType}`
    );
    if (result.status === 200) {
      setTimeout(() => {
        setState((prevState) => ({
          ...prevState,
          startDate: null,
          endDate: null,
          isEndDateDisabled: true,
          isInfoAlert: false,
          isLoading: false,
        }));

        setResetData(result.data.dataList[0].dataList);
        setPageNumber(result.data.dataList[0].pagination.page);
        setPageCount(result.data.dataList[0].pagination.count);
        setCurrentUrl(pageURL);

        resetAutoComplete(); // reset all autocomplete fields
      }, 1000);
    } else {
      ippNotify.error(result.data.responseMessage);
      showLoader();
    }
  };

  const handleResetClick = () => {
    //setIsAdvancedSearch(!isAdvancedSearch);

    setState((prevState) => ({
      ...prevState,
      advancedSearchValidation: {
        eventId: "",
        actionType: "",
        userName: "",
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
        includeArchive: false,
        referenceId: "",
        description: "",
      },
      isEventIdEmpty: false,
      advancedSearchValidationErrors: {},
      isAdvancedSearchValidationText: false,
      handleAutoCompleteInputReset: false,
    }));

    setSelectedStartDate_Time(null);
    setSelectedEndDate_Time(null);

    callResetData();
  };

  const getPageFromBackEnd = async (
    pageNumber,
    limit,
    temp_from,
    temp_to,
    pageCount,
    actionType
  ) => {
    const {eventId,userName,includeArchive,referenceId,startDate,startTime,endDate,endTime,description} = state.advancedSearchValidation;
if (!isEmpty(eventId)) {}else{ apiCallParams.delete("eventId");}
if (!isEmpty(userName)) {}else{apiCallParams.delete("userName");}
if (!isEmpty(description)) {}else{ apiCallParams.delete("description");}
if (!isEmpty(startDate)) {}else{apiCallParams.delete("startDate");}
if (!isEmpty(endDate)) {}else{apiCallParams.delete("endDate");}
if (!isEmpty(referenceId)){}else{ apiCallParams.delete("referenceId");}
if (!isEmpty(includeArchive)){}else{ apiCallParams.delete("includeArchive");}

    setState((prevState) => ({
      ...prevState,

      isLoading: true,
    }));
    apiCallParams.set("page", pageNumber);
    apiCallParams.set("limit", limit);

    pageURL.search = apiCallParams.toString();
    let getUrl = pageURL.pathname + pageURL.search;
    //let getUrl = pageURL.pathname + pageURL.search;
    console.log("pageURL", pageURL);
    console.log("pageURL-123", getUrl);
    console.log("pageURL-123", pageURL.href);
    // const result = await apigetUrl(
    //   `/audit/details?page=${pageNumber}&limit=${limit}&sortBy=${state.sortBy}&sortType=${state.sortType}`
    // );
    const result = await apigetUrl(`${getUrl}`);
    if (result.status === 200) {
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
        setPageData(result.data.dataList[0].dataList);
        setPageNumber(result.data.dataList[0].pagination.page);
        setPageCount(result.data.dataList[0].pagination.count);
        setState((prevState) => ({
          ...prevState,
          page: pageNumber,
          isLoading: false,
        }));
      }, 1000);
    } else {
      ippNotify.error(result.data.responseMessage);
      setTimeout(() => {
        setState((prevState) => ({
          ...prevState,

          isLoading: false,
        }));
      }, 1000);
    }
  };

  const resetAutoComplete = () => {
    setState((prevState) => ({
      ...prevState,
      handleAutoCompleteInputReset: !state.handleAutoCompleteInputReset,
    }));
  };

  const onAdvancedSearchClickClean = () => {
    setState((prevState) => ({
      ...prevState,
      searchValidation: {
        eventId: "",
        actionType: "",
        userName: "",
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
        includeArchive: false,
        referenceId: "",
        description: "",
      },
      isEventIdEmpty: false,
      advancedSearchValidationErrors: {},
      isAdvancedSearchValidationText: false,
      handleAutoCompleteInputReset: false,
    }));
  };

  return (
    <>
      <div className="App">
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <div className="row">
              <div className="col-lg-4"></div>
              <div className="col-lg-4"></div>
              <div className="col-lg-4">
                <IPPNotification />
              </div>
            </div>
            <div className="audit-master-box">
              <EnhancedTableToolbar
                setAdvancedSearchData={setAdvancedSearchData}
                setResetData={setResetData}
                numSelected={state.selected.length}
                pageNumber={state.page}
                limit={state.limit}
                page={state.page}
                sortBy={state.sortBy}
                sortType={state.sortType}
                //setCurrentUrl={setCurrentUrl}

                isAdvancedSearchValidationText={
                  state.isAdvancedSearchValidationText
                }
                handleStartDate_TimeChange={handleStartDate_TimeChange}
                handleEndDate_TimeChange={handleEndDate_TimeChange}
                selectedStartDate_Time={selectedStartDate_Time}
                selectedEndDate_Time={selectedEndDate_Time}
                idNameData={state.idNameData}
                isEmpty={isEmpty}
                handleResetClick={handleResetClick}
                handleSearchClick={handleSearchClick}
                advancedSearchValidation={state.advancedSearchValidation}
                handleAdvancedSearchOnChange={handleAdvancedSearchOnChange}
                handleAutoCompleteInputReset={
                  state.handleAutoCompleteInputReset
                }
                advancedSearchValidationErrors={
                  state.advancedSearchValidationErrors
                }
                handleStartDate={handleStartDate}
                handleEndDate={handleEndDate}
                onAdvancedSearchClickClean={onAdvancedSearchClickClean}
                startDate={state.startDate}
                endDate={state.endDate}
                isStartDateActive={state.isStartDateActive}
                isEndDateDisabled={state.isEndDateDisabled}
                handleAdvancedSearchChange={handleAdvancedSearchChange}
                isEventIdEmpty={state.isEventIdEmpty}
              />
              <div className="flex-auto">
                <div className="table-responsive-material">
                  <Table>
                    <EnhancedTableHead
                      numSelected={state.selected.length}
                      order={state.sortType}
                      orderBy={state.sortBy}
                      onRequestSort={handleRequestSort}
                      rowCount={state.data.length}
                      headCell={state.headCells}
                    />
                    {state.isLoading ? <Loader /> : null}
                    {state.isInfoAlert === true ||
                    (state.data.length === 0 && state.isLoading === false) ? (
                      <InfoModal message="Your query did not match any results" />
                    ) : (
                      <TableBody>
                        {state.data.map((n, i) => {
                          return (
                            <TableRow key={i}>
                              {/* <TableCell>{n.eventId}</TableCell> */}
                              <TableCell>{n.eventName}</TableCell>
                              <TableCell>{n.description}</TableCell>
                              <TableCell>
                                {getDisplayName(n.actionType)}
                              </TableCell>
                              <TableCell>{n.who}</TableCell>
                              <TableCell>
                                {moment(n.when).format("DD-MM-YYYY hh:mm:ss")}
                              </TableCell>
                              <TableCell>
                                {n.referenceId == "null" ? "-" : n.referenceId}
                              </TableCell>
                              <TableCell padding="none">
                                {n.dataBefore &&
                                n.dataAfter &&
                                n.additionalData ? (
                                  <Tooltip title="View More Details">
                                    <IconButton
                                      style={{ marginLeft: "25%" }}
                                      onClick={() => handleClickOpen(n)}
                                    >
                                      <SettingsApplicationsIcon color="primary" />
                                    </IconButton>
                                  </Tooltip>
                                ) : (
                                  <IconButton
                                    style={{ marginLeft: "25%" }}
                                    disabled
                                    // onClick={() => handleClickOpen(n)}
                                  >
                                    <SettingsApplicationsIcon color="disabled" />
                                  </IconButton>
                                )}
                              </TableCell>
                              {/* <TableCell padding="none">
                                <Tooltip title="View More Details">
                                  <IconButton
                                    style={{ marginLeft: "25%" }}
                                    onClick={() => handleClickOpen(n)}
                                    disabled={
                                      !n.dataBefore &&
                                      !n.dataAfter &&
                                      !n.additionalData
                                    }
                                  >
                                    <SettingsApplicationsIcon color="primary" />
                                  </IconButton>
                                </Tooltip>
                              </TableCell> */}
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
      <FormDialog
        open={state.formOpen}
        rowdata={selectedRowdata}
        handleRequestClose={handleRequestClose}
      />
    </>
  );
}

export default App;
