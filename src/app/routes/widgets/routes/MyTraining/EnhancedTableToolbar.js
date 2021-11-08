import React, { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import keycode from "keycode";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import fetch from "cross-fetch";
import { Autocomplete, Alert } from "@material-ui/lab";
import { useHistory } from "react-router-dom";
import DateFnsUtils from "@date-io/date-fns";
import "./master.css";
import { withStyles } from "@material-ui/core/styles";

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
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import AddIcon from "@material-ui/icons/Add";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { SettingsApplicationsOutlined } from "@material-ui/icons";
import CardBox from "./../../../../../components/CardBox/index";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import EditIcon from "@material-ui/icons/Edit";
import Joi from "joi-browser";
import IntlMessages from "util/IntlMessages";
import InputSearchButton from "../CommonComponents/SearchButton";
import InputResetButton from "../CommonComponents/ResetButton";
import InputField from "../CommonComponents/TextField";
import InputDatePicker from "../CommonComponents/DatePicker";

const config = {
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
  data: {},
};

const schema = {
  name: Joi.string()
    .required()
    .label("Name"),
  description: Joi.string()
    .required()
    .label("Description"),
};

const baseURL = `${process.env.REACT_APP_BASE_URL}`;

const api = axios.create({
  baseURL: baseURL,
});

let EnhancedTableToolbar = ({
  numSelected,
  setAdvancedSearchData,
  setResetData,
  page,
  limit,
  setAdvancedSearchError,
  validation,
  policyIssueStartDate,
  policyIssueEndDate,
  isPolicyIssueDateStartDateActive,
  isPolicyIssueDateEndDateDisabled,

  requestDateStartDate,
  requestDateEndDate,
  isPolicyExpiryDateStartDateActive,
  isPolicyExpiryDateEndDateDisabled,

  getSuccessUpdate,
  isAdvancedSearchValidationText,
  handleSearchClick,
  onAdvancedSearchClickClean,
  searchValidation,
  menuItem,
  setCurrentUrl,
  handleMenuItem,
  itemName,
  search,
  callLocalBaseURL,
  errors,
  handleInputChange,
  getErrorUpdate,
  sortBy,
  handlePolicyIssueDateStartDate,
  sortType,
  handlePolicyIssueDateEndDate,
  handlePolicyExpiryDateEndDate,
  handlePolicyExpiryDateStartDate,
  callResetData,
  onAdvancedSearchClick,
  isAdvancedSearch,
  handler,
  handlingDefaultValue,
  dataOFLocation,
}) => {
  //const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);

  const showApiData = (apiData) => {
    console.log("apidata = ", apiData);
  };

  const [state, setState] = useState({
    event: "",
    actionType: "",
    referenceID: "",
    currency: "",
    addForm_Name: "",
    validation: {
      name: "",
      description: "",
    },
    parentId: "",
    dataListId: "",

    errors: {},
    isAddFormSubmitDisabled: false,
    areAllAddFormFieldsPopulated: false,
    isActive: false,
  });

  const AddNewDataInBackend = async () => {
    let addDataObj = {
      name: state.validation.name,
      description: state.validation.description,
    };
    console.log("addDataObj = ", addDataObj);

    setState((prevState) => ({
      ...prevState,
      addFormDialogOpen: false,
      isAddFormSubmitDisabled: false,
    }));

    api
      .post(baseURL + "/insurance/product-types/", addDataObj)
      .then((res) => {
        console.log("Response of Add Submit", res.data);
        setState((prevState) => ({
          ...prevState,
          addFormDialogOpen: false,
          isEditFormSubmitDisabled: false,
        }));
        getSuccessUpdate();
        callLocalBaseURL();
      })
      .catch((err) => {
        console.log("err23", err.response.data.responseMessage);
        console.log("err23", err.response);
        getErrorUpdate(err);
      });
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
      validation: {
        name: "",
        description: "",
      },
    }));
  };

  const handleAddDataRequestClose = () => {
    setState((prevState) => ({ ...prevState, addFormDialogOpen: false }));
  };

  //   const callResetData = async () => {

  // debugger

  //     setState((prevState) => ({
  //       ...prevState,
  //       policyIssueStartDate: null,
  //       policyIssueEndDate: null,
  //       isPolicyIssueDateStartDateActive: false,
  //       isPolicyIssueDateEndDateDisabled: true,
  //       policyExpiryStartDate: null,
  //       policyExpiryEndDate: null,
  //       isPolicyExpiryDateStartDateActive: false,
  //       isPolicyExpiryDateEndDateDisabled: true,

  //     }));
  //   };

  const handleResetClick = (e) => {
    callResetData();
    setState((prevState) => ({
      ...prevState,
      isActive: !state.isActive,
    }));
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
    console.log("target", input);
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
    isAnyFormFieldsPopulated = validation.name !== "";
    /* validation.parentId !== ""; */
    console.log("allFormFieldsPopulated = ", isAnyFormFieldsPopulated);

    console.log("allFormFieldsPopulated = ", allFormFieldsPopulated);

    setState((prevState) => ({
      ...prevState,
      validation,
      errors,
      isAddFormSubmitDisabled: isAnyFormFieldsPopulated && isObjEmpty(errors),
    }));
  };

  const handleDateChange = (date) => {
    console.log("Date", date);
    //setSelectedDate(date);
  };

  const [selectedDate, setSelectedDate] = React.useState();

  const useStyles = makeStyles((theme) => ({
    root: {
      width: "100%",
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: "33.33%",
      flexShrink: 0,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
  }));

  const classes = useStyles();

  return (
    <>
      <Toolbar className="table-header">
        <div className="spacer" />
        <div></div>
        <div className="actions mr-3">
          {numSelected > 0 ? (
            <Tooltip title="Delete">
              <IconButton aria-label="Delete">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Filter list">
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
        open={state.addFormDialogOpen}
        onClose={handleAddDataRequestClose}
      >
        <DialogTitle>Add Product Types</DialogTitle>
        <DialogContent>
          <TextField
            required
            className="mb-2"
            autoFocus
            id="name"
            error={state.errors.name}
            label="Name"
            name="name"
            onChange={handleAddFormChange}
            value={state.validation.name}
            fullWidth
            helperText={state.errors.name}
          />

          <TextField
            required
            id="description"
            error={state.errors.description}
            label="Description"
            name="description"
            onChange={handleAddFormChange}
            value={state.validation.description}
            fullWidth
            helperText={state.errors.description}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={(e) => handleAddDataRequestClose(e)}
            color="secondary"
            variant="contained"
          >
            Cancel
          </Button>
          <Button
            className="mr-1"
            onClick={(e) => handleAddFormDataSubmit(e)}
            color="primary"
            variant="contained"
            disabled={!state.isAddFormSubmitDisabled}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      {isAdvancedSearch ? (
        <div className="row mx-1">
          <CardBox
            styleName="col-12"
            heading={<IntlMessages id="ipp.common.advancedsearch.title" />}
          >
            <form autoComplete="off">
            
              <div className="row">
                <div className="col-lg-3 col-sm-6 col-12 mb-3">
                  <InputField
                    id="outlined-basic"
                    onChange={(event) => handleInputChange(event)}
                    value={searchValidation.firstName}
                    error={errors.name}
                    helperText={errors.name}
                    name="ShortName"
                    label={
                      <IntlMessages id="mytraining.Advance.ShortName" />
                    }
                    fullWidth
                  />
                </div>
                <div className="col-lg-3 col-sm-6 col-12 mb-3">
                  <InputField
                    id="outlined-basic"
                    onChange={(event) => handleInputChange(event)}
                    value={searchValidation.middleName}
                    error={errors.name}
                    helperText={errors.name}
                    name="FullName"
                    fullWidth
                    label={
                      <IntlMessages id="mytraining.Advance.FullName" />
                    }
                  />
                </div>
                <div className="col-lg-6">
              </div>
                <div className="pt-2 ml-2">
                  <InputSearchButton onClick={handleSearchClick} />
                </div>
                <div className="pt-2">
                  <InputResetButton
                    onClick={(event) => handleResetClick(event)}
                  />
                </div>
               
              </div>
              <br />
              <br />
              <div className="row">
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
              </div>
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
  pageNumber: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortType: PropTypes.string.isRequired,
};

export default EnhancedTableToolbar;
