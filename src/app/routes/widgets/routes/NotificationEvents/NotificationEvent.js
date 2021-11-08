import React, { useState, useEffect } from "react";
import "./root.component.css";
import Grid from "@material-ui/core/Grid";
import { Tooltip } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import EditIcon from "@material-ui/icons/Edit";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import EnhancedTableHead from "../CommonComponents/TableHeadComponent";
import EnhancedTableToolbar from "./EnhancedTableToolbar";
import TablePaginationComponent from "../CommonComponents/TablePaginationComponent";
import InfoModal from "../Modal/Info";
import Joi from "joi-browser";
import IntlMessages from "util/IntlMessages";
import apiInstance from "../../../../../setup/index";
import InputField from "../CommonComponents/TextField";
import InputSubmitButton from "../CommonComponents/SubmitButton";
import InputCancelButton from "../CommonComponents/CancelButton";
import { apigetUrl, apiputUrl } from "setup/middleware";
import {
  IPPNotification,
  ippNotify,
} from "../CommonComponents/IPPNotification";
import { getRecordsPerPage } from "../../../../../setup/ApplicatoinConfigurations.js";

import "../CommonComponents/tableStyle.css";
import AuditTimeline from "../CommonComponents/AuditTimeline/AuditTimeline";
import { Visibility } from "@material-ui/icons";
import Loader from "../CommonComponents/Loader";

const baseURL = `${process.env.REACT_APP_BASE_URL}`;
const perPageURL = `/notify/events`;
const pageURL = new URL(baseURL + perPageURL);
let apiCallParams = new URLSearchParams(pageURL.search);

let pageNumber = 1;

const schema = {
  name: Joi.string()
    .required()
    .label("Name"),
  description: Joi.string().label("Description"),
  code: Joi.string()
    .required()
    .label("Code"),
  sms: Joi.boolean()
    .required()
    .label("SMS"),
  email: Joi.boolean()
    .required()
    .label("Email"),
  push: Joi.boolean()
    .required()
    .label("Push"),
  inapp: Joi.boolean()
    .required()
    .label("InApp"),
  isUserOverrideAllowed: Joi.number()
    .required()
    .label("isUserOverrideAllowed"),
};

