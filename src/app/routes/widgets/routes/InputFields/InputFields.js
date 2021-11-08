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
import IntlMessages from "util/IntlMessages";
import "../CommonComponents/tableStyle.css";
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

import AddIcon from "@material-ui/icons/Add";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import EditIcon from "@material-ui/icons/Edit";

import EnhancedTableHead from "../CommonComponents/TableHeadComponent";
import EnhancedTableToolbar from "./EnhancedTableToolbar";
import { data } from "./../../../dashboard/routes/News/data";
import Joi from "joi-browser";
import { Alert, AlertTitle } from "@material-ui/lab";
import CloseIcon from "@material-ui/icons/Close";
import FormHelperText from "@material-ui/core/FormHelperText";
import {
  apigetUrl,
  apipostUrl,
  apiputUrl,
  apideleteUrl,
} from "../../../../../setup/middleware";
import { async } from "q";
import InputField from "../CommonComponents/TextField";
import InputSubmitButton from "../CommonComponents/SubmitButton";
import InputCancelButton from "../CommonComponents/CancelButton";
import {
  IPPNotification,
  ippNotify,
} from "../CommonComponents/IPPNotification";
import { getRecordsPerPage } from "../../../../../setup/ApplicatoinConfigurations.js";
import InputSelect from "../CommonComponents/Select";
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

const returnCoreData_DataTypes = (fieldType) => {
  switch (fieldType) {
    case 2000:
      return "String";
    case 2001:
      return "String";
    case 2002:
      return "Number";
    case 2003:
      return "Date";
    case 2004:
      return "Date & Time";
    case 2005:
      return "Radio";
    case 2006:
      return "Checkbox";
    case 2007:
      return "Password";
    case 2008:
      return "Drop Down";
      case 2009:
      return "Boolean";
      case 2010:
      return "File Upload";
  }
};

const returnReverse_CoreData_DataTypes = (fieldTypeNumber) => {
  switch (fieldTypeNumber) {
    case "String":
      return 2001;
    case "Number":
      return 2002;
    case "Date":
      return 2003;
    case "Date & Time":
      return 2004;
    case "Radio":
      return 2005;
    case "Checkbox":
      return 2006;
    case "Password":
      return 2007;
    case "Drop Down":
      return 2008;
  }
};

const baseURL = `${process.env.REACT_APP_BASE_URL}`;
const perPageURL = `/insurance/fields`;

const pageURL = new URL(baseURL + perPageURL);

let apiCallParams = new URLSearchParams(pageURL.search);

// const api = axios.create({
//   baseURL: baseURL,
// });

let pageNumber = 1;

