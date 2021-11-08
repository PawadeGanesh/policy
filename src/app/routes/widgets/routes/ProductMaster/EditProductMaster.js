/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button } from "@material-ui/core";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import fetch from "cross-fetch";
import Autocomplete from "@material-ui/lab/Autocomplete";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import IntlMessages from "util/IntlMessages";
import Select from "@material-ui/core/Select";
import CardBox from "./../../../../../components/CardBox";
import Switch from "@material-ui/core/Switch";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import "./style.css";
import Joi from "joi-browser";
import {
  apigetUrl,
  apipostUrl,
  apiputUrl,
  apideleteUrl,
} from "../../../../../setup/middleware";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputAddButton from "../CommonComponents/AddButton";
import InputSubmitButton from "../CommonComponents/SubmitButton";
import InputCancelButton from "../CommonComponents/CancelButton";
import InputField from "../CommonComponents/TextField";
import InputAutocomplete from "../CommonComponents/Autocomplete";
import InputSelect from "../CommonComponents/Select";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { async } from "q";
import {
  IPPNotification,
  ippNotify,
} from "../CommonComponents/IPPNotification";
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
  subCategoryId: Joi.number()
    .required()
    .label("SubCategoryId"),
  productTypeId: Joi.number()
    .required()
    .label("ProductTypeId"),
  isComparisonEnabled: Joi.string()
    .required()
    .label("IsComparisonEnabled"),
};

const baseURL = `${process.env.REACT_APP_BASE_URL}`;
const api = axios.create({
  baseURL: baseURL,
});

