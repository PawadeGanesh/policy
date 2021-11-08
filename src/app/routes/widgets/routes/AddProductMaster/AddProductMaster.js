/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button } from "@material-ui/core";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import fetch from "cross-fetch";
import Joi from "joi-browser";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import CardBox from "./../../../../../components/CardBox";
import { useHistory } from "react-router-dom";
import Switch from "@material-ui/core/Switch";
import "./style.css";

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
  /* insuranceCategorias: Joi.string()
    .required()
    .label("InsuranceCategorias"), */
  subCategoryId: Joi.number()
    .required()
    .label("SubCategoryId"),
  productTypeId: Joi.string()
    .required()
    .label("ProductTypeId"),
  isComparisonEnabled: Joi.string()
    .required()
    .label("IsComparisonEnabled"),
  section: Joi.number()
    .required()
    .label("Section"),
};

const productTypes = [
  {
    value: "1",
    label: "PoS",
  },
  {
    value: "1",
    label: "Group",
  },
  {
    value: "1",
    label: "Retail",
  },
];


const baseURL = `${process.env.REACT_APP_BASE_URL}`;


const AddProductMaster = () => {
  const [state, setState] = useState({
    categoryId: "",
    fieldId: "",
    categories: "",
    subCategoryId: "",
    productTypeId: "",
    name: "",
    fieldName: "",
    values: [],
    event: "",
    description: "",
    actionType: "",
    referenceID: "",
    archiveIn: "",
    purgeIn: "",
    createdBy: "",
    isComparisonEnabled: "",
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
    menudata: [],
    catData: [],
    addFormDialogOpen: false,
    selectedEditId: "",
    isAddForm_NameError: false,
    isAddForm_DescriptionError: false,
    isAddForm_SubCategoryIdError: false,
    isAddForm_ProductTypeIdError: false,

    selected_AddForm_Name_Value: "",
    selected_AddForm_Description_Value: "",
    selected_AddForm_SubCategoryId_Value: "",
    selected_AddForm_ProductTypeId_Value: "",
    selected_AddForm_isComparisonEnabled_Value: "",
    inputList: [
      {
        FieldId: 0,
        isMandatory: 0,
        isPreQuote: 0,
        section: "",
      },
    ],
    isSortAsc: true,
    validation: {
      name: "",
      description: "",
      /* insuranceCategorias: "", */
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
    checkedA: true,
    checkedB: true,
  });

  const validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const propertySchema = { [name]: schema[name] };
    const { error } = Joi.validate(obj, propertySchema);
    return error ? error.details[0].message : null;
  };

  function isObjEmpty(obj) {
    for (var prop in obj) {
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }

    return JSON.stringify(obj) === JSON.stringify({});
  }

  const checkAreAllAddFormFieldsPopulated = (obj) => {
    return !Object.values(obj).some((x) => x === "");
  };

  const handleAddFormChange = ({ target: input }) => {
    const errors = { ...state.errors };

    const errorMessage = validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const validation = { ...state.validation };

    validation[input.name] = input.value;

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
  };

  let history = useHistory();

  const handleAddDataRequestClose = () => {
    history.push({
      pathname: "/app/widgets/ProductMaster",
    });
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

  const AddNewDataInBackend = async () => {
    let addDataObj = {
      name: state.validation.name,
      description: state.validation.description,
      isComparisonEnabled: isComparisonEnabledNumberReturn(
        state.validation.isComparisonEnabled
      ),
      inputFields: inputList,
      subCategoryId: parseInt(state.validation.subCategoryId),
      productTypeId: parseInt(state.validation.productTypeId),
      // categoryId: state.categoryId,
    };
    console.log("addDataObj = ", addDataObj);
    axios
      .post(baseURL + "/insurance/products", addDataObj, config)
      .then((res) => {
        console.log(res);
        console.log(res.data);
        setState((prevState) => ({
          ...prevState,
          data: state.data,
          formDialogOpen: false,
          isSuccessAlert: true,
          successMsg: "Product Added Successfully",
        }));
      })
      .catch((err) => {
        console.log("Error", err);
        setState((prevState) => ({
          ...prevState,
          formDialogOpen: false,
          isErrorAlert: true,
          errorMsg: "Failed to Add Product",
        }));
      });
  };

  const handleAddFormDataSubmit = () => {
    history.push({
      pathname: "/app/widgets/ProductMaster",
    });
    AddNewDataInBackend();
  };


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
      setsubCategorias(response.dataList);
    };
    setState((prevState) => ({
      ...prevState,
      categoryId: e.target.value,
    }));
    getSubCategorias();
  };

  const [inputList, setInputList] = useState([
    { fieldId: 0, isMandatory: 0, isPreQuote: 0, section: "" },
  ]);

  const [fieldName_open] = React.useState(false);
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
    })();
  }, []);

  const handleInputSectionChange = (e, index) => {
    console.log("e = ", e.target.value, "index =", index);
    console.log("e = ", e.target.name, "index =", index);
    if (e.target.name) {
      const { value } = e.target;
      const list = [...inputList];
      /* if (typeof list[index] === "undefined") {
        list.push({ fieldId: 0, isMandatory: 0, isPreQuote: 0, section: "" });
      } */
      list[index]["section"] = value;
      setInputList(list);
      setState((prevState) => ({
        ...prevState,
        inputList: list,
      }));
    }
  };

  const handleInputChange = (e, index) => {
    console.log("e = ", e.target.value, "index =", index);
    console.log("e = ", e.target.name, "index =", index);
    if (e.target.name) {
      const { checked } = e.target;
      const list = [...inputList];
      if (typeof list[index] === "undefined") {
        list.push({ fieldId: 0, isMandatory: 0, isPreQuote: 0, section: "" });
      }

      list[index]["isMandatory"] = checked ? 1 : 0;
      setInputList(list);
      setState((prevState) => ({
        ...prevState,
        inputList: list,
      }));
    }
  };

  const handleInputChangeisPreQuote = (e, index) => {
    console.log("e = ", e.target.value, "index =", index);
    console.log("e = ", e.target.name, "index =", index);
    if (e.target.name) {
      const { checked } = e.target;
      const list = [...inputList];
      if (typeof list[index] === "undefined") {
        list.push({ fieldId: 0, isMandatory: 0, isPreQuote: 0, section: "" });
      }

      list[index]["isPreQuote"] = checked ? 1 : 0;
      setInputList(list);
      setState((prevState) => ({
        ...prevState,
        inputList: list,
      }));
    }
  };

  const handleFieldNameInputChange = (e, value, index) => {
    const list = [...inputList];
    if (typeof list[index] === "undefined") {
      list.push({ fieldId: 0, isMandatory: 0, isPreQuote: 0, section: "" });
    }
    if (value) {
      list[index]["fieldId"] = value.id;
    }

    setInputList(list);
  };

  const handleRemoveClick = (index) => {
    const list = [...state.inputList];
    list.splice(index, 1);
    setState((prevState) => ({
      ...prevState,
      inputList: list,
    }));
  };

  const handleAddClick = () => {
    setState((prevState) => ({
      ...prevState,
      inputList: [
        ...state.inputList,
        { fieldId: 0, isMandatory: 0, isPreQuote: 0, section: "" },
      ],
    }));
  };

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
    getCategorias();
  }, []);


  return (
    <div className="row">
      <CardBox styleName="col-md-12">
        <div className="cardBox">
          <div className="row">
            <div className="col-lg-4">
              <TextField
                required
                className="mb-3"
                autoFocus
                id="name"
                label="Name"
                name="name"
                error={state.errors.name}
                onChange={(e) => handleAddFormChange(e)}
                helperText={state.errors.name}
                value={state.validation.name}
                fullWidth
              />
            </div>
            <div className="col-lg-4">
              <TextField
                autoFocus
                className="mb-3"
                id="description"
                label="Description"
                name="description"
                required
                error={state.errors.description}
                onChange={(e) => handleAddFormChange(e)}
                helperText={state.errors.description}
                value={state.validation.description}
                fullWidth
              />
            </div>
            <div className="col-lg-4">
              <FormControl className="w-100 mb-3">
                <InputLabel id="insuranceCategorias">Category</InputLabel>
                <Select
                  labelId="insuranceCategorias"
                  id="insuranceCategorias"
                  label="InsuranceCategorias"
                  name="insuranceCategorias"
                  /* error={state.errors.insuranceCategorias}
                  onChange={handleAddFormChange}
                  helperText={state.errors.insuranceCategorias} */
                  value={state.categoryId}
                  onChange={(e) => handleIsEnabledChange(e)}
                >
                  <MenuItem value="" disabled>
                    <em>Select</em>
                  </MenuItem>
                  {categorias &&
                    categorias.map((categorias, i) => (
                      <MenuItem value={categorias.id} key={i}>
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
                <InputLabel id="subCategoryId">Sub Category</InputLabel>
                <Select
                  labelId="subCategoryId"
                  id="subCategoryId"
                  label="SubCategoryId"
                  name="subCategoryId"
                  required
                  error={state.errors.subCategoryId}
                  onChange={handleAddFormChange}
                  helperText={state.errors.subCategoryId}
                  fullWidth
                >
                  <MenuItem value="">
                    <em>Select</em>
                  </MenuItem>
                  {subCategorias &&
                    subCategorias.map((subCat) => (
                      <MenuItem
                        name="subCategoryId"
                        key={subCat.value}
                        value={subCat.id}
                      >
                        {subCat.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </div>
            <div className="col-lg-4 mb-2">
              <FormControl className="w-100 mb-3">
                <InputLabel id="productTypeId">Product Type</InputLabel>
                <Select
                  labelId="productTypeId"
                  id="productTypeId"
                  label="ProductTypeId"
                  name="productTypeId"
                  required
                  error={state.errors.productTypeId}
                  onChange={(e) => handleAddFormChange(e)}
                  helperText={state.errors.productTypeId}
                  value={state.validation.productTypeId}
                  fullWidth
                >
                  {/* <MenuItem value="">
                    <em>Select</em>
                  </MenuItem>
                  <MenuItem value={1}>PoS</MenuItem>
                  <MenuItem value={1}>Retail</MenuItem>
                  <MenuItem value={1}>Group</MenuItem> */}
                  {productTypes.map((option, i) => (
                    <MenuItem
                      name="ProductTypeId"
                      key={i}
                      value={option.value}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="col-lg-4">
              <FormControl fullWidth error={false}>
                <InputLabel id="isComparisonEnabled">
                  Comparison Enabled?
                </InputLabel>
                <Select
                  className="mb-3"
                  fullWidth
                  label="IsComparisonEnabled"
                  name="isComparisonEnabled"
                  labelId="IsComparisonEnabled"
                  id="isComparisonEnabled"
                  required
                  onChange={(e) => handleAddFormChange(e)}
                  helperText={state.errors.isComparisonEnabled}
                  value={state.validation.isComparisonEnabled}
                  renderValue={(value) => `${value}`}
                >
                  <MenuItem value="">
                    <em>Select</em>
                  </MenuItem>
                  <MenuItem value={"Yes"}>Yes</MenuItem>
                  <MenuItem value={"No"}>No</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
          <div className="mt-4 product-list">
            <div className="row">
              <h4 className="col-lg-3 mt-3 ml-1">Field</h4>
              <h4 className="col-lg-2 mt-3 ml-1">Mandatory?</h4>
              <h4 className="col-lg-2 mt-3 ml-1">Pre-Quote?</h4>
              <h4 className="col-lg-2 mt-3 ml-1">Section</h4>
            </div>
            {state.inputList.map((x, i) => {
              return (
                <div className="row px-4 py-1 mb-1" key={i}>
                  <div className="col-lg-2">
                    <Autocomplete
                      className="mb-4"
                      // id="asynchronous-demo"
                      label="FieldId"
                      name="fieldId"
                      id="fieldId"
                      value={state.selected_AddForm_fieldId_Value}
                      onChange={(e, value) =>
                        handleFieldNameInputChange(e, value, i)
                      }
                      getOptionSelected={(option, value) =>
                        option.id === value.id
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
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <React.Fragment>
                                {fieldName_loading ? (
                                  <CircularProgress color="inherit" size={20} />
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
                      name="isMandatory"
                      label="IsMandatory"
                      checked={x.isMandatory === 1 ? true : false}
                      onChange={(e) => handleInputChange(e, i)}
                      id="isMandatory"
                      color="primary"
                      inputProps={{
                        "aria-label": "secondary checkbox",
                      }}
                    />
                  </div>
                  <div className="col-lg-2">
                    {/* <Switch
                      checked={state.checkedB}
                      onChange={handleChange}
                      color="primary"
                      name="checkedB"
                      inputProps={{ "aria-label": "primary checkbox" }}
                    /> */}
                    <Switch
                      name="isPreQuote"
                      label="IsPreQuote"
                      checked={x.isPreQuote === 1 ? true : false}
                      onChange={(e) => handleInputChangeisPreQuote(e, i)}
                      id="isPreQuote"
                      color="primary"
                      inputProps={{
                        "aria-label": "secondary checkbox",
                      }}
                    />
                  </div>
                  <div className="col-lg-2">
                    <FormControl fullWidth error={false}>
                      <Select
                        className="mb-3"
                        fullWidth
                        label="Section"
                        name="section"
                        labelId="section"
                        id="section"
                        required
                        /* helperText={state.errors.section} */
                        value={x.section}
                        onChange={(e) => handleInputSectionChange(e, i)}
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
                    {state.inputList.length - 1 === i && (
                      <AddCircleOutlineIcon
                        style={{
                          cursor: "pointer",
                          marginRight: "10px",
                        }}
                        onClick={handleAddClick}
                      />
                    )}
                    {state.inputList.length !== 1 && (
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
              onClick={(e) => handleAddDataRequestClose(e)}
              color="secondary"
              className="mr-2"
              variant="contained"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={(e) => handleAddFormDataSubmit(e)}
              disabled={!state.isAddFormSubmitDisabled}
              color="primary"
            >
              Submit
            </Button>
          </div>
        </div>
      </CardBox>
    </div>
  );
};

export default AddProductMaster;