const schema = {
  name: Joi.string()
    .required()
    .label("Name"),
  key: Joi.string()
    .required()
    .label("Key"),
  fieldType: Joi.number()
    .required()
    .label("FieldType"),
  dataListId: Joi.number()
    .required()
    .label("Data List Id"),
  minLength: Joi.number()
    .required()
    .label("Min Length"),
  maxLength: Joi.number()
    .required()
    .label("Max Length"),
  regExp: Joi.any()
    .allow(null, "")
    .optional(),
  isEditable: Joi.number()
    .required()
    .label("is Editable"),
  displayMode: Joi.number()
    .required()
    .label("Display Mode"),
  parentId: Joi.number()
    .required()
    .label("Parent ID"),
  fieldComposition: Joi.number()
    .required()
    .label("Field Composition"),
  forEachWhichField: Joi.number()
    .optional()
    .label("For Which Field"),
  forEachTitleField: Joi.number()
    .optional()
    .label("Title Field"),
  encryptMode: Joi.number()
    .optional()
    .label("Encrypt Mode"),
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
    isSortAsc: true,
    isLoading: true,
    from: 1,
    to: 0,
    pageCount: 0,
    deleteItem_DialogOpen: false,
    isEditForm_DataListId_Available: false,
    isAddForm_ForEach_Available: false,
    isAddForm_ForEachTitle_Available: false,
    validation: {
      name: "",
      key: "",
      fieldType: "",
      dataListId: "",
      minLength: "",
      maxLength: "",
      regExp: "",
      isEditable: "",
      displayMode: "",
      fieldComposition: "",
      parentId: "", //Required when field Composition is child field
      dataListId: "", //Required when field type is checkbox or Radio or dropdown
      forEachWhichField: "", //Required when the display mode is "For Each"
      forEachTitleField: "", //Required when the forEachWhichField is a complex Field
    },
    menuItem: [],
    itemName: "",
    menuItemId: "",
    searchValidation: {
      name: "",
      key: "",
      fieldType: "",
      isEditable: "",
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
    displayModeOptions: [],
    fieldCompositionOptions: [],
    fieldTypesAddForm: [],
    parentIdsOptions: [],
    dataListTypesOptions: [],
    forEachFieldOptions: [],
    forEachTitleFieldOptions: [],
    encryptModeList: [],
    isAuditTimelineActive: false,
    eventId: "",
    referenceId: "",
    auditEventId: "",
    headCells: [
      {
        id: "name",
        isActive: true,
        label: "inputfelid.master.tableheader.Name.label",
      },
      {
        id: "key",
        isActive: true,
        label: "inputfelid.master.tableheader.Key.label",
      },
      {
        id: "fieldType",
        isActive: true,
        label: "inputfelid.master.tableheader.FieldType.label",
      },
      {
        id: "displayMode",
        isActive: false,
        label: "inputfelid.master.tableheader.displayMode.label",
      },
      {
        id: "fieldComposition",
        isActive: false,
        label: "inputfelid.master.tableheader.fieldComposition.label",
      },
      {
        id: "actions",
        isActive: false,
        label: "notificationtempalet.master.tableheader.Actions.label",
      },
    ],
  });

  const dispatch = useDispatch();

  useEffect(() => {
    getDisplayModeData();
    getFieldCompositionData();
    fieldTypesAddForm();
    parentIdAddForm();
    dataListsAddForm();
    forEachFieldsAddForm();
    fetchEncryptModeList();
  }, []);

  const showLoader = () => {
    setTimeout(() => {
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
      }));
    }, 1000);
  };

  const parentIdAddForm = async () => {
    const result = await apigetUrl(
      `/insurance/fields?page=1&limit=500&fieldComposition=4002`
    );
    if (result.data.responseCode === "200") {
      const response = result.data.dataList.map((n) => n);
      setState((prevState) => ({
        ...prevState,
        parentIdsOptions: response,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,

        isErrorAlert: true,
        errorMsg: result.data.responseMessage,
      }));
    }
  };

  const dataListsAddForm = async () => {
    const result = await apigetUrl(
      `/insurance/core-data-types?page=1&limit=1000`
    );
    if (result.data.responseCode === "200") {
      const response = result.data.dataList.map((n) => n);
      setState((prevState) => ({
        ...prevState,
        dataListTypesOptions: response,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,

        isErrorAlert: true,
        errorMsg: result.data.responseMessage,
      }));
    }
  };

  const getDisplayModeData = async () => {
    const result = await apigetUrl(
      `/insurance/core-data?page=1&limit=50&typeId=30`
    );
    if (result.data.responseCode === "200") {
      const response = result.data.dataList.map((n) => n);
      setState((prevState) => ({
        ...prevState,
        displayModeOptions: response,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,

        isErrorAlert: true,
        errorMsg: result.data.responseMessage,
      }));
    }
  };

  const getFieldCompositionData = async () => {
    const result = await apigetUrl(
      `/insurance/core-data?page=1&limit=50&typeId=40`
    );
    if (result.data.responseCode === "200") {
      const response = result.data.dataList.map((n) => n);
      setState((prevState) => ({
        ...prevState,
        fieldCompositionOptions: response,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,

        isErrorAlert: true,
        errorMsg: result.data.responseMessage,
      }));
    }
  };

  const fieldTypesAddForm = async () => {
    const result = await apigetUrl(
      `/insurance/core-data?page=1&limit=724&typeId=20`
    );
    if (result.data.responseCode === "200") {
      const response = result.data.dataList.map((n) => n);
      setState((prevState) => ({
        ...prevState,
        fieldTypesAddForm: response,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,

        isErrorAlert: true,
        errorMsg: result.data.responseMessage,
      }));
    }
  };

  const fetchEncryptModeList = async () => {
    const result = await apigetUrl(
      `/insurance/core-data?page=1&limit=10&typeId=160`
    );
    if (result.data.responseCode === "200") {
      const response = result.data.dataList.map((n) => n);
      setState((prevState) => ({
        ...prevState,
        encryptModeList: response,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        isErrorAlert: true,
        errorMsg: result.data.responseMessage,
      }));
    }
  };

  //Method loads the list of fields to be shone in the for Each which field option
  const forEachFieldsAddForm = async () => {
    const result = await apigetUrl(
      `/insurance/fields?page=1&limit=500&fieldComposition=4002`
    );
    if (result.data.responseCode === "200") {
      const response = result.data.dataList.map((n) => n);
      setState((prevState) => ({
        ...prevState,
        forEachFieldOptions: response,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,

        isErrorAlert: true,
        errorMsg: result.data.responseMessage,
      }));
    }
  };

  //Method loads the list of child fields for the
  const forEachTitleFieldsAddForm = async (parentId) => {
    const result = await apigetUrl(
      `/insurance/fields?page=1&limit=500&parentId=` + parentId
    );
    if (result.data.responseCode === "200") {
      const response = result.data.dataList.map((n) => n);
      setState((prevState) => ({
        ...prevState,
        forEachTitleFieldOptions: response,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,

        isErrorAlert: true,
        errorMsg: result.data.responseMessage,
      }));
    }
  };

  const onTableEditButtonClick = async (event) => {
    let currentTarget = event.currentTarget;
    const result = await apigetUrl(`/insurance/fields/` + currentTarget.id);
    if (result.data.responseCode === "200") {
      /**
       * 'dataList' is required when the above 'fieldType' is one of the following(Radio, Checkbox, Dropdown)
       */
      let isEditForm_DataListId_Available = [
        "Radio",
        "Checkbox",
        "Drop Down",
      ].includes(returnCoreData_DataTypes(result.data.fieldType));

      /** if a filed has a "parent-field", then it's "fieldCompositionId" should be '4003' (as per Docu)  */
      let isAddForm_childField_Available =
        `${result.data.fieldComposition}` === "4003" ? true : false;

      setState((prevState) => ({
        ...prevState,
        editForm_DialogOpen: true,
        selectedEditId: currentTarget.id,
        validation: {
          name: result.data.name,
          key: result.data.key,
          fieldType: result.data.fieldType,
          dataListId: result.data.dataListId,
          minLength: result.data.minLength,
          maxLength: result.data.maxLength,
          regExp: result.data.regExp,
          displayMode: result.data.displayMode,
          fieldComposition: result.data.fieldComposition,
          parentId: result.data.parentId,
          forEachWhichField: result.data.secData,
          forEachTitleField: result.data.secData2,
          encryptMode: result.data.encryptMode,
        },
        isEditForm_DataListId_Available: isEditForm_DataListId_Available,
        isAddForm_childField_Available: isAddForm_childField_Available,
        isAddForm_ForEach_Available:
          result.data.displayMode == 3003 ? true : false,
        isAddForm_ForEachTitle_Available: false,
      }));

      if (result.data.secData != "") {
        for (var i = 0; i < state.forEachFieldOptions.length; i++) {
          if (state.forEachFieldOptions[i].id == result.data.secData) {
            checkAndLoadTitleFields(
              state.forEachFieldOptions[i].fieldComposition,
              state.forEachFieldOptions[i].id
            );
          }
        }
      }
    } else {
      setState((prevState) => ({
        ...prevState,

        isErrorAlert: true,
        errorMsg: result.data.responseMessage,
      }));
    }
  };

  const deleteItemInBackend = async (id) => {
    const result = await apideleteUrl(`/insurance/fields/` + id);
    if (`${result.status}` === "200") {
      ippNotify.success("Successfully Deleted");
      setState((prevState) => ({
        ...prevState,
        formDialogOpen: false,
        // isSuccessAlert: true,
        deleteFormDialogOpen: false,
        isLoading: true,
        // successMsg: "Successfully Deleted",
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
        formDialogOpen: false,
        // isErrorAlert: true,
        // errorMsg: result.data.responseMessage,
      }));
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
        <IntlMessages id="inputfelid.master.modal.edit.title" />
      </DialogTitle>
      <DialogContent>
        <div className="row">
          <div className="col-lg-6">
            <InputField
              required
              autoFocus
              id="name"
              className="mb-3"
              label={
                <IntlMessages id="inputfelid.master.modal.edit.felid.Name" />
              }
              name="name"
              onChange={(e) => handleEditFormChange(e)}
              value={state.validation.name}
              fullWidth
              error={state.errors.name}
              helperText={state.errors.name}
            />
          </div>
          <div className="col-lg-6">
            <InputField
              required
              id="key"
              className="mb-3"
              label={
                <IntlMessages id="inputfelid.master.modal.edit.felid.Key" />
              }
              name="key"
              onChange={(e) => handleEditFormChange(e)}
              value={state.validation.key}
              fullWidth
              error={state.errors.key}
              helperText={state.errors.key}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6">
            <TextField
              required
              name="fieldType"
              id="fieldType"
              variant="outlined"
              error={state.errors.fieldType}
              select
              label={
                <IntlMessages id="inputfelid.master.modal.edit.felid.FieldType" />
              }
              value={state.validation.fieldType}
              onChange={(e) => handleEditFormChange(e)}
              SelectProps={{}}
              margin="normal"
              fullWidth
              helperText={state.errors.fieldType}
            >
              {state.fieldTypesAddForm.map((option) => (
                <MenuItem
                  name="fieldType"
                  key={option.id}
                  attfieldTypesName={option.name}
                  value={option.id}
                >
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <div className="col-lg-6">
            {state.isEditForm_DataListId_Available ? (
              <TextField
                id="dataListId"
                className="mb-3"
                label="Data List"
                name="dataListId"
                onChange={(e) => handleEditFormChange(e)}
                value={state.validation.dataListId}
                fullWidth
                /* error={state.errors.dataListId} */
                /* helperText={state.errors.dataListId} */
                select
                SelectProps={{}}
                margin="normal"
                variant="outlined"
              >
                <MenuItem value="">
                  <em>Select</em>
                </MenuItem>
                {state.dataListTypesOptions.map((option) => (
                  <MenuItem name="dataListId" key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
            ) : null}
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-lg-6">
            <InputField
              required
              id="minLength"
              className="mb-3"
              label={
                <IntlMessages id="inputfelid.master.modal.edit.felid.MinLength" />
              }
              name="minLength"
              onChange={(e) => {
                let value = e.target.value;
                if (!isNaN(value)) {
                  handleEditFormChange(e);
                }
              }}
              value={state.validation.minLength}
              fullWidth
              error={state.errors.minLength}
              helperText={state.errors.minLength}
            />
          </div>
          <div className="col-lg-6">
            <InputField
              required
              id="maxLength"
              className="mb-3"
              label={
                <IntlMessages id="inputfelid.master.modal.edit.felid.MaxLength" />
              }
              name="maxLength"
              onChange={(e) => {
                let value = e.target.value;
                if (!isNaN(value)) {
                  handleEditFormChange(e);
                }
              }}
              value={state.validation.maxLength}
              fullWidth
              error={state.errors.maxLength}
              helperText={state.errors.maxLength}
            />
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-lg-6">
            <InputField
              id="regExp"
              className="mb-3"
              label={
                <IntlMessages id="inputfelid.master.modal.edit.felid.RegExp" />
              }
              name="regExp"
              onChange={(e) => handleEditFormChange(e)}
              value={state.validation.regExp}
              fullWidth
              error={state.errors.regExp}
              helperText={state.errors.regExp}
            />
          </div>
          <div className="col-lg-6">
            <TextField
              required
              className="mb-3 mt-0"
              name="displayMode"
              id="displayMode"
              error={state.errors.displayMode}
              select
              label={
                <IntlMessages id="inputfelid.master.modal.edit.felid.DisplayMode" />
              }
              value={state.validation.displayMode}
              onChange={(e) => handleEditFormChange(e)}
              SelectProps={{}}
              margin="normal"
              variant="outlined"
              fullWidth
              helperText={state.errors.displayMode}
            >
              <MenuItem value="">
                <em>Select</em>
              </MenuItem>
              {state.displayModeOptions.map((option) => (
                <MenuItem
                  name="displayMode"
                  key={option.id}
                  value={option.id}
                  attfieldTypesName={option.id}
                >
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-6">
            {state.isAddForm_ForEach_Available ? (
              <TextField
                required
                id="forEachWhichField"
                variant="outlined"
                select
                label="Which Field"
                name="forEachWhichField"
                onChange={(e) => handleEditFormChange(e)}
                SelectProps={{}}
                value={state.validation.forEachWhichField}
                fullWidth
              >
                <MenuItem value="">
                  <em>Select</em>
                </MenuItem>
                {state.forEachFieldOptions.map((option) => (
                  <MenuItem
                    name="forEachWhichField"
                    attfieldTypesName={option.value}
                    attfieldComposition={option.fieldComposition}
                    attfieldparentid={option.parentId}
                    key={option.id}
                    value={option.id}
                  >
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
            ) : null}
          </div>

          <div className="col-lg-6">
            {state.isAddForm_ForEachTitle_Available ? (
              <TextField
                required
                id="forEachTitleField"
                variant="outlined"
                select
                label="Title Field"
                name="forEachTitleField"
                onChange={(e) => handleEditFormChange(e)}
                SelectProps={{}}
                value={state.validation.forEachTitleField}
                fullWidth
              >
                <MenuItem value="">
                  <em>Select</em>
                </MenuItem>
                {state.forEachTitleFieldOptions.map((option) => (
                  <MenuItem
                    name="forEachTitleField"
                    key={option.id}
                    value={option.id}
                  >
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
            ) : null}
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-lg-6">
            <TextField
              required
              className="mb-3 mt-0"
              name="fieldComposition"
              id="fieldComposition"
              error={state.errors.fieldComposition}
              select
              label={
                <IntlMessages id="inputfelid.master.modal.edit.felid.FieldComposition" />
              }
              /* value={state.validation.fieldComposition} */
              value={state.validation.fieldComposition}
              onChange={(e) => handleEditFormChange(e)}
              SelectProps={{}}
              margin="normal"
              variant="outlined"
              fullWidth
              helperText={state.errors.fieldComposition}
            >
              <MenuItem value="">
                <em>Select</em>
              </MenuItem>
              {state.fieldCompositionOptions.map((option) => (
                <MenuItem
                  name="fieldComposition"
                  key={option.id}
                  value={option.id}
                  attfieldname={option.name}
                >
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <div className="col-lg-6">
            {state.isAddForm_childField_Available ? (
              <TextField
                required
                variant="outlined"
                className="mb-2 mt-0"
                name="parentId"
                id="parentId"
                /* error={state.errors.parentId} */
                select
                label="Parent Field"
                value={state.validation.parentId}
                onChange={(e) => handleEditFormChange(e)}
                SelectProps={{}}
                margin="normal"
                fullWidth
                /* helperText={state.errors.parentId} */
              >
                <MenuItem value="">
                  <em>Select</em>
                </MenuItem>
                {state.parentIdsOptions.map((option) => (
                  <MenuItem name="parentId" key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
            ) : null}
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6">
            <FormControl
              required
              variant="outlined"
              className="w-100 mb-2"
              error={state.errors.encryptMode}
            >
              <InputLabel>
                <IntlMessages id="inputfelid.master.modal.add.felid.EncryptMode" />
              </InputLabel>
              <InputSelect
                labelId="EncryptMode"
                name="encryptMode"
                id="encryptMode"
                label={
                  <IntlMessages id="inputfelid.master.modal.add.felid.EncryptMode" />
                }
                value={state.validation.encryptMode || ""}
                onChange={(e) => handleEditFormChange(e)}
              >
                <MenuItem value="">
                  <em>Select</em>
                </MenuItem>
                {state.encryptModeList.map((option) => (
                  <MenuItem
                    name="encryptMode"
                    key={option.id}
                    attfieldtypesname={option.name}
                    value={option.id}
                  >
                    {option.name}
                  </MenuItem>
                ))}
              </InputSelect>
              <FormHelperText style={{ color: "red" }}>
                {state.errors.encryptMode ? state.errors.encryptMode : " "}
              </FormHelperText>
            </FormControl>
          </div>
        </div>
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
            <IntlMessages id="inputfelid.master.modal.deleteconfrimation.message" />
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
      `/insurance/fields?page=${state.page}&limit=${state.limit}&sortBy=${state.sortBy}&sortType=${state.sortType}`
    );
    if (result.data.responseCode === "200") {
      setTimeout(() => {
      console.log("inputresult::::"+JSON.stringify(result))
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
    const {
      name,
      key,
      fieldType,
      isEditable,
      displayMode,
      fieldComposition,
    } = state.searchValidation;
    let tempArr = [];
    if (!isEmpty(name)) tempArr.push({ name });
    if (!isEmpty(key)) tempArr.push({ key });
    if (!isEmpty(fieldType)) tempArr.push({ fieldType });
    if (!isEmpty(displayMode)) tempArr.push({ displayMode });
    if (!isEmpty(fieldComposition)) tempArr.push({ fieldComposition });
    if ([1, 0].includes(isEditable)) tempArr.push({ isEditable });
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
   var searchparameter = apiCallParams.toString()
  const result = await apigetUrl(
      `/insurance/fields?`+ searchparameter
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
      errors: {},
    }));
  };

  const handle_Edit_Form_RequestClose = () => {
    setState((prevState) => ({
      ...prevState,
      editForm_DialogOpen: false,
      errors: {},
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
      key: state.validation.key,
      // fieldType: returnReverse_CoreData_DataTypes(state.validation.fieldType),
      fieldType: state.validation.fieldType,
      dataListId: state.validation.dataListId,
      minLength: state.validation.minLength,
      maxLength: state.validation.maxLength,
      regExp: state.validation.regExp,
      rowVersion: state.selected_EditForm_RowVersion_Value,
      displayMode: state.validation.displayMode,
      fieldComposition: state.validation.fieldComposition,
      parentId: state.validation.parentId,
      secData: state.validation.forEachWhichField,
      secData2: state.validation.forEachTitleField,
      encryptMode: state.validation.encryptMode,
    };

    const result = await apiputUrl(
      `/insurance/fields/` + state.selectedEditId,
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
        editForm_DialogOpen: false,
        isEditFormSubmitDisabled: false,
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
        // isErrorAlert: true,
        // errorMsg: result.message || "Failed to Update",
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
  const checkForMandatoryFormFieldsPopulated = (obj) => {
    const mandatoryFields = [
      "name",
      "key",
      "fieldType",
      "minLength",
      "maxLength",
      "displayMode",
      "fieldComposition",
    ];
    let isAllMandatoryFieldsFilled = true;
    for (let key of mandatoryFields) {
      // check whether a mandatoryField is filled (or) not
      if ([undefined, null, ""].includes(obj[key])) {
        isAllMandatoryFieldsFilled = false;
        break;
      }
    }
    return isAllMandatoryFieldsFilled;
  };
  const handleEditFormChange = (event) => {
    let { target: input } = event;
    const errors = { ...state.errors };
    const errorMessage = validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const validation = { ...state.validation };
    validation[input.name] = input.value;

    const allFormFieldsPopulated = checkForMandatoryFormFieldsPopulated(
      validation
    );

    setState((prevState) => ({
      ...prevState,
      validation,
      errors,
      isEditFormSubmitDisabled: allFormFieldsPopulated && isObjEmpty(errors),
    }));

    if (input.name === "fieldComposition") {
      let { name, value } = input;
      setState((prevState) => ({
        ...prevState,
        name: value,
        isAddForm_childField_Available:
          event.nativeEvent.target.getAttribute("attfieldname") ===
          "Child Field",
      }));
    }
    if (input.name === "fieldType") {
      let { name, value } = input;
      setState((prevState) => ({
        ...prevState,
        name: value,
        isEditForm_DataListId_Available: [
          "Radio",
          "Checkbox",
          "Drop Down",
        ].includes(returnCoreData_DataTypes(value)),
      }));
    }

    if (input.name === "displayMode") {
      let { name, value } = input;
      setState((prevState) => ({
        ...prevState,
        name: value,
        isAddForm_ForEach_Available:
          event.nativeEvent.target.getAttribute("attfieldTypesName") == "3003", //If the display mode is for each
      }));
    }

    if (input.name === "forEachWhichField") {
      checkAndLoadTitleFields(
        event.nativeEvent.target.getAttribute("attfieldComposition"),
        input.value
      );
    }
  };

  const checkAndLoadTitleFields = (fieldComposition, fieldId) => {
    if (fieldComposition == 4002) {
      //If the selected field is a complex field
      //then need to enable the field list for display name selection
      //Call to load the fields with this specific parent Id

      forEachTitleFieldsAddForm(fieldId);

      setState((prevState) => ({
        ...prevState,
        name: fieldId,
        isAddForm_ForEachTitle_Available: true,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        name: fieldId,
        isAddForm_ForEachTitle_Available: false,
      }));
    }
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
  const getFieldCompositionNameById = (id) => {
    let fieldCompositionInfo = (state.fieldCompositionOptions || []).filter(
      (obj) => {
        return obj.id == id;
      }
    );
    return (fieldCompositionInfo[0] || {}).name || "";
  };
  const getDisplayModeNameById = (id) => {
    let displayModeInfo = (state.displayModeOptions || []).filter((obj) => {
      return obj.id == id;
    });
    return (displayModeInfo[0] || {}).name || "";
  };
  const onNoTableDataAlertCloseClick = () => {
    setState((prevState) => ({
      ...prevState,
      isNoTableDataAlertVisible: !state.isNoTableDataAlertVisible,
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
      // isSuccessAlert: true,
      // successMsg: "Successfully New Data is Added",
    }));
  };

  const getErrorUpdate = (err) => {
    let error = err.data && err.data.responseMessage;
    ippNotify.error(error || "");
    //console.log("resp", err);
    // ippNotify.error(err.data.responseMessage);
  };

  const setSearchedProperty = (searchProperty) => {
    setState((prevState) => ({
      ...prevState,
      searchedProperty: searchProperty,
    }));
  };

  const handleMenuItem = async () => {
    const result = await apigetUrl(
      `/insurance/core-data?page=${state.page}&limit=${state.limit}&typeId=20`
    );
    if (result.data.responseCode === "200") {
      setState((prevState) => ({
        ...prevState,
        menuItem: result.data.dataList,
        itemName: result.data.dataList.map((n) => n.name),
        menuItemId: result.data.dataList.map((n) => n.id),
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
      searchValidation.name !== "" ||
      searchValidation.key !== "" ||
      searchValidation.fieldType !== "" ||
      searchValidation.displayMode !== "" ||
      searchValidation.fieldComposition !== "";

    setState((prevState) => ({
      ...prevState,
      errors,
      searchValidation,
      isAdvancedSearchValidationText: isAnyFormFieldsPopulated,
    }));
  };

  const handleSearchClick = (e) => {
    apiCallParams.delete("name");
    apiCallParams.delete("key");
    apiCallParams.delete("fieldType");
    apiCallParams.delete("displayMode");
    apiCallParams.delete("fieldComposition");
    if (
      state.searchValidation.name === "" &&
      state.searchValidation.key === "" &&
      state.searchValidation.fieldType === "" &&
      state.searchValidation.displayMode === "" &&
      state.searchValidation.fieldComposition === ""
    ) {
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
      displayMode,
      fieldComposition,
    } = state.searchValidation;
    let tempArr = [];

    if (!isEmpty(name)) tempArr.push({ name });
    if (!isEmpty(key)) tempArr.push({ key });
    if (!isEmpty(fieldType)) tempArr.push({ fieldType });
    if (!isEmpty(displayMode)) tempArr.push({ displayMode });
    if (!isEmpty(fieldComposition)) tempArr.push({ fieldComposition });
    if ([1, 0].includes(isEditable)) tempArr.push({ isEditable });

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
    const {name,key,fieldType,isEditable,displayMode,fieldComposition,} = state.searchValidation;
    if (!isEmpty(name)) {}else{apiCallParams.delete("name");}
    if (!isEmpty(key))  {}else{apiCallParams.delete("key");}
    if (!isEmpty(fieldType)) {}else{ apiCallParams.delete("fieldType");}
    if (!isEmpty(displayMode))  {}else{ apiCallParams.delete("displayMode");}
    if (!isEmpty(fieldComposition))  {}else{apiCallParams.delete("fieldComposition");}
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
    const result = await apigetUrl(`/insurance/fields?` + searchURL);
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
        isLoading: false,
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
    apiCallParams.delete("key");
    apiCallParams.delete("fieldType");
    apiCallParams.delete("displayMode");
    apiCallParams.delete("fieldComposition");

    pageURL.search = apiCallParams.toString();

    const result = await apigetUrl(
      `/insurance/fields?page=${1}&limit=${state.limit}&sortBy=${
        state.sortBy
      }&sortType=${state.sortType}`
    );
    if (result.data.responseCode === "200") {
      setTimeout(() => {
      setState((prevState) => ({
        ...prevState,
        searchValidation: {
          name: "",
          key: "",
          fieldType: "",
          isEditable: "",
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
        key: "",
        fieldType: "",
        isEditable: "",
        displayMode: "",
        fieldComposition: "",
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
                  handleMenuItem={handleMenuItem}
                  menuItem={state.menuItem}
                  itemName={state.itemName}
                  onAdvancedSearchClickClean={onAdvancedSearchClickClean}
                  displayModeOptions={state.displayModeOptions || []}
                  forEachFieldOptions={state.forEachFieldOptions || []}
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
                        <TableBody>
                          <TableRow>
                            <TableCell>
                              <InfoModal
                                message={"Your query did not match any results"}
                              />
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      ) : (
                        <TableBody>
                          {state.data.map((n) => {
                            const isSelected = isSelectedFunc(n.id);
                            return (
                              <TableRow key={n.id}>
                                <TableCell>{n.name}</TableCell>
                                <TableCell>{n.key}</TableCell>
                                <TableCell>
                                  {returnCoreData_DataTypes(n.fieldType)}
                                </TableCell>
                                <TableCell>
                                  {getDisplayModeNameById(n.displayMode)}
                                </TableCell>
                                <TableCell>
                                  {getFieldCompositionNameById(
                                    n.fieldComposition
                                  )}
                                </TableCell>
                                <TableCell padding="none">
                                  <Tooltip title={<IntlMessages id="InputFields.Tooltip.Edit" />}>
                                    <IconButton
                                      id={n.id}
                                      onClick={(e) => onTableEditButtonClick(e)}
                                    >
                                      <EditIcon color="primary" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title={<IntlMessages id="InputFields.Tooltip.Delete" />}>
                                    <IconButton
                                      style={{ marginLeft: "-10px" }}
                                      id={n.id}
                                      onClick={(e) => onTableDeleteButtonClick(e)}
                                    >
                                      <DeleteIcon color="secondary" />
                                    </IconButton>
                                  </Tooltip>
                                  {state.auditEventId >= 1 ? (
                                    <Tooltip title={<IntlMessages id="InputFields.Tooltip.View" />}>
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