const EditProductMaster = ({
  closeEditProduct,
  getEditSuccessUpdate,
  getEditErrorUpdate,
  callLocalBaseURL,
  selectedId,
}) => {
  const [state, setState] = useState({
    tabHeaderData: [
      { name: "Section", value: "1" },
      { name: "Feilds", value: "2" },
      { name: "Features", value: "3" },
    ],
    addCode: "A",
    modifyCode: "M",
    deleteCode: "D",
    sectionname: [],
    sectioninputList: [],
    featureinputList: [],
    sectioninputarray: [],
    featureinputarray: [],
    tabValue: "1",
    categoryNameList: [],
    categoryId: "",
    selectedValuePlaceholder: "select",
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
    isSortAsc: true,
    from: 1,
    to: 0,
    pageCount: 0,
    limit: 0,
    deleteFormDialogOpen: false,
    inputFields: [],
    allData: [],

    isfieldIdData: false,
    issectionData: false,
    issectionnamevalueData: false,
    issectionvalueData: false,
    duplicatestatusData: false,
    isnamevalueData: false,
    iskeyvalueData: false,
    iscategoryidData: false,
    fieldPopulated: false,

    validation: {
      name: "",
      description: "",
      subCategoryId: "",
      productTypeId: "",
      isComparisonEnabled: "",
    },
    errors: {},
    isAddFormSubmitDisabled: false,
    areAllAddFormFieldsPopulated: false,
    selected_EditForm_RowVersion_Value: 1,
    isProductMasterEdit: false,
    productDetail: [],
    productDetailArray: [],
    productTypesOptions: [],
    subCategoryNameOptions: [],
    insuranceCategoryNameOptions: [],
    maxsectionid: 0,
    maxfeatureid: 0,
    maxfelidid: 0,
    deleteSectionDialogOpen:false,
    deleteFelidDialogOpen:false,
    deleteFeatureDialogOpen:false,
    deletedFelidsIndex:0,
    deletedSectionIndex:0,
    deletedFeatureIndex:0,
  });

  const [, setsectionInputList] = useState([]);
  const [featureinputList, setfeatureinputList] = useState([]);

  useEffect(() => {
    getProductType()
  }, []);

  const getProductType = async ()=>{
    const result = await apigetUrl(
      `/insurance/product-types?page=${state.page}&limit=500`
    );
    if (result.data.responseCode === "200") {
      let response = result.data.dataList.map((n) => n);
        setState((prevState) => ({
          ...prevState,
          productTypesOptions: response,
        }));
    } else {
      console.log(result.data.responseMessage);
    }
  }

  const [, setcategoryNameList] = useState([]);

  const getSubCategorias = async() => {
    const result = await apigetUrl(
      `/insurance/sub-categories?page=${state.page}&limit=500`
    );
    if (result.data.responseCode === "200") {
      let response = result.data.dataList.map((n) => n);
      setState((prevState) => ({
        ...prevState,
        subCategoryNameOptions: response,
      }));
    } else {
      console.log(result.data.responseMessage);
    }
  };

  const getInsuranceCategories = async (id) => {
    const result = await apigetUrl(
      `/insurance/sub-categories/${id}`
    );
    if (result.data.responseCode === "200") {
      let categoryId = result.data.categoryId;
      setState((prevState) => ({
        ...prevState,
        categoryId: categoryId,
      }));
      getInsurance();
    } else {
      console.log(result.data.responseMessage);
    }
  };

  const getInsurance = async () => {
    const result = await apigetUrl(
      `/insurance/core-data?page=${state.page}&limit=100&typeId=10`
    );
    if (result.data.responseCode === "200") {
      let response = result.data.dataList.map((n) => n);
        setState((prevState) => ({
          ...prevState,
          insuranceCategoryNameOptions: response,
        }));
    } else {
      console.log(result.data.responseMessage);
    }
};

  const getSubCat = async(id) => {
    const result = await apigetUrl(
      `/insurance/sub-categories?page=1&limit=500&categoryId=${id}`
    );
    if (result.data.responseCode === "200") {
      setState((prevState) => ({
        ...prevState,
        subCategoryNameOptions: result.data.dataList,
      }));
    } else {
      console.log(result.data.responseMessage);
    }
};

  const validateProperty = ({ name, value }) => {
    ////////debugger
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

  const handleEditFormChange = ({ target: input }) => {
    ////////debugger
    const errors = { ...state.errors };
    const errorMessage = validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const validation = { ...state.validation };
    validation[input.name] = input.value;

    const allFormFieldsPopulated = checkAreAllAddFormFieldsPopulated(
      validation
    );

    setState((prevState) => ({
      ...prevState,
      validation,
      errors,
      isAddFormSubmitDisabled: allFormFieldsPopulated && isObjEmpty(errors),
      //fieldPopulated: allFormFieldsPopulated && isObjEmpty(errors),
    }));
  };

  useEffect(() => {
    getEditProduct();
    getFieldNames();
    getcategoryNames();
  }, []);

  const getcategoryNames = async() => {
    const result = await apigetUrl(
      `/insurance/core-data?page=1&limit=50&typeId=120`
    );
    if (result.data.responseCode === "200") {
      let response = result.data.dataList.map((n) => n);
      setcategoryNameList(response);
      setState((prevState) => ({
        ...prevState,
        categoryNameList: response,
      }));
    } else {
      ippNotify.error(result.data.responseMessage);
    }
  };

  const getEditProduct = async() => {
    // uncomment once it is dynamic
    // api.get(`insurance/products/${selectedId}`, config).then((res) => {
    state.productDetail.length = 0;
    state.productDetailArray.length = 0;
    state.featureinputList.length = 0;
    state.sectioninputList.length = 0;
    state.sectioninputarray.length = 0;
    state.featureinputarray.length = 0;
    let inputfelidsarray = [];
    let sectionsarray = [];
    let featuresarray = [];
    //api.get(`insurance/products/${selectedId}`, apiInstance).then((res) => {
      const res = await apigetUrl(`/insurance/products/${selectedId}` );
      if (res.data.responseCode === "200") {
      ////////debugger
      let inputfeliddata = res.data.inputFields;
      for (let i = 0; i < inputfeliddata.length; i++) {
        inputfelidsarray.push({
          id: inputfeliddata[i].id,
          fieldId: inputfeliddata[i].fieldId,
          isMandatory: inputfeliddata[i].isMandatory,
          isPreQuote: inputfeliddata[i].isPreQuote,
          section: inputfeliddata[i].section,
          isfieldId: true,
          issection: false,
          status: "",
        });
      }

      let sectionfeliddata = res.data.sections;

      for (let i = 0; i < sectionfeliddata.length; i++) {
        sectionsarray.push({
          id: sectionfeliddata[i].id,
          sectionOrder: sectionfeliddata[i].sectionOrder,
          name: sectionfeliddata[i].name,
          isPreQuote: sectionfeliddata[i].isPreQuote,
          status: "",
          isnamevalue: false,
          issectionvalue: false,
        });
      }

      let featurefeliddata = res.data.features;
      for (let i = 0; i < featurefeliddata.length; i++) {
        featuresarray.push({
          id: featurefeliddata[i].id,
          name: featurefeliddata[i].name,
          key: featurefeliddata[i].key,
          categoryId: featurefeliddata[i].categoryId,
          status: "",
          duplicatestatus: false,
          isnamevalue: false,
          iskeyvalue: false,
          iscategoryid: false,
        });
      }

      let subCategoryId = res.data.subCategoryId;
      let maxsectiondataid = sectionsarray[sectionfeliddata.length - 1].id;
      let maxfeaturesdataid = featuresarray[featurefeliddata.length - 1].id;
      let maxfeliddataid = inputfelidsarray[inputfeliddata.length - 1].id;
      ////////////debugger
      //setfeatureinputList(res.data.features)
      //setsectionInputList(res.data.sections)
      setState((prevState) => ({
        ...prevState,
        validation: {
          name: res.data.name,
          description: res.data.description,
          productTypeId: res.data.productTypeId,
          subCategoryId: res.data.subCategoryId,
          isComparisonEnabled: isComparisonEnabledTextReturn(
            res.data.isComparisonEnabled
          ),
        },
        productDetail: inputfelidsarray,
        productDetailArray: inputfelidsarray,
        featureinputList: featuresarray,
        featureinputarray: featuresarray,
        sectioninputList: sectionsarray,
        sectioninputarray:sectionsarray,
        maxsectionid: maxsectiondataid,
        maxfeatureid: maxfeaturesdataid,
        maxfelidid:maxfeliddataid,
      }));
      getSubCategorias();
      getInsuranceCategories(subCategoryId);
    };
  };

  const getFieldNames = async () => {

    const result = await apigetUrl(
      `/insurance/fields?page=${state.page}&limit=1300`
    );
    if (result.data.responseCode === "200") {
      let response = result.data.dataList.map((n) => n);
      setState((prevState) => ({
        ...prevState,
        allData: response,
      }));
    } else {
      console.log(result.data.responseMessage);
    }
  };

  const updateEditInBackend = async () => {
    let sectionfelidarray = [];
    let featurefelidarray = [];
    let inputfelidarray = [];
    let sectionfeliddata = state.sectioninputarray;
    let featuredata = state.featureinputarray;
    let productdata = state.productDetailArray;
    for (let i = 0; i < productdata.length; i++) {
      if (productdata[i].status != "") {
      inputfelidarray.push({
        id: productdata[i].id,
        fieldId: productdata[i].fieldId,
        isMandatory: productdata[i].isMandatory,
        isPreQuote: productdata[i].isPreQuote,
        section: productdata[i].section,
        status: productdata[i].status,
      });
    }
    }
for (let i = 0; i < sectionfeliddata.length; i++) {
      if (sectionfeliddata[i].status != "") {
        sectionfelidarray.push({
          id: sectionfeliddata[i].id,
          sectionOrder: sectionfeliddata[i].sectionOrder,
          name: sectionfeliddata[i].name,
          isPreQuote: sectionfeliddata[i].isPreQuote,
          status: sectionfeliddata[i].status,
        });
      }
    }
    for (let i = 0; i < featuredata.length; i++) {
      if (featuredata[i].status != "") {
        featurefelidarray.push({
          id: featuredata[i].id,
          name: featuredata[i].name,
          key: featuredata[i].key,
          categoryId: featuredata[i].categoryId,
          status: featuredata[i].status,
        });
      }
    }

    let putDataObj = {
      name: state.validation.name,
      description: state.validation.description,
      subCategoryId: parseInt(state.validation.subCategoryId),
      productTypeId: parseInt(state.validation.productTypeId),
      isComparisonEnabled: isComparisonEnabledNumberReturn(
        state.validation.isComparisonEnabled
      ),
      rowVersion: state.selected_EditForm_RowVersion_Value,
      inputFields: inputfelidarray,
      sections: sectionfelidarray,
      features: featurefelidarray,
    };
    const result = await apiputUrl(
      `/insurance/products/${selectedId}`,putDataObj
    );
    if (result.data.responseCode === "200"){
        //debugger
        setState((prevState) => ({
          ...prevState,
          data: state.data,
        }));
        closeEditProduct();
        callLocalBaseURL();
        getEditSuccessUpdate();
      }
    else{
      if(result.status===401||result.status===402){
        dispatch(verifyToken())
      }
	  else{
      ippNotify.error(result.data.responseMessage||"");
      getEditErrorUpdate(result.data);
    }
  };
  };

  const handleEditFormSubmit = async () => {
    updateEditInBackend();
  };

  const handleRequestClose = () => {
    closeEditProduct();
    /* callLocalBaseURL(); */
  };

  const handleFieldNameInputChange = (e, value, index) => {
    const list = [...state.productDetail];
    const list1 = [...state.productDetailArray];
    // if (typeof list[index] === "undefined") {
    //   list.push({ fieldId: 0, isMandatory: 0, isPreQuote: 0, section: "" });
    // }
    if (value === null) {
      list[index]["fieldId"] = "";
      list[index]["isfieldId"] = false;

      setState((prevState) => ({
        ...prevState,
        productDetail: list,
        productDetailArray: list1,
        isfieldIdData: false,
        isAddFormSubmitDisabled: false,
      }));
    } else {
      const allData = [...state.allData];
      let selectedFieldInfo =
        (allData || []).filter((obj) => {
          if (obj.name === value) return true;
          return false;
        })[0] || {};
      if (selectedFieldInfo && selectedFieldInfo.id) {
        list[index]["fieldId"] = selectedFieldInfo.id;
        list[index]["isfieldId"] = true;

        if (list[index]["status"] != "A") {
          list[index]["status"] = state.modifyCode;
          //list1[index]["status"] = state.modifyCode;
        }
        
        setState((prevState) => ({
          ...prevState,
          productDetail: list,
          productDetailArray: list1,
          isfieldIdData: true,
          isAddFormSubmitDisabled: true,
        }));
      }
    }
  };

  const isComparisonEnabledTextReturn = (isComparisonEnabled) => {
    switch (isComparisonEnabled) {
      case 0:
        return "No";
      case 1:
        return "Yes";
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

  const [, setCategorias] = useState([]);

  useEffect(() => {
    getCategorias();
  }, []);

  const getCategorias = async () => {
    const res = await fetch(
      baseURL + "/insurance/core-data?page=1&limit=500&typeId=10"
    );

    const response = await res.json();
    setCategorias(response.dataList);
  };

  const handleIsEnabledChange = (e) => {
    setState((prevState) => ({
      ...prevState,
      categoryId: e.target.value,
    }));
    getInsurance();
    getSubCat(e.target.value);
    // getInsuranceCategory(e.target.value);
    // let response = {};
    // const getSubCategorias = async () => {
    //   const res = await fetch(
    //     baseURL+"/insurance/sub-categories?page=1&limit=500&categoryId=" +
    //       e.target.value.toString()
    //   );
    //   response = await res.json();
    //   e.persist();
    //   setsubCategorias(typeof response == "object" ? [response] : response);
    // };
  };

  const handleRemoveClick = () => {
    let index=state.deletedFelidsIndex
    const list = [...state.productDetail];
    const list1 = [...state.productDetailArray];
    if (list[index]) {
      list1[index]["status"] = state.deleteCode;
    }
    list.splice(index, 1);
    setState((prevState) => ({
      ...prevState,
      productDetail: list,
      productDetailArray: list1,
      deleteFelidDialogOpen:false,
      isAddFormSubmitDisabled: true,
    }));
    // setInputList(list);
  };

  const handleAddClick = () => {
    let addid = state.maxfelidid + 1;
    setState((prevState) => ({
      ...prevState,
      productDetail: [
        ...state.productDetail,
        {
          id:addid,
          fieldId: 0,
          isMandatory: 0,
          isPreQuote: 0,
          section: "",
          isfieldId: false,
          issection: false,
          status:"A",
        },
      ],
      productDetailArray: [
        ...state.productDetailArray,
        {
          id:addid,
          fieldId: 0,
          isMandatory: 0,
          isPreQuote: 0,
          section: "",
          isfieldId: false,
          issection: false,
          status:"A",
        },
      ],
      maxfelidid:addid,
      isAddFormSubmitDisabled: false,
    }));
  };

  const handlesectionAddClick = () => {
    let addid = state.maxsectionid + 1;
    setState((prevState) => ({
      ...prevState,
      sectioninputList: [
        ...state.sectioninputList,
        {
          id: addid,
          name: "",
          isPreQuote: 0,
          sectionOrder: "",
          status: "A",
          isnamevalue: false,
          issectionvalue: false,
        },
      ],
      sectioninputarray: [
        ...state.sectioninputarray,
        {
          id: addid,
          name: "",
          isPreQuote: 0,
          sectionOrder: "",
          status: "A",
          isnamevalue: false,
          issectionvalue: false,
        },
      ],
      maxsectionid: addid,
      isAddFormSubmitDisabled: false,
    }));
  };

  const handlefeatureAddClick = () => {
    let addid = state.maxfeatureid + 1;
    setState((prevState) => ({
      ...prevState,
      featureinputList: [
        ...state.featureinputList,
        {
          id: addid,
          name: "",
          key: "",
          categoryId: "",
          status: "A",
          duplicatestatus: false,
          isnamevalue: false,
          iskeyvalue: false,
          iscategoryid: false,
        },
      ],
      featureinputarray: [
        ...state.featureinputarray,
        {
          id: addid,
          name: "",
          key: "",
          categoryId: "",
          status: "A",
          duplicatestatus: false,
          isnamevalue: false,
          iskeyvalue: false,
          iscategoryid: false,
        },
      ],
      maxfeatureid:addid,
      isAddFormSubmitDisabled: false,
    }));
  };

  const handleInputChangeisPreQuote = (e, index) => {
    if (e.target.name) {
      const { checked } = e.target;
      const list = [...state.productDetail];
      const list1 = [...state.productDetailArray];
      if (typeof list[index] === "undefined") {
        list.push({ id:0,fieldId: 0, isMandatory: 0, isPreQuote: 0, section: "",status:"" });
      }
      list[index]["isPreQuote"] = checked ? 1 : 0;
      if (list[index]["status"] != "A") {
        list[index]["status"] = state.modifyCode;
        list1[index]["status"] = state.modifyCode;
      }
      setState((prevState) => ({
        ...prevState,
        isPreQuote: list,
        isAddFormSubmitDisabled: true,
        productDetail: list,
        productDetailArray: list,
      }));
    }
  };

  const handleFeatureNameInputChange = (e, value, index) => {
    let inputtagvalue = e.target.value;
    const list = [...state.featureinputList];
    const list1 = [...state.featureinputarray];
    if (typeof list[index] === "undefined") {
      list.push({
        name: "",
        key: "",
        categoryId: "",
        status: "",
        duplicatestatus: false,
        isnamevalue: false,
        iskeyvalue: false,
        iscategoryid: false,
      });
    }
    if (typeof list1[index] === "undefined") {
      list1.push({
        name: "",
        key: "",
        categoryId: "",
        status: "",
        duplicatestatus: false,
        isnamevalue: false,
        iskeyvalue: false,
        iscategoryid: false,
      });
    }
    if (inputtagvalue) {
      list[index]["name"] = inputtagvalue;
      list[index]["isnamevalue"] = false;
      list1[index]["name"] = inputtagvalue;
      list1[index]["isnamevalue"] = false;
      if (list[index]["status"] != "A") {
        list[index]["status"] = state.modifyCode;
        list1[index]["status"] = state.modifyCode;
      }
      setState((prevState) => ({
        ...prevState,
        isnamevalueData: true,
        isAddFormSubmitDisabled: true,
      }));
    } else if (!inputtagvalue) {
      list[index]["name"] = "";
      list[index]["isnamevalue"] = true;
      list1[index]["name"] = "";
      list1[index]["isnamevalue"] = true;
      setState((prevState) => ({
        ...prevState,
        isnamevalueData: false,
        isAddFormSubmitDisabled: false,
      }));
    }

    setfeatureinputList(list);
    setState((prevState) => ({
      ...prevState,
      featureinputList: list,
      featureinputarray1: list,
    }));
  };

  const handleFeatureKeyInputChange = (e, value, index) => {
    let inputtagvalue = e.target.value;
    const list = [...featureinputList];
    const list1 = [...state.featureinputarray];
    if (typeof list[index] === "undefined") {
      list.push({
        name: "",
        key: "",
        categoryId: "",
        status: "",
        duplicatestatus: false,
        isnamevalue: false,
        iskeyvalue: false,
        iscategoryid: false,
      });
    }
    if (typeof list1[index] === "undefined") {
      list1.push({
        name: "",
        key: "",
        categoryId: "",
        status: "",
        duplicatestatus: false,
        isnamevalue: false,
        iskeyvalue: false,
        iscategoryid: false,
      });
    }

    if (inputtagvalue) {
      list[index]["key"] = inputtagvalue;
      list[index]["iskeyvalue"] = false;
      list1[index]["key"] = inputtagvalue;
      list1[index]["iskeyvalue"] = false;
      if (list[index]["status"] != "A") {
        list[index]["status"] = state.modifyCode;
        list1[index]["status"] = state.modifyCode;
      }
      //isnamevalueData: true;
      setState((prevState) => ({
        ...prevState,
        iskeyvalueData: true,
        isAddFormSubmitDisabled: true,
      }));
    } else if (!inputtagvalue) {
      list[index]["key"] = "";
      list[index]["iskeyvalue"] = true;
      list1[index]["key"] = "";
      list1[index]["iskeyvalue"] = true;
      //isnamevalueData: false;
      setState((prevState) => ({
        ...prevState,
        iskeyvalueData: false,
        isAddFormSubmitDisabled: false,
      }));
    }

    setfeatureinputList(list);
    setState((prevState) => ({
      ...prevState,
      featureinputList: list,
      featureinputarray: list1,
    }));
  };

  useEffect(() => {
    checkduplicationkeyvalue();
  }, [featureinputList]);

  const checkduplicationkeyvalue = () => {
    var duplicatefound = true;
    let featuresdata = state.featureinputList;
    for (var k = 0; k < featuresdata.length; k++) {
      featuresdata[k]["duplicatestatus"] = false;
      setfeatureinputList(featuresdata);
      setState((prevState) => ({
        ...prevState,
        featureinputList: featuresdata,
        isAddFormSubmitDisabled: true,
      }));
    }

    for (var i = 0; i < featuresdata.length - 1; i++) {
      let isduplicate = false;
      for (var j = i + 1; j < featuresdata.length; j++) {
        if (i != j) {
          if (featuresdata[i].key === featuresdata[j].key) {
            isduplicate = true;
            featuresdata[j]["duplicatestatus"] = duplicatefound;
            setfeatureinputList(featuresdata);
            setState((prevState) => ({
              ...prevState,
              featureinputList: featuresdata,
              isAddFormSubmitDisabled: false,
            }));
          }
        }
      }
      if (isduplicate === true) {
        featuresdata[i]["duplicatestatus"] = duplicatefound;
        setfeatureinputList(featuresdata);
        setState((prevState) => ({
          ...prevState,
          featureinputList: featuresdata,
          isAddFormSubmitDisabled: false,
        }));
      }
    }
  };

  const handleFeatureInputCategoryChange = (e, index) => {
    if (e.target.name) {
      const { value } = e.target;
      const list = [...state.featureinputList];
      const list1 = [...state.featureinputarray];
      if (typeof list[index] === "undefined") {
        list.push({
          name: "",
          key: "",
          categoryId: "",
          status: "",
          duplicatestatus: false,
          isnamevalue: false,
          iskeyvalue: false,
          iscategoryid: false,
        });
      }
      if (typeof list1[index] === "undefined") {
        list1.push({
          name: "",
          key: "",
          categoryId: "",
          status: "",
          duplicatestatus: false,
          isnamevalue: false,
          iskeyvalue: false,
          iscategoryid: false,
        });
      }
      if (value === "") {
        list[index]["categoryId"] = value;
        list[index]["iscategoryid"] = true;
        list1[index]["categoryId"] = value;
        list1[index]["iscategoryid"] = true;
        setState((prevState) => ({
          ...prevState,
          iscategoryidData: false,
          isAddFormSubmitDisabled: false,
        }));
      } else if (value != "") {
        list[index]["categoryId"] = value;
        list[index]["iscategoryid"] = false;
        list1[index]["categoryId"] = value;
        list1[index]["iscategoryid"] = false;
        if (list[index]["status"] != "A") {
          list[index]["status"] = state.modifyCode;
          list1[index]["status"] = state.modifyCode;
        }
        setState((prevState) => ({
          ...prevState,
          iscategoryidData: true,
          isAddFormSubmitDisabled: true,
        }));
      }
      setfeatureinputList(list);
      setState((prevState) => ({
        ...prevState,
        featureinputList: list,
        featureinputarray: list1,
      }));
    }
  };

  const handleSectionNameInputChange = (e, value, index) => {
    let inputtagvalue = e.target.value;
    const list = [...state.sectioninputList];
    const list1 = [...state.sectioninputarray];
    if (typeof list[index] === "undefined") {
      list.push({
        id: 0,
        name: "",
        isPreQuote: 0,
        sectionOrder: "",
        status: "",
        isnamevalue: false,
        issectionvalue: false,
      });
    }
    if (typeof list1[index] === "undefined") {
      list1.push({
        id: 0,
        name: "",
        isPreQuote: 0,
        sectionOrder: "",
        status: "",
        isnamevalue: false,
        issectionvalue: false,
      });
    }
    if (inputtagvalue) {
      list[index]["name"] = inputtagvalue;
      list[index]["isnamevalue"] = false;
      list1[index]["name"] = inputtagvalue;
      list1[index]["isnamevalue"] = false;

      if (list[index]["status"] != "A") {
        list[index]["status"] = state.modifyCode;
        list1[index]["status"] = state.modifyCode;
      }
      setState((prevState) => ({
        ...prevState,
        issectionnamevalueData: true,
        isAddFormSubmitDisabled: true,
      }));
    } else if (!inputtagvalue) {
      list[index]["name"] = "";
      list[index]["status"] = state.addCode;
      list[index]["isnamevalue"] = true;
      list1[index]["name"] = "";
      list1[index]["status"] = state.addCode;
      list1[index]["isnamevalue"] = true;
      setState((prevState) => ({
        ...prevState,
        issectionnamevalueData: false,
        isAddFormSubmitDisabled: false,
      }));
    }

    setsectionInputList(list);
    setState((prevState) => ({
      ...prevState,
      sectioninputList: list,
      sectioninputarray: list1,
    }));
  };

  const handleSectionInputChangeisPreQuote = (e, index) => {
    ////////debugger
    if (e.target.name) {
      const { checked } = e.target;
      const list = [...state.sectioninputList];
      const list1 = [...state.sectioninputarray];
      if (typeof list[index] === "undefined") {
        list.push({
          id: 0,
          name: "",
          isPreQuote: 0,
          sectionOrder: "",
          status: "",
        });
      }
      if (typeof list1[index] === "undefined") {
        list1.push({
          id: 0,
          name: "",
          isPreQuote: 0,
          sectionOrder: "",
          status: "",
        });
      }

      list[index]["isPreQuote"] = checked ? 1 : 0;
      list1[index]["isPreQuote"] = checked ? 1 : 0;

      if (list[index]["status"] != "A") {
        list[index]["status"] = state.modifyCode;
        list1[index]["status"] = state.modifyCode;
      }
      setsectionInputList(list);
      setState((prevState) => ({
        ...prevState,
        sectioninputList: list,
        sectioninputarray: list1,
        isAddFormSubmitDisabled: true,
      }));
    }
  };

  const handleSectionInputSectionorderChange = (e, index) => {
    if (e.target.name) {
      const { value } = e.target;
      const list = [...state.sectioninputList];
      const list1 = [...state.sectioninputarray];
      if (typeof list[index] === "undefined") {
        list.push({
          id: 0,
          name: "",
          isPreQuote: 0,
          sectionOrder: "",
          status: "",
          isnamevalue: false,
          issectionvalue: false,
        });
      }
      if (typeof list1[index] === "undefined") {
        list1.push({
          id: 0,
          name: "",
          isPreQuote: 0,
          sectionOrder: "",
          status: "",
          isnamevalue: false,
          issectionvalue: false,
        });
      }
      if (value != "") {
        list[index]["sectionOrder"] = value;
        list[index]["issectionvalue"] = false;
        list1[index]["sectionOrder"] = value;
        list1[index]["issectionvalue"] = false;
        if (list[index]["status"] != "A") {
          list[index]["status"] = state.modifyCode;
          list1[index]["status"] = state.modifyCode;
        }
        setState((prevState) => ({
          ...prevState,
          issectionvalueData: true,
          isAddFormSubmitDisabled: true,
        }));
      } else if (value == "") {
        list[index]["sectionOrder"] = value;
        list[index]["issectionvalue"] = true;
        list1[index]["sectionOrder"] = value;
        list1[index]["issectionvalue"] = true;
        setState((prevState) => ({
          ...prevState,
          issectionvalueData: false,
          isAddFormSubmitDisabled: false,
        }));
      }
      setsectionInputList(list);
      setState((prevState) => ({
        ...prevState,
        sectioninputList: list,
        sectioninputarray: list1,
      }));
    }
  };

  const handleSectionRemoveClick = () => {
    let index=state.deletedSectionIndex
    const list = [...state.sectioninputList];
    const list1 = [...state.sectioninputarray];
    if (list1[index]) {
      list1[index]["status"] = state.deleteCode;
    }
    list.splice(index, 1);
    setState((prevState) => ({
      ...prevState,
      sectioninputList: list,
      sectioninputarray: list1,
      deleteSectionDialogOpen:false,
      isAddFormSubmitDisabled: true,
    }));
  };

  const handleFeatureRemoveClick = () => {
    let index = state.deletedFeatureIndex
    const list = [...state.featureinputList];
    const list1 = [...state.featureinputarray];
    if (list1[index]) {
      list1[index]["status"] = state.deleteCode;
    }
    list.splice(index, 1);
    setState((prevState) => ({
      ...prevState,
      featureinputList: list,
      featureinputarray: list,
      deleteFeatureDialogOpen:false,
      isAddFormSubmitDisabled: true,
    }));
  };

  const handleInputSectionChange = (e, index) => {
    if (e.target.name) {
      const { value } = e.target;
      const list = [...state.productDetail];
      const list1 = [...state.productDetailArray];
      if (typeof list[index] === "undefined") {
        list.push({
          id:0,
          FieldId: 0,
          isMandatory: 0,
          isPreQuote: 0,
          section: "",
          isfieldId: false,
          issection: false,
          status:""
        });
      }

      if (value.toString() == "") {
        list[index]["section"] = value;
        list[index]["issection"] = true;
        setState((prevState) => ({
          ...prevState,
          issectionData: false,
          isAddFormSubmitDisabled: false,
        }));
      } else {
        list[index]["section"] = parseInt(value);
        list[index]["issection"] = false;
        if (list[index]["status"] != "A") {
          list[index]["status"] = state.modifyCode;
          list1[index]["status"] = state.modifyCode;
        }
        setState((prevState) => ({
          ...prevState,
          issectionData: true,
          isAddFormSubmitDisabled: true,
        }));
      }
      setState((prevState) => ({
        ...prevState,
        productDetail: list,
        productDetailArray: list,
      }));
    }
  };

  const handleInputChangeIsMandatory = (e, index) => {
    if (e.target.name) {
      const { checked } = e.target;
      const list = [...state.productDetail];
      const list1 = [...state.productDetailArray];
      if (typeof list[index] === "undefined") {
        list.push({ id:0,fieldId: 0, isMandatory: 0, isPreQuote: "", section: "",status:"" });
      }

      list[index]["isMandatory"] = checked ? 1 : 0;
      if (list[index]["status"] != "A") {
        list[index]["status"] = state.modifyCode;
        list1[index]["status"] = state.modifyCode;
      }
     
      setState((prevState) => ({
        ...prevState,
        isMandatory: list,
        productDetail: list,
        productDetailArray: list,
        isAddFormSubmitDisabled: true,
      }));
    }
  };

  const handleTabChange = (event, value) => {
    retractCurrentTabOpenAccordians(state.tabValue);
    setState((prevState) => ({
      ...prevState,
      tabValue: value,
    }));
    //callTabData(value);
  };

  const retractCurrentTabOpenAccordians = () => {
    // console.log("state.expanded = ", state.expansionPanelOpen);
  };

  const getSelectedItem = (productId) => {
    console.log("allData-id", state.allData);
    console.log("allData-id", productId);
    const item = state.allData.find((n) => n.id === productId);
    if (item) {
      return item.name;
    } else if (item === null) {
      return "";
    }
  };

  const handleDeleteFelidsDialogClose = () => {
    setState((prevState) => ({
      ...prevState,
      deleteFelidDialogOpen: false,
    }));
  };

   const onTableDeleteeFelidsButtonClick = (i) => {
    setState((prevState) => ({
      ...prevState,
      deleteFelidDialogOpen: true,
      deletedFelidsIndex:i,
    }));
   
  };

  const handleDeleteSectionDialogClose = () => {
    setState((prevState) => ({
      ...prevState,
      deleteSectionDialogOpen: false,
    }));
  };

   const onTableDeleteeSectionButtonClick = (i) => {
    setState((prevState) => ({
      ...prevState,
      deleteSectionDialogOpen: true,
      deletedSectionIndex:i,
    }));
   
  };

  const handleDeleteFeatureDialogClose = () => {
    setState((prevState) => ({
      ...prevState,
      deleteFeatureDialogOpen: false,
    }));
  };

   const onTableDeleteeFeatureButtonClick = (i) => {
    setState((prevState) => ({
      ...prevState,
      deleteFeatureDialogOpen: true,
      deletedFeatureIndex:i,
    }));
   
  };



  return (
    <div className="row">
    
  <Dialog
            maxWidth="xs"
            open={state.deleteFelidDialogOpen}
            onClose={handleDeleteFelidsDialogClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              { <IntlMessages id="ipp.common.modal.deleteconfirmation.title"/>}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
              <IntlMessages id="product.felids.modal.deleteconfrimation.message"/>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteFelidsDialogClose} color="primary">
              <IntlMessages id="ipp.common.Cancel.button"/>
              </Button>
              <Button
                onClick={handleRemoveClick}
                color="secondary"
                autoFocus
              >
                 <IntlMessages id="ipp.common.Delete.button"/>
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            maxWidth="xs"
            open={state.deleteSectionDialogOpen}
            onClose={handleDeleteSectionDialogClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              { <IntlMessages id="ipp.common.modal.deleteconfirmation.title"/>}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
              <IntlMessages id="product.section.modal.deleteconfrimation.message"/>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteSectionDialogClose} color="primary">
              <IntlMessages id="ipp.common.Cancel.button"/>
              </Button>
              <Button
                onClick={handleSectionRemoveClick}
                color="secondary"
                autoFocus
              >
                 <IntlMessages id="ipp.common.Delete.button"/>
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            maxWidth="xs"
            open={state.deleteFeatureDialogOpen}
            onClose={handleDeleteFeatureDialogClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              { <IntlMessages id="ipp.common.modal.deleteconfirmation.title"/>}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
              <IntlMessages id="product.feature.modal.deleteconfrimation.message"/>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteFeatureDialogClose} color="primary">
              <IntlMessages id="ipp.common.Cancel.button"/>
              </Button>
              <Button
                onClick={handleFeatureRemoveClick}
                color="secondary"
                autoFocus
              >
                 <IntlMessages id="ipp.common.Delete.button"/>
              </Button>
            </DialogActions>
          </Dialog>


      <CardBox styleName="col-md-12">
        <div className="cardBox">
          <div className="row">
          <IPPNotification />
            <div className="col-lg-4">
              <InputField
                className="mb-3"
                autoFocus
                id="name"
                label={
                  <IntlMessages id="product.master.modal.edit.felid.Name" />
                }
                name="name"
                required
                error={state.errors.name}
                onChange={(e) => handleEditFormChange(e)}
                helperText={state.errors.name}
                value={state.validation.name}
                fullWidth
              />
            </div>
            <div className="col-lg-4">
              <InputField
                className="mb-3"
                id="description"
                label={
                  <IntlMessages id="product.master.modal.edit.felid.Description" />
                }
                name="description"
                required
                error={state.errors.description}
                onChange={(e) => handleEditFormChange(e)}
                helperText={state.errors.description}
                value={state.validation.description}
                fullWidth
              />
            </div>
            <div className="col-lg-4">
              <FormControl variant="outlined" className="w-100 mb-3">
                <InputLabel id="insuranceCategorias">
                  Insurance Category
                </InputLabel>
                <InputSelect
                  labelId="insuranceCategorias"
                  id="insuranceCategorias"
                  label={
                    <IntlMessages id="product.master.modal.edit.felid.InsuranceCategorias" />
                  }
                  name="insuranceCategorias"
                  value={state.categoryId || ""}
                  onChange={(e) => handleIsEnabledChange(e)}
                  variant="outlined"
                  // onChange={(e) => handleEditFormChange(e)}
                >
                  {/* <MenuItem value="" disabled>
            <em>Select</em>
          </MenuItem>
          {categorias &&
            categorias.map((categorias) => (
              <MenuItem value={categorias.id}>
                {categorias.name}
              </MenuItem>
            ))} */}
                  <MenuItem value="">
                    <em>Select</em>
                  </MenuItem>
                  {state.insuranceCategoryNameOptions &&
                    state.insuranceCategoryNameOptions.map((option) => (
                      <MenuItem
                        name="insuranceCategorias"
                        key={option.id}
                        value={option.id}
                      >
                        {option.name}
                      </MenuItem>
                    ))}
                </InputSelect>
              </FormControl>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4">
              <FormControl variant="outlined" className="w-100 mb-3">
                <InputLabel id="subCategoryIdOptions">Sub Category</InputLabel>
                <InputSelect
                  labelId="subCategoryId"
                  id="subCategoryId"
                  label={
                    <IntlMessages id="product.master.modal.edit.felid.SubCategoryId" />
                  }
                  name="subCategoryId"
                  required
                  error={state.errors.subCategoryId}
                  onChange={(e) => handleEditFormChange(e)}
                  helperText={state.errors.subCategoryId}
                  value={state.validation.subCategoryId || ""}
                >
                  <MenuItem value="">
                    <em>Select</em>
                  </MenuItem>
                  {state.subCategoryNameOptions &&
                    state.subCategoryNameOptions.map((option) => (
                      <MenuItem
                        name="subCategoryId"
                        key={option.id}
                        value={option.id}
                      >
                        {option.name}
                      </MenuItem>
                    ))}
                </InputSelect>
              </FormControl>
            </div>
            <div className="col-lg-4 mb-2">
              <FormControl variant="outlined" className="w-100 mb-3">
                <InputLabel id="subCategoryIdOptions">Product Type</InputLabel>
                <InputSelect
                  labelId="productTypeId"
                  id="productTypeId"
                  label={
                    <IntlMessages id="product.master.modal.edit.felid.ProductTypeId" />
                  }
                  name="productTypeId"
                  required
                  error={state.errors.productTypeId}
                  onChange={(e) => handleEditFormChange(e)}
                  helperText={state.errors.productTypeId}
                  value={state.validation.productTypeId || ""}
                  fullWidth
                >
                  <MenuItem value="">
                    <em>Select</em>
                  </MenuItem>
                  {state.productTypesOptions &&
                    state.productTypesOptions.map((option) => (
                      <MenuItem
                        name="productTypeId"
                        key={option.id}
                        value={option.id}
                      >
                        {option.name}
                      </MenuItem>
                    ))}
                </InputSelect>
              </FormControl>
            </div>
            <div className="col-lg-4">
              <FormControl
                // className={classes.formControl}
                variant="outlined"
                className="w-100 mb-3"
                fullWidth
                error={false}
              >
                <InputLabel id="isComparisonEnabled">
                  Comparison Enabled?
                </InputLabel>
                <InputSelect
                  label={
                    <IntlMessages id="product.master.modal.edit.felid.IsComparisonEnabled" />
                  }
                  name="isComparisonEnabled"
                  labelId="IsComparisonEnabled"
                  id="isComparisonEnabled"
                  onChange={(e) => handleEditFormChange(e)}
                  error={state.errors.isComparisonEnabled}
                  helperText={state.errors.isComparisonEnabled}
                  value={state.validation.isComparisonEnabled || ""}
                  renderValue={(value) => `${value}`}
                  fullWidth
                >
                  <MenuItem value="">
                    <em>Select</em>
                  </MenuItem>

                  <MenuItem value={"No"}>No</MenuItem>
                  <MenuItem value={"Yes"}>Yes</MenuItem>
                </InputSelect>
              </FormControl>
            </div>
          </div>
          <div className="mt-4 product-list">
            <AppBar position="static" color="default">
              <Tabs
                //indicatorColor="primary"
                //textColor="primary"
                value={state.tabValue}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="on"
              >
                {state.tabHeaderData.map((n) => {
                  return (
                    <Tab
                      value={n.value}
                      label={n.name}
                      id={n.value}
                      key={n.value}
                      // typeId={n.typeId}
                    />
                  );
                })}
              </Tabs>
            </AppBar>
            <br />

            {state.tabValue === "2" ? (
              <>
                <div className="row">
                  <h4 className="col-lg-3 mt-3 ml-1">
                    <IntlMessages id="product.master.modal.add.felid.Fields" />
                  </h4>
                  <h4 className="col-lg-2 mt-3 ml-1">
                    <IntlMessages id="product.master.modal.add.felid.Mandatory" />
                  </h4>
                  <h4 className="col-lg-2 mt-3 ml-1">
                    <IntlMessages id="product.master.modal.add.felid.PreQuote" />
                  </h4>
                  <h4 className="col-lg-2 mt-3 ml-1">
                    <IntlMessages id="product.master.modal.add.felid.Section" />
                  </h4>
                </div>

                {state.productDetail.map((x, i) => {
                  return (
                    <div className="row px-4 py-1 mb-1" key={i}>
                      <div className="col-lg-3">
                        {x.isfieldId === true ? (
                          <>
                            <InputAutocomplete
                              id="fieldId"
                              name="fieldId"
                              onChange={(e, value) =>
                                handleFieldNameInputChange(e, value, i)
                              }
                              options={state.allData.map((n) => n.name) || ""}
                              // value={x.productName}
                              value={getSelectedItem(x.fieldId)||""}
                              renderInput={(params) => (
                                <TextField {...params} variant="outlined" />
                              )}
                              fullWidth
                            />
                          </>
                        ) : (
                          <>
                            <InputAutocomplete
                              id="fieldId"
                              name="fieldId"
                              variant="outlined"
                              onChange={(e, value) =>
                                handleFieldNameInputChange(e, value, i)
                              }
                              options={state.allData.map((n) => n.name) || ""}
                              // value={x.productName}
                              value={getSelectedItem(x.fieldId)||""}
                              renderInput={(params) => (
                                <TextField
                                  required
                                  error
                                  {...params}
                                  variant="outlined"
                                  // error={state.errors.categoryId}
                                  helperText="Feild Name is Required!"
                                />
                              )}
                            />
                          </>
                        )}
                      </div>
                      <div className="col-lg-2">
                        <Switch
                          className="ml10"
                          name="isMandatory"
                          value={x.isMandatory}
                          checked={x.isMandatory === 1 ? true : false}
                          onChange={(e) => handleInputChangeIsMandatory(e, i)}
                          id="isMandatory"
                          color="primary"
                          inputProps={{
                            "aria-label": "secondary checkbox",
                          }}
                        />
                      </div>
                      <div className="col-lg-2">
                        <Switch
                          name="isPreQuote"
                          label="IsPreQuote"
                          value={x.isPreQuote}
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
                        {x.issection === true ? (
                          <>
                            <FormControl
                              variant="outlined"
                              fullWidth
                              error={true}
                            >
                              <InputSelect
                                className="mb-3"
                                fullWidth
                                label="Section"
                                name="section"
                                labelId="section"
                                id="section"
                                required
                                /* helpertext={state.errors.section} */
                                value={x.section || ""}
                                onChange={(e) => handleInputSectionChange(e, i)}
                              >
                                <MenuItem value="">
                                  <em>Select</em>
                                </MenuItem>
                                {state.sectioninputList.map((n) => (
                                  <MenuItem value={n.id} key={n.id}>
                                    {n.name}
                                  </MenuItem>
                                ))}
                              </InputSelect>
                              <FormHelperText>
                                {
                                  <IntlMessages id="product.master.modal.add.felid.Section.errormessage" />
                                }
                              </FormHelperText>
                            </FormControl>
                          </>
                        ) : (
                          <>
                            <FormControl
                              variant="outlined"
                              fullWidth
                              error={false}
                            >
                              <InputSelect
                                className="mb-3"
                                fullWidth
                                label="Section"
                                name="section"
                                labelId="section"
                                id="section"
                                required
                                /* helpertext={state.errors.section} */
                                value={x.section || ""}
                                onChange={(e) => handleInputSectionChange(e, i)}
                              >
                                <MenuItem value="">
                                  <em>Select</em>
                                </MenuItem>
                                {state.sectioninputList.map((n) => (
                                  <MenuItem value={n.id} key={n.id}>
                                    {n.name}
                                  </MenuItem>
                                ))}
                              </InputSelect>
                            </FormControl>
                          </>
                        )}
                      </div>
                      <div className="col-lg-1"></div>
                      <div className="col-lg-2">
                        {state.productDetail.length - 1 === i && (
                          <AddCircleOutlineIcon
                            style={{
                              cursor: "pointer",
                              marginRight: "10px",
                            }}
                            onClick={handleAddClick}
                          />
                        )}
                        {state.productDetail.length !== 1 && (
                          <RemoveCircleOutlineIcon
                            style={{ cursor: "pointer" }}
                            onClick={()=>onTableDeleteeFelidsButtonClick(i)}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </>
            ) : state.tabValue === "1" ? (
              <>
                <div className="row">
                  <h4 className="col-lg-3 mt-3 ml-1">
                    <IntlMessages id="product.master.modal.add.felid.Sectionname" />
                  </h4>
                  <h4 className="col-lg-2 mt-3 ml-1">
                    <IntlMessages id="product.master.modal.add.felid.SectionPreQuote" />
                  </h4>
                  <h4 className="col-lg-2 mt-3 ml-1">
                    <IntlMessages id="product.master.modal.add.felid.Sectionorder" />
                  </h4>
                </div>
                {state.sectioninputList.map((x, i) => {
                  return (
                    <div className="row px-4 py-1 mb-1" key={i}>
                      <div className="col-lg-3">
                        {x.isnamevalue === true ? (
                          <>
                            <InputField
                              error
                              id={"name_" + i}
                              name="name"
                              value={x.name}
                              onChange={(e, value) =>
                                handleSectionNameInputChange(e, value, i)
                              }
                              fullWidth
                              helperText={
                                <IntlMessages id="product.master.modal.add.felid.Sectionname.errormessage" />
                              }
                            />
                          </>
                        ) : (
                          <>
                            <InputField
                              id={"name_" + i}
                              name="name"
                              value={x.name}
                              onChange={(e, value) =>
                                handleSectionNameInputChange(e, value, i)
                              }
                              fullWidth
                            />
                          </>
                        )}
                      </div>
                      <div className="col-lg-2">
                        <Switch
                          name="isPreQuote"
                          label="isPreQuote"
                          checked={x.isPreQuote === 1 ? true : false}
                          onChange={(e) =>
                            handleSectionInputChangeisPreQuote(e, i)
                          }
                          id="isPreQuote"
                          color="primary"
                          inputProps={{
                            "aria-label": "secondary checkbox",
                          }}
                        />
                      </div>
                      <div className="col-lg-2">
                        {x.issectionvalue === true ? (
                          <>
                            <FormControl
                              variant="outlined"
                              fullWidth
                              error={true}
                            >
                              <InputSelect
                                className="mb-3"
                                fullWidth
                                label="sectionOrder"
                                name="sectionOrder"
                                labelId="sectionOrder"
                                id="sectionOrder"
                                required
                                helpertext={state.errors.section}
                                value={x.sectionOrder || ""}
                                onChange={(e) =>
                                  handleSectionInputSectionorderChange(e, i)
                                }
                              >
                                <MenuItem value="">
                                  <em>Select</em>
                                </MenuItem>
                                <MenuItem value={1}>1</MenuItem>
                                <MenuItem value={2}>2</MenuItem>
                                <MenuItem value={3}>3</MenuItem>
                                <MenuItem value={4}>4</MenuItem>
                                <MenuItem value={5}>5</MenuItem>
                              </InputSelect>
                              <FormHelperText>
                                <IntlMessages id="product.master.modal.add.felid.Sectionorder.errormessage" />
                              </FormHelperText>
                            </FormControl>
                          </>
                        ) : (
                          <>
                            <FormControl
                              variant="outlined"
                              fullWidth
                              error={false}
                            >
                              <InputSelect
                                className="mb-3"
                                fullWidth
                                label="sectionOrder"
                                name="sectionOrder"
                                labelId="sectionOrder"
                                id="sectionOrder"
                                required
                                helpertext={state.errors.section}
                                value={x.sectionOrder || ""}
                                onChange={(e) =>
                                  handleSectionInputSectionorderChange(e, i)
                                }
                              >
                                <MenuItem value="">
                                  <em>Select</em>
                                </MenuItem>
                                <MenuItem value={1}>1</MenuItem>
                                <MenuItem value={2}>2</MenuItem>
                                <MenuItem value={3}>3</MenuItem>
                                <MenuItem value={4}>4</MenuItem>
                                <MenuItem value={5}>5</MenuItem>
                              </InputSelect>
                            </FormControl>
                          </>
                        )}
                      </div>
                      <div className="col-lg-1"></div>
                      <div className="col-lg-2">
                        {state.sectioninputList.length - 1 === i && (
                          <AddCircleOutlineIcon
                            style={{
                              cursor: "pointer",
                              marginRight: "10px",
                            }}
                            onClick={handlesectionAddClick}
                          />
                        )}
                        {state.sectioninputList.length !== 1 && (
                          <RemoveCircleOutlineIcon
                            style={{ cursor: "pointer" }}
                            onClick={() => onTableDeleteeSectionButtonClick(i)}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </>
            ) : state.tabValue === "3" ? (
              <>
                <div className="row">
                  <h4 className="col-lg-3 mt-3 ml-1">
                    <IntlMessages id="product.master.modal.add.felid.Name" />
                  </h4>
                  <h4 className="col-lg-2 mt-3 ml-1">
                    <IntlMessages id="product.master.modal.add.felid.key" />
                  </h4>
                  <h4 className="col-lg-2 mt-3 ml-1">
                    <IntlMessages id="product.master.modal.add.felid.Category" />
                  </h4>
                </div>
                {state.featureinputList.map((x, i) => {
                  return (
                    <div className="row px-4 py-1 mb-1" key={i}>
                      <div className="col-lg-3">
                        {x.isnamevalue === true ? (
                          <>
                            <InputField
                              error
                              id="name"
                              name="name"
                              value={x.name}
                              onChange={(e, value) =>
                                handleFeatureNameInputChange(e, value, i)
                              }
                              fullWidth
                              helperText={
                                <IntlMessages id="product.master.modal.add.felid.felidname.errormessage" />
                              }
                            />
                          </>
                        ) : (
                          <>
                            <InputField
                              id="name"
                              name="name"
                              value={x.name}
                              onChange={(e, value) =>
                                handleFeatureNameInputChange(e, value, i)
                              }
                              fullWidth
                            />
                          </>
                        )}
                      </div>
                      <div className="col-lg-2">
                        {x.duplicatestatus === true ? (
                          <>
                            <InputField
                              error
                              id="key"
                              name="key"
                              value={x.key}
                              onChange={(e, value) =>
                                handleFeatureKeyInputChange(e, value, i)
                              }
                              fullWidth
                              helperText={
                                <IntlMessages id="product.master.modal.add.felid.felidkey.duplicatekey" />
                              }
                            />
                          </>
                        ) : x.iskeyvalue === true ? (
                          <>
                            <InputField
                              error
                              id="key"
                              name="key"
                              value={x.key}
                              onChange={(e, value) =>
                                handleFeatureKeyInputChange(e, value, i)
                              }
                              fullWidth
                              helperText={
                                <IntlMessages id="product.master.modal.add.felid.felidkey.errormessage" />
                              }
                            />
                          </>
                        ) : (
                          <>
                            <InputField
                              id="key"
                              name="key"
                              value={x.key}
                              onChange={(e, value) =>
                                handleFeatureKeyInputChange(e, value, i)
                              }
                              fullWidth
                              // helpertext="Duplicate key!"
                            />
                          </>
                        )}
                      </div>
                      <div className="col-lg-2">
                        {x.iscategoryid === true ? (
                          <>
                            <FormControl
                              variant="outlined"
                              fullWidth
                              error={true}
                            >
                              <InputSelect
                                className="mb-3"
                                fullWidth
                                label="category"
                                name="categoryId"
                                labelId="category"
                                id="category"
                                required
                                //helpertext={state.errors.section}
                                value={x.categoryId || ""}
                                onChange={(e) =>
                                  handleFeatureInputCategoryChange(e, i)
                                }
                              >
                                <MenuItem value="">
                                  <em>Select</em>
                                </MenuItem>
                                {state.categoryNameList.map((n, i) => (
                                  <MenuItem value={n.id} key={i}>
                                    {n.name}
                                  </MenuItem>
                                ))}
                              </InputSelect>
                              <FormHelperText>
                                <IntlMessages id="product.master.modal.add.felid.felidcategory.errormessage" />
                              </FormHelperText>
                            </FormControl>
                          </>
                        ) : (
                          <>
                            <FormControl
                              variant="outlined"
                              fullWidth
                              error={false}
                            >
                              <InputSelect
                                className="mb-3"
                                fullWidth
                                label="category"
                                name="categoryId"
                                labelId="category"
                                id="category"
                                required
                                //helpertext={state.errors.section}
                                value={x.categoryId || ""}
                                onChange={(e) =>
                                  handleFeatureInputCategoryChange(e, i)
                                }
                              >
                                <MenuItem value="">
                                  <em>Select</em>
                                </MenuItem>
                                {state.categoryNameList.map((n, i) => (
                                  <MenuItem value={n.id} key={i}>
                                    {n.name}
                                  </MenuItem>
                                ))}
                              </InputSelect>
                            </FormControl>
                          </>
                        )}
                      </div>
                      <div className="col-lg-1"></div>
                      <div className="col-lg-2">
                        {state.featureinputList.length - 1 === i && (
                          <AddCircleOutlineIcon
                            style={{
                              cursor: "pointer",
                              marginRight: "10px",
                            }}
                            onClick={handlefeatureAddClick}
                          />
                        )}
                        {state.featureinputList.length !== 1 && (
                          <RemoveCircleOutlineIcon
                            style={{ cursor: "pointer" }}
                            onClick={() => onTableDeleteeFeatureButtonClick(i)}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </>
            ) : null}
          </div>
          <div className="float-right mt-4">
            <InputCancelButton onClick={(e) => handleRequestClose(e)} />
            <InputSubmitButton
              onClick={(e) => handleEditFormSubmit(e)}
              disabled={!state.isAddFormSubmitDisabled}
            />
          </div>
        </div>
      </CardBox>
    </div>
  );
};

export default EditProductMaster;
