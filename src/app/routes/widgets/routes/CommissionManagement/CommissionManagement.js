import React, { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import IntlMessages from "util/IntlMessages";
import DeleteIcon from "@material-ui/icons/Delete";
import { useLocation } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import EnhancedTableHead from "../CommonComponents/TableHeadComponent";
import EnhancedTableToolbar from "./EnhancedTableToolbar";
import TablePaginationComponent from "../CommonComponents/TablePaginationComponent";
import InfoModal from "../Modal/Info";
import Joi from "joi-browser";
import apiInstance from "../../../../../setup/index";
import { Tooltip } from "@material-ui/core";
import {
  apigetUrl,
  apipostUrl,
  apiputUrl,
  apideleteUrl,
} from "../../../../../setup/middleware";
import _ from "lodash";
import {
  IPPNotification,
  ippNotify,
} from "../CommonComponents/IPPNotification";
import { getRecordsPerPage } from "../../../../../setup/ApplicatoinConfigurations.js";
import "../CommonComponents/tableStyle.css";
import AddCommissionManagement from "./AddCommissionManagement";
import EditCommissionManagement from "./EditCommissionManagement";
import moment from "moment";
import AuditTimeline from "../CommonComponents/AuditTimeline/AuditTimeline";
import { Visibility } from "@material-ui/icons";
import Loader from "../CommonComponents/Loader";
import { FaGalacticSenate } from "react-icons/fa";

const baseURL = `${process.env.REACT_APP_BASE_URL}`;
const perPageURL = `/insurance/commission/rules`;
const pageURL = new URL(baseURL + perPageURL);
let apiCallParams = new URLSearchParams(pageURL.search);

let pageNumber = 1;

const schema = {
  categoryId: Joi.string()
    .required()
    .label("CategoryId"),
  name: Joi.string()
    .required()
    .label("Name"),
  // description: Joi.string()
  //   .allow("")
  //   .optional()
  //   .label("Description"),
  rowVersion: Joi.number()
    .required()
    .label("RowVersion"),
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
    setState((prevState) => ({
      ...prevState,
      data: data,
      isInfoAlert: false,
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
    selectedData: [],
    page: 1,
    rowsPerPage: 5,
    data: [],
    isAdvancedSearch: false,
    formDialogOpen: false,
    selectedEditId: "",
    isSortAsc: true,
    deleteFormDialogOpen: false,
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
    selectedId: "",
    isAuditTimelineActive: false,
    eventId: "",
    referenceId: "",
    auditEventId: "",
    headCells: [
      {
        id: "name",
        isActive: true,
        label: "CommissionManagement.Name",
      },
      {
        id: "description",
        isActive: false,
        label: "CommissionManagement.Description",
      },
      {
        id: "productId",
        isActive: false,
        label: "CommissionManagement.Product",
      },

      {
        id: "providerId",
        isActive: false,
        label: "CommissionManagement.Provider",
      },
      {
        id: "breakupType",
        isActive: false,
        label: "CommissionManagement.BreakupType",
      },
      {
        id: "startDate",
        isActive: false,
        label: "CommissionManagement.StartDate",
      },
      {
        id: "endDate",
        isActive: false,
        label: "CommissionManagement.EndDate",
      },
      {
        id: "actions",
        isActive: false,
        label: "CommissionManagement.Action",
      },
    ],
    isAddCommissionActive: false,
    isEditCommissionActive: false,
    providerData: [],
    productData: [],
    userTypeData: [],
    ruleUserTypeData: [],
    paymentTypeData: [],
    payTypeValue: "",
    rulePaymentTypeData: [],
    slabData: [],
    slabTypeValue: "",
    level1: "",
    level2: "",
    level3: "",
    level4: "",
    level5: "",
    level6: "",
    startDate: null,
    endDate: null,
    isEndDateDisabled: true,
    searchValidation: {
      name: "",
    },
    dataOFLocation: [],
    errors: {},
    advancedSearchValidationErrors: {},
    isAdvancedSearchValidationText: false,
    isLocationActive: false,
  });

  const location = useLocation();

  useEffect(() => {
    if (
      location.state === null ||
      location.state === undefined ||
      location.state === ""
    ) {
      callLocalBaseURL();
    } else if (location.state.locationData) {
      setState((prevState) => ({
        ...prevState,
        isAdvancedSearch: true,
        dataOFLocation: location.state.locationData,
        level1: location.state.locationData[1],
        level2: location.state.locationData[2],
        level3: location.state.locationData[3],
        level4: location.state.locationData[4],
      }));
      let dataOFLocation = location.state.locationData;
      console.log("dataOfLocation", dataOFLocation);
      let date1 = location.state.endDate;
      predefinevaluecheck(date1, dataOFLocation);
    } else if (location.state) {
      setState((prevState) => ({
        ...prevState,
        isAdvancedSearch: true,
      }));
      let dataOFLocation = "";
      let date1 = location.state.endDate;
      predefinevaluecheck(date1, dataOFLocation);
    } else {
      callLocalBaseURL();
    }
  }, [location]);

  const predefinevaluecheck = async (date1, location) => {
    console.log("dataOFLocation", location);
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
      endDate: enddate,
      startDate: startdate,
      isEndDateDisabled: false,
    }));
    if (location === "" || location === null || location === undefined) {
      const result = await apigetUrl(
        `/insurance/commission/rules?page=${state.page}&limit=${state.limit}&createdStartDate=${searchstartdate}&createdEndDate=${searchenddate}`
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
          // showApiData(result.data.dataList);
        }, 1000);
      } else {
        ippNotify.error(result.data.responseMessage);
        showLoader();
      }
    } else {
      const result = await apigetUrl(
        `/insurance/commission/rules?page=${state.page}&limit=${state.limit}&startDate=${searchstartdate}&endDate=${searchenddate}&level1=${location[1]}&level2=${location[2]}&level3=${location[3]}&level4=${location[4]}`
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
          // showApiData(result.data.dataList);
        }, 1000);
      } else {
        ippNotify.error(result.data.responseMessage);
        showLoader();
      }
    }
    // handleSearchClick()
  };

  const onAdvancedSearchClick = (e) => {
    onAdvancedSearchClickClean();
    setState((prevState) => ({
      ...prevState,
      isAdvancedSearch: !state.isAdvancedSearch,
    }));
  };

  useEffect(() => {
    getAllProvider();
    getAllProducts();
    getAllUserType();
    getSlabType();
    getPaymentType();
    callLocalBaseURL();
  }, []);

  const getAllProvider = () => {
    apigetUrl(`/insurance/providers?page=1&limit=1000`)
      .then((res) => {
        console.log("res-provider", res);
        let response = res.data.dataList;
        setState((prevState) => ({
          ...prevState,
          providerData: response,
        }));
      })
      .catch((err) => console.log("err", err));
  };

  const getProviderName = (providerId) => {
    const item = (state.providerData || []).find((n) => n.id === providerId);
    return (item || {}).name;
  };

  const getAllProducts = () => {
    apigetUrl(`/insurance/products?page=1&limit=1000`)
      .then((res) => {
        console.log("res-product", res);
        let response = res.data.dataList;
        setState((prevState) => ({
          ...prevState,
          productData: response,
        }));
      })
      .catch((err) => console.log("err", err));
  };

  const getProductName = (productId) => {
    const item = (state.productData || []).find((n) => n.id === productId);
    return (item || {}).name;
  };

  const getAllUserType = () => {
    apigetUrl(`/insurance/commission/core-data?page=1&limit=1000&typeId=10`)
      .then((res) => {
        console.log("res-product", res);
        let response = res.data.dataList;
        setState((prevState) => ({
          ...prevState,
          userTypeData: response,
          ruleUserTypeData: response,
        }));
      })
      .catch((err) => console.log("err", err));
  };

  const getSlabType = () => {
    apigetUrl(`/insurance/commission/core-data?page=1&limit=1000&typeId=20`)
      .then((res) => {
        console.log("res-product", res);
        let response = res.data.dataList;
        setState((prevState) => ({
          ...prevState,
          slabData: response,
          slabTypeValue: 20,
        }));
      })
      .catch((err) => console.log("err", err));
  };

  const getPaymentType = () => {
    apigetUrl(`/insurance/commission/core-data?page=1&limit=1000&typeId=30`)
      .then((res) => {
        console.log("res-product", res);
        let response = res.data.dataList;
        setState((prevState) => ({
          ...prevState,
          paymentTypeData: response,
          rulePaymentTypeData: response,
          payTypeValue: 30,
        }));
      })
      .catch((err) => console.log("err", err));
  };

  const callLocalBaseURL = async () => {
    const result = await apigetUrl(
      `/insurance/commission/rules?page=${state.page}&limit=${state.limit}&sortBy=${state.sortBy}&sortType=${state.sortType}`
    );
    console.log("result", result);
    if (result.data.responseCode === "200") {
      setTimeout(() => {
        setState((prevState) => ({
          ...prevState,
          data: result.data.dataList,
          page: result.data.pagination.page,
          pageCount: result.data.pagination.count,
          limit: result.data.pagination.limit,
          to: result.data.pagination.limit,
          auditEventId: result.data.auditEventId,
          from: 1,
          isLoading: false,
        }));
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

  const getBreakUpName = (id) => {
    switch (id) {
      case 1:
        return "Slab-BreakUp";
      case 2:
        return "Rule-BreakUp";
      case "":
        return "";
    }
  };

  useEffect(() => {
    apiCallParams.set("page", state.page);
    apiCallParams.set("limit", state.limit);
    apiCallParams.set("sortBy", state.sortBy);
    apiCallParams.set("sortType", state.sortType);
    pageURL.search = apiCallParams.toString();
    setCurrentUrl(pageURL);
    callLocalBaseURL();
  }, []);

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
    const { startDate, endDate } = state;
    const { name } = state.searchValidation;
    const { level1, level2, level3, level4, level5, level6 } = state;

    const formatStartDate = moment(startDate).format("DD-MM-yyyy HH:mm:ss");
    const formatEndDate = moment(endDate).format("DD-MM-yyyy HH:mm:ss");

    apiCallParams.set("page", state.page);
    apiCallParams.set("limit", state.limit);
    apiCallParams.set("sortBy", sortBy);
    apiCallParams.set("sortType", sortType);
    let tempArr = [];
    if (!isEmpty(level1)) tempArr.push({ level1 });
    if (!isEmpty(level2)) tempArr.push({ level2 });
    if (!isEmpty(level3)) tempArr.push({ level3 });
    if (!isEmpty(level4)) tempArr.push({ level4 });
    if (!isEmpty(level5)) tempArr.push({ level5 });
    if (!isEmpty(level6)) tempArr.push({ level6 });
    if (!isEmpty(name)) tempArr.push({ name });
    if (!isEmpty(startDate)) tempArr.push({ startDate: formatStartDate });
    if (!isEmpty(endDate)) tempArr.push({ endDate: formatEndDate });

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

    const result = await apigetUrl(
      `/insurance/commission/rules?` + searchParam
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

  const handleChangeRowsPerPage = (event) => {
    let target = event.target;
    setState((prevState) => ({
      ...prevState,
      page: 1,
      isLoading: true,
    }));
    requestPageLimitCountChange(target.value);
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

  const isSelectedFunc = (id) => {
    // return state.selected.indexOf(id) !== -1;
  };

  const onTableDeleteButtonClick = (event, id) => {
    setState((prevState) => ({
      ...prevState,
      deleteFormDialogOpen: true,
      selectedId: id,
    }));

    const onDeleteButtonClickedIndex = state.data
      .map(function(e) {
        return e.id;
      })
      .indexOf(parseInt(event.currentTarget.id));
  };

  const onTableEditButtonClick = async (event, id) => {
    setState((prevState) => ({
      ...prevState,
      selectedId: id,
      isEditCommissionActive: true,
    }));
  };

  function isObjEmpty(obj) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }

    return JSON.stringify(obj) === JSON.stringify({});
  }

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

  const handleDeleteDialogClose = (e) => {
    setState((prevState) => ({
      ...prevState,
      deleteFormDialogOpen: false,
    }));
  };

  const onDeleteConfirm = () => {
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    deleteItem();
  };

  const deleteItem = async () => {
    // api

    const result = await apideleteUrl(
      `/insurance/commission/rules/${state.selectedId}`
    );
    if (result.status === 200) {
      setState((prevState) => ({
        ...prevState,
        deleteFormDialogOpen: false,
      }));
      setTimeout(() => {
        ippNotify.success("Successfully Deleted");
        setState((prevState) => ({
          ...prevState,
          isLoading: false,
        }));
        callLocalBaseURL();
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

  const getSuccessUpdate = (res) => {
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    setTimeout(() => {
      setTimeout(() => {
        if (`${res}` === "add") {
          ippNotify.success("Successfully New Data is Added");
        } else if (`${res}` === "edit") {
          ippNotify.success("Successfully Data is Updated");
        }
      }, 100);
      setState((prevState) => ({
        ...prevState,
        // addFormDialogOpen: false,
        isAddFormSubmitDisabled: false,
        isLoading: false,
      }));
    }, 1000);
  };

  const getErrorUpdate = (err) => {
    ippNotify.error(err);
    showLoader();
  };

  const handleTextFieldChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const [categoryValue, setCatgoryValue] = useState(null);

  const validateProperty = ({ name, value }) => {
    let obj = {};

    obj = { [name]: value };

    const propertySchema = { [name]: schema[name] };
    const { error } = Joi.validate(obj, propertySchema);
    return error ? error.details[0].message : null;
  };

  const handleAdvancedSearchOnChange = (event) => {
    const { name, value } = event.target;
    if (value) {
      setState((prevState) => ({
        ...prevState,
        searchValidation: {
          name: value,
        },
      }));
    } else if (!value) {
      setState((prevState) => ({
        ...prevState,
        searchValidation: {
          name: value,
        },
      }));
    }
  };

  const isEmpty = (str) => {
    return !str || 0 === str.length;
  };

  const handleApplyClick = (e) => {
    apiCallParams.delete("name");
    apiCallParams.delete("startDate");
    apiCallParams.delete("endDate");
    apiCallParams.delete("level1");
    apiCallParams.delete("level2");
    apiCallParams.delete("level3");
    apiCallParams.delete("level4");
    apiCallParams.delete("level5");
    apiCallParams.delete("level6");
    e.preventDefault();
    // setState((prevState) => ({
    //   ...prevState,
    //   isAdvancedSearchValidationText: true,
    //   errors: {},
    // }));

    const { startDate, endDate } = state;
    const { name } = state.searchValidation;
    const { level1, level2, level3, level4, level5, level6 } = state;

    const formatStartDate = moment(startDate).format("DD-MM-yyyy HH:mm:ss");
    const formatEndDate = moment(endDate).format("DD-MM-yyyy HH:mm:ss");

    let tempArr = [];
    if (!isEmpty(level1)) tempArr.push({ level1 });
    if (!isEmpty(level2)) tempArr.push({ level2 });
    if (!isEmpty(level3)) tempArr.push({ level3 });
    if (!isEmpty(level4)) tempArr.push({ level4 });
    if (!isEmpty(level5)) tempArr.push({ level5 });
    if (!isEmpty(level6)) tempArr.push({ level6 });
    if (!isEmpty(name)) tempArr.push({ name });
    if (!isEmpty(startDate)) tempArr.push({ startDate: formatStartDate });
    if (!isEmpty(endDate)) tempArr.push({ endDate: formatEndDate });
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

  const handleResetClick = async (e) => {
    e.preventDefault();
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    apiCallParams.set("page", 1);
    apiCallParams.set("limit", state.limit);
    apiCallParams.set("sortBy", state.sortBy);
    apiCallParams.set("sortType", state.sortType);

    apiCallParams.delete("name");
    apiCallParams.delete("startDate");
    apiCallParams.delete("endDate");
    apiCallParams.delete("level1");
    apiCallParams.delete("level2");
    apiCallParams.delete("level3");
    apiCallParams.delete("level4");
    apiCallParams.delete("level5");
    apiCallParams.delete("level6");

    pageURL.search = apiCallParams.toString();

    const result = await apigetUrl(
      `/insurance/commission/rules?page=${1}&limit=${state.limit}&sortBy=${
        state.sortBy
      }&sortType=${state.sortType}`
    );
    if (result.data.responseCode === "200") {
      setTimeout(() => {
        setState((prevState) => ({
          ...prevState,
          // advancedSearchValidationErrors: {},
          // isAdvancedSearchValidationText: false,
          searchValidation: {
            name: "",
          },
          startDate: null,
          endDate: null,
          level1: "",
          level2: "",
          level3: "",
          level4: "",
          isLocationActive: !state.isLocationActive,
          dataOFLocation: [1],
          isLoading: false,
        }));
        setResetData(result.data.dataList);
        setPageNumber(result.data.pagination.page);
        setPageCount(result.data.pagination.count);
        setCurrentUrl(pageURL);
      }, 1000);
    } else {
      ippNotify.error(result.data.responseMessage);
      showLoader();
    }
  };

  const onAdvancedSearchClickClean = () => {
    setState((prevState) => ({
      ...prevState,
      // advancedSearchValidationErrors: {},
      // isAdvancedSearchValidationText: false,
      searchValidation: {
        name: "",
      },
      startDate: null,
      endDate: null,
      level1: "",
      level2: "",
      level3: "",
      level4: "",
      dataOFLocation: [],
    }));
  };

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
      showLoader();
      ippNotify.error(result.data.responseMessage);
    }
  };

  const search = async (searchURL) => {
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    const result = await apigetUrl(`/insurance/commission/rules?` + searchURL);
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
      setState((prevState) => ({
        ...prevState,
        isInfoAlert: true,
        infoMsg: "Your query did not match any results",
        to: 0,
        pageCount: 0,
      }));
      showLoader();
    }
  };

  const onAddButtonClick = () => {
    setState((prevState) => ({
      ...prevState,
      isAddCommissionActive: true,
    }));
  };

  const handleRequestClose = () => {
    setState((prevState) => ({
      ...prevState,
      isAddCommissionActive: false,
      isEditCommissionActive: false,
    }));
  };

  const closeEditCommission = () => {
    setState((prevState) => ({
      ...prevState,
      isEditCommissionActive: false,
    }));
  };

  const closeAddCommission = () => {
    setState((prevState) => ({
      ...prevState,
      isAddCommissionActive: false,
    }));
  };

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

  const handleStartDate = (date) => {
    setState((prevState) => ({
      ...prevState,
      startDate: date,
      isEndDateDisabled: false,
    }));
  };

  //Handle Policy Issue End Date
  const handleEndDate = (date) => {
    setState((prevState) => ({
      ...prevState,
      endDate: date,
    }));
  };

  const handlingDefaultValue = () => {};

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
      ) : state.isAddCommissionActive ? (
        <>
          <AddCommissionManagement
            callLocalBaseURL={callLocalBaseURL}
            getSuccessUpdate={getSuccessUpdate}
            getErrorUpdate={getErrorUpdate}
            onAddButtonClick={onAddButtonClick}
            handleRequestClose={handleRequestClose}
            closeAddCommission={closeAddCommission}
          />
        </>
      ) : state.isEditCommissionActive ? (
        <>
          <EditCommissionManagement
            selectedId={state.selectedId}
            callLocalBaseURL={callLocalBaseURL}
            getSuccessUpdate={getSuccessUpdate}
            providerData={state.providerData}
            userTypeData={state.userTypeData}
            ruleUserTypeData={state.ruleUserTypeData}
            productData={state.productData}
            handleRequestClose={handleRequestClose}
            closeEditCommission={closeEditCommission}
            paymentTypeData={state.paymentTypeData}
            payTypeValue={state.payTypeValue}
            rulePaymentTypeData={state.rulePaymentTypeData}
            slabData={state.slabData}
            slabTypeValue={state.slabTypeValue}
          />
        </>
      ) : (
        <div className="App">
          <Dialog
            maxWidth="xs"
            open={state.deleteFormDialogOpen}
            onClose={handleDeleteDialogClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {<IntlMessages id="ipp.common.modal.deleteconfirmation.title" />}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <IntlMessages id="commissionManagement.master.modal.deleteconfrimation.message" />
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteDialogClose} color="primary">
                <IntlMessages id="ipp.common.Cancel.button" />
              </Button>
              <Button onClick={onDeleteConfirm} color="secondary" autoFocus>
                <IntlMessages id="ipp.common.Delete.button" />
              </Button>
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
                  handler={handler}
                  isActive={state.isLocationActive}
                  startDate={state.startDate}
                  endDate={state.endDate}
                  isEndDateDisabled={state.isEndDateDisabled}
                  dataOFLocation={state.dataOFLocation}
                  handlingDefaultValue={handlingDefaultValue}
                  handleStartDate={handleStartDate}
                  handleEndDate={handleEndDate}
                  onAddButtonClick={onAddButtonClick}
                  data={state.data}
                  pageCount={state.pageCount}
                  setAdvancedSearchData={setAdvancedSearchData}
                  setResetData={setResetData}
                  page={state.page}
                  pageCount={state.pageCount}
                  limit={state.limit}
                  to={state.limit}
                  rowsPerPage={state.rowsPerPage}
                  sortBy={state.sortBy}
                  sortType={state.sortType}
                  callLocalBaseURL={callLocalBaseURL}
                  // callResetData={callResetData}
                  handleResetClick={handleResetClick}
                  name={state.searchValidation.name}
                  handleApplyClick={handleApplyClick}
                  handleAdvancedSearchOnChange={handleAdvancedSearchOnChange}
                  isAdvancedSearch={state.isAdvancedSearch}
                  advancedSearchValidationErrors={
                    state.advancedSearchValidationErrors
                  }
                  onAdvancedSearchClick={onAdvancedSearchClick}
                  isAdvancedSearchValidationText={
                    state.isAdvancedSearchValidationText
                  }
                  handleAutoCompleteInputReset={
                    state.handleAutoCompleteInputReset
                  }
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
                                <TableCell align="left">
                                  {n.description}
                                </TableCell>
                                <TableCell align="left">
                                  {getProductName(n.productId)}
                                </TableCell>
                                <TableCell align="left">
                                  {getProviderName(n.providerId)}
                                </TableCell>
                                <TableCell align="left">
                                  {getBreakUpName(n.breakupType)}
                                </TableCell>
                                {/* <TableCell align="center">
                                  {n.locationHierarchy}
                                </TableCell> */}

                                {n.startDate === null ||
                                n.startDate === undefined ||
                                n.startDate === "" ? (
                                  <>
                                    <TableCell align="left">{"---"}</TableCell>
                                  </>
                                ) : (
                                  <TableCell align="left">
                                    {moment(n.startDate).format(
                                      "DD-MM-yyyy HH:mm:ss"
                                    )}
                                  </TableCell>
                                )}
                                {n.endDate === null ||
                                n.endDate === undefined ||
                                n.endDate === "" ? (
                                  <>
                                    <TableCell align="left">{"---"}</TableCell>
                                  </>
                                ) : (
                                  <TableCell align="left">
                                    {moment(n.endDate).format(
                                      "DD-MM-yyyy HH:mm:ss"
                                    )}
                                  </TableCell>
                                )}

                                <TableCell padding="none">
                                  <Tooltip
                                    title={
                                      <IntlMessages id="CommissionManagement.Tooltip.Edit" />
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
                                      <IntlMessages id="CommissionManagement.Tooltip.Delete" />
                                    }
                                  >
                                    <IconButton
                                      id={n.id}
                                      onClick={(e) =>
                                        onTableDeleteButtonClick(e, n.id)
                                      }
                                    >
                                      <DeleteIcon color="secondary" />
                                    </IconButton>
                                  </Tooltip>
                                  {state.auditEventId >= 1 ? (
                                    <Tooltip
                                      title={
                                        <IntlMessages id="CommissionManagement.Tooltip.View" />
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
