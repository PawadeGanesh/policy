import React, { useState, useEffect } from "react";
import "./root.component.css";
import axios from "axios";
import FormControl from "@material-ui/core/FormControl";
import EditIcon from "@material-ui/icons/Edit";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormHelperText from "@material-ui/core/FormHelperText";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import InfoModal from "../Modal/Info";
import EnhancedTableHead from "../CommonComponents/TableHeadComponent";
import EnhancedTableToolbar from "./EnhancedTableToolbar";
import TablePaginationComponent from "../CommonComponents/TablePaginationComponent";
import "../CommonComponents/tableStyle.css";
import Joi from "joi-browser";
import {
  createMuiTheme,
  MenuItem,
  InputLabel,
  Select,
  Tooltip,
  Grid,
} from "@material-ui/core";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import _ from "lodash";
import InputField from "../CommonComponents/TextField";
import InputSubmitButton from "../CommonComponents/SubmitButton";
import InputCancelButton from "../CommonComponents/CancelButton";
import InputSelect from "../CommonComponents/Select";
import { apigetUrl, apiputUrl } from "setup/middleware";
import {
  IPPNotification,
  ippNotify,
} from "../CommonComponents/IPPNotification";
import { getRecordsPerPage } from "../../../../../setup/ApplicatoinConfigurations.js";
import AuditTimeline from "../CommonComponents/AuditTimeline/AuditTimeline";
import { Visibility } from "@material-ui/icons";
import Loader from "../CommonComponents/Loader";
import IntlMessages from "util/IntlMessages";
import { useDispatch, useSelector } from "react-redux";
import { verifyToken } from "../../../../../actions/Auth";

let pageNumber = 1;

const schema = {
  name: Joi.string()
    .required()
    .label("Name"),
  description: Joi.string()
    // .allow("")
    // .optional()
    .required()
    .label("Description"),
  archiveIn: Joi.number()
    .required()
    .label("Archive In"),
  purgeIn: Joi.number()
    .required()
    .label("Purge In"),
  isEnabled: Joi.string()
    .required()
    .label("Is Enabled"),
};

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
    suppressDeprecationWarnings: true,
  },
  palette: {
    primary: {
      main: "#db3131",
    },
  },
});

const formLabelsTheme = createMuiTheme({
  overrides: {
    MuiFormLabel: {
      asterisk: {
        color: "#db3131",
        "&$error": {
          color: "#db3131",
        },
      },
    },
  },
});

const advancedSearchValidationSchema = {
  name: Joi.string()
    .required()
    .label("Name"),
  isEnabled: Joi.number()
    .required()
    .label("Is Enabled"),
};

const config = {
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
  data: {},
};

const baseURL = `${process.env.REACT_APP_BASE_URL}`;
const perPageURL = `/audit/events`;

const pageURL = new URL(baseURL + perPageURL);

let apiCallParams = new URLSearchParams(pageURL.search);

