import React, { useState, useEffect } from "react";
import InfoModal from "../Modal/Info";
import { useHistory, useLocation } from "react-router-dom";
import TablePaginationComponent from "../CommonComponents/TablePaginationComponent";
import "./master.css";
import {
  TableFooter,
  TableCell,
  TableBody,
  IconButton,
  Tooltip,
  TableRow,
  Grid,
  Table,
} from "@material-ui/core";
import EnhancedTableHead from "../CommonComponents/TableHeadComponent";
import EnhancedTableToolbar from "./EnhancedTableToolbar";
import Joi from "joi-browser";
import moment from "moment";
import { apigetUrl } from "../../../../../setup/middleware";
import { useDispatch } from "react-redux";
import { verifyToken } from "../../../../../actions/Auth";
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
import IntlMessages from "util/IntlMessages";

//base url
const baseURL = `${process.env.REACT_APP_BASE_URL}`;

//page number
let pageNumber = 1;

//schema for advance search
const schema = {
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
  const perPageURL = `${currentBaseUrl}`;
  const pageURL = new URL(baseURL + perPageURL);
  const dispatch = useDispatch();
  let history = useHistory();

  let apiCallParams = new URLSearchParams(pageURL.search);

  //set Advanced Search Data
  const setAdvancedSearchData = (data) => {
    setState((prevState) => ({
      ...prevState,
      data: data,
      page: 1,
      from: 1,
      to: state.limit,
    }));
  };

  //set Reset Data
  const setResetData = (data) => {
    setState((prevState) => ({
      ...prevState,
      data: data,
      page: 1,
      from: 1,
      to: state.limit,
    }));
  };

  //set Advanced Search Error
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

  //set Current Url
  const setCurrentUrl = (currentUrl) => {
    setState((prevState) => ({
      ...prevState,
      currentUrl,
    }));
  };

  //state
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
    isLoading: true,
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
    isrequestEndDateDisabled: true,
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
        id: "firstName",
        isActive: true,
        label: "EnquiryList.master.tableheader.firstName.label",
      },
      {
        id: "middleName",
        isActive: true,
        label: "EnquiryList.master.tableheader.middleName.label",
      },
      {
        id: "lastName",
        isActive: true,
        label: "EnquiryList.master.tableheader.lastName.label",
      },
      {
        id: "mobileNo",
        isActive: true,
        label: "EnquiryList.master.tableheader.mobileNo.label",
      },
      {
        id: "emailId",
        isActive: true,
        label: "EnquiryList.master.tableheader.emailId.label",
      },
      {
        id: "requestDate",
        isActive: true,
        label: "EnquiryList.master.tableheader.requestDate.label",
      },
      {
        id: "actions",
        isActive: false,
        label: "EnquiryList.master.tableheader.action.label",
      },
    ],
  });

  //on Advanced Search Click
  const onAdvancedSearchClick = (e) => {
    onAdvancedSearchClickClean();
    setState((prevState) => ({
      ...prevState,
      isAdvancedSearch: !state.isAdvancedSearch,
    }));
  };

  let tempArr = [];

  useEffect(() => {
    apiCallParams.set("page", state.page);
    apiCallParams.set("limit", state.limit);
    apiCallParams.set("sortBy", state.sortBy);
    apiCallParams.set("sortType", state.sortType);
    pageURL.search = apiCallParams.toString();
    setCurrentUrl(pageURL);
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

  //loader
  const showLoader = () => {
    setTimeout(() => {
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
      }));
    }, 1000);
  };

  //predefine value check
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
    }));

    const result = await apigetUrl(
      `${currentBaseUrl}?page=${state.page}&limit=${state.limit}&requestStartdate=${searchstartdate}&requestEndDate=${searchenddate}`
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

  //default function on page load
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

  //request Sort Data Function
  const requestSortData = async (sortBy, sortType) => {
    apiCallParams.set("page", state.page);
    apiCallParams.set("limit", state.limit);
    apiCallParams.set("sortBy", sortBy);
    apiCallParams.set("sortType", sortType);
    const {
      firstName,
      middleName,
      lastName,
      mobileNo,
      emailId,
    } = state.searchValidation;
    const { level1, level2, level3, level4, level5, level6 } = state;
    if (!isEmpty(level1)) {
      apiCallParams.set("level1", level1);
    } else {
      apiCallParams.delete("level1");
    }
    if (!isEmpty(level2)) {
      apiCallParams.set("level2", level2);
    } else {
      apiCallParams.delete("level2");
    }
    if (!isEmpty(level3)) {
      apiCallParams.set("level3", level3);
    } else {
      apiCallParams.delete("level3");
    }
    if (!isEmpty(level4)) {
      apiCallParams.set("level4", level4);
    } else {
      apiCallParams.delete("level4");
    }
    if (!isEmpty(level5)) {
      apiCallParams.set("level5", level5);
    } else {
      apiCallParams.delete("level5");
    }
    if (!isEmpty(level6)) {
      apiCallParams.set("level6", level6);
    } else {
      apiCallParams.delete("level6");
    }
    if (!isEmpty(firstName)) {
      apiCallParams.set("firstName", firstName);
    } else {
      apiCallParams.delete("firstName");
    }
    if (!isEmpty(middleName)) {
      apiCallParams.set("middleName", middleName);
    } else {
      apiCallParams.delete("middleName");
    }
    if (!isEmpty(lastName)) {
      apiCallParams.set("lastName", lastName);
    } else {
      apiCallParams.delete("lastName");
    }
    if (!isEmpty(mobileNo)) {
      apiCallParams.set("mobileNo", mobileNo);
    } else {
      apiCallParams.delete("mobileNo");
    }
    if (!isEmpty(emailId)) {
      apiCallParams.set("emailId", emailId);
    } else {
      apiCallParams.delete("emailId");
    }
    if (!isEmpty(state.requestDateStartDate)) {
      let requestDateformatStateDate = moment(state.requestDateStartDate).format("DD-MM-yyyy HH:mm:ss");
      apiCallParams.set("requestStartdate", requestDateformatStateDate);
    } else {
      apiCallParams.delete("requestStartdate");
    }
    if (!isEmpty(state.requestDateEndDate)) {
      let requestDateformatEndDate = moment(state.requestDateEndDate).format("DD-MM-yyyy HH:mm:ss");
      apiCallParams.set("requestEndDate", requestDateformatEndDate);
    } else {
      apiCallParams.delete("requestEndDate");
    }
    let searchParam = apiCallParams.toString();
    pageURL.search = apiCallParams.toString();
    setCurrentUrl(pageURL);
    const result = await apigetUrl(`${currentBaseUrl}?` + searchParam);
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

  //handle Request Sort
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

  //request Page Limit Count Change
  const requestPageLimitCountChange = async (count) => {
    let res = "";
    apiCallParams.set("page", 1);
    apiCallParams.set("limit", count);
    apiCallParams.set("sortBy", state.sortBy);
    apiCallParams.set("sortType", state.sortType);
    const {
      firstName,
      middleName,
      lastName,
      mobileNo,
      emailId,
    } = state.searchValidation;
    const { level1, level2, level3, level4, level5, level6 } = state;
    if (!isEmpty(level1)) {
      apiCallParams.set("level1", level1);
    } else {
      apiCallParams.delete("level1");
    }
    if (!isEmpty(level2)) {
      apiCallParams.set("level2", level2);
    } else {
      apiCallParams.delete("level2");
    }
    if (!isEmpty(level3)) {
      apiCallParams.set("level3", level3);
    } else {
      apiCallParams.delete("level3");
    }
    if (!isEmpty(level4)) {
      apiCallParams.set("level4", level4);
    } else {
      apiCallParams.delete("level4");
    }
    if (!isEmpty(level5)) {
      apiCallParams.set("level5", level5);
    } else {
      apiCallParams.delete("level5");
    }
    if (!isEmpty(level6)) {
      apiCallParams.set("level6", level6);
    } else {
      apiCallParams.delete("level6");
    }
    if (!isEmpty(firstName)) {
      apiCallParams.set("firstName", firstName);
    } else {
      apiCallParams.delete("firstName");
    }
    if (!isEmpty(middleName)) {
      apiCallParams.set("middleName", middleName);
    } else {
      apiCallParams.delete("middleName");
    }
    if (!isEmpty(lastName)) {
      apiCallParams.set("lastName", lastName);
    } else {
      apiCallParams.delete("lastName");
    }
    if (!isEmpty(mobileNo)) {
      apiCallParams.set("mobileNo", mobileNo);
    } else {
      apiCallParams.delete("mobileNo");
    }
    if (!isEmpty(emailId)) {
      apiCallParams.set("emailId", emailId);
    } else {
      apiCallParams.delete("emailId");
    }
    if (!isEmpty(state.requestDateStartDate)) {
      let requestDateformatStateDate = moment(state.requestDateStartDate).format("DD-MM-yyyy HH:mm:ss");
      apiCallParams.set("requestStartdate", requestDateformatStateDate);
    } else {
      apiCallParams.delete("requestStartdate");
    }
    if (!isEmpty(state.requestDateEndDate)) {
      let requestDateformatEndDate = moment(state.requestDateEndDate).format("DD-MM-yyyy HH:mm:ss");
      apiCallParams.set("requestEndDate", requestDateformatEndDate);
    } else {
      apiCallParams.delete("requestEndDate");
    }
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

  const isSelectedFunc = (id) => {
    return state.selected.indexOf(id) !== -1;
  };

  //handle Change Rows PerPage
  const handleChangeRowsPerPage = (event) => {
    let target = event.target;
    setState((prevState) => ({
      ...prevState,
      page: 1,
      isLoading: true,
    }));
    requestPageLimitCountChange(target.value);
  };

  //validate Schema
  const validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const propertySchema = {
      [name]: schema[name],
    };
    const { error } = Joi.validate(obj, propertySchema);
    return error ? error.details[0].message : null;
  };

  //empty string
  function isObjEmpty(obj) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }

    return JSON.stringify(obj) === JSON.stringify({});
  }

  //set Page Data
  const setPageData = (data) => {
    setState((prevState) => ({
      ...prevState,
      data: data,
    }));
  };

  //set Page Number
  const setPageNumber = (pageNumber) => {
    setState((prevState) => ({
      ...prevState,
      page: pageNumber,
    }));
  };

  //set Page Count
  const setPageCount = (pageCount) => {
    setState((prevState) => ({
      ...prevState,
      pageCount: pageCount,
    }));
  };

  //update to
  const update_to = (to) => {
    setState((prevState) => ({
      ...prevState,
      to: to,
    }));
  };

  //update from
  const update_from = (from) => {
    setState((prevState) => ({
      ...prevState,
      from: from,
    }));
  };

  //set Searched Property
  const setSearchedProperty = (searchProperty) => {
    setState((prevState) => ({
      ...prevState,
      searchedProperty: searchProperty,
    }));
  };

  //handle Input Change
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

  //location filer
  const handler = (id, value) => {
    if (value === "Zone") {
      setState((prevState) => ({
        ...prevState,
        level4: id,
      }));
    }
    if (value === "State") {
      setState((prevState) => ({
        ...prevState,
        level3: id,
      }));
    }
    if (value === "Cluster") {
      setState((prevState) => ({
        ...prevState,
        level2: id,
      }));
    }
    if (value === "District") {
      setState((prevState) => ({
        ...prevState,
        level1: id,
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

  //handle Search Click
  const handleSearchClick = (e) => {
    apiCallParams.delete("requestStartdate");
    apiCallParams.delete("requestEndDate");
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
    if (!isEmpty(firstName)) tempArr.push({ firstName });
    if (!isEmpty(middleName)) tempArr.push({ middleName });
    if (!isEmpty(lastName)) tempArr.push({ lastName });
    if (!isEmpty(mobileNo)) tempArr.push({ mobileNo });
    if (!isEmpty(emailId)) tempArr.push({ emailId });
    if (!isEmpty(state.requestDateStartDate))
      tempArr.push({
        requestStartDate: requestDateformatStartDate,
      });
    if (!isEmpty(state.requestDateEndDate))
      tempArr.push({
        requestEndDate: requestDateformatEndDate,
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

  //check empty string in advance string
  const isEmpty = (str) => {
    return !str || 0 === str.length;
  };

  //get Page From BackEnd
  const getPageFromBackEnd = async (
    pageNumber,
    limit,
    temp_from,
    temp_to,
    pageCount,
    actionType
  ) => {
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    apiCallParams.set("page", pageNumber);
    apiCallParams.set("limit", limit);
    const {
      firstName,
      middleName,
      lastName,
      mobileNo,
      emailId,
    } = state.searchValidation;
    const { level1, level2, level3, level4, level5, level6 } = state;
    if (!isEmpty(level1)) {
      apiCallParams.set("level1", level1);
    } else {
      apiCallParams.delete("level1");
    }
    if (!isEmpty(level2)) {
      apiCallParams.set("level2", level2);
    } else {
      apiCallParams.delete("level2");
    }
    if (!isEmpty(level3)) {
      apiCallParams.set("level3", level3);
    } else {
      apiCallParams.delete("level3");
    }
    if (!isEmpty(level4)) {
      apiCallParams.set("level4", level4);
    } else {
      apiCallParams.delete("level4");
    }
    if (!isEmpty(level5)) {
      apiCallParams.set("level5", level5);
    } else {
      apiCallParams.delete("level5");
    }
    if (!isEmpty(level6)) {
      apiCallParams.set("level6", level6);
    } else {
      apiCallParams.delete("level6");
    }
    if (!isEmpty(firstName)) {
      apiCallParams.set("firstName", firstName);
    } else {
      apiCallParams.delete("firstName");
    }
    if (!isEmpty(middleName)) {
      apiCallParams.set("middleName", middleName);
    } else {
      apiCallParams.delete("middleName");
    }
    if (!isEmpty(lastName)) {
      apiCallParams.set("lastName", lastName);
    } else {
      apiCallParams.delete("lastName");
    }
    if (!isEmpty(mobileNo)) {
      apiCallParams.set("mobileNo", mobileNo);
    } else {
      apiCallParams.delete("mobileNo");
    }
    if (!isEmpty(emailId)) {
      apiCallParams.set("emailId", emailId);
    } else {
      apiCallParams.delete("emailId");
    }
    if (!isEmpty(state.requestDateStartDate)) {
      let requestDateformatStateDate = moment(state.requestDateStartDate).format("DD-MM-yyyy HH:mm:ss");
      apiCallParams.set("requestStartdate", requestDateformatStateDate);
    } else {
      apiCallParams.delete("requestStartdate");
    }
    if (!isEmpty(state.requestDateEndDate)) {
      let requestDateformatEndDate = moment(state.requestDateEndDate).format("DD-MM-yyyy HH:mm:ss");
      apiCallParams.set("requestEndDate", requestDateformatEndDate);
    } else {
      apiCallParams.delete("requestEndDate");
    }
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

  //search
  const search = async (searchURL) => {
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    const result = await apigetUrl(`${currentBaseUrl}?` + searchURL);
    if (result.data.responseCode === "200") {
      setTimeout(() => {
        setAdvancedSearchData(result.data.dataList);
        setPageNumber(result.data.pagination.page);
        setPageCount(result.data.pagination.count);
        setState((prevState) => ({
          ...prevState,
          isInfoAlert: false,
          isLoading: false,
        }));
      }, 1000);
    } else {
      if (result.status === 401 || result.status === 402) {
        dispatch(verifyToken());
      } else {
        setState((prevState) => ({
          ...prevState,

          isInfoAlert: true,
          infoMsg: "Your query did not match any results",
          to: 0,
          pageCount: 0,
          isLoading: false,
        }));
      }
    }
  };

  //call Reset Data
  const callResetData = async () => {
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    apiCallParams.set("page", 1);
    apiCallParams.set("limit", state.limit);
    apiCallParams.set("sortBy", state.sortBy);
    apiCallParams.set("sortType", state.sortType);
    apiCallParams.delete("requestStartDate");
    apiCallParams.delete("requestEndDate");
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
      `${currentBaseUrl}?page=${1}&limit=${state.limit}`
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
          isrequestEndDateDisabled: true,
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
      if (result.status === 401 || result.status === 402) {
        dispatch(verifyToken());
      } else {
        ippNotify.error(result.data.responseMessage);
        showLoader();
      }
    }
  };

  //on Advanced Search Click Clean
  const onAdvancedSearchClickClean = () => {
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
      dataOFLocation: [],
      isAdvancedSearchValidationText: true,
      errors: {},
    }));
  };

  //handle request Start Date
  const handlerequestStartDate = (date) => {
    setState((prevState) => ({
      ...prevState,
      requestDateStartDate: date,
      isrequestEndDateDisabled: false,
    }));
  };

  //handle request EndDate
  const handlerequestEndDate = (date) => {
    setState((prevState) => ({
      ...prevState,
      requestDateEndDate: date,
    }));
  };

  //redirect to quotes page
  const onTableViewButtonClick = (event) => {
    let currentTarget = event.currentTarget.id;
    history.push({
      pathname: "/app/wireframes/health/quotes/",
      state: { id: currentTarget },
    });
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

  //page
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
                  isrequestEndDateDisabled={state.isrequestEndDateDisabled}
                  onAdvancedSearchClickClean={onAdvancedSearchClickClean}
                  handlerequestEndDate={handlerequestEndDate}
                  handlerequestStartDate={handlerequestStartDate}
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
                                  {n.customer.map((n) => n.firstName)}
                                </TableCell>
                                <TableCell>
                                  {n.customer.map((n) => n.middleName)}
                                </TableCell>
                                <TableCell>
                                  {n.customer.map((n) => n.lastName)}
                                </TableCell>
                                <TableCell>
                                  {n.customer.map((n) => n.mobileNo)}
                                </TableCell>
                                <TableCell>
                                  {n.customer.map((n) => n.emailId)}
                                </TableCell>
                                <TableCell>{n.requestDate}</TableCell>
                                <TableCell padding="none">
                                  <Tooltip
                                    title={
                                      <IntlMessages id="EnquiryList.Tooltip.View" />
                                    }
                                  >
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
