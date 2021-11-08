import React, { useState, useEffect } from "react";
import "./root.component.css";
import { Button, Tooltip } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import IntlMessages from "util/IntlMessages";
import "../CommonComponents/tableStyle.css";
import DeleteIcon from "@material-ui/icons/Delete";
import TablePaginationComponent from "../CommonComponents/TablePaginationComponent";
import EditIcon from "@material-ui/icons/Edit";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import EnhancedTableHead from "../CommonComponents/TableHeadComponent";
import EnhancedTableToolbar from "./EnhancedTableToolbar";
import InfoModal from "../Modal/Info";
import { useHistory } from "react-router-dom";
import AddInsuranceProvider from "./AddInsuranceProvider";
import EditInsuranceProvider from "./EditInsuranceProvider";
import Joi from "joi-browser";
import apiInstance from "../../../../../setup/index";
import {
  IPPNotification,
  ippNotify,
} from "../CommonComponents/IPPNotification";
import { apigetUrl, apideleteUrl } from "setup/middleware";
import { getRecordsPerPage } from "../../../../../setup/ApplicatoinConfigurations.js";
import AuditTimeline from "../CommonComponents/AuditTimeline/AuditTimeline";
import { Visibility } from "@material-ui/icons";
import Loader from "../CommonComponents/Loader";
import { useDispatch } from "react-redux";
import { verifyToken } from "../../../../../actions/Auth";

const baseURL = `${process.env.REACT_APP_BASE_URL}`;
const perPageURL = `/insurance/providers`;

const pageURL = new URL(baseURL + perPageURL);
console.log("pageURL = ", pageURL);

let apiCallParams = new URLSearchParams(pageURL.search, apiInstance);
console.log("apiCallParams = ", apiCallParams);

// const api = axios.create({
//   baseURL: baseURL,
// });

let pageNumber = 1;

const advancedSearchValidationSchema = {
  name: Joi.string()
    .required()
    .label("Name"),
  kafkaTopic: Joi.string()
    .required()
    .label("kafka Topic"),
};

