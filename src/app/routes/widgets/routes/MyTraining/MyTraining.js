import React, { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import keycode from "keycode";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import fetch from "cross-fetch";
import { Autocomplete } from "@material-ui/lab";
import DateFnsUtils from "@date-io/date-fns";
import InfoModal from "../Modal/Info";
import { useHistory, Link, useLocation } from "react-router-dom";
import SuccessModal from "../Modal/Success";
import ErrorModal from "../Modal/Error";
import TablePaginationComponent from "../CommonComponents/TablePaginationComponent";
import "./master.css";
import {
  ListItemIcon,
  Modal,
  makeStyles,
  CircularProgress,
  TableHead,
  TableFooter,
  TableCell,
  TableBody,
  IconButton,
  FormControl,
  Select,
  Toolbar,
  Tooltip,
  TableRow,
  TableSortLabel,
  TablePagination,
  Button,
  TextField,
  Grid,
  Card,
  Table,
  Typography,
  CardContent,
  MenuItem,
  InputLabel,
  useTheme,
} from "@material-ui/core";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import AddIcon from "@material-ui/icons/Add";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { SettingsApplicationsOutlined } from "@material-ui/icons";
import CardBox from "./../../../../../components/CardBox/index";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import EditIcon from "@material-ui/icons/Edit";

import EnhancedTableHead from "../CommonComponents/TableHeadComponent";
import EnhancedTableToolbar from "./EnhancedTableToolbar";
import { data } from "./../../../dashboard/routes/News/data";
import Joi from "joi-browser";
import { Alert, AlertTitle } from "@material-ui/lab";
import CloseIcon from "@material-ui/icons/Close";
import GetAppIcon from "@material-ui/icons/GetApp";
import moment from "moment";
import { apigetUrl, apiputUrl } from "../../../../../setup/middleware";
import VisibilityIcon from "@material-ui/icons/Visibility";
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
const perPageURL = `/otm/courses`;

const pageURL = new URL(baseURL + perPageURL);
let apiCallParams = new URLSearchParams(pageURL.search);

const api = axios.create({
  baseURL: baseURL,
});

let pageNumber = 1;

const schema = {
  policyNum: Joi.string()
    .required()
    .label("policyNum"),
  description: Joi.string()
    .required()
    .label("Description"),
  firstName: Joi.string()
    .required()
    .label("firstName"),
  middleName: Joi.string()
    .required()
    .label("middleName"),
  lastName: Joi.string()
    .required()
    .label("lastName"),
  mobileNo: Joi.string()
    .required()
    .label("mobileNo"),
  emailId: Joi.string()
    .required()
    .label("emailId"),
};

function App({ currentBaseUrl }) {
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
      page: 1,
      from: 1,
      to: state.limit,
    }));
  };

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

  const setCurrentUrl = (currentUrl) => {
    setState((prevState) => ({
      ...prevState,
      currentUrl,
    }));
  };

  const [state, setState] = useState({
    id: "",
    name: "",
    key: "",
    fieldType: "",
    isVisible: "",
    isEditable: "",
    selected: [],
    page: 1,
    limit: getRecordsPerPage(),
    rowsPerPage: 5,
    data: [],
    sortType: "asc",
    sortBy: "requestDate",
    editForm_DialogOpen: false,
    selectedEditId: "",
    selectedDeleteId: "",
    isSortAsc: true,
    from: 1,
    to: 0,
    pageCount: 0,
    deleteItem_DialogOpen: false,
    isEditForm_DataListId_Available: false,
    validation: {
      policyNum: "",
      description: "",
      firstName: "",
      middleName: "",
      lastName: "",
      mobileNo: "",
      emailId: "",
    },
    menuItem: [],
    itemName: "",
    menuItemId: "",
    searchValidation: {
      policyNum: "",
      firstName: "",
      middleName: "",
      lastName: "",
      mobileNo: "",
      emailId: "",
    },
    requestDateStartDate: null,
    requestDateEndDate: null,
    policyExpiryStartDate: null,
    policyExpiryStartDate: null,
    isPolicyExpiryDateStartDateActive: false,
    isPolicyExpiryDateEndDateDisabled: true,
    isPolicyIssueDateEndDateDisabled: true,
    isAdvancedSearchValidationText: false,

    errors: {},
    isEditFormSubmitDisabled: false,
    areAllEditFormFieldsPopulated: false,
    isNoTableDataAlertVisible: true,
    isSuccessAlert: false,
    isErrorAlert: false,
    errorMsg: "",
    successMsg: "",
    isInfoAlert: false,
    infoMsg: "",
    error: "",
    isLoading: true,
    inTableErrorMessageContent: "Unable to fetch data!",
    searchedProperty: "",
    selected_EditForm_RowVersion_Value: 1,
    isAdvancedSearchValidationText: true,
    searchActive: false,
    startdate: "",
    endDate: "",
    isAdvancedSearch: false,
    level1: "",
    level2: "",
    level3: "",
    level4: "",
    level5: "",
    level6: "",
    dataOFLocation: [],
    isAuditTimelineActive: false,
    eventId: "",
    referenceId: "",
    headCells: [
      {
        id: "ShortName",
        isActive: false,
       label:"mytraining.ShortName"
      },
      {
        id: "FullName",
        isActive: false,
        label: "mytraining.FullName",
      },
      {
        id: "Language",
        isActive: false,
        label: "mytraining.Language",
      },
      {
        id: "Status",
        isActive: false,
        label: "mytraining.Status",
      },
      {
        id: "actions",
        isActive: false,
        label: "Action",
      },
    ],
  });

  const onAdvancedSearchClick = (e) => {
    console.log("Clicked for Search");

    onAdvancedSearchClickClean();
    setState((prevState) => ({
      ...prevState,
      isAdvancedSearch: !state.isAdvancedSearch,
    }));
  };

  let tempArr = [];
  const policyissueed = null;
  const policyissuesd = null;

  const showApiData = (apiData) => {
    //console.log("apidata = ", apiData);
  };

  useEffect(() => {
    apiCallParams.set("page", state.page);
    apiCallParams.set("limit", state.limit);
    apiCallParams.set("sortBy", state.sortBy);
    apiCallParams.set("sortType", state.sortType);
    pageURL.search = apiCallParams.toString();
    setCurrentUrl(pageURL);
    // callLocalBaseURL();
  }, []);

  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      setState((prevState) => ({
        ...prevState,
        isAdvancedSearch: true,
      }));
      let date1 = location.state.endDate;
      predefinevaluecheck(date1);
    } else {
      callLocalBaseURL();
    }
  }, [location]);

  const showLoader = () => {
    setTimeout(() => {
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
      }));
    }, 1000);
  };

  const predefinevaluecheck = async (date1) => {
    let currentdate = moment(date1).format("DD-MM-yyyy");
    let month = currentdate.slice(3, 5);
    let year = currentdate.slice(6, 10);
    let finyear = "";
    if (parseInt(month) > 3) {
      finyear = year;
    } else {
      finyear = parseInt(year) - 1;
    }
    let findate = finyear + "-" + "04" + "-" + "01" + " " + "00:00:00";
    let findateformate = moment(findate).format("ddd MMM DD yyyy HH:mm:ss");
    let endateformate = moment(date1).format("ddd MMM DD yyyy HH:mm:ss");
    let enddate = new Date(endateformate);
    let startdate = new Date(findateformate);
    let searchstartdate = moment(startdate).format("DD-MM-yyyy HH:mm:ss");
    let searchenddate = moment(enddate).format("DD-MM-yyyy HH:mm:ss");
    setState((prevState) => ({
      ...prevState,
      requestDateEndDate: enddate,
      requestDateStartDate: startdate,
      isPolicyIssueDateStartDateActive: true,
      isPolicyIssueDateEndDateDisabled: false,
    }));

    const result = await apigetUrl(
      `${currentBaseUrl}?page=${state.page}&limit=${state.limit}&requestDateStartDate=${searchstartdate}&requestDateEndDate=${searchenddate}`
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
        isLoading: false,
      }));
      showApiData(result.data.dataList);
    }, 1000);
    } else {
      ippNotify.error(result.data.responseMessage);
      showLoader()
    }
  };

  const callLocalBaseURL = async () => {
    const result = await apigetUrl(
      `${currentBaseUrl}?page=${state.page}&limit=${state.limit}`
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
        isLoading:false,
      }));
      showApiData(result.data.dataList);
    }, 1000);
    } else {
      ippNotify.error(result.data.responseMessage);
      showLoader()
    }

    // adding new element in the table header
    if ((result.data.dataList || []).find((n) => n.auditEventId >= 1)) {
      let updateHeadCells = state.headCells;
      updateHeadCells.push({
        id: "timeline",
        isActive: false,
        label: "Audit Detail",
      });
      setState((prevState) => ({
        ...prevState,
        headCells: updateHeadCells,
      }));
    }
  };

  const requestSortData = async (sortBy, sortType) => {
    //debugger
    apiCallParams.set("page", state.page);
    apiCallParams.set("limit", state.limit);
    apiCallParams.set("sortBy", sortBy);
    apiCallParams.set("sortType", sortType);

    pageURL.search = apiCallParams.toString();
    setCurrentUrl(pageURL);
    const result = await apigetUrl(
      `${currentBaseUrl}?page=${state.page}&limit=${state.limit}&sortBy=${sortBy}&sortType=${sortType}`
    );
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
      showLoader()
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = state.sortBy === property && state.sortType === "desc";
    let currentSortOrder = isAsc ? "asc" : "desc";
    setState((prevState) => ({
      ...prevState,
      sortType: isAsc ? "asc" : "desc",
      sortBy: property,
    }));
    requestSortData(property, currentSortOrder);
  };

  const handleSelectAllClick = (event, checked) => {
    if (checked) {
      setState({
        selected: state.data.map((n) => n.id),
      });
      return;
    }
    setState({ selected: [] });
  };

  const requestPageLimitCountChange = async (count) => {
    //debugger
    update_to(count);
    update_from(1);

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
    }
  };

  const isSelectedFunc = (id) => {
    return state.selected.indexOf(id) !== -1;
  };

  const handleChangeRowsPerPage = (event) => {
    let target = event.target;
    setState((prevState) => ({
      ...prevState,
      limit: target.value,
      page: 1,
    }));
    requestPageLimitCountChange(target.value);
  };

  const handle_Delete_Item_RequestClose = () => {
    setState((prevState) => ({
      ...prevState,
      deleteItem_DialogOpen: false,
    }));
  };

  const handle_Edit_Form_RequestClose = () => {
    setState((prevState) => ({
      ...prevState,
      editForm_DialogOpen: false,
    }));
  };

  let history = useHistory();

  const handleRequestClose = () => {
    setState((prevState) => ({
      ...prevState,
      formDialogOpen: false,
    }));
  };

  const validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const propertySchema = {
      [name]: schema[name],
    };
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
    let { target: input } = event;
    const errors = { ...state.errors };
    const errorMessage = validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const validation = { ...state.validation };
    validation[input.name] = input.value;

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

  const onEditForm_RegExp_Change = (e) => {
    const target = e.target;
    setState((prevState) => ({
      ...prevState,
      selected_EditForm_RegExp_Value: target.value,
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

  const noDataAlert_UseStyles = makeStyles((theme) => ({
    root: {
      width: "100%",
      "& > * + *": {
        marginTop: theme.spacing(2),
      },
    },
  }));

  const noDataAlert_Classes = noDataAlert_UseStyles();

  const getSuccessUpdate = () => {
    setState((prevState) => ({
      ...prevState,
      // addFormDialogOpen: false,
      isAddFormSubmitDisabled: false,
      isSuccessAlert: true,
      successMsg: "Successfully New Data is Added",
    }));
  };

  const getErrorUpdate = (err) => {
    let error = err.response.data.responseMessage;
    let errMessage = error.slice(10);
    setState((prevState) => ({
      ...prevState,
      errorMsg: errMessage,
      isErrorAlert: true,
    }));
  };

  const setSearchedProperty = (searchProperty) => {
    setState((prevState) => ({
      ...prevState,
      searchedProperty: searchProperty,
    }));
  };

  const handleInputChange = (event) => {
    const { target: input } = event;
    const errors = { ...state.errors };
    const errorMessage = validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const searchValidation = {
      ...state.searchValidation,
    };
    searchValidation[input.name] = input.value;

    let isAnyFormFieldsPopulated = false;
    isAnyFormFieldsPopulated =
      searchValidation.policyNum !== "" || searchValidation.description !== "";

    setState((prevState) => ({
      ...prevState,
      errors,
      searchValidation,
      isAdvancedSearchValidationText:
        isAnyFormFieldsPopulated && isObjEmpty(errors),
    }));
  };
  const handlingDefaultValue = () => {};

  const handler = (id, value) => {
    console.log("level", id, value);
    if (value === "Zone") {
      setState((prevState) => ({
        ...prevState,
        level1: id,
      }));
    }
    if (value === "State") {
      setState((prevState) => ({
        ...prevState,
        level2: id,
      }));
    }
    if (value === "Cluster") {
      setState((prevState) => ({
        ...prevState,
        level3: id,
      }));
    }
    if (value === "District") {
      setState((prevState) => ({
        ...prevState,
        level4: id,
      }));
    }
    if (value === "City") {
      setState((prevState) => ({
        ...prevState,
        level5: id,
      }));
    }
    if (value === "Area") {
      setState((prevState) => ({
        ...prevState,
        level6: id,
      }));
    }
  };

  const handleSearchClick = (e) => {
    apiCallParams.delete("requestDateStartDate");
    apiCallParams.delete("requestDateEndDate");
    apiCallParams.delete("firstName");
    apiCallParams.delete("middleName");
    apiCallParams.delete("lastName");
    apiCallParams.delete("mobileNo");
    apiCallParams.delete("emailId");
    apiCallParams.delete("level1");
    apiCallParams.delete("level2");
    apiCallParams.delete("level3");
    apiCallParams.delete("level4");
    apiCallParams.delete("level5");
    apiCallParams.delete("level6");
    setState((prevState) => ({
      ...prevState,
      isAdvancedSearchValidationText: true,
      errors: {},
    }));

    e.preventDefault();

    const {
      policyNum,
      key,
      fieldType,
      isEditable,
      firstName,
      middleName,
      lastName,
      mobileNo,
      emailId,
    } = state.searchValidation;
    const { level1, level2, level3, level4, level5, level6 } = state;

    const requestDateformatStartDate = moment(
      state.requestDateStartDate
    ).format("DD-MM-yyyy HH:mm:ss");
    const requestDateformatEndDate = moment(state.policyIssueEndDate).format(
      "DD-MM-yyyy HH:mm:ss"
    );

    tempArr.length = 0;

    if (!isEmpty(level1)) tempArr.push({ level1 });
    if (!isEmpty(level2)) tempArr.push({ level2 });
    if (!isEmpty(level3)) tempArr.push({ level3 });
    if (!isEmpty(level4)) tempArr.push({ level4 });
    if (!isEmpty(level5)) tempArr.push({ level5 });
    if (!isEmpty(level6)) tempArr.push({ level6 });
    if (!isEmpty(policyNum)) tempArr.push({ policyNum });
    if (!isEmpty(key)) tempArr.push({ key });
    if (!isEmpty(fieldType)) tempArr.push({ fieldType });
    if (!isEmpty(isEditable)) tempArr.push({ isEditable });
    if (!isEmpty(firstName)) tempArr.push({ firstName });
    if (!isEmpty(middleName)) tempArr.push({ middleName });
    if (!isEmpty(lastName)) tempArr.push({ lastName });
    if (!isEmpty(mobileNo)) tempArr.push({ mobileNo });
    if (!isEmpty(emailId)) tempArr.push({ emailId });
    if (!isEmpty(state.requestDateStartDate))
      tempArr.push({
        requestDateStartDate: requestDateformatStartDate,
      });
    if (!isEmpty(state.requestDateEndDate))
      tempArr.push({
        requestDateEndDate: requestDateformatEndDate,
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

  const isEmpty = (str) => {
    return !str || 0 === str.length;
  };

  const getPageFromBackEnd = async (pageNumber, limit) => {
    //debugger
    setState((prevState) => ({
      ...prevState,
      page: pageNumber,
    }));

    apiCallParams.set("page", pageNumber);
    apiCallParams.set("limit", limit);

    pageURL.search = apiCallParams.toString();
    let getUrl = pageURL.pathname + pageURL.search;
    const result = await apigetUrl(`${getUrl}`);
    if (result.data.responseCode === "200") {
      setTimeout(() => {
      setPageData(result.data.dataList);
      setPageNumber(result.data.pagination.page);
      setPageCount(result.data.pagination.count);
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
      }));
    }, 1000);
    } else {
      ippNotify.error(result.data.responseMessage);
      showLoader()
    }
  };

  const search = async (searchURL) => {
    const result = await apigetUrl(`${currentBaseUrl}?` + searchURL);
    if (result.data.responseCode === "200") {
      setTimeout(() => {
      setAdvancedSearchData(result.data.dataList);
      showApiData(result.data.dataList);

      setPageNumber(result.data.pagination.page);
      setPageCount(result.data.pagination.count);
      setState((prevState) => ({
        ...prevState,
        isInfoAlert: false,
        isLoading: false,
      }));
    }, 1000);
    } else {
      setState((prevState) => ({
        ...prevState,

        isInfoAlert: true,
        infoMsg: "Your query did not match any results",
        to: 0,
        pageCount: 0,
      }));
    }
  };

  const callResetData = async () => {
    apiCallParams.set("page", 1);
    apiCallParams.set("limit", state.limit);
    apiCallParams.set("sortBy", state.sortBy);
    apiCallParams.set("sortType", state.sortType);

    apiCallParams.delete("requestDateStartDate");
    apiCallParams.delete("requestDateEndDate");
    apiCallParams.delete("firstName");
    apiCallParams.delete("middleName");
    apiCallParams.delete("lastName");
    apiCallParams.delete("mobileNo");
    apiCallParams.delete("emailId");
    apiCallParams.delete("level1");
    apiCallParams.delete("level2");
    apiCallParams.delete("level3");
    apiCallParams.delete("level4");
    apiCallParams.delete("level5");
    apiCallParams.delete("level6");

    pageURL.search = apiCallParams.toString();
    const result = await apigetUrl(
      `${currentBaseUrl}?page=${1}&limit=${state.limit}&sortBy=${
        state.sortBy
      }&sortType=${state.sortType}`
    );
    if (result.data.responseCode === "200") {
      setTimeout(() => {
      setState((prevState) => ({
        ...prevState,
        searchValidation: {
          policyNum: "",
          firstName: "",
          middleName: "",
          lastName: "",
          mobileNo: "",
          emailId: "",
        },
        requestDateStartDate: null,
        requestDateEndDate: null,
        policyExpiryStartDate: null,
        policyExpiryEndDate: null,
        isPolicyIssueDateStartDateActive: false,
        isPolicyIssueDateEndDateDisabled: true,
        isPolicyExpiryDateStartDateActive: false,
        isPolicyExpiryDateEndDateDisabled: true,
        isInfoAlert: false,
        isAdvancedSearchValidationText: true,
        errors: {},
        level1: "",
        level2: "",
        level3: "",
        level4: "",
        dataOFLocation: [1],
        isLoading: false,
      }));
      setResetData(result.data.dataList);
      setPageNumber(1);
      setPageCount(result.data.pagination.count);
      setCurrentUrl(pageURL);
    }, 1000);
    } else {
      ippNotify.error(result.data.responseMessage);
      showLoader()
    }
  };

  const onAdvancedSearchClickClean = () => {
    setState((prevState) => ({
      ...prevState,
      searchValidation: {
        policyNum: "",
        policyIssueStartDate: null,
        policyIssueEndDate: null,
        policyExpiryStartDate: null,
        policyExpiryEndDate: null,
      },
      dataOFLocation: [],
      isAdvancedSearchValidationText: true,
      errors: {},
    }));
  };

  const filedownloadlink = (event) => {
    const url = event.currentTarget.id;
    window.open(url, "_blank");
  };

  const handlePolicyIssueDateStartDate = (date) => {
    setState((prevState) => ({
      ...prevState,

      policyIssueStartDate: date,
      isPolicyIssueDateStartDateActive: true,
      isPolicyIssueDateEndDateDisabled: false,
    }));
  };

  const handlePolicyIssueDateEndDate = (date) => {
    setState((prevState) => ({
      ...prevState,
      policyIssueEndDate: date,
    }));
  };

  const handlePolicyExpiryDateStartDate = (date) => {
    setState((prevState) => ({
      ...prevState,
      requestDateStartDate: date,
      isPolicyExpiryDateStartDateActive: true,
      isPolicyExpiryDateEndDateDisabled: false,
    }));
  };

  const handlePolicyExpiryDateEndDate = (date) => {
    setState((prevState) => ({
      ...prevState,
      requestDateEndDate: date,
    }));
  };

  const onTableViewButtonClick = (event) => {
    // let currentTarget = event.currentTarget.id;
    // history.push({
    //   pathname: "/app/wireframes/health/quotes/",
    //   state: { id: currentTarget },
    // });
  };

  // To call the Audit Timeline
  const onTableViewClick = (e, eventId) => {
    apigetUrl(
      `/audit/details?page=1&limit=100&sortBy=when&sortType=desc&eventId=${eventId}`
    )
      .then((res) => {
        setState((prevState) => ({
          ...prevState,
          eventId: eventId,
          referenceId: (res.data.dataList[0] || {}).referenceId,
          isAuditTimelineActive: true,
        }));
      })
      .catch((err) => console.log("Err", err));
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
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <div></div>

              <div className="row">
                <div className="col-lg-4"></div>
                <div className="col-lg-4"></div>
                <div className="col-lg-4">
                  <IPPNotification />
                </div>
              </div>
              <div className="audit-master-box">
                <EnhancedTableToolbar
                  numSelected={state.selected.length}
                  page={state.page}
                  limit={state.limit}
                  sortBy={state.sortBy}
                  sortType={state.sortType}
                  onAdvancedSearchClick={onAdvancedSearchClick}
                  isAdvancedSearch={state.isAdvancedSearch}
                  setAdvancedSearchData={setAdvancedSearchData}
                  setResetData={setResetData}
                  getSuccessUpdate={getSuccessUpdate}
                  getErrorUpdate={getErrorUpdate}
                  callLocalBaseURL={callLocalBaseURL}
                  setAdvancedSearchError={setAdvancedSearchError}
                  setSearchedProperty={setSearchedProperty}
                  setCurrentUrl={setCurrentUrl}
                  handleInputChange={handleInputChange}
                  validation={state.validation}
                  errors={state.errors}
                  handleSearchClick={handleSearchClick}
                  isAdvancedSearchValidationText={
                    state.isAdvancedSearchValidationText
                  }
                  callResetData={callResetData}
                  search={search}
                  searchValidation={state.searchValidation}
                  requestDateStartDate={state.requestDateStartDate}
                  requestDateEndDate={state.requestDateEndDate}
                  isPolicyIssueDateEndDateDisabled={
                    state.isPolicyIssueDateEndDateDisabled
                  }
                  policyExpiryStartDate={state.policyExpiryStartDate}
                  policyExpiryEndDate={state.policyExpiryEndDate}
                  isPolicyExpiryDateEndDateDisabled={
                    state.isPolicyExpiryDateEndDateDisabled
                  }
                  onAdvancedSearchClickClean={onAdvancedSearchClickClean}
                  handlePolicyIssueDateStartDate={
                    handlePolicyIssueDateStartDate
                  }
                  handlePolicyIssueDateEndDate={handlePolicyIssueDateEndDate}
                  handlePolicyExpiryDateEndDate={handlePolicyExpiryDateEndDate}
                  handlePolicyExpiryDateStartDate={
                    handlePolicyExpiryDateStartDate
                  }
                  dataOFLocation={state.dataOFLocation}
                  handler={handler}
                  handlingDefaultValue={handlingDefaultValue}
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
                              <TableRow key={n.id}>
                                   <TableCell>
                                   {n.shortName}
                                 </TableCell>
                                 <TableCell>
                                   {n.fullName}
                                 </TableCell>
                                
                                 <TableCell>
                                   {n.language}
                                 </TableCell>
                                 <TableCell>
                                   {n.progress} %
                                 </TableCell>
                                <TableCell padding="none">
                                  <Tooltip title="View Quotes">
                                    <IconButton
                                      style={{ marginLeft: "10%" }}
                                      id={n.id}
                                      onClick={(e) => onTableViewButtonClick(e)}
                                    >
                                      <VisibilityIcon color="primary" />
                                    </IconButton>
                                  </Tooltip>
                                </TableCell>
                                {n.auditEventId >= 1 ? (
                                  <>
                                    <TableCell padding="none">
                                      <Tooltip title="View Audit Timeline">
                                        <IconButton
                                          style={{ marginLeft: "10%" }}
                                          onClick={(e) =>
                                            onTableViewClick(e, n.auditEventId)
                                          }
                                        >
                                          <Visibility color="primary" />
                                        </IconButton>
                                      </Tooltip>
                                    </TableCell>
                                  </>
                                ) : null}
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
      )}
    </>
  );
}

export default App;
