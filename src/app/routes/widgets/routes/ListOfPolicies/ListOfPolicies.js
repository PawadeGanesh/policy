import React, { useState, useEffect } from "react";
import axios from "axios";
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
import GetAppIcon from "@material-ui/icons/GetApp";
import moment from "moment";
import { apigetUrl } from "../../../../../setup/middleware";
import apiInstance from "../../../../../setup/index";
import {
  IPPNotification,
  ippNotify,
} from "../CommonComponents/IPPNotification";
import { getRecordsPerPage } from "../../../../../setup/ApplicatoinConfigurations.js";
import "../CommonComponents/tableStyle.css";
import { currencyFormater } from "../CommonComponents/formater";
import AuditTimeline from "../CommonComponents/AuditTimeline/AuditTimeline";
import { Visibility } from "@material-ui/icons";
import Loader from "../CommonComponents/Loader";
import IntlMessages from "util/IntlMessages";
import { useDispatch, useSelector } from "react-redux";
import { verifyToken } from "../../../../../actions/Auth";

const baseURL = `${process.env.REACT_APP_BASE_URL}`;

let pageNumber = 1;

//schema
const schema = {
  policyNum: Joi.string()
    .required()
    .label("policyNum"),
};

function App({ currentBaseUrl }) {
  const perPageURL = `${currentBaseUrl}`;
  const pageURL = new URL(baseURL + perPageURL);
  const dispatch = useDispatch();
  let apiCallParams = new URLSearchParams(pageURL.search);

  const location = useLocation();
  let history = useHistory();

  //Set Advanced Search Data
  const setAdvancedSearchData = (data) => {
    setState((prevState) => ({
      ...prevState,
      data: data,
      page: 1,
      from: 1,
      to: state.limit,
    }));
  };

  //Set Reset Data
  const setResetData = (data) => {
    setState((prevState) => ({
      ...prevState,
      data: data,
      page: 1,
      from: 1,
      to: state.limit,
    }));
  };

  //Set Advanced Search Error
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

  //Set Current Url
  const setCurrentUrl = (currentUrl) => {
    setState((prevState) => ({
      ...prevState,
      currentUrl,
    }));
  };

  const [state, setState] = useState({
    isAdvancedSearch: false,
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
    sortBy: "issueDate",
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
    },
    menuItem: [],
    itemName: "",
    menuItemId: "",
    searchValidation: {
      policyNum: "",
    },
    policyType: "",
    policyIssueStartDate: null,
    policyIssueEndDate: null,
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
    isLoading: false,
    inTableErrorMessageContent: "Unable to fetch data!",
    searchedProperty: "",
    selected_EditForm_RowVersion_Value: 1,
    isAdvancedSearchValidationText: true,
    searchActive: false,
    startdate: "",
    endDate: "",

    isAdvancedSearch: false,
    dataOFLocation: [],
    level1: "",
    level2: "",
    level3: "",
    level4: "",
    level5: "",
    level6: "",
    isAuditTimelineActive: false,
    eventId: "",
    referenceId: "",
    auditEventId: "",
    isLoading: true,
    headCells: [
      {
        id: "policyNum",
        isActive: true,
        label: "ListOfPolicies.master.tableheader.policyNum.label",
      },
      {
        id: "issueDate",
        isActive: true,
        label: "ListOfPolicies.master.tableheader.policyIssueDate.label",
      },
      {
        id: "expireDate",
        isActive: true,
        label: "ListOfPolicies.master.tableheader.policyExpiryDate.label",
      },
      {
        id: "premiumAmount",
        isActive: false,
        label: "ListOfPolicies.master.tableheader.premiumAmount.label",
      },
      {
        id: "taxAmount",
        isActive: false,
        label: "ListOfPolicies.master.tableheader.taxAmount.label",
      },
      {
        id: "type",
        isActive: false,
        label: "ListOfPolicies.master.tableheader.type.label",
      },
      {
        id: "policyLink",
        isActive: false,
        label: "ListOfPolicies.master.tableheader.policyLink.label",
      },
      {
        id: "scheduleLink",
        isActive: false,
        label: "ListOfPolicies.master.tableheader.scheduleLink.label",
      },
    ],
  });

  let tempArr = [];

  const handlingDefaultValue = () => {};

  const showLoader = () => {
    setTimeout(() => {
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
      }));
    }, 1000);
  };

  //Checking For Predefine Value
  useEffect(() => {
    if (location.state) {
      //debugger
      setState((prevState) => ({
        ...prevState,
        isAdvancedSearch: true,
        dataOFLocation: location.state.locationData,
      }));
      let dataOFLocation = location.state.locationData;
      let date1 = location.state.endDate;
      let typepredefinevalue = location.state.type;

      setState((prevState) => ({
        ...prevState,

        policyType: typepredefinevalue,
      }));
      predefinevaluecheck(date1, typepredefinevalue, dataOFLocation);
    } else {
      apiCallParams.set("page", state.page);
      apiCallParams.set("limit", state.limit);
      apiCallParams.set("sortBy", state.sortBy);
      apiCallParams.set("sortType", state.sortType);
      pageURL.search = apiCallParams.toString();
      setCurrentUrl(pageURL);
      callLocalBaseURL();
    }
  }, [location]);

  //Predefine Value Functionality
  const predefinevaluecheck = async (date1, typepredefinevalue, location) => {
    //debugger
    let policyTypeValue = parseInt(typepredefinevalue);
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
      policyIssueEndDate: enddate,
      policyIssueStartDate: startdate,
      isPolicyIssueDateStartDateActive: true,
      isPolicyIssueDateEndDateDisabled: false,
    }));
    if (
      typepredefinevalue === NaN ||
      typepredefinevalue === "" ||
      typepredefinevalue === null ||
      typepredefinevalue === undefined
    ) {
      const result = await apigetUrl(
        `${currentBaseUrl}?page=${state.page}&limit=${state.limit}&policyIssueStartDate=${searchstartdate}&policyIssueEndDate=${searchenddate}`
      );
      if (result.data.responseCode === "200") {
        setTimeout(() => {
          let resultData = result.data.dataList;
          setState((prevState) => ({
            ...prevState,
            data: resultData,
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
    } else if (location === "" || location === null || location === undefined) {
      const result = await apigetUrl(
        `${currentBaseUrl}?page=${state.page}&limit=${state.limit}&policyIssueStartDate=${searchstartdate}&policyIssueEndDate=${searchenddate}&policyType=${policyTypeValue}`
      );
      if (result.data.responseCode === "200") {
        setTimeout(() => {
          let resultData = result.data.dataList;
          setState((prevState) => ({
            ...prevState,
            data: resultData,
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
    } else {
      const result = await apigetUrl(
        `${currentBaseUrl}?page=${state.page}&limit=${state.limit}&policyIssueStartDate=${searchstartdate}&policyIssueEndDate=${searchenddate}&level1=${location[1]}&level2=${location[2]}&level3=${location[3]}&level4=${location[4]}&policyType=${policyTypeValue}`
      );
      if (result.data.responseCode === "200") {
        setTimeout(() => {
          let resultData = result.data.dataList;
          setState((prevState) => ({
            ...prevState,
            data: resultData,
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
    }
  };

  //Advance Search Button Function
  const onAdvancedSearchClick = (e) => {
    onAdvancedSearchClickClean();
    setState((prevState) => ({
      ...prevState,
      isAdvancedSearch: !state.isAdvancedSearch,
    }));
  };

  //Default Function
  const callLocalBaseURL = async () => {
    const result = await apigetUrl(
      `${currentBaseUrl}?page=${state.page}&limit=${state.limit}`
    );
    if (result.data.responseCode === "200") {
      setTimeout(() => {
        let resultData = result.data.dataList;
        setState((prevState) => ({
          ...prevState,
          data: resultData,
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
    if ((result.data || {}).auditEventId >= 1) {
      let updateHeadCells = state.headCells;
      updateHeadCells.push({
        id: "timeline",
        isActive: false,
        label: "Actions",
      });
      setState((prevState) => ({
        ...prevState,
        auditEventId: result.data.auditEventId,
        headCells: updateHeadCells,
      }));
    }
  };

  //location predefine value check
  useEffect(() => {
    if (location.state) {
      setState((prevState) => ({
        ...prevState,
        isAdvancedSearch: true,
        searchValidation: {
          policyNum: location.state.policyNum,
        },
      }));
      axios
        .get(
          `${baseURL}/insurance/policy?page=${state.page}&limit=${state.limit}&sortBy=policyNum&sortType=asc&policyNum=${location.state.policyNum}`,
          apiInstance
        )
        .then((res) => {
          if (res.data.responseCode === "200") {
            setTimeout(() => {
              let resultData = res.data.dataList;
              setState((prevState) => ({
                ...prevState,
                data: resultData,
                page: res.data.pagination.page,
                pageCount: res.data.pagination.count,
                isLoading: false,
              }));
            }, 1000);
          }
        })
        .catch((err) => ippNotify.error(err));
    }
  }, [location]);

  //Sorting Functionality
  const requestSortData = async (sortBy, sortType) => {
    apiCallParams.set("page", state.page);
    apiCallParams.set("limit", state.limit);
    apiCallParams.set("sortBy", sortBy);
    apiCallParams.set("sortType", sortType);
    const { policyNum } = state.searchValidation;
    const { level1, level2, level3, level4, level5, level6 } = state;
    const policyType = state.policyType;
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
    if (!isEmpty(policyNum)) {
      apiCallParams.set("policyNum", policyNum);
    } else {
      apiCallParams.delete("policyNum");
    }
    if (!isEmpty(policyType)) {
      apiCallParams.set("policyType", policyType);
    } else {
      apiCallParams.delete("policyType");
    }
    if (!isEmpty(state.policyIssueStartDate)) {
      let policyIssueStartDateFormate = moment(
        state.policyIssueStartDate
      ).format("DD-MM-yyyy HH:mm:ss");
      apiCallParams.set("policyIssueStartDate", policyIssueStartDateFormate);
    } else {
      apiCallParams.delete("policyIssueStartDate");
    }
    if (!isEmpty(state.policyIssueEndDate)) {
      let policyIssueEndDateFormate = moment(state.policyIssueEndDate).format(
        "DD-MM-yyyy HH:mm:ss"
      );
      apiCallParams.set("policyIssueEndDate", policyIssueEndDateFormate);
    } else {
      apiCallParams.delete("policyIssueEndDate");
    }
    if (!isEmpty(state.policyExpiryStartDate)) {
      let policyExpiryStartDateFormate = moment(
        state.policyExpiryStartDate
      ).format("DD-MM-yyyy HH:mm:ss");
      apiCallParams.set("policyExpiryStartDate", policyExpiryStartDateFormate);
    } else {
      apiCallParams.delete("policyExpiryStartDate");
    }
    if (!isEmpty(state.policyExpiryEndDate)) {
      let policyExpiryEndDateFormate = moment(state.policyExpiryEndDate).format(
        "DD-MM-yyyy HH:mm:ss"
      );
      apiCallParams.set("policyExpiryEndDate", policyExpiryEndDateFormate);
    } else {
      apiCallParams.delete("policyExpiryEndDate");
    }

    let searchParam = apiCallParams.toString();
    pageURL.search = apiCallParams.toString();
    setCurrentUrl(pageURL);
    const result = await apigetUrl(`${currentBaseUrl}?` + searchParam);
    if (result.data.responseCode === "200") {
      setTimeout(() => {
        let resultData = result.data.dataList;
        setState((prevState) => ({
          ...prevState,
          data: resultData,
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

  //handling Sorting Request
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

  //Request Page Limit Count Functionality
  const requestPageLimitCountChange = async (count) => {
    let res = "";

    apiCallParams.set("page", 1);
    apiCallParams.set("limit", count);
    apiCallParams.set("sortBy", state.sortBy);
    apiCallParams.set("sortType", state.sortType);
    const { policyNum } = state.searchValidation;
    const { level1, level2, level3, level4, level5, level6 } = state;
    const policyType = state.policyType;
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
    if (!isEmpty(policyNum)) {
      apiCallParams.set("policyNum", policyNum);
    } else {
      apiCallParams.delete("policyNum");
    }
    if (!isEmpty(policyType)) {
      apiCallParams.set("policyType", policyType);
    } else {
      apiCallParams.delete("policyType");
    }
    if (!isEmpty(state.policyIssueStartDate)) {
      let policyIssueStartDateFormate = moment(
        state.policyIssueStartDate
      ).format("DD-MM-yyyy HH:mm:ss");
      apiCallParams.set("policyIssueStartDate", policyIssueStartDateFormate);
    } else {
      apiCallParams.delete("policyIssueStartDate");
    }
    if (!isEmpty(state.policyIssueEndDate)) {
      let policyIssueEndDateFormate = moment(state.policyIssueEndDate).format(
        "DD-MM-yyyy HH:mm:ss"
      );
      apiCallParams.set("policyIssueEndDate", policyIssueEndDateFormate);
    } else {
      apiCallParams.delete("policyIssueEndDate");
    }
    if (!isEmpty(state.policyExpiryStartDate)) {
      let policyExpiryStartDateFormate = moment(
        state.policyExpiryStartDate
      ).format("DD-MM-yyyy HH:mm:ss");
      apiCallParams.set("policyExpiryStartDate", policyExpiryStartDateFormate);
    } else {
      apiCallParams.delete("policyExpiryStartDate");
    }
    if (!isEmpty(state.policyExpiryEndDate)) {
      let policyExpiryEndDateFormate = moment(state.policyExpiryEndDate).format(
        "DD-MM-yyyy HH:mm:ss"
      );
      apiCallParams.set("policyExpiryEndDate", policyExpiryEndDateFormate);
    } else {
      apiCallParams.delete("policyExpiryEndDate");
    }

    pageURL.search = apiCallParams.toString();

    setCurrentUrl(pageURL);
    let getUrl = pageURL.pathname + pageURL.search;
    const result = await apigetUrl(`${getUrl}`);
    if (result.data.responseCode === "200") {
      setTimeout(() => {
        update_to(count);
        update_from(1);
        let resultData = result.data.dataList;
        setState((prevState) => ({
          ...prevState,
          data: resultData,
          page: 1,
          pageCount: result.data.pagination.count,
          limit: result.data.pagination.limit,
          isLoading: false,
        }));
      }, 1000);
      pageNumber = 1;
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

  //Handle Row Change Per Page
  const handleChangeRowsPerPage = (event) => {
    let target = event.target;
    setState((prevState) => ({
      ...prevState,
      page: 1,
      isLoading: true,
    }));
    requestPageLimitCountChange(target.value);
  };

  //Validating Property With Schema
  const validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const propertySchema = {
      [name]: schema[name],
    };
    const { error } = Joi.validate(obj, propertySchema);
    return error ? error.details[0].message : null;
  };

  //Checking For Empty Object/String
  function isObjEmpty(obj) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }

    return JSON.stringify(obj) === JSON.stringify({});
  }

  //Set Page Data
  const setPageData = (data) => {
    setState((prevState) => ({
      ...prevState,
      data: data,
    }));
  };

  //Set Page Number
  const setPageNumber = (pageNumber) => {
    setState((prevState) => ({
      ...prevState,
      page: pageNumber,
    }));
  };

  //Set Page Count
  const setPageCount = (pageCount) => {
    setState((prevState) => ({
      ...prevState,
      pageCount: pageCount,
    }));
  };

  //Set Update To
  const update_to = (to) => {
    setState((prevState) => ({
      ...prevState,
      to: to,
    }));
  };

  //Set Update Fr0m
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

  //Input Text Box Validation
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

  //Handle Search Validation
  const handleSearchClick = () => {
    apiCallParams.delete("policyNum");
    apiCallParams.delete("policyIssueStartDate");
    apiCallParams.delete("policyIssueEndDate");
    apiCallParams.delete("policyExpiryStartDate");
    apiCallParams.delete("policyExpiryEndDate");
    apiCallParams.delete("policyType");
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

    const { policyNum, key, fieldType, isEditable } = state.searchValidation;
    const { level1, level2, level3, level4, level5, level6 } = state;

    const policyType = state.policyType;
    const PolicyIssueDateformatStartDate = moment(
      state.policyIssueStartDate
    ).format("DD-MM-yyyy HH:mm:ss");
    const PolicyIssueDateformatEndDate = moment(
      state.policyIssueEndDate
    ).format("DD-MM-yyyy HH:mm:ss");
    const PolicyExpiryDateformatStartDate = moment(
      state.policyExpiryStartDate
    ).format("DD-MM-yyyy HH:mm:ss");
    const PolicyExpiryDateformatEndDate = moment(
      state.policyExpiryEndDate
    ).format("DD-MM-yyyy HH:mm:ss");

    tempArr.length = 0;

    if (!isEmpty(level1)) tempArr.push({ level1 });
    if (!isEmpty(level2)) tempArr.push({ level2 });
    if (!isEmpty(level3)) tempArr.push({ level3 });
    if (!isEmpty(level4)) tempArr.push({ level4 });
    if (!isEmpty(level5)) tempArr.push({ level5 });
    if (!isEmpty(level6)) tempArr.push({ level6 });
    if (!isEmpty(policyNum)) tempArr.push({ policyNum });
    if (!isEmpty(policyType)) tempArr.push({ policyType });
    if (!isEmpty(key)) tempArr.push({ key });
    if (!isEmpty(fieldType)) tempArr.push({ fieldType });
    if (!isEmpty(isEditable)) tempArr.push({ isEditable });
    if (!isEmpty(state.policyIssueStartDate))
      tempArr.push({
        policyIssueStartDate: PolicyIssueDateformatStartDate,
      });
    if (!isEmpty(state.policyIssueEndDate))
      tempArr.push({
        policyIssueEndDate: PolicyIssueDateformatEndDate,
      });
    if (!isEmpty(state.policyExpiryStartDate))
      tempArr.push({
        policyExpiryStartDate: PolicyExpiryDateformatStartDate,
      });
    if (!isEmpty(state.policyExpiryEndDate))
      tempArr.push({
        policyExpiryEndDate: PolicyExpiryDateformatEndDate,
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

  //is Empty Function
  const isEmpty = (str) => {
    return !str || 0 === str.length;
  };

  //Pagination Function
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

    const { policyNum } = state.searchValidation;
    const { level1, level2, level3, level4, level5, level6 } = state;
    const policyType = state.policyType;
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
    if (!isEmpty(policyNum)) {
      apiCallParams.set("policyNum", policyNum);
    } else {
      apiCallParams.delete("policyNum");
    }
    if (!isEmpty(policyType)) {
      apiCallParams.set("policyType", policyType);
    } else {
      apiCallParams.delete("policyType");
    }
    if (!isEmpty(state.policyIssueStartDate)) {
      let policyIssueStartDateFormate = moment(
        state.policyIssueStartDate
      ).format("DD-MM-yyyy HH:mm:ss");
      apiCallParams.set("policyIssueStartDate", policyIssueStartDateFormate);
    } else {
      apiCallParams.delete("policyIssueStartDate");
    }
    if (!isEmpty(state.policyIssueEndDate)) {
      let policyIssueEndDateFormate = moment(state.policyIssueEndDate).format(
        "DD-MM-yyyy HH:mm:ss"
      );
      apiCallParams.set("policyIssueEndDate", policyIssueEndDateFormate);
    } else {
      apiCallParams.delete("policyIssueEndDate");
    }
    if (!isEmpty(state.policyExpiryStartDate)) {
      let policyExpiryStartDateFormate = moment(
        state.policyExpiryStartDate
      ).format("DD-MM-yyyy HH:mm:ss");
      apiCallParams.set("policyExpiryStartDate", policyExpiryStartDateFormate);
    } else {
      apiCallParams.delete("policyExpiryStartDate");
    }
    if (!isEmpty(state.policyExpiryEndDate)) {
      let policyExpiryEndDateFormate = moment(state.policyExpiryEndDate).format(
        "DD-MM-yyyy HH:mm:ss"
      );
      apiCallParams.set("policyExpiryEndDate", policyExpiryEndDateFormate);
    } else {
      apiCallParams.delete("policyExpiryEndDate");
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
        let resultData = result.data.dataList;
        setPageData(resultData);
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

  //Advance Search Functionality
  const search = async (searchURL) => {
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    const result = await apigetUrl(`${currentBaseUrl}?` + searchURL);
    if (result.data.responseCode === "200") {
      setTimeout(() => {
        let resultData = result.data.dataList;
        setAdvancedSearchData(resultData);

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

  //Reset Button Click Functionality
  const callResetData = async () => {
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    apiCallParams.set("page", 1);
    apiCallParams.set("limit", state.limit);
    apiCallParams.set("sortBy", state.sortBy);
    apiCallParams.set("sortType", state.sortType);

    apiCallParams.delete("policyNum");
    apiCallParams.delete("policyIssueStartDate");
    apiCallParams.delete("policyIssueEndDate");
    apiCallParams.delete("policyExpiryStartDate");
    apiCallParams.delete("policyExpiryEndDate");
    apiCallParams.delete("policyType");
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
        let resultData = result.data.dataList;
        setState((prevState) => ({
          ...prevState,
          searchValidation: {
            policyNum: "",
          },
          policyType: "",
          isLoading: false,
          policyIssueStartDate: null,
          policyIssueEndDate: null,
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
        }));
        setResetData(resultData);
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

  //Advanced Search Clean up
  const onAdvancedSearchClickClean = () => {
    setState((prevState) => ({
      ...prevState,
      searchValidation: {
        policyNum: "",
        policyIssueStartDate: null,
        policyIssueEndDate: null,
        policyExpiryStartDate: null,
        policyExpiryEndDate: null,
        policyType: "",
      },
      isAdvancedSearchValidationText: true,
      errors: {},
      dataOFLocation: [],
    }));
  };

  //Redirect to a new page to download a file
  const filedownloadlink = (event) => {
    const url = event.currentTarget.id;
    window.open(url, "_blank");
  };

  //Handle Policy Issue Start Date
  const handlePolicyIssueDateStartDate = (date) => {
    setState((prevState) => ({
      ...prevState,

      policyIssueStartDate: date,
      isPolicyIssueDateStartDateActive: true,
      isPolicyIssueDateEndDateDisabled: false,
    }));
  };

  //Handle Policy Issue End Date
  const handlePolicyIssueDateEndDate = (date) => {
    setState((prevState) => ({
      ...prevState,
      policyIssueEndDate: date,
    }));
  };

  //Handle Policy Type
  const handlepolicytype = (e) => {
    setState((prevState) => ({
      ...prevState,
      policyType: e.target.value,
    }));
  };

  //Handle Policy Expiry Start Date
  const handlePolicyExpiryDateStartDate = (date) => {
    setState((prevState) => ({
      ...prevState,
      policyExpiryStartDate: date,
      isPolicyExpiryDateStartDateActive: true,
      isPolicyExpiryDateEndDateDisabled: false,
    }));
  };

  //Handle Policy Expiry End Date
  const handlePolicyExpiryDateEndDate = (date) => {
    setState((prevState) => ({
      ...prevState,
      policyExpiryEndDate: date,
    }));
  };

  //Setting Location Values
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
      if (result.status === 401 || result.status === 402) {
        dispatch(verifyToken());
      } else {
        ippNotify.error(result.data.responseMessage);
        showLoader();
      }
    }
  };

  // close the Audit Timeline
  const handleCloseAuditTimeline = () => {
    setState((prevState) => ({
      ...prevState,
      isAuditTimelineActive: false,
    }));
  };

  //display policy type
  const viewPolicyType = (type) => {
    switch (type) {
      case 1:
        return "New";
      case 2:
        return "Renewal";
    }
  };

  //Main Page Design
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
                  isAdvancedSearch={state.isAdvancedSearch}
                  onAdvancedSearchClick={onAdvancedSearchClick}
                  numSelected={state.selected.length}
                  isAdvancedSearch={state.isAdvancedSearch}
                  onAdvancedSearchClick={onAdvancedSearchClick}
                  page={state.page}
                  limit={state.limit}
                  sortBy={state.sortBy}
                  sortType={state.sortType}
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
                  policyIssueStartDate={state.policyIssueStartDate}
                  policyIssueEndDate={state.policyIssueEndDate}
                  isPolicyIssueDateEndDateDisabled={
                    state.isPolicyIssueDateEndDateDisabled
                  }
                  policyExpiryStartDate={state.policyExpiryStartDate}
                  policyExpiryEndDate={state.policyExpiryEndDate}
                  isPolicyExpiryDateEndDateDisabled={
                    state.isPolicyExpiryDateEndDateDisabled
                  }
                  policyType={state.policyType}
                  handlepolicytype={handlepolicytype}
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
                                <TableCell>{n.policyNum}</TableCell>
                                <TableCell>{n.policyIssueDate}</TableCell>
                                <TableCell>{n.policyExpiryDate} </TableCell>
                                <TableCell>
                                  {currencyFormater(n.premiumAmount)}
                                </TableCell>
                                <TableCell>
                                  {currencyFormater(n.taxAmount)}{" "}
                                </TableCell>
                                <TableCell>
                                  {viewPolicyType(n.policyType)}{" "}
                                </TableCell>

                                <TableCell padding="none">
                                  <Tooltip
                                    title={
                                      <IntlMessages id="ListOfPolicies.Tooltip.Download" />
                                    }
                                  >
                                    <IconButton
                                      disabled={!n.policyLink}
                                      color="primary"
                                      id={n.policyLink}
                                      onClick={(e) => filedownloadlink(e)}
                                    >
                                      <GetAppIcon />
                                    </IconButton>
                                  </Tooltip>
                                </TableCell>
                                <TableCell padding="none">
                                  <Tooltip
                                    title={
                                      <IntlMessages id="ListOfPolicies.Tooltip.Get" />
                                    }
                                  >
                                    <IconButton
                                      disabled={!n.scheduleLink}
                                      color="primary"
                                      id={n.scheduleLink}
                                      onClick={(e) => filedownloadlink(e)}
                                    >
                                      <GetAppIcon />
                                    </IconButton>
                                  </Tooltip>
                                </TableCell>
                                {state.auditEventId >= 1 ? (
                                  <>
                                    <TableCell padding="none">
                                      <Tooltip title="View Audit Timeline">
                                        <IconButton
                                          style={{ marginLeft: "10%" }}
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
