import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import MaterialTable from "material-table";
import axios from "axios";
import { forwardRef } from "react";
import { Modal, TextField, Button } from "@material-ui/core";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import Icon from "@material-ui/core/Icon";
import Edit from "@material-ui/icons/Edit";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Search from "@material-ui/icons/Search";
import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import ViewColumn from "@material-ui/icons/ViewColumn";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import Avatar from "react-avatar";
import Grid from "@material-ui/core/Grid";
import Alert from "@material-ui/lab/Alert";
//import DetailsIcon from '@material-ui/icons/Details';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { eventList } from "app/routes/socialApps/routes/Profile/data";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PropTypes from "prop-types";
import keycode from "keycode";
import TableHead from "@material-ui/core/TableHead";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import fetch from "cross-fetch";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import EditIcon from "@material-ui/icons/Edit";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormHelperText from "@material-ui/core/FormHelperText";
import CardBox from "./../../../../../components/CardBox";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import { useAsyncDebounce } from "react-table";
import AddIcon from "@material-ui/icons/Add";
import { AndroidSharp } from "@material-ui/icons";
import { useHistory } from "react-router-dom";
import Switch from "@material-ui/core/Switch";
import "./style.css";
import Joi from "joi-browser";

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
  /* insuranceCategories: Joi.string()
    .required()
    .label("insuranceCategories"), */
  subCategoryId: Joi.number()
    .required()
    .label("SubCategoryId"),
  productTypeId: Joi.string()
    .required()
    .label("ProductTypeId"),
  isComparisonEnabled: Joi.string()
    .required()
    .label("IsComparisonEnabled"),
  /* fieldId: Joi.string()
    .required()
    .label("FieldId"),
  isMandatory: Joi.number()
    .allow("IsMandatory")
    .optional(), */
};

const baseURL = `${process.env.REACT_APP_BASE_URL}`;

const api = axios.create({
  baseURL: baseURL,
});

const useStyles = makeStyles((theme) => ({
  modal: {
    position: "absolute",
    width: 400,
    backgroundColor: "white",
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: "53%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  iconos: {
    cursor: "pointer",
  },
  inputMaterial: {
    width: "100%",
  },
}));

