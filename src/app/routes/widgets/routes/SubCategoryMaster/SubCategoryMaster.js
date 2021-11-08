import React, { useState, useEffect, useRef } from "react";
import "./root.component.css";
import MaterialTable from "material-table";
import axios from "axios";
import { forwardRef } from "react";
import { Modal, TextField, Button } from "@material-ui/core";

import Grid from "@material-ui/core/Grid";
import Alert from "@material-ui/lab/Alert";
//import DetailsIcon from '@material-ui/icons/Details';
import IntlMessages from "util/IntlMessages";
import keycode from "keycode";

import DeleteIcon from "@material-ui/icons/Delete";

import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import EditIcon from "@material-ui/icons/Edit";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormHelperText from "@material-ui/core/FormHelperText";
import CardBox from "./../../../../../components/CardBox";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import EnhancedTableHead from "../CommonComponents/TableHeadComponent";
import EnhancedTableToolbar from "./EnhancedTableToolbar";
import TablePaginationComponent from "../CommonComponents/TablePaginationComponent";
import InfoModal from "../Modal/Info";
import SuccessModal from "../Modal/Success";
import ErrorModal from "../Modal/Error";
import Joi from "joi-browser";
import apiInstance from "../../../../../setup/index";
import {
  apigetUrl,
  apipostUrl,
  apiputUrl,
  apideleteUrl,
} from "../../../../../setup/middleware";
import _ from "lodash";
import { async } from "q";
import InputSubmitButton from "../CommonComponents/SubmitButton";
import InputCancelButton from "../CommonComponents/CancelButton";
import InputAutocomplete from "../CommonComponents/Autocomplete";
import InputField from "../CommonComponents/TextField";
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
const perPageURL = `/insurance/sub-categories`;
const pageURL = new URL(baseURL + perPageURL);
let apiCallParams = new URLSearchParams(pageURL.search, apiInstance);

// const api = axios.create({
//   baseURL: baseURL,
// });

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

const advancedSearchValidationSchema = {
  Categories: Joi.string()
    .required()
    .label("Categories"),
  name: Joi.string()
    .required()
    .label("Name"),
};