function App() {
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
    pageNumber = 1;
    setState((prevState) => ({
      ...prevState,
      isInfoAlert: false,
      data: data,
      page: 1,
      from: 1,
      to: state.limit,

      isAdvancedSearchValidationText: false,
    }));
  };

  const setCurrentUrl = (currentUrl) => {
    setState((prevState) => ({ ...prevState, currentUrl }));
  };

  const [state, setState] = useState({
    isLoading: true,
    name: "",
    sortType: "asc",
    sortBy: "name",
    selected: [],
    page: 1,
    rowsPerPage: 5,
    data: [],
    formDialogOpen: false,
    currentUrl: "",
    searchedProperty: "",
    validation: {
      name: "",
      code: "",
      sms: false,
      email: false,
      push: false,
      inapp: false,
    },
    description: "",
    searchValidation: {
      name: "",
      code: "",
      isUserOverrideAllowed: "",
    },
    errors: {},
    isEditFormSubmitDisabled: false,
    areAllEditFormFieldsPopulated: false,
    isSortAsc: true,
    from: 1,
    to: 0,
    pageCount: 0,
    limit: getRecordsPerPage(),
    isSuccessAlert: false,
    successMsg: "",
    isErrorAlert: false,
    errorMsg: "",
    isInfoAlert: false,
    infoMsg: "",
    isAdvancedSearchValidationText: false,
    isUserOverrideAllowed: 1,
    rowVersion: 0,
    categoryId: 0,
    isAuditTimelineActive: false,
    eventId: "",
    referenceId: "",
    auditEventId: "",
    headCells: [
      {
        id: "name",
        isActive: true,
        label: "notificationdetails.master.tableheader.Name.label",
      },
      {
        id: "description",
        isActive: false,
        label: "notificationdetails.master.tableheader.Description.label",
      },
      {
        id: "code",
        isActive: true,
        label: "notificationdetails.master.tableheader.Code.label",
      },
      {
        id: "isUserOverrideAllowed",
        isActive: false,
        label:
          "notificationdetails.master.tableheader.isUserOverrideAllowed.label",
      },
      {
        id: "actions",
        isActive: false,
        label: "notificationdetails.master.tableheader.Actions.label",
      },
    ],
  });

  const showApiData = (apiData) => {};

  useEffect(() => {
    apiCallParams.set("page", state.page);
    apiCallParams.set("limit", state.limit);
    apiCallParams.set("sortBy", state.sortBy);
    apiCallParams.set("sortType", state.sortType);
    pageURL.search = apiCallParams.toString();
    setCurrentUrl(pageURL);
    callLocalBaseURL();
  }, []);

  const callLocalBaseURL = async () => {
    const result = await apigetUrl(
      `/notify/events?page=${state.page}&limit=${state.limit}`
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
        showApiData(result.data.dataList);
      }, 1000);
    } else if (result.data.responseStatus === "failure") {
      ippNotify.error(result.data.responseMessage);
      showLoader();
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

  useEffect(() => {
    let newData = state.data;
    console.log("newData", newData);
  }, [state.data]);

  const requestSortData = async (sortBy, sortType) => {
    const { name, code, isUserOverrideAllowed } = state.searchValidation;
    apiCallParams.set("page", state.page);
    apiCallParams.set("limit", state.limit);
    apiCallParams.set("sortBy", sortBy);
    apiCallParams.set("sortType", sortType);
    let tempArr = [];
    if (!isEmpty(name)) tempArr.push({ name });
    if (!isEmpty(code)) tempArr.push({ code });
    if (!isEmpty(isUserOverrideAllowed !== ""))
      tempArr.push({
        isUserOverrideAllowed,
      });
    tempArr.map((p) => {
      for (var key in p) {
        if (p.hasOwnProperty(key)) {
          apiCallParams.set(key, p[key]);
        }
      }
    });
    let searchParam = apiCallParams.toString();
    pageURL.search = apiCallParams.toString();
    setCurrentUrl(pageURL);
    const result = await apigetUrl(`/notify/events?` + searchParam);
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

  const isUserOverrideAllowedTextReturn = (isUserOverrideAllowed) => {
    switch (isUserOverrideAllowed) {
      case 0:
        return "No";
      case 1:
        return "Yes";
      case "":
        return "";
    }
  };

  const preferencesTextReturn = (preferences) => {
    switch (preferences) {
      case "N":
        return false;
      case "Y":
        return true;
      case "":
        return "";
    }
  };

  const preferencesNumberReturn = (preferences) => {
    switch (preferences) {
      case true:
        return "Y";
      case false:
        return "N";
      case "":
        return "";
    }
  };

  const onTableEditButtonClick = async (event, id) => {
    const res = await apigetUrl(`/notify/events/${id}`);
    if (res.data.responseCode === "200") {
      const response = res.data;
      setState((prevState) => ({
        ...prevState,
        formDialogOpen: true,
        selectedId: response.id,
        validation: {
          name: response.name,
          code: response.code,
          sms: preferencesTextReturn(response.preferences.sms),
          email: preferencesTextReturn(response.preferences.email),
          inapp: preferencesTextReturn(response.preferences.inapp),
          push: preferencesTextReturn(response.preferences.push),
        },
        description: response.description,
        isUserOverrideAllowed: response.isUserOverrideAllowed,
        rowVersion: response.rowVersion,
        categoryId: response.categoryId,
      }));
    } else {
      ippNotify.error(res.data.responseMessage);
    }
  };

  const handleRequestClose = () => {
    setState((prevState) => ({
      ...prevState,
      formDialogOpen: false,
      isEditFormSubmitDisabled: false,
      validation: {
        name: "",
        code: "",
        sms: false,
        email: false,
        push: false,
        inapp: false,
      },
      description: "",
      errors: {},
    }));
  };

  const updateEditInBackend = async () => {
    let putDataObj = {
      name: state.validation.name,
      description: state.description,
      code: state.validation.code,
      preferences: {
        sms: preferencesNumberReturn(state.validation.sms),
        email: preferencesNumberReturn(state.validation.email),
        inapp: preferencesNumberReturn(state.validation.inapp),
        push: preferencesNumberReturn(state.validation.push),
      },
      isUserOverrideAllowed: state.isUserOverrideAllowed,
      rowVersion: state.rowVersion,
      categoryId: state.categoryId,
    };

    setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));

    const res = await apiputUrl(
      `/notify/events/${state.selectedId}`,
      putDataObj
    );
    if (res.data.responseCode === "200") {
      const response = res.data;
      setTimeout(() => {
        const indexInExistingData = state.data
          .map(function(e) {
            return e.id;
          })
          .indexOf(res.data.id);
        state.data[indexInExistingData] = res.data;
        ippNotify.success("Successfully Updated");
        setState((prevState) => ({
          ...prevState,
          data: state.data,
          formDialogOpen: false,
          // isSuccessAlert: true,
          // successMsg: "Successfully Updated",
          isLoading: false,
        }));
      }, 1000);
    } else {
      ippNotify.error(res.data.responseMessage);
      setState((prevState) => ({
        ...prevState,
        formDialogOpen: true,
      }));
      showLoader();
    }
  };

  const handleEditFormSubmit = async (e) => {
    e.preventDefault();
    updateEditInBackend();
  };

  const validateProperty = ({ name, value, checked }) => {
    let obj = {};
    if (
      name === "sms" ||
      name === "email" ||
      name === "push" ||
      name === "inapp"
    ) {
      obj = { [name]: checked };
    } else {
      obj = { [name]: value };
    }

    const propertySchema = { [name]: schema[name] };
    const { error } = Joi.validate(obj, propertySchema);
    return error ? error.details[0].message : null;
  };

  function isObjEmpty(obj) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }

    return JSON.stringify(obj) === JSON.stringify({});
  }

  const checkAreAllEditFormFieldsPopulated = (obj) => {
    return !Object.values(obj).some((x) => x === "");
  };

  const handleEditFormChange = ({ target: input }) => {
    const errors = { ...state.errors };
    const errorMessage = validateProperty(input);
    console.log("errorMessage", errorMessage);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const validation = { ...state.validation };
    if (
      input.name === "sms" ||
      input.name === "email" ||
      input.name === "push" ||
      input.name === "inapp"
    ) {
      validation[input.name] = input.checked;
    } else {
      validation[input.name] = input.value;
    }

    const allFormFieldsPopulated = checkAreAllEditFormFieldsPopulated(
      validation
    );

    setState((prevState) => ({
      ...prevState,
      validation,
      errors,
      isEditFormSubmitDisabled: allFormFieldsPopulated && isObjEmpty(errors),
    }));
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

  const handleInputChange = (event) => {
    const { target: input } = event;
    const errors = { ...state.errors };
    const searchValidation = { ...state.searchValidation };

    const errorMessage = validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];
    searchValidation[input.name] = input.value;

    let isAnyFormFieldsPopulated = false;
    isAnyFormFieldsPopulated =
      searchValidation.name !== "" ||
      searchValidation.code !== "" ||
      searchValidation.isUserOverrideAllowed !== "";

    if (isAnyFormFieldsPopulated && isObjEmpty(errors)) {
      setState((prevState) => ({
        ...prevState,
        searchValidation,
        errors,
        isAdvancedSearchValidationText: false,
      }));
    } else if (!isAnyFormFieldsPopulated && !isObjEmpty(errors)) {
      setState((prevState) => ({
        ...prevState,
        searchValidation,
        errors,
        isAdvancedSearchValidationText: true,
      }));
    } else if (isAnyFormFieldsPopulated && !isObjEmpty(errors)) {
      setState((prevState) => ({
        ...prevState,
        searchValidation,
        errors,
        isAdvancedSearchValidationText: false,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        searchValidation,
        errors,
        isAdvancedSearchValidationText: true,
      }));
    }
  };

  const isEmpty = (str) => {
    return !str || 0 === str.length;
  };

  const handleApplyClick = (e) => {
    const { name, code, isUserOverrideAllowed } = state.searchValidation;
    e.preventDefault();

    if (code === "" && name === "" && isUserOverrideAllowed === "") {
      setState((prevState) => ({
        ...prevState,
        isAdvancedSearchValidationText: true,
        errors: {},
      }));
      return;
    } else if (code === "" || name === "" || isUserOverrideAllowed === "") {
      setState((prevState) => ({
        ...prevState,
        isAdvancedSearchValidationText: false,
        errors: {},
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        isAdvancedSearchValidationText: false,
        errors: {},
      }));
    }

    let tempArr = [];
    if (!isEmpty(name)) tempArr.push({ name });
    if (!isEmpty(code)) tempArr.push({ code });
    if (!isEmpty(isUserOverrideAllowed !== ""))
      tempArr.push({
        isUserOverrideAllowed,
      });

    apiCallParams.set("page", 1);
    apiCallParams.set("limit", state.limit);
    apiCallParams.set("sortBy", state.sortBy);
    apiCallParams.set("sortType", state.sortType);

    tempArr.map((p) => {
      for (var key in p) {
        if (p.hasOwnProperty(key)) {
          apiCallParams.set(key, p[key]);
        }
      }
    });

    pageURL.search = apiCallParams.toString();
    search(apiCallParams.toString());
  };

  const getPageFromBackEnd = async (
    pageNumber,
    limit,
    temp_from,
    temp_to,
    pageCount,
    actionType
  ) => {
    const { name, code, isUserOverrideAllowed } = state.searchValidation;
    if (!isEmpty(name)) {
    } else {
      apiCallParams.delete("name");
    }
    if (!isEmpty(code)) {
    } else {
      apiCallParams.delete("code");
    }
    if (!isEmpty(isUserOverrideAllowed !== "")) {
    } else {
      apiCallParams.delete("isUserOverrideAllowed");
    }
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));

    apiCallParams.set("page", pageNumber);
    apiCallParams.set("limit", limit);

    pageURL.search = apiCallParams.toString();
    let getUrl = pageURL.pathname + pageURL.search;
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

  const search = async (searchURL) => {
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    const res = await apigetUrl("/notify/events?" + searchURL);
    if (res.data.responseCode === "200") {
      setTimeout(() => {
        setAdvancedSearchData(res.data.dataList);
        setPageNumber(res.data.pagination.page);
        setPageCount(res.data.pagination.count);
        setState((prevState) => ({
          ...prevState,
          isLoading: false,
        }));
      }, 1000);
    } else {
      ippNotify.error(res.data.responseMessage);
      showLoader();
    }
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

    apiCallParams.delete("name");
    apiCallParams.delete("code");
    apiCallParams.delete("isUserOverrideAllowed");

    pageURL.search = apiCallParams.toString();

    const result = await apigetUrl(
      `/notify/events?page=${1}&limit=${state.limit}&sortBy=${
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

  const handleResetClick = (e) => {
    //setIsAdvancedSearch(!isAdvancedSearch);

    setState((prevState) => ({
      ...prevState,
      searchValidation: {
        name: "",
        code: "",
        isUserOverrideAllowed: "",
      },
      isAdvancedSearchValidationText: false,
      errors: {},
    }));

    callResetData();
  };

  const onAdvancedSearchClickClean = () => {
    setState((prevState) => ({
      ...prevState,
      searchValidation: {
        name: "",
        code: "",
        isUserOverrideAllowed: "",
      },
      isAdvancedSearchValidationText: false,
      errors: {},
    }));
  };

  const handleEditDescriptionChange = (e) => {
    setState((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
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

  return (
    <>
      {state.isAuditTimelineActive ? (
        <AuditTimeline
          closeAuditTimeline={handleCloseAuditTimeline}
          eventId={state.eventId}
          referenceId={state.referenceId}
        />
      ) : (
        <div className="App">
          {console.log("error-Message", state.errors.code)}
          <Dialog
            maxWidth="sm"
            open={state.formDialogOpen}
            onClose={handleRequestClose}
          >
            <DialogTitle>
              <IntlMessages id="notificationdetails.master.modal.edit.tilte" />
            </DialogTitle>
            <DialogContent>
              <div className="row">
                <div className="col-lg-6">
                  <InputField
                    required
                    className="mb-3"
                    autoFocus
                    id="name"
                    error={state.errors.name}
                    label={
                      <IntlMessages id="notificationdetails.master.modal.edit.felid.Name" />
                    }
                    name="name"
                    onChange={(e) => handleEditFormChange(e)}
                    value={state.validation.name}
                    helperText={state.errors.name}
                    fullWidth
                  />
                </div>
                <div className="col-lg-6">
                  <InputField
                    required
                    className="mb-3"
                    id="code"
                    error={state.errors.code}
                    label={
                      <IntlMessages id="notificationdetails.master.modal.edit.felid.Code" />
                    }
                    name="code"
                    onChange={(e) => handleEditFormChange(e)}
                    value={state.validation.code}
                    helperText={state.errors.code}
                    fullWidth
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-lg-12">
                  <InputField
                    required
                    className="mb-2"
                    id="description"
                    label={
                      <IntlMessages id="notificationdetails.master.modal.edit.felid.Description" />
                    }
                    name="description"
                    onChange={(e) => handleEditDescriptionChange(e)}
                    value={state.description}
                    fullWidth
                  />
                </div>
              </div>
              <Paper className="pb-3 mt-3" elevation={3}>
                <FormControl component="fieldset">
                  <FormLabel
                    className="pl-2 pt-2"
                    component="legend"
                    id="preferences"
                  >
                    Preferences
                  </FormLabel>
                  <FormGroup row>
                    <FormControlLabel
                      className="mr-3"
                      label={
                        <IntlMessages id="notificationdetails.master.modal.edit.felid.SMS" />
                      }
                      name="sms"
                      control={
                        <Switch
                          color="primary"
                          checked={state.validation.sms}
                          error={state.errors.sms}
                          helperText={state.errors.sms}
                          onClick={(e) => handleEditFormChange(e, "sms")}
                          // renderValue={(value) =>
                          //   console.log("value", value)`${value}`
                          // }
                        />
                      }
                      labelPlacement="start"
                    />

                    <FormControlLabel
                      className="mr-3"
                      label={
                        <IntlMessages id="notificationdetails.master.modal.edit.felid.Email" />
                      }
                      name="email"
                      control={
                        <Switch
                          color="primary"
                          checked={state.validation.email}
                          onChange={(e) => handleEditFormChange(e)}
                          // renderValue={(value) =>
                          //   console.log("value", value)`${value}`
                          // }
                        />
                      }
                      labelPlacement="start"
                    />

                    <FormControlLabel
                      className="mr-3"
                      label={
                        <IntlMessages id="notificationdetails.master.modal.edit.felid.Push" />
                      }
                      name="push"
                      control={
                        <Switch
                          color="primary"
                          checked={state.validation.push}
                          onChange={(e) => handleEditFormChange(e)}
                          // renderValue={(value) =>
                          //   console.log("value", value)`${value}`
                          // }
                        />
                      }
                      labelPlacement="start"
                    />
                    <FormControlLabel
                      className="mr-3"
                      label={
                        <IntlMessages id="notificationdetails.master.modal.edit.felid.InApp" />
                      }
                      name="inapp"
                      control={
                        <Switch
                          color="primary"
                          checked={state.validation.inapp}
                          onChange={(e) => handleEditFormChange(e)}
                          // renderValue={(value) =>
                          //   console.log("value", value)`${value}`
                          // }
                        />
                      }
                      labelPlacement="start"
                    />
                  </FormGroup>
                </FormControl>
              </Paper>
            </DialogContent>
            <DialogActions>
              <InputCancelButton onClick={(e) => handleRequestClose(e)} />

              <InputSubmitButton
                onClick={(e) => handleEditFormSubmit(e)}
                disabled={!state.isEditFormSubmitDisabled}
              />
            </DialogActions>
          </Dialog>
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
                  data={state.data}
                  setAdvancedSearchData={setAdvancedSearchData}
                  setResetData={setResetData}
                  page={state.page}
                  pageCount={state.pageCount}
                  limit={state.limit}
                  to={state.limit}
                  rowsPerPage={state.rowsPerPage}
                  sortType={state.sortType}
                  sortBy={state.sortBy}
                  handleInputChange={handleInputChange}
                  isAdvancedSearchValidationText={
                    state.isAdvancedSearchValidationText
                  }
                  validation={state.validation}
                  error={state.errors}
                  handleApplyClick={handleApplyClick}
                  // callResetData={callResetData}
                  handleResetClick={handleResetClick}
                  callLocalBaseURL={callLocalBaseURL}
                  searchValidation={state.searchValidation}
                  onAdvancedSearchClickClean={onAdvancedSearchClickClean}
                />

                <div className="flex-auto">
                  <div className="table-responsive-material">
                    <Table>
                      <EnhancedTableHead
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
                          {state.data.map((n) => {
                            const isSelected = isSelectedFunc(n.id);
                            let isUserOverrideAllowed = n.isUserOverrideAllowed;
                            return (
                              <TableRow
                                hover
                                role="checkbox"
                                aria-checked={isSelected}
                                tabIndex={-1}
                                key={n.id}
                                selected={isSelected}
                              >
                                <TableCell>{n.name}</TableCell>
                                <TableCell>{n.description}</TableCell>
                                <TableCell>{n.code}</TableCell>
                                <TableCell>
                                  {isUserOverrideAllowedTextReturn(
                                    n.isUserOverrideAllowed
                                  )}
                                </TableCell>

                                <TableCell padding="none">
                                  <Tooltip
                                    title={
                                      <IntlMessages id="NotificationEvent.Tooltip.Edit" />
                                    }
                                  >
                                    <IconButton
                                      id={n.id}
                                      onClick={(event) =>
                                        onTableEditButtonClick(event, n.id)
                                      }
                                    >
                                      <EditIcon color="primary" />
                                    </IconButton>
                                  </Tooltip>
                                  {state.auditEventId >= 1 ? (
                                    <Tooltip
                                      title={
                                        <IntlMessages id="NotificationEvent.Tooltip.View" />
                                      }
                                    >
                                      <IconButton
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
                            property={state.sortBy}
                            sortType={state.sortType}
                            currentUrl={state.currentUrl}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                            setPageData={setPageData}
                            setPageNumber={setPageNumber}
                            setPageCount={setPageCount}
                            update_from={update_from}
                            update_to={update_to}
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
      )}
    </>
  );
}

export default App;
