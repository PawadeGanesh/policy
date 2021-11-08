import React, { useState, useEffect, useRef } from "react";
import "./root.component.css";
import MaterialTable from "material-table";
import axios from "axios";
import { forwardRef } from "react";
import { Modal, TextField, Button } from "@material-ui/core";
import PropTypes from "prop-types";
import Toolbar from "@material-ui/core/Toolbar";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import fetch from "cross-fetch";
import Typography from "@material-ui/core/Typography";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormHelperText from "@material-ui/core/FormHelperText";
import CardBox from "../../../../../components/CardBox";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Joi from "joi-browser";
import IntlMessages from "util/IntlMessages";
import _ from "lodash";
import apiInstance from "../../../../../setup/index";
import {
  apigetUrl,
  apipostUrl,
  apiputUrl,
} from "../../../../../setup/middleware";
import InputAddButton from "../CommonComponents/AddButton";
import InputSubmitButton from "../CommonComponents/SubmitButton";
import InputCancelButton from "../CommonComponents/CancelButton";
import InputSearchButton from "../CommonComponents/SearchButton";
import InputResetButton from "../CommonComponents/ResetButton";
import InputAutocomplete from "../CommonComponents/Autocomplete";
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
    .allow("")
    .optional()
    .label("Description"),
  categoryId: Joi.string()
    .required()
    .label("CategoryId"),
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
  rowsPerPage,
  pageCount,
  sortBy,
  sortType,
  getSuccessUpdate,
  callLocalBaseURL,
  getErrorUpdate,
  setPageCount,
  limit,
  handleTextFieldChange,
  name,
  categoryData,
  handleSearchCategory,
  handleApplyClick,
  nameReset,
  handleCategoryName,
  categoryReset,
  categoryName,
  categoryValue,
  onAdvancedSearchClickClean,
  handleResetClick,
  handleAdvancedSearchOnChange,
  handleAutoCompleteInputReset,
  advancedSearchValidationErrors,
  isAdvancedSearchValidationText,
}) => {
  const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);
  const dispatch = useDispatch();

  const onAdvancedSearchClick = (e) => {
    onAdvancedSearchClickClean();
    setIsAdvancedSearch(!isAdvancedSearch);
  };
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
  }));

  const classes = useStyles();
  const categoryID_AutoComplete_Ref = useRef();

  const [state, setState] = useState({
    name: "",
    categoryId: "",
    order: "asc",
    orderBy: "name",
    selected: [],
    page: 1,
    rowsPerPage: 5,
    count: 0,
    data: [],
    addFormDialogOpen: false,
    selectedEditId: "",
    isAddForm_NameError: false,
    isAddForm_DescriptionError: false,
    isAddForm_CategoryIdError: false,
    selected_AddForm_Name_Value: "",
    selected_AddForm_Description_Value: "",
    selected_AddForm_CategoryId_Value: "",
    isSortAsc: true,
    validation: {
      name: "",
      description: "",
    },
    categoryId: "",
    catID: 0,
    errors: {},
    addSubCategoryValidationText: false,
    isAddFormSubmitDisabled: false,
    areAllAddFormFieldsPopulated: false,
    allData: [],
    autoCompleltePopulated: false,
    error: false,
    categoryIdPopulated: false,
    namePopulated: false,
  });

  const getData = async () => {
    const result = await apigetUrl(
      `/insurance/core-data?page=${state.page}&limit=${state.rowsPerPage}&typeId=10`
    );
    if (result.data.responseCode === "200") {
      const response = result.data.dataList;
      setState((prevState) => ({
        ...prevState,
        allData: response,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,

        isErrorAlert: true,
        errorMsg: result.data.responseMessage,
      }));
    }
  };

  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const loading = open && options.length === 0;

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  const useStyles2 = makeStyles((theme) => ({
    button: {
      margin: theme.spacing(1),
    },
  }));

  const classes_AddButton = useStyles2();

  const onAddButtonClick = () => {
    setState((prevState) => ({
      ...prevState,
      addFormDialogOpen: true,
      validation: {
        name: "",
        description: "",
      },
      categoryId: "",
    }));
    getData();
  };

  const handleAddDataRequestClose = () => {
    setState((prevState) => ({ ...prevState, addFormDialogOpen: false }));
  };

  const AddNewDataInBackend = async () => {
    let postObj = {
      categoryId: state.catID,
      name: state.validation.name,
      description: state.validation.description,
    };

    const result = await apipostUrl(`/insurance/sub-categories`, postObj);
    if (result.data.responseCode === "200") {
      console.log("Response of Edit Submit", result.data);
      setState((prevState) => ({
        ...prevState,
        data: state.data,
        addFormDialogOpen: false,
      }));
      getSuccessUpdate();
      callLocalBaseURL();
    } else {
      if(result.status===401||result.status===402){
        dispatch(verifyToken())
      }
	  else{
      setState((prevState) => ({
        ...prevState,
        addFormDialogOpen: true,
      }));
      console.log(state);
      getErrorUpdate(result);
      callLocalBaseURL();
	  }
    }
  };

  const handleAddFormDataSubmit = (e) => {
    AddNewDataInBackend();
  };

  function isObjEmpty(obj) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }

    return JSON.stringify(obj) === JSON.stringify({});
  }

  const addSubCategoryValidateProperty = ({ name, value }) => {
    let obj;
    let propertySchema;

    obj = { [name]: value };
    propertySchema = { [name]: schema[name] };

    const { error } = Joi.validate(obj, propertySchema);
    return error ? error.details[0].message : null;
  };

  const checkAreAllAddFormFieldsPopulated = (obj) => {
    return !Object.values(obj).some((x) => x === "");
  };

  const handleAddFormChange = (e) => {
    const { target: input } = e;
    const errors = { ...state.errors };
    const validation = { ...state.validation };
    console.log("validation", validation);
    const errorMessage = addSubCategoryValidateProperty(input);

    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    validation[input.name] = input.value;

    var deepValidation = _.cloneDeep(validation);
    delete deepValidation["description"];
    console.log("deepValidation", deepValidation);

    const allFormFieldsPopulated = checkAreAllAddFormFieldsPopulated(
      deepValidation
    );

    console.log("allFormFieldsPopulated", allFormFieldsPopulated);

    setState((prevState) => ({
      ...prevState,
      validation,
      errors,
      // namePopulated: allFormFieldsPopulated,
      addSubCategoryValidationText: true,
      namePopulated:
        allFormFieldsPopulated &&
        isObjEmpty(errors) &&
        addSubCategoryValidateProperty,
    }));
  };

  const handleAddChange = (e, value) => {
    console.log("value", value);
    let findEventId = (state.allData || []).find((n) => n.name === value);
    if (value === null) {
      setState((prevState) => ({
        ...prevState,
        catID: (findEventId || {}).id,
        error: true,
        categoryIdPopulated: false,
        isAddFormSubmitDisabled: false,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        catID: (findEventId || {}).id,
        error: false,
        categoryIdPopulated: true,
      }));
    }
  };

  useEffect(() => {
    const { categoryIdPopulated, namePopulated } = state;
    if (categoryIdPopulated && namePopulated) {
      setState((prevState) => ({
        ...prevState,
        isAddFormSubmitDisabled: true,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        isAddFormSubmitDisabled: false,
      }));
    }
  }, [state.categoryIdPopulated, state.namePopulated]);

  return (
    <>
    <Toolbar className="table-header">
      <div className="spacer" />
      <div>
        <InputAddButton
          className={classes_AddButton.button}
          onClick={(e) => onAddButtonClick(e)}
        ></InputAddButton>
      </div>
      <div className="actions">
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
      maxWidth={"xs"}
      fullWidth={true}
      open={state.addFormDialogOpen}
      onClose={handleAddDataRequestClose}
    >
      <DialogTitle>
        <IntlMessages id="insuranceSubCategories.master.modal.add.tilte" />
      </DialogTitle>
      <DialogContent>
        {/* <Autocomplete
            ref={categoryID_AutoComplete_Ref}
            id="categoryId"
            name="categoryId"
            onChange={(e, value) =>
              handleAddFormChange(e, value, categoryID_AutoComplete_Ref)
            }
            options={state.allData}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField
                required
                {...params}
                label={
                  <IntlMessages id="insuranceSubCategories.master.modal.edit.felid.CategoryId" />
                }
                helperText={state.errors.categoryId}
                error={state.errors.categoryId}
                variant="outlined"
              />
            )}
            fullWidth
          /> */}
        {state.error ? (
          <InputAutocomplete
            id="categoryId"
            name="categoryId"
            onChange={handleAddChange}
            options={(state.allData || []).map((n) => n.name)}
            // getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField
                {...params}
                error
                required
                label={
                  <IntlMessages id="insuranceSubCategories.master.modal.edit.felid.CategoryId" />
                }
                helperText="Category is Required"
                variant="outlined"
              />
            )}
            fullWidth
          />
        ) : (
            <InputAutocomplete
              id="categoryId"
              name="categoryId"
              onChange={handleAddChange}
              options={(state.allData || []).map((n) => n.name)}
              // getOptionLabel={(option) => option.name}
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

        <br />
        <InputField
          className="mb-3"
          id="name"
          error={state.errors.name}
          label={
            <IntlMessages id="insuranceSubCategories.master.modal.add.felid.Name" />
          }
          name="name"
          onChange={(e) => handleAddFormChange(e)}
          value={state.validation.name}
          helperText={state.errors.name}
          variant="outlined"
          fullWidth
          required
        />
        <InputField
          className="mb-3"
          id="description"
          //   error={state.errors.description}
          label={
            <IntlMessages id="insuranceSubCategories.master.modal.add.felid.Description" />
          }
          name="description"
          onChange={(e) => handleAddFormChange(e)}
          value={state.validation.description}
          // helperText={state.errors.description}
          fullWidth
          variant="outlined"
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
      <div className="row">
        <CardBox
          styleName="col-12"
          heading={<IntlMessages id="ipp.common.advancedsearch.title" />}
        >
          <form className="row" autoComplete="off">
            <div className="col-lg-3 col-sm-6 col-12 mb-3">
              <InputField
                id="outlined-basic"
                label={
                  <IntlMessages id="insuranceSubCategories.master.advancedsearch.Name" />
                }
                variant="outlined"
                onChange={(event) => handleAdvancedSearchOnChange(event)}
                value={name}
                error={advancedSearchValidationErrors.name}
                helperText={advancedSearchValidationErrors.name}
                name="name"
                fullWidth
              />
            </div>
            <div className="col-lg-3 col-sm-6 col-12 mb-3">
              <Autocomplete
                id="Categories"
                name="Categories"
                key={handleAutoCompleteInputReset}
                ref={categoryID_AutoComplete_Ref}
                autoHighlight
                options={categoryData}
                getOptionLabel={(option) => option.name}
                onChange={(event, value) =>
                  handleAdvancedSearchOnChange(
                    event,
                    value,
                    categoryID_AutoComplete_Ref
                  )
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={
                      <IntlMessages id="insuranceSubCategories.master.advancedsearch.Categories" />
                    }
                    variant="outlined"
                    error={advancedSearchValidationErrors.Categories}
                    helperText={advancedSearchValidationErrors.Categories}
                  />
                )}
                fullWidth
              />
            </div>
            <div className="col-lg-6">
              </div>
            <div className="pt-2 ml-2">
              <InputSearchButton
                onClick={(event) => handleApplyClick(event)}
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
              {isAdvancedSearchValidationText
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
  // numSelected: PropTypes.number.isRequired,
  setAdvancedSearchData: PropTypes.func.isRequired,
  setResetData: PropTypes.func.isRequired,
};

export default EnhancedTableToolbar;
