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
import { useHistory } from "react-router-dom";
import SuccessModal from "../Modal/Success";
import ErrorModal from "../Modal/Error";
import TablePaginationComponent from "../CommonComponents/TablePaginationComponent";
import "./root.component.css";
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
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import EditIcon from "@material-ui/icons/Edit";
import IntlMessages from "util/IntlMessages";

import EnhancedTableHead from "../CommonComponents/TableHeadComponent";
import EnhancedTableToolbar from "./EnhancedTableToolbar";
import { data } from "./../../../dashboard/routes/News/data";
import Joi from "joi-browser";
import { Alert, AlertTitle } from "@material-ui/lab";
import CloseIcon from "@material-ui/icons/Close";
import {
  apigetUrl,
  apipostUrl,
  apiputUrl,
  apideleteUrl,
} from "../../../../../setup/middleware";
// import InputField from "../CommonComponents/TextField";
// import InputSubmitButton from "../CommonComponents/SubmitButton";
// import InputCancelButton from "../CommonComponents/CancelButton";
// import AddUserManagement from "./AddUserManagement";
// import EditUserManagement from "./EditUserManagement";
import {
  IPPNotification,
  ippNotify,
} from "../CommonComponents/IPPNotification";
import { getRecordsPerPage } from "../../../../../setup/ApplicatoinConfigurations.js";
import "../CommonComponents/tableStyle.css";
import AuditTimeline from "../CommonComponents/AuditTimeline/AuditTimeline";
import { Visibility } from "@material-ui/icons";
import Loader from "../CommonComponents/Loader";

// const config = {
//   headers: {
//     accept: "application/json",
//   },
//   data: {},
// };

const baseURL = `${process.env.REACT_APP_BASE_URL}`;
const perPageURL = `/auth/users`;
const pageURL = new URL(baseURL + perPageURL);
let apiCallParams = new URLSearchParams(pageURL.search);

const api = axios.create({
  baseURL: baseURL,
});

let pageNumber = 1;

