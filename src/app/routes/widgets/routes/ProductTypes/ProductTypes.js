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
import InputField from "../CommonComponents/TextField";
import InputSubmitButton from "../CommonComponents/SubmitButton";
import InputCancelButton from "../CommonComponents/CancelButton";
import {
  IPPNotification,
  ippNotify,
} from "../CommonComponents/IPPNotification";
import { getRecordsPerPage } from "../../../../../setup/ApplicatoinConfigurations.js";
import "../CommonComponents/tableStyle.css";
import AuditTimeline from "../CommonComponents/AuditTimeline/AuditTimeline";
import { Visibility } from "@material-ui/icons";
import Loader from "../CommonComponents/Loader";
import { useDispatch, useSelector } from "react-redux";
import {verifyToken} from "../../../../../actions/Auth";

// const config = {
//   headers: {
//     accept: "application/json",
//   },
//   data: {},
// };

const baseURL = `${process.env.REACT_APP_BASE_URL}`;
const perPageURL = `/insurance/product-types`;
const pageURL = new URL(baseURL + perPageURL);
let apiCallParams = new URLSearchParams(pageURL.search);

const api = axios.create({
  baseURL: baseURL,
});

let pageNumber = 1;

const schema = {
  name: Joi.string()
    .required()
    .label("Name"),
  description: Joi.string()
    .required()
    .label("Description"),
};

