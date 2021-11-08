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
import IntlMessages from "util/IntlMessages";
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
import {
  apigetUrl,
  apipostUrl,
  apiputUrl,
  apideleteUrl,
} from "../../../../../setup/middleware";
import InputAddButton from "../CommonComponents/AddButton";
import InputSubmitButton from "../CommonComponents/SubmitButton";
import InputCancelButton from "../CommonComponents/CancelButton";
import InputSearchButton from "../CommonComponents/SearchButton";
import InputResetButton from "../CommonComponents/ResetButton";
import InputField from "../CommonComponents/TextField";
import { useDispatch, useSelector } from "react-redux";
import {verifyToken} from "../../../../../actions/Auth";

// const config = {
//   headers: {
//     "Content-Type": "application/json",
//     accept: "application/json",
//   },
//   data: {},
// };

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
  getSuccessUpdate,
  isAdvancedSearchValidationText,
  handleSearchClick,
  onAdvancedSearchClickClean,
  searchValidation,
  menuItem,
  setCurrentUrl,
  handleMenuItem,
  itemName,
  callResetData,
  search,
  callLocalBaseURL,
  errors,
  handleInputChange,
  getErrorUpdate,
  sortBy,
  sortType,
}) => {
  const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);
  const dispatch = useDispatch();

  const onAdvancedSearchClick = (e) => {
    onAdvancedSearchClickClean();
    setIsAdvancedSearch(!isAdvancedSearch);
  };

  const showApiData = (apiData) => {
    // console.log("apidata = ", apiData);
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
    searchValidation: {
      name: "",
    },
    errors: {},
    isAddFormSubmitDisabled: false,
    areAllAddFormFieldsPopulated: false,
    addFormDialogOpen: false,
  });

  const AddNewDataInBackend = async () => {
    let addDataObj = {
      name: state.validation.name,
      description: state.validation.description,
    };

    setState((prevState) => ({
      ...prevState,
      addFormDialogOpen: false,
      isAddFormSubmitDisabled: false,
    }));

    const result = await apipostUrl(`/insurance/product-types`, addDataObj);
    if (result.data.responseCode === "200") {
      setState((prevState) => ({
        ...prevState,
        addFormDialogOpen: false,
        isEditFormSubmitDisabled: false,
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
      validation: {
        name: "",
        description: "",
      },
    }));
  };

  const handleAddDataRequestClose = () => {
    setState((prevState) => ({ ...prevState, addFormDialogOpen: false }));
  };

  const handleResetClick = (e) => {
    setState((prevState) => ({
      ...prevState,
      validation: {
        name: "",
        description: "",
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
      validation.name !== "" && validation.description !== "";
    /* validation.parentId !== ""; */

    setState((prevState) => ({
      ...prevState,
      validation,
      errors,
      isAddFormSubmitDisabled: isAnyFormFieldsPopulated && isObjEmpty(errors),
    }));
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
        open={state.addFormDialogOpen}
        onClose={handleAddDataRequestClose}
      >
        <DialogTitle>
          <IntlMessages id="producttype.master.modal.add.tilte" />
        </DialogTitle>
        <DialogContent>
          <InputField
            required
            className="mb-2"
            autoFocus
            id="name"
            error={state.errors.name}
            label={
              <IntlMessages id="producttype.master.modal.add.felid.Name" />
            }
            name="name"
            onChange={handleAddFormChange}
            value={state.validation.name}
            fullWidth
            helperText={state.errors.name}
          />

          <InputField
            required
            id="description"
            error={state.errors.description}
            label={
              <IntlMessages id="producttype.master.modal.add.felid.Description" />
            }
            name="description"
            onChange={handleAddFormChange}
            value={state.validation.description}
            fullWidth
            helperText={state.errors.description}
          />
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
              <div className="col-lg-3 col-sm-6 col-12 mb-3">
                <InputField
                  id="outlined-basic"
                  label={
                    <IntlMessages id="producttype.master.advancedsearch.Name" />
                  }
                  onChange={(event) => handleInputChange(event)}
                  value={searchValidation.name}
                  error={errors.name}
                  helperText={errors.name}
                  name="name"
                  fullWidth
                />
              </div>
              <div className="col-lg-9">
              </div>
              <div className="pt-2 ml-2">
                <InputSearchButton
                  onClick={(event) => handleSearchClick(event)}
                />
              </div>
              <div className="pt-2 ml-2">
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
  // pageNumber: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortType: PropTypes.string.isRequired,
};

export default EnhancedTableToolbar;