function App() {
  const categoryID_AutoComplete_Ref = useRef();
  //for error handling
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
      isAdvancedSearchValidationText: false,
    }));
  };

  const setCurrentUrl = (currentUrl) => {
    setState((prevState) => ({ ...prevState, currentUrl }));
  };

  const [state, setState] = useState({
    name: "",
    archiveIn: "",
    purgeIn: "",
    isEnabled: "",
    createdBy: "",
    createdDate: "",
    modifiedName: "",
    modifiedDate: "",
    sortType: "asc",
    sortBy: "name",
    selected: [],
    page: 1,
    rowsPerPage: 5,
    data: [],
    formDialogOpen: false,
    isLoading: true,
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
    validation: {
      name: "",
      rowVersion: "",
    },
    categoryId: "",
    description: "",
    errors: {},
    editSubCategoryValidationText: false,
    isEditFormSubmitDisabled: false,
    areAllEditFormFieldsPopulated: false,
    selectedId: "",
    allData: [],
    categoryData: [],
    categoryName: "",
    catID: "",
    searchActive: false,
    catName: "categoryID",
    advancedSearchValidation: {
      name: "",
      Categories: "",
    },
    advancedSearchValidationErrors: {},
    isAdvancedSearchValidationText: false,
    handleAutoCompleteInputReset: false,
    foundIndex: "",
    error: false,
    categoryIdPopulated: false,
    namePopulated: false,
    isAuditTimelineActive: false,
    eventId: "",
    referenceId: "",
    auditEventId: "",
    headCells: [
      {
        id: "name",
        isActive: true,
        label: "insuranceSubCategories.master.tableheader.Name.label",
      },
      {
        id: "description",
        isActive: false,
        label: "insuranceSubCategories.master.tableheader.Description.label",
      },
      {
        id: "category",
        isActive: true,
        label: "insuranceSubCategories.master.tableheader.Category.label",
      },
      {
        id: "actions",
        isActive: false,
        label: "notificationtempalet.master.tableheader.Actions.label",
      },
    ],
  });

  const dispatch = useDispatch();

  const showLoader = () => {
    setTimeout(() => {
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
      }));
    }, 1000);
  };

  const callLocalBaseURL = async () => {
    const result = await apigetUrl(
      `/insurance/sub-categories?page=${state.page}&limit=${state.limit}&sortBy=${state.sortBy}&sortType=${state.sortType}`
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
      if(result.status===401||result.status===402){
        dispatch(verifyToken())
      }
	  else{
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
    setCurrentUrl(pageURL);
    callLocalBaseURL();
  }, []);

  const getData = async () => {
    //api
    const result = await apigetUrl(
      `/insurance/sub-categories?page=${state.page}&limit=${state.pageCount}`
    );
    if (result.data.responseCode === "200") {
      const response = result.data.dataList.map((n) => n);
      let categoryID_DataArray = response.map((item) => {
        return { name: item.categoryId.toString() };
      });

      //state.validation.categoryId
      var foundIndex = categoryID_DataArray.findIndex(
        (eachItem) => eachItem.name === state.categoryId
      );

      setState((prevState) => ({
        ...prevState,
        allData: categoryID_DataArray,
        foundIndex: foundIndex,
      }));
    }
  };

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
    const categoryId = state.catID;
    // const { name, categoryId } = state.advancedSearchValidation;
    const { name } = state.advancedSearchValidation;
    let tempArr = [];
    if (!isEmpty(name)) tempArr.push({ name });
    if (!isEmpty(categoryId)) tempArr.push({ categoryId });
    // if (!isEmpty(categoryName)) tempArr.push({ categoryName });
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
    let searchParam = apiCallParams.toString();
     pageURL.search = apiCallParams.toString();
    setCurrentUrl(pageURL);

    const result = await apigetUrl(`/insurance/sub-categories?`+searchParam);
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
    // api
    const result = await apigetUrl(`/insurance/sub-categories/${id}`);
    if (result.data.responseCode === "200") {
      const response = result.data;
      setState((prevState) => ({
        ...prevState,
        formDialogOpen: true,
        selectedId: response.id,
        validation: {
          name: response.name,
          rowVersion: response.rowVersion,
          // description: response.description,
          // categoryId: response.categoryId.toString(),
        },
        description: response.description,
        categoryId: response.categoryId.toString(),
      }));
    } else {
      if(result.status===401||result.status===402){
        dispatch(verifyToken())
      }
	  else{
      ippNotify.error(result.data.responseMessage);
      setState((prevState) => ({
        ...prevState,
        formDialogOpen: true,
      }));
    }

    getData();
	  }
     
  };

  const handleRequestClose = () => {
    setState((prevState) => ({
      ...prevState,
      formDialogOpen: false,
      isEditFormSubmitDisabled: false,
      validation: {
        name: "",
        rowVersion: "",
      },
      categoryId: "",
      description: "",
      errors: {},
      error: false,
    }));
  };

  const updateEditInBackend = async () => {
    let putDataObj = {
      categoryId: parseInt(state.categoryId),
      name: state.validation.name,
      description: state.description,
      rowVersion: parseInt(state.validation.rowVersion),
    };

    const result = await apiputUrl(
      `/insurance/sub-categories/${state.selectedId}`,
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
      }));
      callLocalBaseURL();
    } else {
      if(result.status===401||result.status===402){
        dispatch(verifyToken())
      }
	  else{
      ippNotify.error(result.data.responseMessage);
      setState((prevState) => ({
        ...prevState,
        formDialogOpen: true,
      }));
	  }
      
    }
  };

  const handleEditFormSubmit = async (e) => {
    updateEditInBackend();
  };

  // const validateProperty = ({ name, value }) => {
  //   const obj = { [name]: value };
  //   const propertySchema = { [name]: schema[name] };
  //   const { error } = Joi.validate(obj, propertySchema);
  //   return error ? error.details[0].message : null;
  // };

  function isObjEmpty(obj) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }

    return JSON.stringify(obj) === JSON.stringify({});
  }

  const editSubCategoryValidateProperty = ({ name, value }) => {
    let obj;
    let propertySchema;

    obj = { [name]: value };
    propertySchema = { [name]: schema[name] };
    const { error } = Joi.validate(obj, propertySchema);
    return error ? error.details[0].message : null;
  };

  const checkAreAllEditFormFieldsPopulated = (obj) => {
    return !Object.values(obj).some((x) => x === "");
  };

  const handleEditFormChange = (e) => {
    const { target: input } = e;
    const errors = { ...state.errors };
    const validation = { ...state.validation };
    const errorMessage = editSubCategoryValidateProperty(input);

    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    validation[input.name] = input.value;
    const allFormFieldsPopulated = checkAreAllEditFormFieldsPopulated(
      validation
    );

    setState((prevState) => ({
      ...prevState,
      validation,
      errors,
      editSubCategoryValidationText: true,
      namePopulated: allFormFieldsPopulated,
      isEditFormSubmitDisabled:
        allFormFieldsPopulated &&
        isObjEmpty(errors) &&
        editSubCategoryValidateProperty,
    }));
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

  const handleDeleteDialogClose = (e) => {
    setState((prevState) => ({
      ...prevState,
      deleteFormDialogOpen: false,
    }));
  };

  const onDeleteConfirm = () => {
    deleteItem();
  };
  const deleteItem = async () => {
    // api

    const result = await apideleteUrl(
      `/insurance/sub-categories/${state.selectedId}`
    );
    if (result.status === 200) {
      ippNotify.success("Successfully Deleted");
      setState((prevState) => ({
        ...prevState,
        deleteFormDialogOpen: false,
        isLoading: true,
      }));
      callLocalBaseURL();
    } else {
      if(result.status===401||result.status===402){
        dispatch(verifyToken())
      }
	  else{
      ippNotify.error(result.data.responseMessage);
      setState((prevState) => ({
        ...prevState,
        deleteFormDialogOpen: true,
      }));
	  }
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

  // const handleEditCategoryId = (e, values) => {
  //   setState((prevState) => ({
  //     ...prevState,
  //     categoryId: parseInt(values),
  //     // isEditFormSubmitDisabled: true,
  //   }));
  // };

  // const setValue = () => {
  //   return state.validation.categoryId;
  // };

  const getSuccessUpdate = () => {
    ippNotify.success("Successfully New Data is Added");
    setState((prevState) => ({
      ...prevState,
      // addFormDialogOpen: false,
      isAddFormSubmitDisabled: false,
    }));
  };

  const getErrorUpdate = (err) => {
    ippNotify.error(err.data.responseMessage);
  };

  const handleTextFieldChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  useEffect(() => {
    getCategoriesName();
  }, []);

  const getCategoriesName = async () => {
    const result = await apigetUrl(
      `/insurance/core-data?page=${state.page}&limit=${state.rowsPerPage}&typeId=10`
    );
    if (result.data.responseCode === "200") {
      const response = result.data.dataList;
      setState((prevState) => ({
        ...prevState,
        categoryData: response,
      }));
    } else {
      ippNotify.error(result.data.responseMessage);
    }
  };

  const [categoryValue, setCatgoryValue] = useState(null);

  const advanceSearchValidateProperty = (
    { name, value },
    autoCompleteValue,
    ref
  ) => {
    let obj;
    let propertySchema;

    if (ref) {
      autoCompleteValue
        ? (obj = {
            [ref.current.getAttribute("name")]: autoCompleteValue.name,
          })
        : (obj = {
            [ref.current.getAttribute("name")]: autoCompleteValue,
          });

      propertySchema = {
        [ref.current.getAttribute("name")]: advancedSearchValidationSchema[
          ref.current.getAttribute("name")
        ],
      };
    } else {
      obj = { [name]: value };
      propertySchema = {
        [name]: advancedSearchValidationSchema[name],
      };
    }

    const { error } = Joi.validate(obj, propertySchema);
    return error ? error.details[0].message : null;
  };

  const handleAdvancedSearchOnChange = (event, autoCompleteValue, ref) => {
    const { target: input } = event;
    const errors = { ...state.advancedSearchValidationErrors };
    const validation = { ...state.advancedSearchValidation };
    if (ref) {
      const errorMessage = advanceSearchValidateProperty(
        input,
        autoCompleteValue,
        ref
      );

      if (errorMessage) errors[ref.current.getAttribute("name")] = errorMessage;
      else delete errors[ref.current.getAttribute("name")];

      autoCompleteValue
        ? (validation[ref.current.getAttribute("name")] =
            autoCompleteValue.name)
        : (validation[ref.current.getAttribute("name")] = autoCompleteValue);
    } else {
      const errorMessage = advanceSearchValidateProperty(input);
      if (errorMessage) errors[input.name] = errorMessage;
      else delete errors[input.name];
      validation[input.name] = input.value;
    }

    autoCompleteValue
      ? setState((prevState) => ({
          ...prevState,
          catID: autoCompleteValue.id,
        }))
      : setState((prevState) => ({
          ...prevState,
          catID: "",
        }));

    let isAnyFormFieldsPopulated = false;
    isAnyFormFieldsPopulated =
      validation.categoryName !== "" || validation.name !== "";

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

  const isEmpty = (str) => {
    return !str || 0 === str.length;
  };

  const handleApplyClick = (e) => {
    apiCallParams.delete("name");
    apiCallParams.delete("categoryId");
    e.preventDefault();
    // const name = state.name;
    const categoryId = state.catID;
    // const { name, categoryId } = state.advancedSearchValidation;
    const { Categories, name } = state.advancedSearchValidation;

    if (Categories === "" && name === "") {
      setState((prevState) => ({
        ...prevState,
        isAdvancedSearchValidationText: true,
        advancedSearchValidationErrors: {},
      }));
    } else if (Categories === "" || name === "") {
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
    if (!isEmpty(categoryId)) tempArr.push({ categoryId });
    // if (!isEmpty(categoryName)) tempArr.push({ categoryName });
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
    apiCallParams.delete("categoryId");

    pageURL.search = apiCallParams.toString();

    //const res = await axios.get(pageURL.href, apiInstance);
    // nameReset();
    // categoryReset();
    // callLocalBaseURL();

    const result = await apigetUrl(
      `/insurance/sub-categories?page=${1}&limit=${state.limit}&sortBy=${
        state.sortBy
      }&sortType=${state.sortType}`
    );
    if (result.data.responseCode === "200") {
      setTimeout(() => {
        setState((prevState) => ({
          ...prevState,
          advancedSearchValidationErrors: {},
          isAdvancedSearchValidationText: false,
          catID: "",
          advancedSearchValidation: {
            name: "",
            Categories: "",
          },
          handleAutoCompleteInputReset: !state.handleAutoCompleteInputReset,
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
    //  nameReset();
    // categoryReset();
    // callLocalBaseURL();
    setState((prevState) => ({
      ...prevState,
      advancedSearchValidationErrors: {},
      isAdvancedSearchValidationText: false,
      advancedSearchValidation: {
        name: "",
        Categories: "",
      },
    }));
  };

  const getPageFromBackEnd = async (pageNumber, limit,temp_from,temp_to,pageCount,actionType) => {
    const categoryId = state.catID;
  const { Categories, name } = state.advancedSearchValidation;
  if (!isEmpty(name)){}else{ apiCallParams.delete("name");}
    if (!isEmpty(categoryId)){}else{ apiCallParams.delete("categoryId");}
    
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
    // api
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    const result = await apigetUrl(`/insurance/sub-categories?` + searchURL);
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
        isLoading: false,
      }));
	  }
      
    }
  };

  const handleEditDescriptionChange = (e) => {
    setState((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
      isEditFormSubmitDisabled: true,
    }));
  };

  const handleEditChange = (event, value) => {
    let findCatergoryId = (state.categoryData || []).find(
      (n) => n.name === value
    );
    console.log("value", value);
    if (value === null) {
      setState((prevState) => ({
        ...prevState,
        categoryId: (findCatergoryId || {}).id,
        error: true,
        categoryIdPopulated: false,
        isEditFormSubmitDisabled: false,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        categoryId: (findCatergoryId || {}).id,
        error: false,
        categoryIdPopulated: true,
        isEditFormSubmitDisabled: true,
      }));
    }
  };

  const [value, setValue] = React.useState("");
  const [inputValue, setInputValue] = React.useState("");

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

  const getName = (categoryID) => {
    const item = (state.categoryData || []).find(
      (n) => n.id === parseInt(categoryID)
    );
    return (item || {}).name;
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
            maxWidth="xs"
            open={state.formDialogOpen}
            onClose={handleRequestClose}
          >
            <DialogTitle>
              <IntlMessages id="insuranceSubCategories.master.modal.edit.title" />
            </DialogTitle>
            <DialogContent>
              {state.error ? (
                <InputAutocomplete
                  className="mb-3"
                  id="categoryId"
                  name="categoryId"
                  onChange={handleEditChange}
                  options={(state.categoryData || []).map((n) => n.name)}
                  value={getName(state.categoryId)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error
                      required
                      label={
                        <IntlMessages id="insuranceSubCategories.master.modal.edit.felid.CategoryId" />
                      }
                      helperText="CategoryId is Required"
                      variant="outlined"
                    />
                  )}
                  fullWidth
                />
              ) : (
                <InputAutocomplete
                  className="mb-3"
                  id="categoryId"
                  name="categoryId"
                  onChange={handleEditChange}
                  options={(state.categoryData || []).map((n) => n.name)}
                  value={getName(state.categoryId)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      label={
                        <IntlMessages id="insuranceSubCategories.master.modal.edit.felid.CategoryId" />
                      }
                      variant="outlined"
                    />
                  )}
                  fullWidth
                />
              )}

              <InputField
                className="mb-2"
                autoFocus
                id="name"
                error={state.errors.name}
                label={
                  <IntlMessages id="insuranceSubCategories.master.modal.edit.felid.Name" />
                }
                name="name"
                onChange={(e) => handleEditFormChange(e)}
                value={state.validation.name}
                fullWidth
                helperText={state.errors.name}
                required
              />
              <InputField
                id="description"
                label={
                  <IntlMessages id="insuranceSubCategories.master.modal.edit.felid.Description" />
                }
                name="description"
                onChange={(e) => handleEditDescriptionChange(e)}
                value={state.description}
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <InputCancelButton onClick={(e) => handleRequestClose(e)} />
              <InputSubmitButton
                onClick={(e) => handleEditFormSubmit(e)}
                disabled={!state.isEditFormSubmitDisabled}
              />
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
                <IntlMessages id="insuranceSubCategories.master.modal.deleteconfrimation.message" />
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
                  getSuccessUpdate={getSuccessUpdate}
                  getErrorUpdate={getErrorUpdate}
                  callLocalBaseURL={callLocalBaseURL}
                  // name={state.validation.name}
                  name={state.advancedSearchValidation.name}
                  handleTextFieldChange={handleTextFieldChange}
                  categoryData={state.categoryData}
                  categoryName={state.categoryName}
                  catID={state.catID}
                  handleApplyClick={handleApplyClick}
                  categoryValue={categoryValue}
                  handleResetClick={handleResetClick}
                  handleAdvancedSearchOnChange={handleAdvancedSearchOnChange}
                  advancedSearchValidationErrors={
                    state.advancedSearchValidationErrors
                  }
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
                                <TableCell>{n.description}</TableCell>
                                <TableCell>{n.categoryName}</TableCell>

                                <TableCell padding="none">
                                  <Tooltip title={<IntlMessages id="SubCategoryMaster.Tooltip.Edit" />}>
                                    <IconButton
                                      id={n.id}
                                      onClick={(e) =>
                                        onTableEditButtonClick(e, n.id)
                                      }
                                    >
                                      <EditIcon color="primary" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title={<IntlMessages id="SubCategoryMaster.Tooltip.Delete" />}>
                                  <IconButton
                                  style={{marginLeft:"-10px"}}
                                    id={n.id}
                                    onClick={(e) =>
                                      onTableDeleteButtonClick(e, n.id)
                                    }
                                  >
                                    <DeleteIcon color="secondary" />
                                  </IconButton>
                                  </Tooltip>
                                  {state.auditEventId >= 1 ? (
                                    <Tooltip title={<IntlMessages id="SubCategoryMaster.Tooltip.View" />}>
                                      <IconButton
                                        style={{marginLeft:"-10px"}}
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
                            // handleBackButtonClick={handleBackButtonClick}
                            // handleNextButtonClick={handleNextButtonClick}
                          />
                          {/* <TablePagination
                        count={-1}
                        rowsPerPage={state.limit}
                        rowsPerPageOptions={[5, 10, 15, 20, 25]}
                        page={state.page}
                        labelDisplayedRows={({ from, to, count }) =>
                          `${state.from}-${state.to} of total ${state.pageCount} items`
                        }
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                        ActionsComponent={(subProps) => (
                          <TablePaginationActions
                            {...subProps}
                            setPageData={setPageData}
                            setPageNumber={setPageNumber}
                            setPageCount={setPageCount}
                            update_from={update_from}
                            update_to={update_to}
                            from={state.from}
                            to={state.to}
                            count={state.pageCount}
                            limit={state.limit}
                            data={state.data}
                            // rowsPerPage={state.rowsPerPage}
                            searchActive={state.searchActive}
                            name={state.name}
                          />
                        )}
                      /> */}
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