const schema = {
  userName: Joi.string()
    .required()
    .label("userName"),
  firstName: Joi.string()
    .required()
    .label("firstName"),
  lastName: Joi.string()
    .required()
    .label("lastName"),
  email: Joi.string()
    .required()
    .label("email"),
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
    setState((prevState) => ({ ...prevState, currentUrl }));
  };

  const [state, setState] = useState({
    isAddUserManagementActive: false,
    isEditUserManagementActive: false,
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
    sortBy: "username",
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
      name: "",
      description: "",
    },
    menuItem: [],
    itemName: "",
    menuItemId: "",
    searchValidation: {
      userName: "",
      firstName: "",
      lastName: "",
      email: "",
    },
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
    selectedId: 0,
    isAuditTimelineActive: false,
    eventId: "",
    referenceId: "",
    auditEventId: "",
    isLoading: true,
    headCells: [
      {
        id: "Name",
        isActive: false,
        label: "UserManagement.master.tableheader.name.label",
      },
      {
        id: "EmailId",
        isActive: false,
        label: "UserManagement.master.tableheader.EmailId.label",
      },
      {
        id: "mobileno",
        isActive: false,
        label: "UserManagement.master.tableheader.mobileno.label",
      },
      {
        id: "actions",
        isActive: false,
        label: "producttype.master.tableheader.Actions.label",
      },
    ],
  });

  const showLoader = () => {
    setTimeout(() => {
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
      }));
    }, 1000);
  };

  const onTableEditButtonClick = async (event, id) => {
    setState((prevState) => ({
      ...prevState,
      isEditUserManagementActive: true,
      selectedId: id,
    }));
  };

  const deleteItemInBackend = async (id) => {
    const result = await apideleteUrl(`/auth/users/` + id);
    if (result.status === 200) {
      ippNotify.success("Successfully Deleted");
      setState((prevState) => ({
        ...prevState,
        formDialogOpen: false,
        isSuccessAlert: true,
        deleteFormDialogOpen: false,
        successMsg: "Successfully Deleted",
        isLoading: true,
      }));

      callLocalBaseURL();
    } else {
      ippNotify.error("Failed to Delete");
      setState((prevState) => ({
        ...prevState,
        formDialogOpen: false,
        isErrorAlert: true,
        errorMsg: "Failed to Delete",
      }));
    }
  };

  const onTableDeleteButtonClick = (event) => {
    const onDeleteButtonClickedIndex = state.data
      .map(function(e) {
        return e.id;
      })
      .indexOf(parseInt(event.currentTarget.id));

    setState((prevState) => ({
      ...prevState,
      deleteItem_DialogOpen: true,
      selectedDeleteId: event.currentTarget.id,
    }));
  };

  const showApiData = (apiData) => {
    // console.log("apidata = ", apiData);
  };

  const deleteForm_NoConfirm = () => {
    setState((prevState) => ({
      ...prevState,
      deleteItem_DialogOpen: false,
    }));
  };
  const deleteForm_YesConfirm = () => {
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    deleteItemInBackend(state.selectedDeleteId);
    setState((prevState) => ({
      ...prevState,
      deleteItem_DialogOpen: false,
    }));
  };

  const deleteItem_content = (
    <>
      <DialogTitle>
        <IntlMessages id="ipp.common.modal.deleteconfirmation.title" />
      </DialogTitle>
      <DialogContent>
        <p>
          <b>
            <IntlMessages id="user.master.modal.deleteconfrimation.message" />
          </b>
        </p>
      </DialogContent>
      <DialogActions>
        <Button onClick={(e) => deleteForm_YesConfirm(e)} color="secondary">
          <IntlMessages id="ipp.common.Yes.button" />
        </Button>
        <Button onClick={(e) => deleteForm_NoConfirm(e)} color="primary">
          <IntlMessages id="ipp.common.No.button" />
        </Button>
      </DialogActions>
    </>
  );

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
      `/auth/users?page=${state.page}&limit=${state.limit}`
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
    } else {
      ippNotify.error(result.data.responseMessage);
      showLoader();
    }
  };

  const requestSortData = async (sortBy, sortType) => {
    apiCallParams.set("page", state.page);
    apiCallParams.set("limit", state.limit);
    apiCallParams.set("sortBy", sortBy);
    apiCallParams.set("sortType", sortType);

    pageURL.search = apiCallParams.toString();

    setCurrentUrl(pageURL);

    const result = await apigetUrl(
      `/auth/users?page=${state.page}&limit=${state.limit}&sortBy=${sortBy}&sortType=${sortType}`
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

  const handleSelectAllClick = (event, checked) => {
    if (checked) {
      setState({ selected: state.data.map((n) => n.id) });
      return;
    }
    setState({ selected: [] });
  };

  const requestPageLimitCountChange = async (count) => {
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
      }, 1000);
      pageNumber = 1;
    } else {
      ippNotify.error(result.data.responseMessage);
      showLoader();
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
      isLoading: true,
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

  const updateEditInBackend = async () => {};
  const handleEditFormSubmit = async (e) => {
    updateEditInBackend();
  };

  const validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
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

  const onAddButtonClick = (e) => {
    setState((prevState) => ({
      ...prevState,
      isAddUserManagementActive: true,
    }));
  };

  const closeAddUserManagement = () => {
    setState((prevState) => ({
      ...prevState,
      isAddUserManagementActive: false,
    }));
  };

  const closeEditUserManagement = () => {
    setState((prevState) => ({
      ...prevState,
      isEditUserManagementActive: false,
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
      isLoading: true,
    }));
    ippNotify.success(" Successfully New User is Added");
  };

  const getErrorUpdate = (err) => {
    let error = err.data.responseMessage;
    ippNotify.error(error);
  };

  const getEditSuccessUpdate = () => {
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    ippNotify.success(" Successfully Updated");
  };

  const getEditErrorUpdate = (err) => {
    let error = err.data.responseMessage;
    ippNotify.error(error);
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

    const searchValidation = { ...state.searchValidation };
    searchValidation[input.name] = input.value;

    let isAnyFormFieldsPopulated = false;
    isAnyFormFieldsPopulated =
      searchValidation.name !== "" || searchValidation.description !== "";

    setState((prevState) => ({
      ...prevState,
      errors,
      searchValidation,
      isAdvancedSearchValidationText:
        isAnyFormFieldsPopulated && isObjEmpty(errors),
    }));
  };

  const handleSearchClick = (e) => {
    apiCallParams.delete("name");
    apiCallParams.delete("userName");
    apiCallParams.delete("firstName");
    apiCallParams.delete("lastName");
    apiCallParams.delete("email");
    if (state.searchValidation.name === "") {
      setState((prevState) => ({
        ...prevState,
        isAdvancedSearchValidationText: false,
      }));
      return;
    } else {
      setState((prevState) => ({
        ...prevState,
        isAdvancedSearchValidationText: true,
        errors: {},
      }));
    }
    e.preventDefault();

    const {
      name,
      key,
      fieldType,
      isEditable,
      userName,
      firstName,
      lastName,
      email,
    } = state.searchValidation;
    let tempArr = [];
    if (!isEmpty(name)) tempArr.push({ name });
    if (!isEmpty(key)) tempArr.push({ key });
    if (!isEmpty(fieldType)) tempArr.push({ fieldType });
    if (!isEmpty(isEditable)) tempArr.push({ isEditable });
    if (!isEmpty(userName)) tempArr.push({ userName });
    if (!isEmpty(firstName)) tempArr.push({ firstName });
    if (!isEmpty(lastName)) tempArr.push({ lastName });
    if (!isEmpty(email)) tempArr.push({ email });

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
    setState((prevState) => ({
      ...prevState,
      page: pageNumber,
      isLoading: true,
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
      showLoader();
    }
  };

  const search = async (searchURL) => {
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    const result = await apigetUrl(`/auth/users?` + searchURL);
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
    apiCallParams.delete("userName");
    apiCallParams.delete("firstName");
    apiCallParams.delete("lastName");
    apiCallParams.delete("email");

    pageURL.search = apiCallParams.toString();

    const result = await apigetUrl(
      `/auth/users?page=${state.page}&limit=${state.limit}&sortBy=${state.sortBy}&sortType=${state.sortType}`
    );
    if (result.data.responseCode === "200") {
      setTimeout(() => {
        setState((prevState) => ({
          ...prevState,
          searchValidation: {
            userName: "",
            firstName: "",
            lastName: "",
            email: "",
          },
          isInfoAlert: false,
          isAdvancedSearchValidationText: true,
          errors: {},
          isLoading: false,
        }));
      }, 1000);
      setResetData(result.data.dataList);
      setPageNumber(result.data.pagination.page);
      setPageCount(result.data.pagination.count);
      setCurrentUrl(pageURL);
    } else {
      ippNotify.error(result.data.responseMessage);
    }
  };

  const onAdvancedSearchClickClean = () => {
    setState((prevState) => ({
      ...prevState,
      searchValidation: {
        userName: "",
        firstName: "",
        lastName: "",
        email: "",
      },
      isAdvancedSearchValidationText: true,
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
    <React.Fragment>
      {state.isAuditTimelineActive ? (
        <AuditTimeline
          closeAuditTimeline={handleCloseAuditTimeline}
          eventId={state.eventId}
          referenceId={state.referenceId}
        />
      ) : state.isAddUserManagementActive === true ? (
        <div>
          {/* <AddUserManagement
            getSuccessUpdate={getSuccessUpdate}
            getErrorUpdate={getErrorUpdate}
            closeAddUserManagement={closeAddUserManagement}
            callLocalBaseURL={callLocalBaseURL}
          /> */}
        </div>
      ) : state.isEditUserManagementActive === true ? (
        <div>
          {/* <EditUserManagement
            getEditSuccessUpdate={getEditSuccessUpdate}
            getEditErrorUpdate={getEditErrorUpdate}
            closeEditUserManagement={closeEditUserManagement}
            callLocalBaseURL={callLocalBaseURL}
            selectedId={state.selectedId}
          /> */}
        </div>
      ) : (
        <div className="App">
          <Dialog
            maxWidth="sm"
            open={state.editForm_DialogOpen}
            onClose={handle_Edit_Form_RequestClose}
          ></Dialog>
          <Dialog
            maxWidth="sm"
            open={state.deleteItem_DialogOpen}
            onClose={handle_Delete_Item_RequestClose}
          >
            {deleteItem_content}
          </Dialog>
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
                  onAddButtonClick={onAddButtonClick}
                  numSelected={state.selected.length}
                  page={state.page}
                  limit={state.limit}
                  sortBy={state.sortBy}
                  sortType={state.sortType}
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
                  onAdvancedSearchClickClean={onAdvancedSearchClickClean}
                />

                <div className="flex-auto">
                  <div className="table-responsive-material">
                    <Table>
                      <EnhancedTableHead
                        numSelected={state.selected.length}
                        order={state.sortType}
                        orderBy={state.sortBy}
                        onSelectAllClick={handleSelectAllClick}
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
                                  {n.firstName + " " + n.lastName}
                                </TableCell>
                                <TableCell>{n.email}</TableCell>
                                <TableCell>{n.mobileNumber}</TableCell>
                                <TableCell padding="none">
                                  <IconButton
                                    id={n.keyCloakId}
                                    onClick={(e) =>
                                      onTableEditButtonClick(e, n.keyCloakId)
                                    }
                                  >
                                    <EditIcon color="primary" />
                                  </IconButton>
                                  <IconButton
                                    id={n.keyCloakId}
                                    onClick={(e) => onTableDeleteButtonClick(e)}
                                  >
                                    <DeleteIcon color="secondary" />
                                  </IconButton>
                                  {state.auditEventId >= 1 ? (
                                    <Tooltip title="View Audit Timeline">
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
    </React.Fragment>
  );
}

export default App;