const App = () => {
  // const [iserror, setIserror] = useState(false);
  // const [errorMessages, setErrorMessages] = useState([]);
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

  const setCurrentUrl = (currentUrl) => {
    setState((prevState) => ({ ...prevState, currentUrl }));
  };

  const [state, setState] = useState({
    data: [],
    // allData: [],
    allDatas: [],
    sortType: "asc",
    sortBy: "name",
    from: 1,
    to: 0,
    page: 1,
    rowsPerPage: 5,
    pageCount: 0,
    limit: getRecordsPerPage(),
    isSortAsc: true,
    formDialogOpen: false,
    deleteFormDialogOpen: false,
    isLoading: true,
    isSuccessAlert: false,
    successMsg: "",
    isErrorAlert: false,
    errorMsg: "",
    isInfoAlert: false,
    infoMsg: "",
    productPageCount: 0,
    isAddProductActive: false,
    isEditProductActive: false,
    deleteFormDialogOpen: false,
    selectedId: 0,
    searchValidation: {
      name: "",
      kafkaTopic: "",
    },
    errors: {},
    areAllEditFormFieldsPopulated: false,
    isAdvancedSearchValidationText: false,
    isAuditTimelineActive: false,
    eventId: "",
    referenceId: "",
    auditEventId: "",
    headCells: [
      {
        id: "name",
        isActive: true,
        label: "InsuranceProviders.master.tableheader.Name.label",
      },
      {
        id: "kafkaTopic",
        isActive: true,
        label: "InsuranceProviders.master.tableheader.KafkaTopic.label",
      },
      {
        id: "logo",
        isActive: false,
        label: "InsuranceProviders.master.tableheader.Logo.label",
      },
      {
        id: "actions",
        isActive: false,
        label: "InsuranceProviders.master.tableheader.Actions.label",
      },
    ],
  });

  const dispatch = useDispatch();

  console.log("ALLDATA", state.allData);

  const showLoader = () => {
    setTimeout(() => {
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
      }));
    }, 1000);
  };

  const callLocalBaseURL = async () => {
    let result = await apigetUrl(
      `/insurance/providers?page=${state.page}&limit=${state.limit}&sortBy=${state.sortBy}&sortType=${state.sortType}`
    );
    if (result.data.responseCode === "200") {
      setTimeout(() => {
        setState((prevState) => ({
          ...prevState,
          data: result.data.dataList,
          page: result.data.pagination.page,
          pageCount: result.data.pagination.count,
          limit: result.data.pagination.limit,
          to: result.data.pagination.limit,
          from: 1,
          auditEventId: (result.data || {}).auditEventId,
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

  useEffect(() => {
    apiCallParams.set("page", state.page);
    apiCallParams.set("limit", state.limit);
    apiCallParams.set("sortBy", state.sortBy);
    apiCallParams.set("sortType", state.sortType);
    pageURL.search = apiCallParams.toString();
    console.log("pageURL = ", pageURL.href);
    setCurrentUrl(pageURL, apiInstance);
    callLocalBaseURL();
    callProducts();
  }, []);

  useEffect(() => {
    getProductName();
  }, [state.pageCount]);

  const getProductName = async () => {
    let result = await apigetUrl(
      `/insurance/products?page=${state.page}&limit=${state.pageCount}`
    );
    if (result.data.responseCode === "200") {
      let { dataList } = result.data || [];
      let response = dataList.map((n) => n);
      setState((prevState) => ({
        ...prevState,
        allDatas: response,
      }));
    } else {
      ippNotify.error(result.data.responseMessage);
    }
  };

  const callProducts = async () => {
    // api
    let result = await apigetUrl(`/insurance/products?page=1&limit=100`);
    if (result.data.responseCode === "200") {
      setState((prevState) => ({
        ...prevState,
        // allData: res.data.dataList,
        page: result.data.pagination.page,
        productPageCount: result.data.pagination.count,
      }));
    } else {
      ippNotify.error(result.data.responseMessage);
    }
  };

  const isSelectedFunc = (id) => {
    // return state.selected.indexOf(id) !== -1;
  };

  let history = useHistory();

  const onTableEditButtonClick = (e, id) => {
    console.log("ID", id);
    setState((prevState) => ({
      ...prevState,
      isEditProductActive: true,
      selectedId: id,
    }));
  };

  const handleEditFormSubmit = () => {
    let putObj = {
      name: state.name,
      logo: state.logo,
      kafka_topic: state.kafka_topic,
      integrationDetails: state.integrationDetails,
      productDetail: [
        {
          productName: state.productName,
          customized_name: state.customized_name,
        },
      ],
    };

    console.log("putObj", putObj);
  };

  const handleRequestClose = () => {
    setState((prevState) => ({
      ...prevState,
      formDialogOpen: false,
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

  const requestSortData = async (sortBy, sortType) => {
    console.log("property = ", sortBy);
    console.log("sortType = ", sortType);
    const { name, kafkaTopic } = state.searchValidation;
    apiCallParams.set("page", state.page);
    apiCallParams.set("limit", state.limit);
    apiCallParams.set("sortBy", sortBy);
    apiCallParams.set("sortType", sortType);
    let tempArr = [];
    if (!isEmpty(name)) tempArr.push({ name });
    if (!isEmpty(kafkaTopic)) tempArr.push({ kafkaTopic });
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

    setCurrentUrl(pageURL, apiInstance);

    const res = await apigetUrl(`/insurance/providers?` + searchParam);
    if (res.data.responseCode === "200") {
      setTimeout(() => {
        setState((prevState) => ({
          ...prevState,
          data: res.data.dataList,
          isLoading: false,
        }));
      }, 1000);
    } else {
      if (res.status === 401 || res.status === 402) {
        dispatch(verifyToken());
      } else {
        ippNotify.error(res.data.responseMessage);
        showLoader();
      }
    }
  };

  const handleChangeRowsPerPage = (event) => {
    console.log("RowsPerPage", event.target.value);
    let target = event.target;
    setState((prevState) => ({
      ...prevState,
      page: 1,
      isLoading: true,
    }));
    requestPageLimitCountChange(target.value);
  };

  const setPageCount = (pageCount) => {
    setState((prevState) => ({
      ...prevState,
      pageCount: pageCount,
    }));
  };

  const requestPageLimitCountChange = async (count) => {
    console.log("page limit change requested");
    console.log("count = ", count);

    apiCallParams.set("page", 1);
    apiCallParams.set("limit", count);
    apiCallParams.set("sortBy", state.sortBy);
    apiCallParams.set("sortType", state.sortType);

    pageURL.search = apiCallParams.toString();

    setCurrentUrl(pageURL, apiInstance);

    console.log("before call = ", pageURL.href);
    let getUrl = pageURL.pathname + pageURL.search;
    const res = await apigetUrl(`${getUrl}`);
    if (res.data.responseCode === "200") {
      console.log("res after rows per page change= ", res);
      setTimeout(() => {
        update_to(count);
        update_from(1);
        setState((prevState) => ({
          ...prevState,
          data: res.data.dataList,
          page: 1,
          pageCount: res.data.pagination.count,
          limit: res.data.pagination.limit,
          isLoading: false,
        }));
        pageNumber = 1;
      }, 1000);
    } else {
      if (res.status === 401 || res.status === 402) {
        dispatch(verifyToken());
      } else {
        ippNotify.error(res.data.responseMessage);
        showLoader();
      }
    }
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

  const onAddButtonClick = () => {
    setState((prevState) => ({
      ...prevState,
      isAddProductActive: true,
    }));
  };

  const getSuccessUpdate = () => {
    setState((prevState) => ({
      ...prevState,
      isSuccessAlert: true,
      successMsg: "Successfully New Data is Added",
    }));
  };

  const getErrorUpdate = (err) => {
    setState((prevState) => ({
      ...prevState,
      errorMsg: err?.response?.data?.responseMessage,
      isErrorAlert: true,
    }));
  };

  const closeAddProduct = () => {
    setState((prevState) => ({
      ...prevState,
      isAddProductActive: false,
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
    const { name, kafkaTopic } = state.searchValidation;
    if (!isEmpty(name)) {
    } else {
      apiCallParams.delete("name");
    }
    if (!isEmpty(kafkaTopic)) {
    } else {
      apiCallParams.delete("kafkaTopic");
    }
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));

    apiCallParams.set("page", pageNumber);
    apiCallParams.set("limit", limit);

    pageURL.search = apiCallParams.toString();

    console.log("pageURL.href = ", pageURL.href);
    let getUrl = pageURL.pathname + pageURL.search;
    const res = await apigetUrl(`${getUrl}`);
    if (res.data.responseCode === "200") {
      console.log("res after backend style pagination = ", res.data);
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
        setPageData(res.data.dataList);
        setPageNumber(res.data.pagination.page);
        setPageCount(res.data.pagination.count);
        setState((prevState) => ({
          ...prevState,
          page: pageNumber,
          isLoading: false,
        }));
      }, 1000);
    } else {
      if (res.status === 401 || res.status === 402) {
        dispatch(verifyToken());
      } else {
        ippNotify.error(res.data.responseMessage);
        showLoader();
      }
    }
  };

  const onTableDeleteButtonClick = (event, id) => {
    console.log("DeleteId", id);
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
    console.log("onDeleteButtonClickedIndex = ", onDeleteButtonClickedIndex);
  };

  const handleDeleteDialogClose = (e) => {
    setState((prevState) => ({
      ...prevState,
      deleteFormDialogOpen: false,
    }));
  };

  const onDeleteConfirm = () => {
    deleteItem();
    console.log("Delete");
  };
  const deleteItem = () => {
    console.log("DeleteId", state.selectedId);
    // api
    apideleteUrl(`/insurance/providers/${state.selectedId}`).then((res) => {
      if (`${res.status}` !== "200") {
        ippNotify.error(res.data.responseMessage);
        setState((prevState) => ({
          ...prevState,
          isErrorAlert: true,
          errorMsg: "Failed to Update",
        }));
        return false;
      }

      ippNotify.success("Deleted Successfully");
      setState((prevState) => ({
        ...prevState,
        deleteFormDialogOpen: false,
        successMsg: "Deleted Successfully",
        isSuccessAlert: true,
        isLoading: true,
      }));
      callLocalBaseURL();
    });
  };

  const closeEditProduct = () => {
    setState((prevState) => ({
      ...prevState,
      isEditProductActive: false,
    }));
  };

  const advanceSearchValidateProperty = ({ name, value }) => {
    console.log("name = ", name, "value = ", value, typeof value);
    const obj = { [name]: value };
    const propertySchema = {
      [name]: advancedSearchValidationSchema[name],
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

  const handleAdvanceSearchChange = (event) => {
    const { target: input } = event;
    const errors = { ...state.errors };
    const errorMessage = advanceSearchValidateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const searchValidation = { ...state.searchValidation };
    searchValidation[input.name] = input.value;

    let isAnyFormFieldsPopulated = false;
    isAnyFormFieldsPopulated =
      searchValidation.name !== "" ||
      searchValidation.kafkaTopic !== "" ||
      console.log("allFormFieldsPopulated = ", isAnyFormFieldsPopulated);
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
    apiCallParams.delete("name");
    apiCallParams.delete("kafkaTopic");
    const { name, kafkaTopic } = state.searchValidation;
    e.preventDefault();

    if (name === "" && kafkaTopic === "") {
      console.log("when no data entered");
      setState((prevState) => ({
        ...prevState,
        isAdvancedSearchValidationText: true,
        errors: {},
      }));
      return;
    } else if (name === "" || kafkaTopic === "") {
      console.log("when any data entered");
      setState((prevState) => ({
        ...prevState,
        isAdvancedSearchValidationText: false,
        errors: {},
      }));
    } else {
      console.log("when both data entered");
      setState((prevState) => ({
        ...prevState,
        isAdvancedSearchValidationText: false,
        errors: {},
      }));
    }

    console.log("name", name);
    console.log("code", kafkaTopic);

    console.log(`"name = "${name},"kafkaTopic = "${kafkaTopic}`);

    let tempArr = [];
    if (!isEmpty(name)) tempArr.push({ name });
    if (!isEmpty(kafkaTopic)) tempArr.push({ kafkaTopic });

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

    console.log("to string = ", apiCallParams.toString());
    pageURL.search = apiCallParams.toString();
    console.log("pageURL = ", pageURL);
    // search(pageURL.href);
    search(apiCallParams.toString());
  };

  const search = async (searchURL) => {
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    apigetUrl(`/insurance/providers?` + searchURL)
      .then((res) => {
        setTimeout(() => {
          console.log("advanced serach data = ", res.data);

          setAdvancedSearchData(res.data.dataList);
          setPageNumber(res.data.pagination.page);
          setPageCount(res.data.pagination.count);
          setState((prevState) => ({
            ...prevState,
            isLoading: false,
          }));
        }, 1000);
      })
      .catch((error) => {
        console.log("Advanced Search Error", error);
        setState((prevState) => ({
          ...prevState,
          isInfoAlert: true,
          errorMsg: error.response.data.responseMessage,
          to: 0,
          pageCount: 0,
          isLoading: false,
        }));
      });
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
    apiCallParams.delete("kafkaTopic");

    pageURL.search = apiCallParams.toString();

    console.log("pageURL.href = ", pageURL.href);

    const res = await apigetUrl(
      `/insurance/providers?page=1&limit=${state.limit}&sortBy=${state.sortBy}&sortType=${state.sortType}`
    );
    if (res.data.responseCode === "200") {
      setTimeout(() => {
        console.log("res = ", res.data.dataList);
        setState((prevState) => ({
          ...prevState,
          searchValidation: {
            name: "",
            kafkaTopic: "",
          },
          isInfoAlert: false,
          isAdvancedSearchValidationText: false,
          errors: {},
          isLoading: false,
        }));
        setResetData(res.data.dataList);
        setPageNumber(1);
        setPageCount(res.data.pagination.count);
        setCurrentUrl(pageURL, apiInstance);
      }, 1000);
    } else {
      if (res.status === 401 || res.status === 402) {
        dispatch(verifyToken());
      } else {
        ippNotify.error(res.data.responseMessage);
        showLoader();
      }
    }
  };

  const onAdvancedSearchClickClean = () => {
    setState((prevState) => ({
      ...prevState,
      searchValidation: {
        name: "",
        kafkaTopic: "",
      },
      isAdvancedSearchValidationText: false,
      errors: {},
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

  console.log("InfoModal", state.data.length);
  return (
    <React.Fragment>
      {state.isAuditTimelineActive ? (
        <AuditTimeline
          closeAuditTimeline={handleCloseAuditTimeline}
          eventId={state.eventId}
          referenceId={state.referenceId}
        />
      ) : state.isAddProductActive === true ? (
        <div>
          <AddInsuranceProvider
            page={state.page}
            pageCount={state.productPageCount}
            getSuccessUpdate={getSuccessUpdate}
            getErrorUpdate={getErrorUpdate}
            closeAddProduct={closeAddProduct}
            callLocalBaseURL={callLocalBaseURL}
          />
        </div>
      ) : state.isEditProductActive === true ? (
        <div>
          <EditInsuranceProvider
            page={state.page}
            pageCount={state.productPageCount}
            getSuccessUpdate={getSuccessUpdate}
            getErrorUpdate={getErrorUpdate}
            closeEditProduct={closeEditProduct}
            callLocalBaseURL={callLocalBaseURL}
            selectedId={state.selectedId}
            allDatas={state.allDatas}
          />
        </div>
      ) : (
        <div className="App">
          <Dialog
            maxWidth="xs"
            open={state.formDialogOpen}
            onClose={handleRequestClose}
          >
            <DialogTitle>Edit Sub Category</DialogTitle>
            <DialogContent></DialogContent>
            <DialogActions>
              <Button
                onClick={(e) => handleRequestClose(e)}
                variant="contained"
                color="secondary"
              >
                Cancel
              </Button>
              <Button
                onClick={(e) => handleEditFormSubmit(e)}
                color="primary"
                variant="contained"
                disabled={!state.isEditFormSubmitDisabled}
              >
                Submit
              </Button>
            </DialogActions>
          </Dialog>

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
                <IntlMessages id="InsuranceProviders.master.modal.deleteconfrimation.message" />
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
              <div className="audit-master-box">
                <EnhancedTableToolbar
                  completeState={state}
                  onAddButtonClick={onAddButtonClick}
                  handleAdvanceSearchChange={handleAdvanceSearchChange}
                  handleApplyClick={handleApplyClick}
                  callResetData={callResetData}
                  onAdvancedSearchClickClean={onAdvancedSearchClickClean}
                  setResetData={setResetData}
                  isAdvancedSearchValidationText={
                    state.isAdvancedSearchValidationText
                  }
                  error={state.errors}
                  callLocalBaseURL={callLocalBaseURL}
                  searchValidation={state.searchValidation}
                />

                <div className="flex-auto">
                  <IPPNotification />
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
                                <TableCell>{n.kafkaTopic}</TableCell>
                                <TableCell>
                                  <img height="60px" src={n.logo} />
                                </TableCell>

                                <TableCell padding="none" padding="none">
                                  <Tooltip
                                    title={
                                      <IntlMessages id="InsuranceProviders.Tooltip.Edit" />
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
                                      <IntlMessages id="InsuranceProviders.Tooltip.Delete" />
                                    }
                                  >
                                    <IconButton
                                      style={{ marginLeft: "-10px" }}
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
                                        <IntlMessages id="InsuranceProviders.Tooltip.View" />
                                      }
                                    >
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
            <IPPNotification />
          </Grid>
        </div>
      )}
    </React.Fragment>
  );
};

export default App;
