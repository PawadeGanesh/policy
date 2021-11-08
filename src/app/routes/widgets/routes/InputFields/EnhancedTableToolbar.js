import React, { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import { useHistory } from "react-router-dom";
import "./master.css";
import IntlMessages from "util/IntlMessages";
import {
  makeStyles,
  IconButton,
  FormControl,
  Toolbar,
  Tooltip,
  Typography,
  MenuItem,
  InputLabel,
} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CardBox from "./../../../../../components/CardBox/index";
import Joi from "joi-browser";
import { apigetUrl, apipostUrl } from "../../../../../setup/middleware";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputAddButton from "../CommonComponents/AddButton";
import InputSubmitButton from "../CommonComponents/SubmitButton";
import InputCancelButton from "../CommonComponents/CancelButton";
import InputSearchButton from "../CommonComponents/SearchButton";
import InputResetButton from "../CommonComponents/ResetButton";
import InputField from "../CommonComponents/TextField";
import InputSelect from "../CommonComponents/Select";
import { useDispatch, useSelector } from "react-redux";
import {verifyToken} from "../../../../../actions/Auth";

const schema = {
  name: Joi.string()
    .required()
    .label("Name"),
  key: Joi.string()
    .required()
    .label("Key"),
  fieldType: Joi.number()
    .required()
    .label("Field Type"),
  dataListId: Joi.number()
    .optional()
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
    .optional()
    .label("Parent Field"),
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

const baseURL = `${process.env.REACT_APP_BASE_URL}`;

const api = axios.create({
  baseURL: baseURL,
});

let EnhancedTableToolbar = ({
  numSelected,
  getSuccessUpdate,
  isAdvancedSearchValidationText,
  handleSearchClick,
  onAdvancedSearchClickClean,
  searchValidation,
  callResetData,
  callLocalBaseURL,
  handleInputChange,
  getErrorUpdate,
}) => {
  const dispatch = useDispatch();
  const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);

  const onAdvancedSearchClick = (e) => {
    onAdvancedSearchClickClean();
    setIsAdvancedSearch(!isAdvancedSearch);
  };

  const showApiData = (apiData) => {
    // console.log("apidata = ", apiData);
  };

  const [state, setState] = useState({
    event: "",
    description: "",
    actionType: "",
    referenceID: "",
    currency: "",
    addForm_Name: "",
    addForm_Key: "",
    addForm_FieldType: "",
    addForm_dataListId: "",
    addForm_MinLength: "",
    addForm_MaxLength: "",
    addForm_RegExp: "",
    isAddForm_DataListId_Available: false,
    isAddForm_childField_Available: false,
    isAddForm_ForEach_Available: false,
    isAddForm_ForEachTitle_Available: false,
    validation: {
      name: "",
      key: "",
      fieldType: "",
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
    searchValidation: {
      name: "",
      key: "",
      fieldType: "",
      isEditable: "",
      displayMode: "",
      fieldComposition: "",
    },
    errors: {},
    isAddFormSubmitDisabled: false,
    areAllAddFormFieldsPopulated: false,
    displayModeOptions: [],
    fieldCompositionOptions: [],
    fieldTypesAddForm: [],
    parentIdsOptions: [],
    dataListTypesOptions: [],
    forEachFieldOptions: [],
    forEachTitleFieldOptions: [],
    addFormDialogOpen: false,
    encryptModeList: []
  });

  useEffect(() => {
    getDisplayModeData();
    getFieldCompositionData();
    fieldTypesAddForm();
    parentIdAddForm();
    dataListsAddForm();
    forEachFieldsAddForm();
    fetchEncryptModeList();
  }, []);

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

  const AddNewDataInBackend = async () => {
    let addDataObj = {
      name: state.validation.name,
      key: state.validation.key,
      /* fieldType: returnReverse_CoreData_DataTypes(state.validation.fieldType), */
      fieldType: state.validation.fieldType,
      dataListId: state.validation.dataListId,
      minLength: state.validation.minLength,
      maxLength: state.validation.maxLength,
      regExp: state.validation.regExp,
      displayMode: state.validation.displayMode,
      fieldComposition: state.validation.fieldComposition,
      parentId: state.validation.parentId,
      secData: state.validation.forEachWhichField,
      secData2: state.validation.forEachTitleField,
      encryptMode: state.validation.encryptMode
    };

    const result = await apipostUrl(`/insurance/fields`, addDataObj);
    if (result.data.responseCode === "200") {
      setState((prevState) => ({
        ...prevState,
        addFormDialogOpen: false,
        isEditFormSubmitDisabled: false,
        isAddFormSubmitDisabled: false,
      }));
      getSuccessUpdate();
      callLocalBaseURL();
    } else {
      if(result.status===401||result.status===402){
        dispatch(verifyToken())
      }
	  else{
      getErrorUpdate(result);
	  }
    }
  };

  const validate = () => {
    const options = {
      abortEarly: false,
    };
    const { error } = Joi.validate(state.validation, schema, options);

    if (!error) return null;
    const errors = {};

    for (let item of error.details) errors[item.path[0]] = item.message;
    return errors;
  };

  let history = useHistory();

  const handleAddFormDataSubmit = () => {
    AddNewDataInBackend();
  };

  const useStyles2 = makeStyles((theme) => ({
    button: {
      margin: theme.spacing(1),
    },
  }));

  const classes_AddButton = useStyles2();

  const onAddButtonClick = (e) => {
    setState((prevState) => ({
      ...prevState,
      addFormDialogOpen: true,
      isAddForm_DataListId_Available: false,
      isAddForm_childField_Available: false,
      isAddForm_ForEach_Available: false,
      isAddForm_ForEachTitle_Available: false,
      parentId: "",
      dataListId: "",
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
        parentId: "",
      },
      errors: {},
    }));
  };

  const handleAddDataRequestClose = () => {
    setState((prevState) => ({ ...prevState, addFormDialogOpen: false }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleResetClick = (e) => {
    setState((prevState) => ({
      ...prevState,
      validation: {
        name: "",
        key: "",
        fieldType: "",
        isEditable: "",
        displayMode: "",
        fieldComposition: "",
      },
    }));

    callResetData();
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

  const checkAreAllAddFormFieldsPopulated = (obj) => {
    return !Object.values(obj).some((x) => x === "");
  };

  const handleAddFormChange = (event, optionsName) => {
    let { target: input } = event;
    const errors = { ...state.errors };

    const errorMessage = validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const validation = { ...state.validation };
    validation[input.name] = input.value;

    const allFormFieldsPopulated = checkAreAllAddFormFieldsPopulated(
      validation
    );

    let isAnyFormFieldsPopulated = false;
    isAnyFormFieldsPopulated =
      validation.name !== "" &&
      validation.key !== "" &&
      validation.fieldType !== "" &&
      validation.key !== "" &&
      validation.minLength !== "" &&
      validation.maxLength !== "" &&
      /* validation.regExp !== "" && */
      validation.displayMode !== "" &&
      validation.fieldComposition !== "";
    /* validation.parentId !== ""; */

    setState((prevState) => ({
      ...prevState,
      validation,
      errors,
      isAddFormSubmitDisabled: isAnyFormFieldsPopulated && isObjEmpty(errors),
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
        isAddForm_DataListId_Available:
          event.nativeEvent.target.getAttribute("attfieldtypesname") ===
            "Radio" ||
          event.nativeEvent.target.getAttribute("attfieldtypesname") ===
            "Checkbox" ||
          event.nativeEvent.target.getAttribute("attfieldtypesname") ===
            "Dropdown",
      }));
    }

    if (input.name === "displayMode") {
      let { name, value } = input;
      setState((prevState) => ({
        ...prevState,
        name: value,
        isAddForm_ForEach_Available:
          event.nativeEvent.target.getAttribute("attfieldtypesname") == "3003", //If the display mode is for each
      }));
    }

    if (input.name === "forEachWhichField") {
      if (
        event.nativeEvent.target.getAttribute("attfieldcomposition") == 4002
      ) {
        //If the selected field is a complex field
        //then need to enable the field list for display name selection
        //Call to load the fields with this specific parent Id

        forEachTitleFieldsAddForm(input.value);

        let { name, value } = input;
        setState((prevState) => ({
          ...prevState,
          name: value,
          isAddForm_ForEachTitle_Available: true,
        }));
      } else {
        let { name, value } = input;
        setState((prevState) => ({
          ...prevState,
          name: value,
          isAddForm_ForEachTitle_Available: false,
        }));
      }
    }
  };

  return (
    <>
      <Toolbar className="table-header">
        <div className="spacer" />
        <div>
          <InputAddButton
            className={classes_AddButton.button}
            onClick={() => onAddButtonClick()}
          />
        </div>
        <div className="actions mr-3">
          {numSelected > 0 ? (
            <Tooltip title="Delete">
              <IconButton aria-label="Delete">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title={<IntlMessages id="EnhancedTableHead.Tooltip.List" />}>
              <IconButton
                onClick={(event) => onAdvancedSearchClick(event)}
                aria-label="Filter list"
              >
                <FilterListIcon />
              </IconButton>
            </Tooltip>
          )}
        </div>
      </Toolbar>
      <Dialog
        maxWidth="sm"
        open={state.addFormDialogOpen || false}
        onClose={handleAddDataRequestClose}
      >
        <DialogTitle>
          <IntlMessages id="inputfelid.master.modal.add.tilte" />
        </DialogTitle>
        <DialogContent>
          <div className="row">
            <div className="col-lg-6">
              <InputField
                required
                className="mb-3"
                autoFocus
                id="name"
                error={state.errors.name}
                label={
                  <IntlMessages id="inputfelid.master.modal.add.felid.Name" />
                }
                name="name"
                onChange={handleAddFormChange}
                value={state.validation.name}
                fullWidth
                helperText={state.errors.name}
              />
            </div>
            <div className="col-lg-6">
              <InputField
                required
                id="key"
                error={state.errors.key}
                label={
                  <IntlMessages id="inputfelid.master.modal.add.felid.Key" />
                }
                name="key"
                onChange={handleAddFormChange}
                value={state.validation.key}
                fullWidth
                helperText={state.errors.key}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6">
              {state.errors.fieldType ? (
                <FormControl
                  required
                  variant="outlined"
                  className="w-100 mb-2"
                  error
                >
                  <InputLabel>
                    <IntlMessages id="inputfelid.master.modal.add.felid.FieldType" />
                  </InputLabel>
                  <InputSelect
                    labelId="FieldType"
                    name="fieldType"
                    id="fieldType"
                    label={
                      <IntlMessages id="inputfelid.master.modal.add.felid.FieldType" />
                    }
                    value={state.validation.fieldType || ""}
                    onChange={handleAddFormChange}
                  >
                    <MenuItem value="">
                      <em>Select</em>
                    </MenuItem>
                    {state.fieldTypesAddForm.map((option) => (
                      <MenuItem
                        name="fieldType"
                        key={option.id}
                        attfieldtypesname={option.name}
                        value={option.id}
                      >
                        {option.name}
                      </MenuItem>
                    ))}
                  </InputSelect>
                  <FormHelperText style={{ color: "red" }}>
                    {state.errors.fieldType ? state.errors.fieldType : " "}
                  </FormHelperText>
                </FormControl>
              ) : (
                <FormControl required variant="outlined" className="w-100 mb-2">
                  <InputLabel>
                    <IntlMessages id="inputfelid.master.modal.add.felid.FieldType" />
                  </InputLabel>
                  <InputSelect
                    labelId="FieldType"
                    name="fieldType"
                    id="fieldType"
                    label={
                      <IntlMessages id="inputfelid.master.modal.add.felid.FieldType" />
                    }
                    value={state.validation.fieldType || ""}
                    onChange={handleAddFormChange}
                  >
                    <MenuItem value="">
                      <em>Select</em>
                    </MenuItem>
                    {state.fieldTypesAddForm.map((option) => (
                      <MenuItem
                        name="fieldType"
                        key={option.id}
                        attfieldtypesname={option.name}
                        value={option.id}
                      >
                        {option.name}
                      </MenuItem>
                    ))}
                  </InputSelect>
                </FormControl>
              )}
            </div>
            <div className="col-lg-6">
              {state.isAddForm_DataListId_Available ? (
                <FormControl variant="outlined" className="w-100 mb-2">
                  <InputLabel>
                    <IntlMessages id="Data List ID" />
                  </InputLabel>
                  <InputSelect
                    required
                    id="dataListId"
                    select
                    variant="outlined"
                    label="Data List ID"
                    name="dataListId"
                    onChange={handleAddFormChange}
                    SelectProps={{}}
                    value={state.validation.dataListId || ""}
                    fullWidth
                  >
                    <MenuItem value="">
                      <em>Select</em>
                    </MenuItem>
                    {state.dataListTypesOptions.map((option) => (
                      <MenuItem
                        name="dataListId"
                        key={option.id}
                        attfieldtypesname={option.name}
                        value={option.id}
                      >
                        {option.name}
                      </MenuItem>
                    ))}
                  </InputSelect>
                </FormControl>
              ) : null}
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-lg-6">
              <InputField
                required
                className="mb-2"
                label={
                  <IntlMessages id="inputfelid.master.modal.add.felid.MinLength" />
                }
                name="minLength"
                error={state.errors.minLength}
                onChange={(e) => {
                  let value = e.target.value;
                  if (!isNaN(value)) {
                    handleAddFormChange(e);
                  }
                }}
                value={state.validation.minLength}
                fullWidth
                helperText={state.errors.minLength}
              />
            </div>
            <div className="col-lg-6">
              <InputField
                required
                className="mb-2"
                label={
                  <IntlMessages id="inputfelid.master.modal.add.felid.MaxLength" />
                }
                name="maxLength"
                error={state.errors.maxLength}
                onChange={(e) => {
                  let value = e.target.value;
                  if (!isNaN(value)) {
                    handleAddFormChange(e);
                  }
                }}
                value={state.validation.maxLength}
                fullWidth
                helperText={state.errors.maxLength}
              />
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-lg-6">
              <InputField
                className="mb-2 mt-0"
                label={
                  <IntlMessages id="inputfelid.master.modal.add.felid.RegExp" />
                }
                name="regExp"
                onChange={handleAddFormChange}
                value={state.validation.regExp}
                fullWidth
                margin="normal"
              />
            </div>
            <div className="col-lg-6">
              {state.errors.displayMode ? (
                <FormControl
                  required
                  variant="outlined"
                  className="w-100 mb-2"
                  error
                >
                  <InputLabel>
                    <IntlMessages id="inputfelid.master.modal.add.felid.DisplayMode" />
                  </InputLabel>
                  <InputSelect
                    labelId="DisplayMode"
                    className="mb-2 mt-0"
                    name="displayMode"
                    id="displayMode"
                    label={
                      <IntlMessages id="inputfelid.master.modal.add.felid.DisplayMode" />
                    }
                    value={state.validation.displayMode || ""}
                    onChange={handleAddFormChange}
                  >
                    <MenuItem value="">
                      <em>Select</em>
                    </MenuItem>
                    {state.displayModeOptions.map((option) => (
                      <MenuItem
                        name="displayMode"
                        attfieldtypesname={option.id}
                        key={option.id}
                        value={option.id}
                      >
                        {option.name}
                      </MenuItem>
                    ))}
                  </InputSelect>
                  <FormHelperText style={{ color: "red" }}>
                    {state.errors.displayMode ? state.errors.displayMode : " "}
                  </FormHelperText>
                </FormControl>
              ) : (
                <FormControl required variant="outlined" className="w-100 mb-2">
                  <InputLabel>
                    <IntlMessages id="inputfelid.master.modal.add.felid.DisplayMode" />
                  </InputLabel>
                  <InputSelect
                    labelId="DisplayMode"
                    className="mb-2 mt-0"
                    name="displayMode"
                    id="displayMode"
                    label={
                      <IntlMessages id="inputfelid.master.modal.add.felid.DisplayMode" />
                    }
                    value={state.validation.displayMode || ""}
                    onChange={handleAddFormChange}
                  >
                    <MenuItem value="">
                      <em>Select</em>
                    </MenuItem>
                    {state.displayModeOptions.map((option) => (
                      <MenuItem
                        name="displayMode"
                        attfieldtypesname={option.id}
                        key={option.id}
                        value={option.id}
                      >
                        {option.name}
                      </MenuItem>
                    ))}
                  </InputSelect>
                </FormControl>
              )}
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-lg-6">
              {state.isAddForm_ForEach_Available ? (
                <FormControl variant="outlined" className="w-100 mb-2">
                  <InputLabel>
                    <IntlMessages id="Which Field" />
                  </InputLabel>
                  <InputSelect
                    required
                    id="forEachWhichField"
                    select
                    label="Which Field"
                    name="forEachWhichField"
                    variant="outlined"
                    onChange={handleAddFormChange}
                    SelectProps={{}}
                    value={state.validation.forEachWhichField || ""}
                    fullWidth
                  >
                    <MenuItem value="">
                      <em>Select</em>
                    </MenuItem>
                    {state.forEachFieldOptions.map((option) => (
                      <MenuItem
                        name="forEachWhichField"
                        attfieldtypesname={option.value}
                        attfieldcomposition={option.fieldComposition}
                        attfieldparentid={option.parentId}
                        key={option.id}
                        value={option.id}
                      >
                        {option.name}
                      </MenuItem>
                    ))}
                  </InputSelect>
                </FormControl>
              ) : null}
            </div>

            <div className="col-lg-6">
              {state.isAddForm_ForEachTitle_Available ? (
                <FormControl variant="outlined" className="w-100 mb-2">
                  <InputLabel>
                    <IntlMessages id="Title Field" />
                  </InputLabel>
                  <InputSelect
                    required
                    id="forEachTitleField"
                    select
                    label="Title Field"
                    name="forEachTitleField"
                    onChange={handleAddFormChange}
                    SelectProps={{}}
                    variant="outlined"
                    value={state.validation.forEachTitleField || ""}
                    fullWidth
                  >
                    <MenuItem value="">
                      <em>Select</em>
                    </MenuItem>
                    {state.forEachTitleFieldOptions.map((option) => (
                      <MenuItem
                        name="forEachTitleField"
                        key={option.id}
                        attfieldtypesname={option.name}
                        value={option.id}
                      >
                        {option.name}
                      </MenuItem>
                    ))}
                  </InputSelect>
                </FormControl>
              ) : null}
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6">
              {state.errors.fieldComposition ? (
                <FormControl
                  required
                  variant="outlined"
                  className="w-100 mb-2"
                  error
                >
                  <InputLabel>
                    <IntlMessages id="inputfelid.master.modal.add.felid.FieldComposition" />
                  </InputLabel>
                  <InputSelect
                    labelId="FieldComposition"
                    className="mb-2 mt-0"
                    name="fieldComposition"
                    id="fieldComposition"
                    label={
                      <IntlMessages id="inputfelid.master.modal.add.felid.FieldComposition" />
                    }
                    value={state.validation.fieldComposition || ""}
                    onChange={handleAddFormChange}
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
                  </InputSelect>
                  <FormHelperText>
                    {state.errors.fieldComposition
                      ? state.errors.fieldComposition
                      : " "}
                  </FormHelperText>
                </FormControl>
              ) : (
                <FormControl required variant="outlined" className="w-100 mb-2">
                  <InputLabel>
                    <IntlMessages id="inputfelid.master.modal.add.felid.FieldComposition" />
                  </InputLabel>
                  <InputSelect
                    labelId="FieldComposition"
                    className="mb-2 mt-0"
                    name="fieldComposition"
                    id="fieldComposition"
                    label={
                      <IntlMessages id="inputfelid.master.modal.add.felid.FieldComposition" />
                    }
                    value={state.validation.fieldComposition || ""}
                    onChange={handleAddFormChange}
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
                  </InputSelect>
                </FormControl>
              )}
            </div>
            <div className="col-lg-6">
              {state.isAddForm_childField_Available ? (
                <FormControl variant="outlined" className="w-100 mb-2">
                  <InputLabel>
                    <IntlMessages id="Parent ID" />
                  </InputLabel>
                  <InputSelect
                    required
                    className="mb-2 mt-0"
                    name="parentId"
                    id="parentId"
                    select
                    label="Parent ID"
                    variant="outlined"
                    value={state.validation.parentId || ""}
                    onChange={handleAddFormChange}
                    SelectProps={{}}
                    margin="normal"
                    fullWidth
                  >
                    <MenuItem value="">
                      <em>Select</em>
                    </MenuItem>
                    {state.parentIdsOptions.map((option) => (
                      <MenuItem
                        name="parentId"
                        key={option.id}
                        attfieldtypesname={option.name}
                        value={option.id}
                      >
                        {option.name}
                      </MenuItem>
                    ))}
                  </InputSelect>
                </FormControl>
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
                  onChange={handleAddFormChange}
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
          <InputCancelButton onClick={(e) => handleAddDataRequestClose(e)} />
          <InputSubmitButton
            onClick={(e) => handleAddFormDataSubmit(e)}
            disabled={!state.isAddFormSubmitDisabled}
          />
        </DialogActions>
      </Dialog>
      {isAdvancedSearch ? (
        <div className="row mx-1">
          <CardBox
            styleName="col-12"
            heading={<IntlMessages id="ipp.common.advancedsearch.title" />}
          >
            <form className="row" autoComplete="off">
              <div className="col-lg col-sm-6 col-12 mb-3">
                <InputField
                  id="outlined-basic"
                  label={
                    <IntlMessages id="inputfelid.master.advancedsearch.Name" />
                  }
                  onChange={(event) => handleInputChange(event)}
                  value={searchValidation.name}
                  // error={errors.name}
                  // helperText={errors.name}
                  name="name"
                  fullWidth
                />
              </div>
              <div className="col-lg col-sm-6 col-12 mb-3">
                <InputField
                  id="key"
                  label={
                    <IntlMessages id="inputfelid.master.advancedsearch.Key" />
                  }
                  onChange={(event) => handleInputChange(event)}
                  value={searchValidation.key}
                  // error={errors.key}
                  // helperText={errors.key}
                  name="key"
                  fullWidth
                />
              </div>
              <div className="col-lg col-sm-6 col-12 mb-2">
                <FormControl variant="outlined" className="w-100 mb-2">
                  <InputLabel>
                    <IntlMessages id="inputfelid.master.advancedsearch.FieldType" />
                  </InputLabel>
                  <InputSelect
                    id="fieldType"
                    className="mb-3"
                    label={
                      <IntlMessages id="inputfelid.master.advancedsearch.FieldType" />
                    }
                    variant="outlined"
                    name="fieldType"
                    select
                    onChange={(event) => handleInputChange(event)}
                    value={searchValidation.fieldType || ""}
                    fullWidth
                    // error={errors.fieldType}
                    // helperText={errors.fieldType}
                  >
                    <MenuItem value="">
                      <em>Select</em>
                    </MenuItem>
                    {state.fieldTypesAddForm.map((option) => (
                      <MenuItem
                        name="fieldType"
                        key={option.id}
                        attfieldtypesname={option.name}
                        value={option.id}
                      >
                        {option.name}
                      </MenuItem>
                    ))}
                  </InputSelect>
                </FormControl>
              </div>

              <div className="col-lg col-sm-6 col-12 mb-2">
                <FormControl variant="outlined" className="w-100 mb-2">
                  <InputLabel>
                    <IntlMessages id="inputfelid.master.advancedsearch.DisplayMode" />
                  </InputLabel>
                  <InputSelect
                    id="displayMode"
                    className="mb-3"
                    label={
                      <IntlMessages id="inputfelid.master.advancedsearch.DisplayMode" />
                    }
                    variant="outlined"
                    name="displayMode"
                    select
                    onChange={(event) => handleInputChange(event)}
                    value={searchValidation.displayMode || ""}
                    fullWidth
                    // error={errors.displayMode}
                    // helperText={errors.displayMode}
                  >
                    <MenuItem value="">
                      <em>Select</em>
                    </MenuItem>
                    {state.displayModeOptions.map((option) => (
                      <MenuItem
                        name="displayMode"
                        key={option.id}
                        attfieldtypesname={option.name}
                        value={option.id}
                      >
                        {option.name}
                      </MenuItem>
                    ))}
                  </InputSelect>
                </FormControl>
              </div>

              <div className="col-lg col-sm col-12 mb-2">
                <FormControl variant="outlined" className="w-100 mb-2">
                  <InputLabel>
                    <IntlMessages id="inputfelid.master.advancedsearch.FieldComposition" />
                  </InputLabel>
                  <InputSelect
                    id="fieldComposition"
                    className="mb-3"
                    label={
                      <IntlMessages id="inputfelid.master.advancedsearch.FieldComposition" />
                    }
                    variant="outlined"
                    name="fieldComposition"
                    select
                    onChange={(event) => handleInputChange(event)}
                    value={searchValidation.fieldComposition || ""}
                    fullWidth
                    // error={errors.fieldComposition}
                    // helperText={errors.fieldComposition}
                  >
                    <MenuItem value="">
                      <em>Select</em>
                    </MenuItem>
                    {state.fieldCompositionOptions.map((option) => (
                      <MenuItem
                        name="fieldComposition"
                        key={option.id}
                        attfieldtypesname={option.name}
                        value={option.id}
                      >
                        {option.name}
                      </MenuItem>
                    ))}
                  </InputSelect>
                </FormControl>
              </div>

              {/* <div className="col-lg col-sm col-12 mb-2">
                <FormControl variant="outlined" className="w-100 mb-2">
                  <InputLabel id="isEditable">Is Editable</InputLabel>
                  <Select
                    labelId="isEditable"
                    id="isEditable"
                    label={<IntlMessages id="inputfelid.master.advancedsearch.IsEditable"/>}
                    name="isEditable"
                    value={searchValidation.isEditable}
                    onChange={handleInputChange}
                    // error={errors.isEditable}
                    // helperText={errors.isEditable}
                  >
                    <MenuItem value="">
                      <em>Select</em>
                    </MenuItem>
                    <MenuItem value={1}>Editable</MenuItem>
                    <MenuItem value={0}>Not editable</MenuItem>
                  </Select>
                </FormControl>
              </div> */}
            </form>
            <form className="row" autoComplete="off">
              <div className="pt-2 ml-2">
                <InputSearchButton
                  onClick={(event) => handleSearchClick(event)}
                />
              </div>
              <div className="pt-2">
                <InputResetButton
                  onClick={(event) => handleResetClick(event)}
                />
              </div>

              <Typography
                variant="subtitle2"
                gutterBottom
                className="ml-3 mt-3"
                color="error"
              >
                {!isAdvancedSearchValidationText
                  ? "At least one field should be filled"
                  : null}
              </Typography>
            </form>
          </CardBox>
        </div>
      ) : null}
    </>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  setAdvancedSearchData: PropTypes.func.isRequired,
  setResetData: PropTypes.func.isRequired,
  setCurrentUrl: PropTypes.func.isRequired,
  limit: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortType: PropTypes.string.isRequired,
  displayModeOptions: PropTypes.array.isRequired,
  forEachFieldOptions: PropTypes.array.isRequired,
};

export default EnhancedTableToolbar;
