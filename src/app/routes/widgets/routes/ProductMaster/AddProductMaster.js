/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button } from "@material-ui/core";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import Joi from "joi-browser";
import Autocomplete from "@material-ui/lab/Autocomplete";
import IntlMessages from "util/IntlMessages";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import FormHelperText from "@material-ui/core/FormHelperText";
import CardBox from "./../../../../../components/CardBox";
import { useHistory } from "react-router-dom";
import Switch from "@material-ui/core/Switch";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import "./style.css";
import {
  apigetUrl,
  apipostUrl,
  apiputUrl,
  apideleteUrl,
} from "../../../../../setup/middleware";
import InputAddButton from "../CommonComponents/AddButton";
import InputSubmitButton from "../CommonComponents/SubmitButton";
import InputCancelButton from "../CommonComponents/CancelButton";
import InputField from "../CommonComponents/TextField";
import InputAutocomplete from "../CommonComponents/Autocomplete";
import InputSelect from "../CommonComponents/Select";
import { useDispatch, useSelector } from "react-redux";
import {verifyToken} from "../../../../../actions/Auth";

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

const AddProductMaster = ({
  getSuccessUpdate,
  getErrorUpdate,
  closeAddProduct,
  callLocalBaseURL,
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
    tabValue: "1",
    expansionPanelOpen: false,
    expansionPanelValue: "",
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
    categoryNameList: [],
    featureinputkeyduplicatecheck: false,
    isvaluenullcheck: false,
    isduplicatecheck: false,
    isfieldIdData: false,
    issectionData: false,
    issectionnamevalueData: false,
    issectionvalueData: false,
    duplicatestatusData: false,
    isnamevalueData: false,
    iskeyvalueData: false,
    iscategoryidData: false,
    fieldPopulated: false,
    inputList1: [
      {
        FieldId: 0,
        isMandatory: 0,
        isPreQuote: 0,
        section: "",
        isfieldId: true,
        issection: false,
      },
    ],
    sectioninputList: [
      {
        id: 0,
        name: "",
        isPreQuote: 0,
        sectionOrder: "",
        status: "",
        isnamevalue: false,
        issectionvalue: false,
      },
    ],
    featureinputList: [
      {
        id: 0,
        name: "",
        key: "",
        categoryId: "",
        status: "",
        duplicatestatus: false,
        isnamevalue: false,
        iskeyvalue: false,
        iscategoryid: false,
      },
    ],
    allData: [],
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
    productTypesOptions: [],
  });

  useEffect(() => {
    getFieldNames();
    productTypesOptions();
    getcategoryNames();
    // getsubCatNames();
  }, []);


  const dispatch = useDispatch();

  const getFieldNames = async () => {
    const result = await apigetUrl(`/insurance/fields?page=${state.page}&limit=1300`);
    if (result.data.responseCode === "200") {
      let response = result.data.dataList.map((n) => n);
      setState((prevState) => ({
        ...prevState,
        allData: response,
      }));
    } 
    else {
      console.log(result.data.responseMessage);
    }
    
  };

  const getcategoryNames =async () => {
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
    }
    else {
      console.log(result.data.responseMessage);
    }
  };

  const productTypesOptions =async () => {
    const result = await apigetUrl(
      `/insurance/product-types?page=${state.page}&limit=500`
    );
    if (result.data.responseCode === "200") {
      let response = result.data.dataList.map((n) => n);
        setState((prevState) => ({
          ...prevState,
          productTypesOptions: response,
        }));
    } 
    else {
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

  const handleAddFormChange = ({ target: input }) => {
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
      fieldPopulated: allFormFieldsPopulated && isObjEmpty(errors),
      //isAddFormSubmitDisabled: allFormFieldsPopulated && isObjEmpty(errors),
    }));
  };

  useEffect(() => {
    if (
      state.isfieldIdData === true &&
      state.issectionData === true &&
      state.issectionnamevalueData === true &&
      state.issectionvalueData === true &&
      state.duplicatestatusData === false &&
      state.isnamevalueData === true &&
      state.iskeyvalueData === true &&
      state.iscategoryidData === true &&
      state.fieldPopulated === true
    ) {
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
  }, [
    state.validation,
    state.isfieldIdData,
    state.issectionData,
    state.issectionnamevalueData,
    state.issectionvalueData,
    state.duplicatestatusData,
    state.isnamevalueData,
    state.iskeyvalueData,
    state.iscategoryidData,
  ]);

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
    //debugger
    var featurelist = [];
    var sectionlist = [];
    var inputlist = [];
    var featurelistdata = state.featureinputList;
    var sectionlistdata = state.sectioninputList;
    var inputdata = state.inputList1;
    for (let i = 0; i < featurelistdata.length; i++) {
      featurelist.push({
        name: featurelistdata[i].name,
        key: featurelistdata[i].key,
        categoryId: featurelistdata[i].categoryId,
        status: featurelistdata[i].status,
      });
    }
    for (let i = 0; i < sectionlistdata.length; i++) {
      sectionlist.push({
        id: sectionlistdata[i].id,
        name: sectionlistdata[i].name,
        isPreQuote: sectionlistdata[i].isPreQuote,
        sectionOrder: sectionlistdata[i].sectionOrder,
        status: sectionlistdata[i].status,
      });
    }
    for (let i = 0; i < inputdata.length; i++) {
      inputlist.push({
        fieldId: inputdata[i].FieldId,
        isMandatory: inputdata[i].isMandatory,
        isPreQuote: inputdata[i].isPreQuote,
        section: inputdata[i].section,
      });
    }
    let addDataObj = {
      name: state.validation.name,
      description: state.validation.description,
      isComparisonEnabled: isComparisonEnabledNumberReturn(
        state.validation.isComparisonEnabled
      ),
      inputFields: inputlist,
      sections: sectionlist,
      features: featurelist,
      subCategoryId: parseInt(state.validation.subCategoryId),
      productTypeId: parseInt(state.validation.productTypeId),
    };

    const result = await apipostUrl(`/insurance/products`, addDataObj);
    if (result.data.responseCode === "200"||result.data.responseCode === "201") {
      setState((prevState) => ({
        ...prevState,
        data: state.data,
      }));
      getSuccessUpdate();
      callLocalBaseURL();
      closeAddProduct();
    } else {
      if(result.status===401||result.status===402){
        dispatch(verifyToken())
      }
	  else{
      setState((prevState) => ({
        ...prevState,
        formDialogOpen: false,
       
      }));
      getErrorUpdate();
	  }
    }
  };

  const handleAddFormDataSubmit = () => {
    AddNewDataInBackend();
  };

  const handleIsEnabledChange = (e) => {
    //////////debugger
    let valuecatid = e.target.value.toString();
    getSubCategorias(valuecatid);
    setState((prevState) => ({
      ...prevState,
      categoryId: valuecatid,
    }));
    getSubCategorias();
  };
  const getSubCategorias = async (valuecatid) => {
    const result = await apigetUrl(
      `/insurance/sub-categories?page=1&limit=500&categoryId=${valuecatid}`
    );
    if (result.data.responseCode === "200") {
      setsubCategorias(result.data.dataList);
    } else {
      console.log(result.data.responseMessage);
    }
  };
  const [inputList1, setInputList] = useState([
    {
      FieldId: 0,
      isMandatory: 0,
      isPreQuote: 0,
      section: "",
      isfieldId: false,
      issection: false,
    },
  ]);

  const [sectioninputList, setsectionInputList] = useState([
    {
      id: 0,
      name: "",
      isPreQuote: 0,
      sectionOrder: "",
      status: "",
      isnamevalue: false,
      issectionvalue: false,
    },
  ]);

  const [featureinputList, setfeatureinputList] = useState([
    {
      name: "",
      key: "",
      categoryId: "",
      status: "",
      duplicatestatus: false,
      isnamevalue: false,
      iskeyvalue: false,
      iscategoryid: false,
    },
  ]);

  const handleInputSectionChange = (e, index) => {
    if (e.target.name) {
      const { value } = e.target;
      const list = [...inputList1];
      if (typeof list[index] === "undefined") {
        list.push({
          FieldId: 0,
          isMandatory: 0,
          isPreQuote: 0,
          section: "",
          isfieldId: false,
          issection: false,
        });
      }

      if (value.toString() == "") {
        list[index]["section"] = value;
        list[index]["issection"] = true;
        setState((prevState) => ({
          ...prevState,
          issectionData: false,
        }));
      } else {
        list[index]["section"] = parseInt(value);
        list[index]["issection"] = false;
        setState((prevState) => ({
          ...prevState,
          issectionData: true,
        }));
      }
      setInputList(list);
      setState((prevState) => ({
        ...prevState,
        inputList1: list,
      }));
    }
  };

  const handleSectionInputSectionorderChange = (e, index) => {
    if (e.target.name) {
      const { value } = e.target;
      const list = [...sectioninputList];
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
      if (value != "") {
        list[index]["sectionOrder"] = value;
        list[index]["issectionvalue"] = false;
        setState((prevState) => ({
          ...prevState,
          issectionvalueData: true,
        }));
      } else if (value == "") {
        list[index]["sectionOrder"] = value;
        list[index]["issectionvalue"] = true;
        setState((prevState) => ({
          ...prevState,
          issectionvalueData: false,
        }));
      }
      setsectionInputList(list);
      setState((prevState) => ({
        ...prevState,
        sectioninputList: list,
      }));
    }
  };

  const handleFeatureInputCategoryChange = (e, index) => {
    if (e.target.name) {
      const { value } = e.target;
      const list = [...featureinputList];
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
      if (value === "") {
        list[index]["categoryId"] = value;
        list[index]["iscategoryid"] = true;
        setState((prevState) => ({
          ...prevState,
          iscategoryidData: false,
        }));
      } else if (value != "") {
        list[index]["categoryId"] = value;
        list[index]["iscategoryid"] = false;
        setState((prevState) => ({
          ...prevState,
          iscategoryidData: true,
        }));
      }
      setfeatureinputList(list);
      setState((prevState) => ({
        ...prevState,
        featureinputList: list,
      }));
    }
  };

  const handleInputChange = (e, index) => {
    if (e.target.name) {
      const { checked } = e.target;
      const list = [...inputList1];
      if (typeof list[index] === "undefined") {
        list.push({ fieldId: 0, isMandatory: 0, isPreQuote: 0, section: "" });
      }

      list[index]["isMandatory"] = checked ? 1 : 0;
      setInputList(list);
      setState((prevState) => ({
        ...prevState,
        inputList1: list,
      }));
    }
  };

  const handleInputChangeisPreQuote = (e, index) => {
    if (e.target.name) {
      const { checked } = e.target;
      const list = [...inputList1];
      if (typeof list[index] === "undefined") {
        list.push({
          fieldId: 0,
          isMandatory: 0,
          isPreQuote: 0,
          section: "",
          isfieldId: false,
          issection: false,
        });
      }

      list[index]["isPreQuote"] = checked ? 1 : 0;
      setInputList(list);
      setState((prevState) => ({
        ...prevState,
        inputList1: list,
      }));
    }
  };

  const handleSectionInputChangeisPreQuote = (e, index) => {
    if (e.target.name) {
      const { checked } = e.target;
      const list = [...sectioninputList];
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

      list[index]["isPreQuote"] = checked ? 1 : 0;
      setsectionInputList(list);
      setState((prevState) => ({
        ...prevState,
        sectioninputList: list,
      }));
    }
  };

  const handleFieldNameInputChange = (e, value, index) => {
    const list = [...state.inputList1];
    if (typeof list[index] === "undefined") {
      list.push({
        fieldId: 0,
        isMandatory: 0,
        isPreQuote: 0,
        section: "",
        isfieldId: false,
        issection: false,
      });
    }
    if (value === null) {
      list[index]["FieldId"] = "";
      list[index]["isfieldId"] = false;

      setState((prevState) => ({
        ...prevState,
        isfieldIdData: false,
        inputList1: list,
      }));
    } else {
      //debugger
      const allData = [...state.allData];
      let selectedFieldInfo =
        (allData || []).filter((obj) => {
          if (obj.name === value) return true;
          return false;
        })[0] || {};
      if (selectedFieldInfo && selectedFieldInfo.id) {
        //debugger
        list[index]["FieldId"] = selectedFieldInfo.id;
        list[index]["isfieldId"] = true;
        setInputList(list);
        setState((prevState) => ({
          ...prevState,
          inputList1: list,
          isfieldIdData: true,
        }));
      }
    }
  };

  const handleSectionNameInputChange = (e, value, index) => {
    let inputtagvalue = e.target.value;
    const list = [...sectioninputList];
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
    if (inputtagvalue) {
      list[index]["id"] = index + 1;
      list[index]["name"] = inputtagvalue;
      list[index]["status"] = state.addCode;
      list[index]["isnamevalue"] = false;
      setState((prevState) => ({
        ...prevState,
        issectionnamevalueData: true,
      }));
    } else if (!inputtagvalue) {
      list[index]["id"] = index + 1;
      list[index]["name"] = "";
      list[index]["status"] = state.addCode;
      list[index]["isnamevalue"] = true;
      setState((prevState) => ({
        ...prevState,
        issectionnamevalueData: false,
      }));
    }

    setsectionInputList(list);
    setState((prevState) => ({
      ...prevState,
      sectioninputList: list,
    }));
  };

  const handleFeatureNameInputChange = (e, value, index) => {
    let inputtagvalue = e.target.value;
    const list = [...featureinputList];
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
    if (inputtagvalue) {
      list[index]["name"] = inputtagvalue;
      list[index]["status"] = state.addCode;
      list[index]["isnamevalue"] = false;
      setState((prevState) => ({
        ...prevState,
        isnamevalueData: true,
      }));
    } else if (!inputtagvalue) {
      list[index]["name"] = "";
      list[index]["status"] = state.addCode;
      list[index]["isnamevalue"] = true;
      setState((prevState) => ({
        ...prevState,
        isnamevalueData: false,
      }));
    }

    setfeatureinputList(list);
    setState((prevState) => ({
      ...prevState,
      featureinputList: list,
    }));
  };

  const handleFeatureKeyInputChange = (e, value, index) => {
    let inputtagvalue = e.target.value;
    const list = [...featureinputList];
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

    if (inputtagvalue) {
      list[index]["key"] = inputtagvalue;
      list[index]["iskeyvalue"] = false;
      //isnamevalueData: true;
      setState((prevState) => ({
        ...prevState,
        iskeyvalueData: true,
      }));
    } else if (!inputtagvalue) {
      list[index]["key"] = "";
      list[index]["iskeyvalue"] = true;
      //isnamevalueData: false;
      setState((prevState) => ({
        ...prevState,
        iskeyvalueData: false,
      }));
    }

    setfeatureinputList(list);
    setState((prevState) => ({
      ...prevState,
      featureinputList: list,
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
        duplicatestatusData: false,
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
              duplicatestatusData: true,
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
          duplicatestatusData: true,
        }));
      }
    }
  };

  const handleRemoveClick = (index) => {
    const list = [...state.inputList1];
    list.splice(index, 1);
    setState((prevState) => ({
      ...prevState,
      inputList1: list,
    }));
  };

  const handleSectionRemoveClick = (index) => {
    const list = [...state.sectioninputList];
    list.splice(index, 1);
    setState((prevState) => ({
      ...prevState,
      sectioninputList: list,
    }));
  };

  const handleFeatureRemoveClick = (index) => {
    const list = [...state.featureinputList];
    list.splice(index, 1);
    setState((prevState) => ({
      ...prevState,
      featureinputList: list,
    }));
  };

  const handleAddClick = () => {
    setState((prevState) => ({
      ...prevState,
      inputList1: [
        ...state.inputList1,
        {
          FieldId: 0,
          isMandatory: 0,
          isPreQuote: 0,
          section: "",
          isfieldId: false,
          issection: false,
        },
      ],
      isfieldIdData: false,
      issectionData: false,
    }));
  };

  const handlesectionAddClick = () => {
    setState((prevState) => ({
      ...prevState,
      sectioninputList: [
        ...state.sectioninputList,
        {
          id: 0,
          name: "",
          isPreQuote: 0,
          sectionOrder: "",
          status: "",
          isnamevalue: false,
          issectionvalue: false,
        },
      ],
      issectionnamevalueData: false,
      issectionvalueData: false,
    }));
  };

  const handlefeatureAddClick = () => {
    setState((prevState) => ({
      ...prevState,
      featureinputList: [
        ...state.featureinputList,
        {
          name: "",
          key: "",
          categoryId: "",
          status: "",
          duplicatestatus: false,
          isnamevalue: false,
          iskeyvalue: false,
          iscategoryid: false,
        },
      ],
      duplicatestatusData: false,
      isnamevalueData: false,
      iskeyvalueData: false,
      iscategoryidData: false,
    }));
  };

  const [categorias, setCategorias] = useState([]);
  const [, setcategoryNameList] = useState([]);
  const [subCategorias, setsubCategorias] = useState([]);

  useEffect(() => {
    getCategorias();
  }, []);

  const getCategorias = async () => {
    const result = await apigetUrl(
      `/insurance/core-data?page=1&limit=1000&typeId=10`
    );
    if (result.data.responseCode === "200") {
      const response = result.data.dataList;
       setCategorias(response);
        setState((prevState) => ({
          ...prevState,
          categorias: response,
        }));
    }  else {
      console.log(result.data.responseMessage);
    }
  };

  // const getCategorias =  () => {

  //   // const res = await fetch(
  //   //   baseURL + "/insurance/core-data?page=1&limit=1000&typeId=10"
  //   // );
  //   axios
  //    .get( baseURL + "/insurance/core-data?page=1&limit=1000&typeId=10", apiInstance)
  //    .then((res) => {
  //      ////////////debugger
  //   const response = res.data.dataList;
  //   setCategorias(response);
  //   setState((prevState) => ({
  //      ...prevState,
  //     categorias:response,
  //   }));
  //    })
  //   .catch((err) => {
  //     console.log("Error", err.response);
  //     // setState((prevState) => ({
  //     //   ...prevState,
  //     //   formDialogOpen: false,
  //     //   isErrorAlert: true,
  //     //   errorMsg: err.response.data.responseMessage,
  //     // }));
  //   });
  // };

  const retractCurrentTabOpenAccordians = () => {
    // console.log("state.expanded = ", state.expansionPanelOpen);
  };

  const handleTabChange = (event, value) => {
    retractCurrentTabOpenAccordians(state.tabValue);

    setState((prevState) => ({
      ...prevState,
      tabValue: value,
    }));
    //callTabData(value);
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

  return (
    <div className="row">
      <CardBox styleName="col-md-12">
        <div className="cardBox">
          <div className="row">
            <div className="col-lg-4">
              <InputField
                required
                className="mb-3"
                autoFocus
                id="name"
                label={
                  <IntlMessages id="product.master.modal.add.felid.Name" />
                }
                name="name"
                error={state.errors.name}
                onChange={(e) => handleAddFormChange(e)}
                helperText={state.errors.name}
                value={state.validation.name}
                fullWidth
              />
            </div>
            <div className="col-lg-4">
              <InputField
                autoFocus
                className="mb-3"
                id="description"
                label={
                  <IntlMessages id="product.master.modal.add.felid.Description" />
                }
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
              <FormControl variant="outlined" className="w-100 mb-3">
                <InputLabel id="insuranceCategorias">Category</InputLabel>
                <InputSelect
                  labelId="insuranceCategorias"
                  id="insuranceCategorias"
                  label={
                    <IntlMessages id="product.master.modal.add.felid.InsuranceCategorias" />
                  }
                  name="insuranceCategorias"
                  value={state.categoryId || ""}
                  onChange={(e) => handleIsEnabledChange(e)}
                >
                  <MenuItem value="" disabled>
                    <em>Select</em>
                  </MenuItem>
                  {categorias &&
                    categorias.map((categorias) => (
                      <MenuItem
                        value={categorias.id}
                        id={categorias.id}
                        key={categorias.id}
                      >
                        {categorias.name}
                      </MenuItem>
                    ))}
                </InputSelect>
              </FormControl>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4">
              <FormControl variant="outlined" className="w-100 mb-3">
                <InputLabel id="subCategoryId">Sub Category</InputLabel>
                <InputSelect
                  labelId="subCategoryId"
                  id="subCategoryId"
                  label={
                    <IntlMessages id="product.master.modal.add.felid.SubCategoryId" />
                  }
                  name="subCategoryId"
                  required
                  error={state.errors.subCategoryId}
                  onChange={handleAddFormChange}
                  helperText={state.errors.subCategoryId}
                  fullWidth
                  value={state.validation.subCategoryId || ""}
                >
                  <MenuItem value="">
                    <em>Select</em>
                  </MenuItem>
                  {subCategorias &&
                    subCategorias.map((n) => (
                      <MenuItem name="subCategoryId" key={n.value} value={n.id}>
                        {n.name}
                      </MenuItem>
                    ))}
                </InputSelect>
              </FormControl>
            </div>
            <div className="col-lg-4 mb-2">
              <FormControl variant="outlined" className="w-100 mb-3">
                <InputLabel id="productTypeId">Product Type</InputLabel>
                <InputSelect
                  labelId="productTypeId"
                  id="productTypeId"
                  label={
                    <IntlMessages id="product.master.modal.add.felid.ProductTypeId" />
                  }
                  name="productTypeId"
                  required
                  error={state.errors.productTypeId}
                  onChange={(e) => handleAddFormChange(e)}
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
              <FormControl variant="outlined" fullWidth error={false}>
                <InputLabel id="isComparisonEnabled">
                  Comparison Enabled?
                </InputLabel>
                <InputSelect
                  className="mb-3"
                  fullWidth
                  label={
                    <IntlMessages id="product.master.modal.add.felid.IsComparisonEnabled" />
                  }
                  name="isComparisonEnabled"
                  labelId="IsComparisonEnabled"
                  id="isComparisonEnabled"
                  required
                  onChange={(e) => handleAddFormChange(e)}
                  helperText={state.errors.isComparisonEnabled}
                  value={state.validation.isComparisonEnabled || ""}
                  renderValue={(value) => `${value}`}
                >
                  <MenuItem value="">
                    <em>Select</em>
                  </MenuItem>
                  <MenuItem value={"Yes"}>Yes</MenuItem>
                  <MenuItem value={"No"}>No</MenuItem>
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
                {state.inputList1.map((x, i) => {
                  return (
                    <div className="row px-4 py-1 mb-1" key={i}>
                      <div className="col-lg-3">
                        {x.isfieldId === true ? (
                          <>
                            <InputAutocomplete
                              error
                              id="FieldId"
                              name="FieldId"
                              onChange={(e, value) =>
                                handleFieldNameInputChange(e, value, i)
                              }
                              options={state.allData.map((n) => n.name) || ""}
                              // value={x.productName}
                              value={getSelectedItem(x.FieldId)||""}
                              renderInput={(params) => (
                                <TextField {...params} variant="outlined" />
                              )}
                            />
                          </>
                        ) : (
                          <>
                            <InputAutocomplete
                              id="FieldId"
                              name="FieldId"
                              onChange={(e, value) =>
                                handleFieldNameInputChange(e, value, i)
                              }
                              options={state.allData.map((n) => n.name) || ""}
                              // value={x.productName}
                              value={getSelectedItem(x.FieldId)||""}
                              renderInput={(params) => (
                                <TextField {...params} />
                              )}
                              variant="outlined"
                              renderInput={(params) => (
                                <TextField
                                  required
                                  error
                                  {...params}
                                  // error={state.errors.categoryId}
                                  helperText="Feild Name is Required!"
                                  variant="outlined"
                                />
                              )}
                            />
                          </>
                        )}
                      </div>
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
                                {state.sectioninputList.map((n, i) => (
                                  <MenuItem value={n.id} key={i}>
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
                                {state.sectioninputList.map((n, i) => (
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
                        {state.inputList1.length - 1 === i && (
                          <AddCircleOutlineIcon
                            style={{
                              cursor: "pointer",
                              marginRight: "10px",
                            }}
                            onClick={handleAddClick}
                          />
                        )}
                        {state.inputList1.length !== 1 && (
                          <RemoveCircleOutlineIcon
                            style={{ cursor: "pointer" }}
                            onClick={() => handleRemoveClick(i)}
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
                  ////debugger
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
                            onClick={() => handleSectionRemoveClick(i)}
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
                  //alert(i)
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
                              id={"name_" + i}
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
                              //helperText="Duplicate key!"
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
                                id="categoryId"
                                required
                                helpertext={state.errors.section}
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
                                id="categoryId"
                                required
                                helpertext={state.errors.section}
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
                            onClick={() => handleFeatureRemoveClick(i)}
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
            <InputCancelButton onClick={(e) => handleAddDataRequestClose(e)} />
            <InputSubmitButton
              onClick={(e) => handleAddFormDataSubmit(e)}
              disabled={!state.isAddFormSubmitDisabled}
            />
          </div>
        </div>
      </CardBox>
    </div>
  );
};

export default AddProductMaster;