const api = axios.create({
  baseURL: baseURL,
});

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
      isAdvancedSearchValidationText: false,
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
    data: [],
    formDialogOpen: false,
    selectedEditId: "",
    selected_EditForm_RowVersion_Value: 1,
    isSortAsc: true,
    from: 1,
    to: 0,
    pageCount: 0,
    limit: getRecordsPerPage(),
    isNoTableDataAlertVisible: true,
    validation: {
      name: "",
      description: "",
      archiveIn: "",
      purgeIn: "",
      isEnabled: "",
    },
    description: "",
    errors: {},
    isEditFormSubmitDisabled: false,
    areAllEditFormFieldsPopulated: false,
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
    advancedSearchValidation: {
      name: "",
      isEnabled: "",
    },
    advancedSearchValidationErrors: {},
    isAdvancedSearchValidationText: false,
    isAuditTimelineActive: false,
    eventId: "",
    referenceId: "",
    auditEventId: "",
    headCells: [
      {
        id: "name",
        isActive: true,
        label: "auditevent.master.tableheader.Name.label",
      },
      {
        id: "description",
        isActive: false,
        label: "auditevent.master.tableheader.Description.label",
      },
      {
        id: "archiveIn",
        isActive: false,
        label: "auditevent.master.tableheader.ArchiveIn.label",
      },
      {
        id: "purgeIn",
        isActive: false,
        label: "auditevent.master.tableheader.PurgeIn.label",
      },
      {
        id: "isEnabled",
        isActive: false,
        label: "auditevent.master.tableheader.IsEnabled.label",
      },
      {
        id: "actions",
        isActive: false,
        label: "auditevent.master.tableheader.Actions.label",
      },
    ],
  });

  const showApiData = (apiData) => {};
  const dispatch = useDispatch();

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
      `/audit/events?page=${state.page}&limit=${state.limit}`
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
          auditEventId: result.data.auditEventId,
          isLoading: false,
        }));
        showApiData(result.data.dataList);
      }, 1000);
    } else if (result.data.responseStatus === "failure") {
      ippNotify.error(result.data.responseMessage);
      showLoader();
    } else {
      if (result.status === 401 || result.status === 402) {
        dispatch(verifyToken());
      } else {
        ippNotify.error(result.data.responseMessage);
        showLoader();
      }
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
      minWidth: 200,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));

  const requestSortData = async (sortBy, sortType) => {
    const { name, isEnabled } = state.advancedSearchValidation;
    apiCallParams.set("page", state.page);
    apiCallParams.set("limit", state.limit);
    apiCallParams.set("sortBy", sortBy);
    apiCallParams.set("sortType", sortType);
    let tempArr = [];
    if (!isEmpty(name)) tempArr.push({ name });
    if (isEnabled !== "") tempArr.push({ isEnabled });
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

    const result = await apigetUrl(`/audit/events?` + searchParam);
    if (result.data.responseCode === "200") {
      setTimeout(() => {
        setState((prevState) => ({
          ...prevState,
          data: result.data.dataList,
          isLoading: false,
        }));
      }, 1000);
    } else {
      if (result.status === 401 || result.status === 402) {
        dispatch(verifyToken());
      } else {
        ippNotify.error(result.data.responseMessage);
        showLoader();
      }
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
      if (result.status === 401 || result.status === 402) {
        dispatch(verifyToken());
      } else {
        ippNotify.error(result.data.responseMessage);
        showLoader();
      }
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
  const isEnabledNumberReturn = (isEnabled) => {
    switch (isEnabled) {
      case "Yes":
        return 1;
      case "No":
        return 0;
      case "":
        return "";
    }
  };

  const onTableEditButtonClick = async (event) => {
    let currentTarget = event.currentTarget;

    const res = await apigetUrl(`/audit/events/${currentTarget.id}`);
    if (res.data.responseCode === "200") {
      setState((prevState) => ({
        ...prevState,
        formDialogOpen: true,
        selectedEditId: currentTarget.id,
        validation: {
          name: res.data.name,
          archiveIn: res.data.archiveIn,
          purgeIn: res.data.purgeIn,
          isEnabled: isEnabledTextReturn(res.data.isEnabled),
          rowVersion: res.data.rowVersion,
          description: res.data.description,
        },
      }));
    } else {
      if (res.status === 401 || res.status === 402) {
        dispatch(verifyToken());
      } else {
        ippNotify.error(res.data.responseMessage);
        showLoader();
      }
    }
  };

  const handleRequestClose = () => {
    setState((prevState) => ({
      ...prevState,
      formDialogOpen: false,
      isEditFormSubmitDisabled: false,
      validation: {
        name: "",
        description: "",
        archiveIn: "",
        purgeIn: "",
        isEnabled: "",
      },
      errors: {},
    }));
  };
  const updateEditInBackend = async () => {
    let putDataObj = {
      name: state.validation.name,
      description: state.validation.description,
      archiveIn: parseInt(state.validation.archiveIn),
      purgeIn: parseInt(state.validation.purgeIn),
      isEnabled: isEnabledNumberReturn(state.validation.isEnabled),
      rowVersion: state.selected_EditForm_RowVersion_Value,
    };

    setState((prevState) => ({
      ...prevState,
      formDialogOpen: false,
      isEditFormSubmitDisabled: false,
      isLoading: true,
    }));

    const res = await apiputUrl(
      `/audit/events/${state.selectedEditId}`,
      putDataObj
    );
    console.log("res", res);
    if (res.data.responseCode === "200") {
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
      if (res.status === 401 || res.status === 402) {
        dispatch(verifyToken());
      } else {
        ippNotify.error(res.data.responseMessage);
        setState((prevState) => ({
          ...prevState,
          formDialogOpen: true,
        }));
        showLoader();
      }
    }
  };

  const validateProperty = ({ name, value }) => {
    var obj = {};
    if (name === "archiveIn" || name === "purgeIn") {
      const onlyNums = value.replace(/[^0-9]/g, "");

      if (onlyNums != state.validation.archiveIn) {
        obj = { [name]: onlyNums };
      } else {
        return;
      }
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

  const handleEditFormChange = (event) => {
    const { target: input } = event;

    const errors = { ...state.errors };
    const errorMessage = validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const validation = { ...state.validation };

    if (input.name === "archiveIn" || input.name === "purgeIn") {
      const onlyNums = input.value.replace(/[^0-9]/g, "");
      if (onlyNums != state.validation.archiveIn) {
        validation[input.name] = onlyNums;
      } else {
        return;
      }
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

    if (input.name === "fieldType") {
      validation["dataListId"] = "";
    } else {
      delete validation["dataListId"];
    }
  };

  const handleEditFormSubmit = (e) => {
    updateEditInBackend();
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
    apiCallParams.delete("isEnabled");

    pageURL.search = apiCallParams.toString();

    // const res = await axios.get(pageURL.href, apiInstance);

    const result = await apigetUrl(
      `/audit/events?page=${1}&limit=${state.limit}&sortBy=${
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
      if (result.status === 401 || result.status === 402) {
        dispatch(verifyToken());
      } else {
        ippNotify.error(result.data.responseMessage);
        showLoader();
      }
    }
  };

  const handleResetClick = (e) => {
    setState((prevState) => ({
      ...prevState,
      advancedSearchValidation: {
        name: "",
        isEnabled: "",
      },
    }));

    callResetData();
  };

  const onAdvancedSearchClickClean = () => {
    setState((prevState) => ({
      ...prevState,
      advancedSearchValidation: {
        name: "",
        isEnabled: "",
      },
      isAdvancedSearchValidationText: false,
      advancedSearchValidationErrors: {},
    }));
  };

  const search = async (searchURL) => {
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    console.log("searchURL:::::" + searchURL);
    apigetUrl(`/audit/events?` + searchURL)
      .then((res) => {
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
      })
      .catch((error) => {
        setState((prevState) => ({
          ...prevState,
          to: 0,
          pageCount: 0,
        }));
        setAdvancedSearchError(
          true,
          "Advanced Search Error = ",
          error.response.responseMessage
        );
      });
  };

  const isEmpty = (str) => {
    return !str || 0 === str.length;
  };

  const handleSearchClick = (e) => {
    apiCallParams.delete("name");
    apiCallParams.delete("isEnabled");
    const { name, isEnabled } = state.advancedSearchValidation;

    if (name === "" && isEnabled === "") {
      setState((prevState) => ({
        ...prevState,
        isAdvancedSearchValidationText: true,
        advancedSearchValidationErrors: {},
      }));
      return;
    } else if (name === "" || isEnabled === "") {
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

    let tempArr = [];
    if (!isEmpty(name)) tempArr.push({ name });
    if (isEnabled !== "") tempArr.push({ isEnabled });

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

    // search(pageURL.href);
    search(apiCallParams.toString());
    console.log("searchURL-123", apiCallParams.toString());
  };

  const handleAdvancedSearchOnChange = (event) => {
    const { target: input } = event;
    const errors = { ...state.advancedSearchValidationErrors };
    const errorMessage = advanceSearchValidateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const validation = { ...state.advancedSearchValidation };
    validation[input.name] = input.value;

    let isAnyFormFieldsPopulated = false;
    isAnyFormFieldsPopulated =
      validation.name !== "" || validation.isEnabled !== "";

    if (isAnyFormFieldsPopulated && isObjEmpty(errors)) {
      setState((prevState) => ({
        ...prevState,
        advancedSearchValidation: validation,
        advancedSearchValidationErrors: errors,
        isAdvancedSearchValidationText: false,
      }));
    } else if (!isAnyFormFieldsPopulated && !isObjEmpty(errors)) {
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

  const advanceSearchValidateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const propertySchema = { [name]: advancedSearchValidationSchema[name] };
    const { error } = Joi.validate(obj, propertySchema);
    return error ? error.details[0].message : null;
  };

  const getPageFromBackEnd = async (
    pageNumber,
    limit,
    temp_from,
    temp_to,
    pageCount,
    actionType
  ) => {
    const { name, isEnabled } = state.advancedSearchValidation;
    if (!isEmpty(name)) {
    } else {
      apiCallParams.delete("name");
    }
    if (isEnabled !== "") {
    } else {
      apiCallParams.delete("isEnabled");
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
      if (result.status === 401 || result.status === 402) {
        dispatch(verifyToken());
      } else {
        ippNotify.error(result.data.responseMessage);
        showLoader();
      }
    }
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
          <Dialog
            maxWidth="sm"
            open={state.formDialogOpen}
            onClose={handleRequestClose}
          >
            <DialogTitle>Edit Audit Event</DialogTitle>

            <DialogContent>
              <div className="row">
                <div className="col-lg-12">
                  <InputField
                    className="mb-4"
                    autoFocus
                    id="name"
                    error={state.errors.name}
                    helperText={state.errors.name}
                    label="Name"
                    name="name"
                    onChange={(e) => handleEditFormChange(e)}
                    value={state.validation.name}
                    fullWidth
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <InputField
                    className="mb-4"
                    id="description"
                    error={state.errors.description}
                    helperText={state.errors.description}
                    label="Description"
                    name="description"
                    onChange={(e) => handleEditFormChange(e)}
                    value={state.validation.description}
                    fullWidth
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-lg-6">
                  <InputField
                    className="mb-4"
                    id="archiveIn"
                    error={state.errors.archiveIn}
                    helperText={state.errors.archiveIn}
                    label="Archive In"
                    name="archiveIn"
                    onChange={(e) => handleEditFormChange(e)}
                    value={state.validation.archiveIn}
                    fullWidth
                    required
                  />
                </div>
                <div className="col-lg-6">
                  <InputField
                    className="mb-4"
                    id="purgeIn"
                    error={state.errors.purgeIn}
                    helperText={state.errors.purgeIn}
                    label="Purge In"
                    name="purgeIn"
                    onChange={(e) => handleEditFormChange(e)}
                    value={state.validation.purgeIn}
                    fullWidth
                    required
                  />
                </div>
              </div>

              <MuiThemeProvider theme={formLabelsTheme}>
                {state.errors.isEnabled ? (
                  <FormControl
                    variant="outlined"
                    className={classes.formControl}
                    required
                    error
                  >
                    <InputLabel id="demo-simple-select-outlined-label">
                      isEnabled
                    </InputLabel>
                    <InputSelect
                      labelId="Is Enabled"
                      id="isEnabled12"
                      name="isEnabled"
                      value={state.validation.isEnabled}
                      onChange={(event) => handleEditFormChange(event)}
                      renderValue={(value) => `${value}`}
                      label="isEnabled"
                      required
                    >
                      <MenuItem value="">
                        <em>Select</em>
                      </MenuItem>
                      <MenuItem value={"Yes"}>Yes</MenuItem>
                      <MenuItem value={"No"}>No</MenuItem>
                    </InputSelect>
                    <FormHelperText style={{ color: "red" }}>
                      {state.errors.isEnabled ? state.errors.isEnabled : " "}
                    </FormHelperText>
                  </FormControl>
                ) : (
                  <FormControl
                    variant="outlined"
                    className={classes.formControl}
                    required
                  >
                    <InputLabel id="demo-simple-select-outlined-label">
                      isEnabled
                    </InputLabel>
                    <InputSelect
                      labelId="Is Enabled"
                      id="isEnabled12"
                      name="isEnabled"
                      value={state.validation.isEnabled}
                      onChange={(event) => handleEditFormChange(event)}
                      renderValue={(value) => `${value}`}
                      label="isEnabled"
                      required
                    >
                      <MenuItem value="">
                        <em>Select</em>
                      </MenuItem>
                      <MenuItem value={"Yes"}>Yes</MenuItem>
                      <MenuItem value={"No"}>No</MenuItem>
                    </InputSelect>
                  </FormControl>
                )}
              </MuiThemeProvider>
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
                  setAdvancedSearchData={setAdvancedSearchData}
                  setResetData={setResetData}
                  numSelected={state.selected.length}
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
                  onAdvancedSearchClickClean={onAdvancedSearchClickClean}
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
                          {state.data.map((n) => {
                            const isSelected = isSelectedFunc(n.id);
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
                                <TableCell>{n.archiveIn}</TableCell>
                                <TableCell>{n.purgeIn}</TableCell>
                                <TableCell>
                                  {isEnabledTextReturn(n.isEnabled)}
                                </TableCell>

                                <TableCell padding="none">
                                  <Tooltip
                                    title={
                                      <IntlMessages id="AuditEvents.Tooltip.Edit" />
                                    }
                                  >
                                    <IconButton
                                      id={n.id}
                                      onClick={(e) => onTableEditButtonClick(e)}
                                    >
                                      <EditIcon color="primary" />
                                    </IconButton>
                                  </Tooltip>
                                  {state.auditEventId >= 1 ? (
                                    <Tooltip
                                      title={
                                        <IntlMessages id="AuditEvents.Tooltip.View" />
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
                            isLoading={state.isLoading}
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