function App() {

  const dispatch = useDispatch();

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
    sortBy: "name",
    editForm_DialogOpen: false,
    selectedEditId: "",
    selectedDeleteId: "",
    isLoading: true,
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
      name: "",
      description: "",
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
    isAuditTimelineActive: false,
    eventId: "",
    referenceId: "",
    auditEventId: "",
    headCells: [
      {
        id: "name",
        isActive: true,
        label: "producttype.master.tableheader.Name.label",
      },
      {
        id: "description",
        isActive: false,
        label: "producttype.master.tableheader.Description.label",
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

  const onTableEditButtonClick = async (event) => {
    let currentTarget = event.currentTarget;
    const result = await apigetUrl(
      `/insurance/product-types/` + currentTarget.id
    );
    if (result.data.responseCode === "200") {
      setState((prevState) => ({
        ...prevState,
        editForm_DialogOpen: true,
        selectedEditId: currentTarget.id,
        validation: {
          name: result.data.name,
          description: result.data.description,
          rowVersion: result.data.rowVersion,
        },
      }));
    } else {
      ippNotify.error(result.data.responseMessage);
    }
  };

  const deleteItemInBackend = async (id) => {
    const result = await apideleteUrl(`/insurance/product-types/` + id);
    if (result.status === 200) {
      ippNotify.success("Successfully deleted");
      setState((prevState) => ({
        ...prevState,
        formDialogOpen: false,
        isSuccessAlert: true,
        deleteFormDialogOpen: false,
        isLoading: true,
        successMsg: "Successfully Deleted",
      }));
      callLocalBaseURL();
    }
    else{
      if(result.status===401||result.status===402){
        dispatch(verifyToken())
      }
	  else{
      ippNotify.success("Failed To delete");
      showLoader();
	  }
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

  const editTableContent = (
    <>
      <DialogTitle>
        <IntlMessages id="ipp.common.reset.button" />
      </DialogTitle>
      <DialogContent>
        <InputField
          autoFocus
          id="name"
          className="mb-3"
          label={<IntlMessages id="producttype.master.modal.edit.felid.Name" />}
          name="name"
          onChange={(e) => handleEditFormChange(e)}
          value={state.validation.name}
          fullWidth
          error={state.errors.name}
          helperText={state.errors.name}
        />
        <InputField
          id="description"
          className="mb-3"
          label={
            <IntlMessages id="producttype.master.modal.edit.felid.Description" />
          }
          name="description"
          onChange={(e) => handleEditFormChange(e)}
          value={state.validation.description}
          fullWidth
          error={state.errors.description}
          helperText={state.errors.description}
        />
      </DialogContent>
      <DialogActions>
        <InputCancelButton onClick={(e) => handle_Edit_Form_RequestClose(e)} />
        <InputSubmitButton
          onClick={(e) => handleEditFormSubmit(e)}
          disabled={!state.isEditFormSubmitDisabled}
        />
      </DialogActions>
    </>
  );
  const deleteForm_NoConfirm = () => {
    setState((prevState) => ({
      ...prevState,
      deleteItem_DialogOpen: false,
    }));
  };
  const deleteForm_YesConfirm = () => {
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
            <IntlMessages id="producttype.master.modal.deleteconfrimation.message" />
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
      `/insurance/product-types?page=${state.page}&limit=${state.limit}`
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
      if(result.status===401||result.status===402){
        dispatch(verifyToken())
      }
	  else{
	   ippNotify.error(result.data.responseMessage);
      showLoader();
	  }
    }
  };

  const requestSortData = async (sortBy, sortType) => {
    const { name, key, fieldType, isEditable } = state.searchValidation;
    let tempArr = [];
    if (!isEmpty(name)) tempArr.push({ name });
    if (!isEmpty(key)) tempArr.push({ key });
    if (!isEmpty(fieldType)) tempArr.push({ fieldType });
    if (!isEmpty(isEditable)) tempArr.push({ isEditable });

    apiCallParams.set("page", state.page);
    apiCallParams.set("limit", state.limit);
    apiCallParams.set("sortBy", sortBy);
    apiCallParams.set("sortType", sortType);

    tempArr.map((p) => {
      for (var key in p) {
        if (p.hasOwnProperty(key)) {
          apiCallParams.set(key, p[key]);
        }
      }
    });

    let searchParam = apiCallParams.toString()
    pageURL.search = apiCallParams.toString();

    setCurrentUrl(pageURL);

    const result = await apigetUrl(`/insurance/product-types?`+searchParam);
    if (result.data.responseCode === "200") {
      setTimeout(() => {
      setState((prevState) => ({
        ...prevState,
        data: result.data.dataList,
        isLoading: false,
      }));
    }, 1000);
    } else {
      if(result.status===401||result.status===402){
        dispatch(verifyToken())
      }
	  else{
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

  const handleSelectAllClick = (event, checked) => {
    if (checked) {
      setState({ selected: state.data.map((n) => n.id) });
      return;
    }
    setState({ selected: [] });
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
      if(result.status===401||result.status===402){
        dispatch(verifyToken())
      }
	  else{
	   ippNotify.error(result.data.responseMessage);
      showLoader();
	  }
    }
  };

  const isSelectedFunc = (id) => {
    return state.selected.indexOf(id) !== -1;
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

  const updateEditInBackend = async () => {
    let putDataObj = {
      name: state.validation.name,
      description: state.validation.description,
      rowVersion: state.selected_EditForm_RowVersion_Value,
    };

    setState((prevState) => ({
      ...prevState,
      editForm_DialogOpen: false,
      isEditFormSubmitDisabled: false,
    }));

    const result = await apiputUrl(
      `/insurance/product-types/` + state.selectedEditId,
      putDataObj
    );
    if (result.data.responseCode === "200") {
      const indexInExistingData = state.data
        .map(function(e) {
          return e.id;
        })
        .indexOf(result.data.id);

      state.data[indexInExistingData] = result.data;
      ippNotify.success("Successfully Updated");
      setState((prevState) => ({
        ...prevState,
        data: state.data,
        formDialogOpen: false,
        isLoading: true,
        // isSuccessAlert: true,
        // successMsg: "Successfully Updated",
      }));
      callLocalBaseURL()
    } else {
      if(result.status===401||result.status===402){
        dispatch(verifyToken())
      }
	  else{
      ippNotify.error(result.data.responseMessage);
      setState((prevState) => ({
        ...prevState,
        formDialogOpen: true,
        // isErrorAlert: true,
        // errorMsg: "Failed to Update",
      }));
	  }
     
    }
  };
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
    ippNotify.success("Successfully New Data is Added");
    setState((prevState) => ({
      ...prevState,
      // addFormDialogOpen: false,
      isAddFormSubmitDisabled: false,
    }));
  };

  const getErrorUpdate = (err) => {
    let error = err.data.responseMessage;
    let errMessage = error.slice(10);
    ippNotify.error(err.data.responseMessage);
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

    const { name, key, fieldType, isEditable } = state.searchValidation;
    let tempArr = [];
    if (!isEmpty(name)) tempArr.push({ name });
    if (!isEmpty(key)) tempArr.push({ key });
    if (!isEmpty(fieldType)) tempArr.push({ fieldType });
    if (!isEmpty(isEditable)) tempArr.push({ isEditable });

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

  const getPageFromBackEnd = async (pageNumber, limit,temp_from,temp_to,pageCount,actionType) => {
    const { name } = state.searchValidation;
    if (!isEmpty(name)) {}else{apiCallParams.delete("name");}
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
        if(actionType==="handleNextButtonClick"){
          update_from(temp_from)
          if (temp_to >= pageCount) {
            update_to(pageCount);
          } else {
            update_to(temp_to);
          }
        }
        else if(actionType==="handleBackButtonClick"){
          update_from(temp_from)
          update_to(temp_to)
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
      if(result.status===401||result.status===402){
        dispatch(verifyToken())
      }
	  else{
	   ippNotify.error(result.data.responseMessage);
      showLoader();
	  }
    }
  };

  const search = async (searchURL) => {
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    const result = await apigetUrl(`/insurance/product-types?` + searchURL);
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
      if(result.status===401||result.status===402){
        dispatch(verifyToken())
      }
	  else{
      setState((prevState) => ({
        ...prevState,

        isInfoAlert: true,
        infoMsg: "Your query did not match any results",
        to: 0,
        pageCount: 0,
      }));
	  }
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

    pageURL.search = apiCallParams.toString();

    const result = await apigetUrl(
      `/insurance/product-types?page=${state.page}&limit=${state.limit}&sortBy=${state.sortBy}&sortType=${state.sortType}`
    );
    if (result.data.responseCode === "200") {
      setTimeout(() => {
      setState((prevState) => ({
        ...prevState,
        searchValidation: {
          name: "",
        },
        isInfoAlert: false,
        isAdvancedSearchValidationText: true,
        errors: {},
        isLoading: false,
      }));
      setResetData(result.data.dataList);
      setPageNumber(1);
      setPageCount(result.data.pagination.count);
      setCurrentUrl(pageURL);
    }, 1000);
    } else {
      if(result.status===401||result.status===402){
        dispatch(verifyToken())
      }
	  else{
	   ippNotify.error(result.data.responseMessage);
      showLoader();
	  }
    }
  };

  const onAdvancedSearchClickClean = () => {
    setState((prevState) => ({
      ...prevState,
      searchValidation: {
        name: "",
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
      if(result.status===401||result.status===402){
        dispatch(verifyToken())
      }
	  else{
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
                  {/* {state.isSuccessAlert === true ? (
                  <SuccessModal
                    message={state.successMsg}
                    closeSuccess={closeSuccessAlert}
                  />
                ) : null}
                {state.isErrorAlert === true ? (
                  <ErrorModal
                    message={state.errorMsg}
                    closeError={closeErrorAlert}
                  />
                ) : null} */}
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
                                <TableCell>{n.name}</TableCell>
                                <TableCell>{n.description}</TableCell>
                                <TableCell padding="none">
                                  <Tooltip title={<IntlMessages id="ProductTypes.Tooltip.Edit" />}>
                                    <IconButton
                                      id={n.id}
                                      onClick={(e) => onTableEditButtonClick(e)}
                                    >
                                      <EditIcon color="primary" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title={<IntlMessages id="ProductTypes.Tooltip.Delete" />}>
                                    <IconButton
                                    style={{ marginLeft: "-10px" }}
                                      id={n.id}
                                      onClick={(e) => onTableDeleteButtonClick(e)}
                                    >
                                      <DeleteIcon color="secondary" />
                                    </IconButton>
                                  </Tooltip>
                                  {state.auditEventId >= 1 ? (
                                    <Tooltip title={<IntlMessages id="ProductTypes.Tooltip.View" />}>
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
          </Grid>
        </div>
      )}
      <Dialog
        maxWidth="sm"
        open={state.editForm_DialogOpen}
        onClose={handle_Edit_Form_RequestClose}
      >
        {editTableContent}
      </Dialog>
      <Dialog
        maxWidth="sm"
        open={state.deleteItem_DialogOpen}
        onClose={handle_Delete_Item_RequestClose}
      >
        {deleteItem_content}
      </Dialog>
    </>
  );
}

export default App;
