import React, { useState, useEffect } from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import InfoModal from "../Modal/Info";
import { useHistory } from "react-router-dom";
import TablePaginationComponent from "../CommonComponents/TablePaginationComponent";
import "./master.css";
import {
  TableFooter,
  TableCell,
  TableBody,
  IconButton,
  Tooltip,
  TableRow,
  Button,
  Grid,
  Table,
} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import EditIcon from "@material-ui/icons/Edit";
import IntlMessages from "util/IntlMessages";

import EnhancedTableHead from "../CommonComponents/TableHeadComponent";
import EnhancedTableToolbar from "./EnhancedTableToolbar";
import Joi from "joi-browser";
import { apigetUrl, apideleteUrl } from "../../../../../setup/middleware";
import AddUserManagement from "./AddUserManagement";
import EditUserManagement from "./EditUserManagement";
import {
  IPPNotification,
  ippNotify,
} from "../CommonComponents/IPPNotification";
import { getRecordsPerPage } from "../../../../../setup/ApplicatoinConfigurations.js";
import "../CommonComponents/tableStyle.css";
import AuditTimeline from "../CommonComponents/AuditTimeline/AuditTimeline";
import { Visibility } from "@material-ui/icons";
import Loader from "../CommonComponents/Loader";
import { useDispatch } from "react-redux";
import { verifyToken } from "../../../../../actions/Auth";

const baseURL = `${process.env.REACT_APP_BASE_URL}`;
const perPageURL = `/auth/users`;
const pageURL = new URL(baseURL + perPageURL);
let apiCallParams = new URLSearchParams(pageURL.search);