const EditProductMaster = () => {
  const location = useLocation();
  const [state, setState] = useState({
    name: "",
    createdBy: "",
    subCategoryIp: "",
    createdDate: "",
    modifiedName: "",
    modifiedDate: "",
    order: "asc",
    orderBy: "name",
    selected: [],
    page: 1,
    rowsPerPage: 10,
    data: [],
    data1: [],
    categoryOptions: [],
    categoryOptionsValues: [],
    CatData: [],
    formDialogOpen: false,
    selectedEditId: "",
    isEditForm_NameError: false,
    isEditForm_DescriptionError: false,
    selected_EditForm_Name_Value: "",
    selected_EditForm_SubCategoryId_Value: "",
    selected_EditForm_ProductTypeId_Value: "",
    selected_EditForm_isComparisonEnabled_Value: "",
    selected_EditForm_isMandatory_Value: false,
    selected_EditForm_Description_Value: "",
    selected_EditForm_RowVersion_Value: 1,
    selected_EditForm_isDeleted_Value: 1,
    selected_EditForm_InputFields_Value: [],
    isSortAsc: true,
    from: 1,
    to: 0,
    pageCount: 0,
    limit: 0,
    isSortAsc: true,
    deleteFormDialogOpen: false,
    inputFields: [],
    validation: {
      name: "",
      description: "",
      /* insuranceCategories: "", */
      subCategoryId: "",
      productTypeId: "",
      isComparisonEnabled: "",
    },
    errors: {},
    isAddFormSubmitDisabled: false,
    areAllAddFormFieldsPopulated: false,
    isSuccessAlert: false,
    successMsg: "",
    isErrorAlert: false,
    errorMsg: "",
    /*  getErrorUpdate,
    getSuccessUpdate */
    isProductMasterEdit: false,
    checkedA: true,
    checkedB: true,
    inputList: [
      {
        FieldId: 0,
        isMandatory: 0,
      },
    ],
    fieldName: "",
  });

  localStorage.setItem("isSuccessAlert", state.isSuccessAlert);
  localStorage.setItem("isErrorAlert", state.isErrorAlert);
  localStorage.setItem("errorMsg", state.errorMsg);
  localStorage.setItem("successMsg", state.successMsg);

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

  const useStyles2 = makeStyles((theme) => ({
    button: {
      margin: theme.spacing(1),
    },
  }));

  const classes_AddButton = useStyles2();

  const validateProperty = ({ name, value }) => {
    //console.log("name = ", name, "value = ", value);
    const obj = { [name]: value };
    const propertySchema = { [name]: schema[name] };
    //console.log("propertySchema = ", propertySchema);
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

  const handleEditFormChange = ({ target: input }) => {
    //console.log("input = ", input);

    const errors = { ...state.errors };
    const errorMessage = validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const validation = { ...state.validation };
    validation[input.name] = input.value;
    //console.log("validation = ", validation, "errors = ", errors);
    //console.log("errors obj check = ", isObjEmpty(errors));

    // console.log(
    //   "state.areAllAddFormFieldsPopulated = ",
    //   state.areAllAddFormFieldsPopulated,
    //   "validation = ",
    //   validation
    // );

    //console.log("isObjEmpty(errors) = ", isObjEmpty(errors));
    // console.log(
    //   "state.areAllAddFormFieldsPopulated = ",
    //   state.areAllAddFormFieldsPopulated
    // );

    const allFormFieldsPopulated = checkAreAllAddFormFieldsPopulated(
      validation
    );
    console.log("allFormFieldsPopulated = ", allFormFieldsPopulated);

    setState((prevState) => ({
      ...prevState,
      validation,
      errors,
      isAddFormSubmitDisabled: allFormFieldsPopulated && isObjEmpty(errors),
    }));
    // console.log(
    //   "truth check",
    //   state.areAllAddFormFieldsPopulated && isObjEmpty(errors)
    // );

    /* if (
      input.name === "insuranceCategories" ||
      input.name === "subCategoryId" ||
      input.name === "productTypeId" 
    ) {
      validation["dataListId"] = "";
      checkDataListIdAvailability(input.value);
    } else {
      delete validation["dataListId"];
    } */
  };

  const [inputList, setInputList] = useState([
    { fieldId: 0, isMandatory: 0, fieldName: "" },
  ]);

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      validation: {
        name: location.state.detail[0].selected_EditForm_Name_Value,
        description:
          location.state.detail[0].selected_EditForm_Description_Value,
        subCategoryId:
          location.state.detail[0].selected_EditForm_SubCategoryId_Value,
        productTypeId:
          location.state.detail[0].selected_EditForm_ProductTypeId_Value,
        isComparisonEnabled:
          location.state.detail[0].selected_EditForm_isComparisonEnabled_Value,
      },

      selectedEditId: location.state.detail[0].selectedEditId,
      selected_EditForm_RowVersion_Value:
        location.state.detail[0].selected_EditForm_RowVersion_Value,
      selected_EditForm_isDeleted_Value:
        location.state.detail[0].selected_EditForm_isDeleted_Value,
      selected_EditForm_InputFields_Value:
        location.state.detail[0].selected_EditForm_InputFields_Value,
      selected_EditForm_isMandatory_Value:
        location.state.detail[0].selected_EditForm_isMandatory_Value,
      selected_EditForm_FieldId_Value:
        location.state.detail[0].selected_EditForm_FieldId_Value,
    }));
  }, [location]);

  let history = useHistory();

  const updateEditInBackend = async () => {
    let array = [...inputList];
    for (let i = 0; i < array.length; i++) {
      delete array[i].fieldName;
      console.log(array);
    }

    console.log("EDIT ID", state.selectedEditId);
    let putDataObj = {
      name: state.validation.name,
      description: state.validation.description,
      subCategoryId: parseInt(state.validation.subCategoryId),
      productTypeId: parseInt(state.validation.productTypeId),
      isComparisonEnabled: isComparisonEnabledNumberReturn(
        state.validation.isComparisonEnabled
      ),
      rowVersion: state.selected_EditForm_RowVersion_Value,
      inputFields: array,
    };

    console.log("putDataObj = ", putDataObj);

    api
      .put(
        baseURL + "/insurance/products/" + state.selectedEditId,
        putDataObj,
        config
      )
      .then((res) => {
        console.log("Response of Edit Submit", res.data);
        setState((prevState) => ({
          ...prevState,
          data: state.data,
          formDialogOpen: false,
          isSuccessAlert: true,
          successMsg: "Success",
        }));
        history.push({
          pathname: "/app/widgets/ProductMaster",
        });
      })
      .catch((err) => {
        localStorage.setItem("errorMsg", state.errorMsg);
        console.log("Error", err);
        setState((prevState) => ({
          ...prevState,
          formDialogOpen: false,
          isErrorAlert: true,
          errorMsg: "Failed",
        }));
      });
  };

  const handleEditFormSubmit = async (e) => {
    updateEditInBackend();
  };

  const handleRequestClose = () => {
    history.push({
      pathname: "/app/widgets/ProductMaster",
      state: {
        detail: [{}],
      },
    });
  };

  const onEditForm_Name_Change = (e) => {
    const target = e.target;
    setState((prevState) => ({
      ...prevState,
      selected_EditForm_Name_Value: target.value,
    }));
  };

  const onEditForm_Description_Change = (e) => {
    const target = e.target;
    setState((prevState) => ({
      ...prevState,
      selected_EditForm_Description_Value: target.value,
    }));
  };

  const onEditForm_isComparisonEnabled_Change = (e) => {
    e.persist();
    console.log("e.target.value = ", e.target.value);
    setState((prevState) => ({
      ...prevState,
      selected_EditForm_isComparisonEnabled_Value: e.target.value,
    }));
  };

  const handleFieldNameInputChange = (e, value, index) => {
    const list = [...inputList];
    if (value) {
      list[index]["fieldId"] = value.id;
      list[index]["fieldName"] = value.name;
    }
    setInputList(list);
  };

  const handleInputChange = (e, index) => {
    console.log("e = ", e.target.value, "index =", index);
    console.log("e = ", e.target.name, "index =", index);
    if (e.target.name) {
      const { name, checked } = e.target;
      const list = [...inputList];
      if (typeof list[index] === "undefined") {
        list.push({ fieldId: 0, isMandatory: 0 });
      }

      list[index]["isMandatory"] = checked ? 1 : 0;
      setInputList(list);
    }
  };

  const isComparisonEnabledTextReturn = (isComparisonEnabled) => {
    switch (isComparisonEnabled) {
      case 0:
        return "Yes";
      case 1:
        return "No";
      case "":
        return "";
    }
  };

  const isComparisonEnabledNumberReturn = (isComparisonEnabled) => {
    switch (isComparisonEnabled) {
      case "Yes":
        return 1;
      case "No":
        return 0;
      case "":
        return "";
    }
  };

  const classes = useStyles();

  const [fieldName_open, fieldName_setOpen] = React.useState(false);
  const [fieldName_options, fieldName_setOptions] = React.useState([]);
  const fieldName_loading = fieldName_open && fieldName_options.length === 0;

  useEffect(() => {
    (async () => {
      const response = await fetch(
        baseURL + "/insurance/fields?page=1&limit=50"
      );
      const result = await response.json();
      console.log("response", result.dataList);
      fieldName_setOptions(result.dataList);
      let list = [];
      let inputFieldValues =
        location.state.detail[0].selected_EditForm_InputFields_Value;
      for (let i = 0; i < inputFieldValues.length; i++) {
        list.push({
          fieldId: inputFieldValues[i].fieldId,
          isMandatory: inputFieldValues[i].isMandatory,
          fieldName: getFieldName(inputFieldValues[i].fieldId, result.dataList),
        });
      }
      setInputList(list);
    })();
  }, []);

  const [categorias, setCategorias] = useState([]);

  const [subCategorias, setsubCategorias] = useState([]);

  useEffect(() => {
    const getCategorias = async () => {
      const res = await fetch(
        baseURL + "/insurance/core-data?page=1&limit=1000&typeId=10"
      );

      const response = await res.json();
      console.log("getCategorias", response.dataList);
      setCategorias(response.dataList);
      console.log(response.dataList);
    };

    const getSubCategorias = async () => {
      let subCatResponse = {};
      const res = await fetch(
        baseURL +
          "/insurance/sub-categories?page=1&limit=500&categoryId=" +
          state.validation.subCategoryId.toString()
      );

      subCatResponse = await res.json();
      console.log("getSubCategorias", subCatResponse.dataList);
      console.log(subCatResponse.dataList);
      setsubCategorias(subCatResponse.dataList);
    };
    getCategorias();
    getSubCategorias();
  }, []);

  const handleIsEnabledChange = (e) => {
    let response = {};
    const getSubCategorias = async () => {
      const res = await fetch(
        baseURL +
          "/insurance/sub-categories?page=1&limit=500&categoryId=" +
          e.target.value.toString()
      );

      response = await res.json();
      console.log("getSubCategorias", response.dataList);
      console.log(response.dataList);
      e.persist();
      setsubCategorias(typeof response == "object" ? [response] : response);
    };
    getSubCategorias();
  };

  const onEditForm_ProductTypeId_Change = (e) => {
    e.persist();
    console.log("e.target.value = ", e.target.value);
    setState((prevState) => ({
      ...prevState,
      selected_EditForm_ProductTypeId_Value: e.target.value,
    }));
  };

  const getFieldName = (id, data) => {
    let name = data.find((v) => v.id === id);
    return name ? name.name : "";
  };

  const setFieldName = (newValue, i) => {
    let list = [...inputList];
    list[i].fieldName = newValue;
    setInputList(list);
  };

  const handleRemoveClick = (index) => {
    const list = [...inputList];
    list.splice(index, 1);
    // setState((prevState) => ({
    //   ...prevState,
    //   inputList: list,
    // }));
    setInputList([...list]);
  };

  const handleAddClick = () => {
    // setState((prevState) => ({
    //   ...prevState,
    //   inputList: [...inputList, { fieldId: 0, isMandatory: 0, fieldName: "" }],
    // }));
    setInputList([...inputList, { fieldId: 0, isMandatory: 0, fieldName: "" }]);
  };

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  return (
    <div className="row">
      <div className="col-lg-4">
        <h3 className="audit-header">Edit Insurance Product</h3>
      </div>
      <CardBox styleName="col-md-12">
        <div className="cardBox">
          <div className="row">
            <div className="col-lg-4">
              <TextField
                className="mb-3"
                autoFocus
                id="name"
                label="Name"
                name="name"
                /* onChange={(e) => onEditForm_Name_Change(e)}
                value={state.selected_EditForm_Name_Value} */
                error={state.errors.name}
                onChange={(e) => handleEditFormChange(e)}
                helperText={state.errors.name}
                value={state.validation.name}
                fullWidth
              />
            </div>
            <div className="col-lg-4">
              <TextField
                className="mb-3"
                id="description"
                label="Description"
                name="description"
                /* onChange={(e) => onEditForm_Description_Change(e)}
                value={state.selected_EditForm_Description_Value} */
                error={state.errors.description}
                onChange={(e) => handleEditFormChange(e)}
                helperText={state.errors.description}
                value={state.validation.description}
                fullWidth
              />
            </div>
            <div className="col-lg-4">
              <FormControl className="w-100 mb-3">
                <InputLabel id="insuranceCategories">
                  insurance Categories
                </InputLabel>
                <Select
                  labelId="insuranceCategories"
                  id="insuranceCategories"
                  label="InsuranceCategories"
                  name="insuranceCategories"
                  /* value={state.selected_EditForm_SubCategoryId_Value} */
                  /* value={state.categories} */
                  value={state.validation.subCategoryId}
                  onChange={(e) => handleIsEnabledChange(e)}
                >
                  <MenuItem value="">
                    <em>Select</em>
                  </MenuItem>
                  {categorias &&
                    categorias.map((categorias) => (
                      <MenuItem value={categorias.id}>
                        {categorias.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4">
              <FormControl className="w-100 mb-3">
                <InputLabel id="subCategoryIdOptions">
                  Sub Categories
                </InputLabel>
                <Select
                  labelId="subCategoryId"
                  id="subCategoryId"
                  label="SubCategoryId"
                  name="subCategoryId"
                  required
                  error={state.errors.subCategoryId}
                  onChange={(e) => handleEditFormChange(e)}
                  helperText={state.errors.subCategoryId}
                  value={state.validation.subCategoryId}
                  /* onChange={(e) => onEditForm_SubCategoryId_Change(e)}
                  value={state.selected_EditForm_SubCategoryId_Value} */
                >
                  <MenuItem value="" disabled>
                    <em>Select</em>
                  </MenuItem>
                  {subCategorias &&
                    subCategorias.map((subCat) => (
                      <MenuItem value={subCat.id}>{subCat.name}</MenuItem>
                    ))}
                </Select>
              </FormControl>
            </div>
            <div className="col-lg-4 mb-2">
              <FormControl className="w-100 mb-3">
                <InputLabel id="subCategoryIdOptions">Product Type</InputLabel>
                <Select
                  labelId="productTypeId"
                  id="productTypeId"
                  required
                  onChange={(e) => handleEditFormChange(e)}
                  error={state.errors.productTypeId}
                  helperText={state.errors.productTypeId}
                  value={state.validation.productTypeId}
                  /* onChange={(e) => onEditForm_ProductTypeId_Change(e)}
                  value={state.selected_EditForm_ProductTypeId_Value} */
                  label="ProductTypeId"
                  name="productTypeId"
                >
                  <MenuItem value="">
                    <em>Select</em>
                  </MenuItem>
                  <MenuItem value={1}>PoS</MenuItem>
                  <MenuItem value={1}>Retail</MenuItem>
                  <MenuItem value={1}>Group</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className="col-lg-4">
              <FormControl
                className={classes.formControl}
                className="w-100 mb-3"
                fullWidth
                error={false}
              >
                <InputLabel id="isComparisonEnabled">
                  Is Comparison Enabled
                </InputLabel>
                <Select
                  label="IsComparisonEnabled"
                  name="isComparisonEnabled"
                  labelId="IsComparisonEnabled"
                  id="isComparisonEnabled"
                  onChange={(e) => handleEditFormChange(e)}
                  error={state.errors.isComparisonEnabled}
                  helperText={state.errors.isComparisonEnabled}
                  value={state.validation.isComparisonEnabled}
                  /* value={state.selected_EditForm_isComparisonEnabled_Value}
                  onChange={(e) => onEditForm_isComparisonEnabled_Change(e)} */
                  renderValue={(value) => `${value}`}
                  fullWidth
                >
                  <MenuItem value="">
                    <em>Select</em>
                  </MenuItem>

                  <MenuItem value={"No"}>No</MenuItem>
                  <MenuItem value={"Yes"}>Yes</MenuItem>
                </Select>
                <FormHelperText>
                  {/* {state.selected_EditForm_IsEnabled_Value == "" ? "Error" : ""} */}
                </FormHelperText>
              </FormControl>
            </div>
          </div>
          <div className="mt-4 product-list">
            <div className="row">
              <h4 className="col-lg-3 mt-3 ml-1">Fields Names</h4>
              <h4 className="col-lg-2 mt-3 ml-1">Is Mandatory?</h4>
              <h4 className="col-lg-2 mt-3 ml-1">Is PreQuote?</h4>
              <h4 className="col-lg-2 mt-3 ml-1">Sections</h4>
            </div>
            {inputList &&
              inputList.map((x, i) => {
                return (
                  <div className="row px-4 py-1 mb-1">
                    <div className="col-lg-2">
                      <Autocomplete
                        className="mb-3"
                        id="asynchronous-demo"
                        label="FieldId"
                        name="fieldId"
                        id="fieldId"
                        onChange={(e, value) =>
                          handleFieldNameInputChange(e, value, i)
                        }
                        inputValue={inputList[i].fieldName}
                        onInputChange={(event, newValue) =>
                          setFieldName(newValue, i)
                        }
                        required
                        getOptionLabel={(option) => {
                          return option.name;
                        }}
                        options={fieldName_options || []}
                        loading={fieldName_loading}
                        ignoreCase={false}
                        renderInput={(params) => (
                          <TextField
                            required
                            {...params}
                            label="Field Names"
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <React.Fragment>
                                  {fieldName_loading ? (
                                    <CircularProgress
                                      color="inherit"
                                      size={20}
                                    />
                                  ) : null}
                                  {params.InputProps.endAdornment}
                                </React.Fragment>
                              ),
                            }}
                          />
                        )}
                      />
                    </div>
                    <div className="col-lg-1"></div>
                    <div className="col-lg-2">
                      <Switch
                        className="ml10"
                        name="isMandatory"
                        value={x.isMandatory}
                        checked={x.isMandatory === 1 ? true : false}
                        onChange={(e) => handleInputChange(e, i)}
                        /* defaultChecked */
                        id="isMandatory"
                        // onChange={(e) => onEditForm_isMandatory_Change(e)}
                        color="primary"
                        inputProps={{
                          "aria-label": "secondary checkbox",
                        }}
                      />
                    </div>
                    <div className="col-lg-2">
                      <Switch
                        checked={state.checkedB}
                        onChange={handleChange}
                        color="primary"
                        name="checkedB"
                        inputProps={{ "aria-label": "primary checkbox" }}
                      />
                    </div>
                    <div className="col-lg-2">
                      <FormControl fullWidth error={false}>
                        <Select
                          className="mb-3"
                          fullWidth
                          label="Section"
                          name="section"
                          labelId="Section"
                          id="section"
                          required
                          helperText={state.errors.section}
                          value={state.validation.section}
                          renderValue={(value) => `${value}`}
                        >
                          <MenuItem value="">
                            <em>Select</em>
                          </MenuItem>
                          <MenuItem value={1}>1</MenuItem>
                          <MenuItem value={2}>2</MenuItem>
                          <MenuItem value={3}>3</MenuItem>
                          <MenuItem value={4}>4</MenuItem>
                          <MenuItem value={5}>5</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                    <div className="col-lg-1"></div>
                    <div className="col-lg-2">
                      {inputList.length - 1 === i && (
                        <AddCircleOutlineIcon
                          style={{
                            cursor: "pointer",
                            marginRight: "10px",
                          }}
                          onClick={handleAddClick}
                        />
                      )}
                      {inputList.length !== 1 && (
                        <RemoveCircleOutlineIcon
                          style={{ cursor: "pointer" }}
                          onClick={() => handleRemoveClick(i)}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
          <div className="float-right mt-4">
            <Button
              onClick={(e) => handleRequestClose(e)}
              color="secondary"
              className="mr-2"
              variant="contained"
            >
              Cancel
            </Button>
            <Button
              onClick={(e) => handleEditFormSubmit(e)}
              disabled={!state.isAddFormSubmitDisabled}
              color="primary"
              variant="contained"
            >
              Submit
            </Button>
          </div>
        </div>
      </CardBox>
    </div>
  );
};

export default EditProductMaster;