let pageNumber = 1;
//schema
const schema = {
  username: Joi.string()
    .required()
    .label("username"),
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
  const dispatch = useDispatch();

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
    setState((prevState) => ({ ...prevState, currentUrl }));
  };

  //state
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
      username: "",
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
        id: "username",
        isActive: false,
        label: "UserManagement.master.tableheader.Username.label",
      },
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

  //loader
  const showLoader = () => {
    setTimeout(() => {
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
      }));
    }, 1000);
  };

  //edit
  const onTableEditButtonClick = async (event, id) => {
    setState((prevState) => ({
      ...prevState,
      isEditUserManagementActive: true,
      selectedId: id,
    }));
  };

  //delete
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
      if (result.status === 401 || result.status === 402) {
        dispatch(verifyToken());
      } else {
        ippNotify.error("Failed to Delete");
        setState((prevState) => ({
          ...prevState,
          formDialogOpen: false,
          isErrorAlert: true,
          errorMsg: "Failed to Delete",
        }));
      }
    }
  };

  //delete button click
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

  //delete Form NoConfirm
  const deleteForm_NoConfirm = () => {
    setState((prevState) => ({
      ...prevState,
      deleteItem_DialogOpen: false,
    }));
  };

  //delete Form YesConfirm
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

  //delete form
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

  //default function to load
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

  //sort
  const requestSortData = async (sortBy, sortType) => {
    apiCallParams.set("page", state.page);
    apiCallParams.set("limit", state.limit);
    apiCallParams.set("sortBy", sortBy);
    apiCallParams.set("sortType", sortType);
    const { username, firstName, lastName, email } = state.searchValidation;
    if (!isEmpty(username)) {
      apiCallParams.set("username", username);
    } else {
      apiCallParams.delete("username");
    }
    if (!isEmpty(firstName)) {
      apiCallParams.set("firstName", firstName);
    } else {
      apiCallParams.delete("firstName");
    }
    if (!isEmpty(lastName)) {
      apiCallParams.set("lastName", lastName);
    } else {
      apiCallParams.delete("lastName");
    }
    if (!isEmpty(email)) {
      apiCallParams.set("email", email);
    } else {
      apiCallParams.delete("email");
    }

    let searchParam = apiCallParams.toString();
    pageURL.search = apiCallParams.toString();

    setCurrentUrl(pageURL);

    const result = await apigetUrl(`/auth/users?` + searchParam);
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

  //handle Select All Click
  const handleSelectAllClick = (event, checked) => {
    if (checked) {
      setState({ selected: state.data.map((n) => n.id) });
      return;
    }
    setState({ selected: [] });
  };

  //request Page Limit Count Change
  const requestPageLimitCountChange = async (count) => {
    let res = "";

    apiCallParams.set("page", 1);
    apiCallParams.set("limit", count);
    apiCallParams.set("sortBy", state.sortBy);
    apiCallParams.set("sortType", state.sortType);
    const { username, firstName, lastName, email } = state.searchValidation;
    if (!isEmpty(username)) {
      apiCallParams.set("username", username);
    } else {
      apiCallParams.delete("username");
    }
    if (!isEmpty(firstName)) {
      apiCallParams.set("firstName", firstName);
    } else {
      apiCallParams.delete("firstName");
    }
    if (!isEmpty(lastName)) {
      apiCallParams.set("lastName", lastName);
    } else {
      apiCallParams.delete("lastName");
    }
    if (!isEmpty(email)) {
      apiCallParams.set("email", email);
    } else {
      apiCallParams.delete("email");
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

  //is Selected Func
  const isSelectedFunc = (id) => {
    return state.selected.indexOf(id) !== -1;
  };

  //handle Change Rows Per Page
  const handleChangeRowsPerPage = (event) => {
    let target = event.target;
    setState((prevState) => ({
      ...prevState,
      page: 1,
      isLoading: true,
    }));
    requestPageLimitCountChange(target.value);
  };

  //handle Delete Item RequestClose
  const handle_Delete_Item_RequestClose = () => {
    setState((prevState) => ({
      ...prevState,
      deleteItem_DialogOpen: false,
    }));
  };

  //handle Edit Form RequestClose
  const handle_Edit_Form_RequestClose = () => {
    setState((prevState) => ({
      ...prevState,
      editForm_DialogOpen: false,
    }));
  };

  //validate Property
  const validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const propertySchema = { [name]: schema[name] };
    const { error } = Joi.validate(obj, propertySchema);
    return error ? error.details[0].message : null;
  };

  //is Obj Empty
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

  //on Add Button Click
  const onAddButtonClick = (e) => {
    setState((prevState) => ({
      ...prevState,
      isAddUserManagementActive: true,
    }));
  };

  //close Add User Management
  const closeAddUserManagement = () => {
    setState((prevState) => ({
      ...prevState,
      isAddUserManagementActive: false,
    }));
  };

  //close Edit User Management
  const closeEditUserManagement = () => {
    setState((prevState) => ({
      ...prevState,
      isEditUserManagementActive: false,
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

  //get Success Update
  const getSuccessUpdate = () => {
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    ippNotify.success(" Successfully New User is Added");
  };

  //get Error Update
  const getErrorUpdate = (err) => {
    let error = err.data.responseMessage;
    ippNotify.error(error);
  };

  //get Edit Success Update
  const getEditSuccessUpdate = () => {
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    ippNotify.success(" Successfully Updated");
  };

  //get Edit Error Update
  const getEditErrorUpdate = (err) => {
    let error = err.data.responseMessage;
    ippNotify.error(error);
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

  //handle Search Click
  const handleSearchClick = (e) => {
    apiCallParams.delete("name");
    apiCallParams.delete("username");
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

    const { username, firstName, lastName, email } = state.searchValidation;
    let tempArr = [];
    if (!isEmpty(username)) tempArr.push({ username });
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

  //is empty
  const isEmpty = (str) => {
    return !str || 0 === str.length;
  };

  //pagination
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
    const { username, firstName, lastName, email } = state.searchValidation;
    if (!isEmpty(username)) {
      apiCallParams.set("username", username);
    } else {
      apiCallParams.delete("username");
    }
    if (!isEmpty(firstName)) {
      apiCallParams.set("firstName", firstName);
    } else {
      apiCallParams.delete("firstName");
    }
    if (!isEmpty(lastName)) {
      apiCallParams.set("lastName", lastName);
    } else {
      apiCallParams.delete("lastName");
    }
    if (!isEmpty(email)) {
      apiCallParams.set("email", email);
    } else {
      apiCallParams.delete("email");
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
    const result = await apigetUrl(`/auth/users?` + searchURL);
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
        }));
        showLoader();
      }
    }
  };

  //reset
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
            username: "",
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
      setPageNumber(1);
      setPageCount(result.data.pagination.count);
      setCurrentUrl(pageURL);
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
        username: "",
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
          <AddUserManagement
            getSuccessUpdate={getSuccessUpdate}
            getErrorUpdate={getErrorUpdate}
            closeAddUserManagement={closeAddUserManagement}
            callLocalBaseURL={callLocalBaseURL}
          />
        </div>
      ) : state.isEditUserManagementActive === true ? (
        <div>
          <EditUserManagement
            getEditSuccessUpdate={getEditSuccessUpdate}
            getEditErrorUpdate={getEditErrorUpdate}
            closeEditUserManagement={closeEditUserManagement}
            callLocalBaseURL={callLocalBaseURL}
            selectedId={state.selectedId}
          />
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
                                <TableCell>{n.username}</TableCell>
                                <TableCell>
                                  {n.firstName + " " + n.lastName}
                                </TableCell>
                                <TableCell>{n.email}</TableCell>
                                <TableCell>{n.mobileNumber}</TableCell>
                                <TableCell padding="none">
                                  <Tooltip
                                    title={
                                      <IntlMessages id="UserManagement.Tooltip.Edit" />
                                    }
                                  >
                                    <IconButton
                                      id={n.keyCloakId}
                                      onClick={(e) =>
                                        onTableEditButtonClick(e, n.keyCloakId)
                                      }
                                    >
                                      <EditIcon color="primary" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip
                                    title={
                                      <IntlMessages id="UserManagement.Tooltip.Delete" />
                                    }
                                  >
                                    <IconButton
                                      id={n.keyCloakId}
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
