import React, { useState, useEffect } from "react";
import "./root.component.css";
import axios from "axios";
import { Button } from "@material-ui/core";
import EnhancedTableHead from "../CommonComponents/TableHeadComponent";
import IntlMessages from "util/IntlMessages";
import Grid from "@material-ui/core/Grid";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TablePaginationComponent from "../CommonComponents/TablePaginationComponent";
import Tooltip from "@material-ui/core/Tooltip";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import { Alert } from "@material-ui/lab";
import InfoModal from "../Modal/Info";
import SuccessModal from "../Modal/Success";
import ErrorModal from "../Modal/Error";
import EnhancedTableToolbar from "./EnhancedTableToolbar";
import Joi from "joi-browser";
import AddProductMaster from "./AddProductMaster";
import EditProductMaster from "./EditProductMaster";
import {
  IPPNotification,
  ippNotify,
} from "../CommonComponents/IPPNotification";
import { getRecordsPerPage } from "../../../../../setup/ApplicatoinConfigurations.js";
import "../CommonComponents/tableStyle.css";
import {
  apigetUrl,
  apipostUrl,
  apiputUrl,
  apideleteUrl,
} from "../../../../../setup/middleware";
import AuditTimeline from "../CommonComponents/AuditTimeline/AuditTimeline";
import { Visibility } from "@material-ui/icons";
import { async } from "q";
import Loader from "../CommonComponents/Loader";
import { useDispatch, useSelector } from "react-redux";
import {verifyToken} from "../../../../../actions/Auth";

const baseURL = `${process.env.REACT_APP_BASE_URL}`;
const perPageURL = `/insurance/products`;

const pageURL = new URL(baseURL + perPageURL);

let apiCallParams = new URLSearchParams(pageURL.search);

let pageNumber = 1;

const api = axios.create({
  baseURL: baseURL,
});

const advancedSearchValidationSchema = {
  SubCategoryType: Joi.string()
    .required()
    .label("SubCategoryType"),
  ProductType: Joi.string()
    .required()
    .label("ProductType"),
  name: Joi.string()
    .required()
    .label("Name"),
};

function App() {

  const dispatch = useDispatch();

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

  const setCurrentUrl = (currentUrl) => {
    setState((prevState) => ({ ...prevState, currentUrl }));
  };

  const [iserror] = useState(false);
  const [errorMessages] = useState([]);

  const [state, setState] = useState({
    name: "",
    createdBy: "",
    subCategoryIp: "",
    createdDate: "",
    modifiedName: "",
    modifiedDate: "",
    order: "asc",
    orderBy: "name",
    sortType: "asc",
    sortBy: "name",
    isLoading: true,
    selected: [],
    page: 1,
    rowsPerPage: 5,
    data: [],
    data1: [],
    categoryOptions: [],
    categoryOptionsValues: [],
    CatData: [],
    formDialogOpen: false,
    isInfoAlert: false,
    infoMsg: "",
    selectedEditId: "",
    selectedDeleteId: "",
    isNoTableDataAlertVisible: true,
    isEditForm_NameError: false,
    isEditForm_DescriptionError: false,
    selected_EditForm_Name_Value: "",
    selected_EditForm_isComparisonEnabled_Value: "",
    selected_EditForm_isMandatory_Value: false,
    selected_EditForm_Description_Value: "",
    selected_EditForm_RowVersion_Value: 1,
    selected_EditForm_isDeleted_Value: 1,
    selected_EditForm_InputFields_Value: [],
    searchValidation: {
      name: "",
      categoryId: "",
    },
    validation: {
      name: "",
      description: "",
      /* insuranceCategorias: "", */
      subCategoryId: "",
      productTypeId: "",
      isComparisonEnabled: "",
    },
    selectedId: 0,
    errors: {},
    isSortAsc: true,
    from: 1,
    to: 0,
    pageCount: 0,
    limit: getRecordsPerPage(),
    deleteFormDialogOpen: false,
    isSuccessAlert: false,
    successMsg: "",
    isErrorAlert: false,
    errorMsg: "",
    isActiveSearch: false,
    searchActive: false,
    isAdvancedSearchValidationText: false,
    categoryData: [],
    productTypeData: [],
    categoryName: "",
    catID: "",
    productID: "",
    advancedSearchValidation: {
      name: "",
      SubCategoryType: "",
      ProductType: "",
    },
    advancedSearchValidationErrors: {},
    handleAutoCompleteInputReset: false,
    isProductMasterEdit: false,
    isAddProductActive: false,
    isEditProductActive: false,
    isAuditTimelineActive: false,
    eventId: "",
    referenceId: "",
    auditEventId: "",
    headCells: [
      {
        id: "name",
        isActive: true,
        label: "product.master.tableheader.Name.label",
      },
      {
        id: "description",
        isActive: false,
        label: "product.master.tableheader.Description.label",
      },
      {
        id: "subCategory",
        isActive: false,
        label: "product.master.tableheader.SubCategory.label",
      },
      {
        id: "productType",
        isActive: false,
        label: "product.master.tableheader.ProductType.label",
      },

      {
        id: "actions",
        isActive: false,
        label: "product.master.tableheader.Actions.label",
      },
    ],
  });

  const showLoader = () => {
    setTimeout(() => {
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
      }));
    }, 1000);
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

  const showApiData = () => {
    // console.log("apidata = ", apiData);
  };

  const callLocalBaseURL = async () => {
    
    const result = await apigetUrl(
      `/insurance/products?page=${state.page}&limit=${state.limit}`
    );
    if (result.data.responseCode === "200") {
      setTimeout(() => {
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

  useEffect(() => {
    apiCallParams.set("page", state.page);
    apiCallParams.set("limit", state.limit);
    apiCallParams.set("sortBy", state.sortBy);
    apiCallParams.set("sortType", state.sortType);
    pageURL.search = apiCallParams.toString();
    setCurrentUrl(pageURL);
    callLocalBaseURL();
  }, []);

  const requestSortData = async (sortBy, sortType) => {
    const subCategoryId = state.catID;
    const productTypeId = state.productID;
const {name} = state.advancedSearchValidation;
	    let tempArr = [];
    if (!isEmpty(name)) tempArr.push({ name });
    if (!isEmpty(subCategoryId)) tempArr.push({ subCategoryId });
    if (!isEmpty(productTypeId)) tempArr.push({ productTypeId });

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

    const result = await apigetUrl(`/insurance/products?`+searchParam);
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

  const isSelectedFunc = (id) => {
    return state.selected.indexOf(id) !== -1;
  };

  const onTableDeleteButtonClick = (event) => {
    setState((prevState) => ({
      ...prevState,
      selectedDeleteId: event.currentTarget.id,
      deleteFormDialogOpen: true,
    }));
  };

  const onTableEditButtonClick = async (event, id) => {
    setState((prevState) => ({
      ...prevState,
      isEditProductActive: true,
      selectedId: id,
    }));
  };

  const onInsuranceProducts_DeleteConfirm = async () => {
    const result = await apideleteUrl(
      `/insurance/products/` + state.selectedDeleteId
    );
    if (result.status === 200) {
     
      ippNotify.success("Successfully deleted");
      setState((prevState) => ({
        ...prevState,
        formDialogOpen: false,
        isSuccessAlert: true,
        deleteFormDialogOpen: false,
        isLoading: true,
      }));
      callLocalBaseURL();
    } else {
      if(result.status===401||result.status===402){
        dispatch(verifyToken())
      }
	  else{
      ippNotify.error("Failed to Delete");
      setState((prevState) => ({
        ...prevState,
        formDialogOpen: false,
        isErrorAlert: true,
        isLoading: false,
      }));
	  }
    }
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

  const handleDeleteDialogClose = () => {
    setState((prevState) => ({
      ...prevState,
      deleteFormDialogOpen: false,
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

  function isObjEmpty(obj) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }

    return JSON.stringify(obj) === JSON.stringify({});
  }

  const isEmpty = (str) => {
    return !str || 0 === str.length;
  };

  const onAdvancedSearchClickClean = () => {
    setState((prevState) => ({
      ...prevState,
      advancedSearchValidation: {
        name: "",
        SubCategoryType: "",
        ProductType: "",
      },
      advancedSearchValidationErrors: {},
      isAdvancedSearchValidationText: false,
    }));
  };

  useEffect(() => {
    getCategoriesName();
    getProductTypeName();
  }, []);

  const getCategoriesName = async () => {
    const result = await apigetUrl(
      `/insurance/sub-categories?page=${state.page}&limit=1000`
    );
    if (result.data.responseCode === "200") {
      const response = result.data.dataList;
      setState((prevState) => ({
        ...prevState,
        categoryData: response,
      }));
    }
  };

  const getProductTypeName = async () => {
    const result = await apigetUrl(
      `/insurance/product-types?page=${state.page}&limit=${state.limit}&typeId=10`
    );
    if (result.data.responseCode === "200") {
      const response = result.data.dataList;
      setState((prevState) => ({
        ...prevState,
        productTypeData: response,
      }));
    }
  };

  const [categoryValue] = useState(null);

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
      propertySchema = { [name]: advancedSearchValidationSchema[name] };
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
    if (autoCompleteValue) {
      if (ref.current.getAttribute("name") === "SubCategoryType") {
        setState((prevState) => ({
          ...prevState,
          catID: autoCompleteValue.id,
        }));
      }
    } else {
      setState((prevState) => ({
        ...prevState,
        catID: "",
      }));
    }

    if (autoCompleteValue) {
      if (ref.current.getAttribute("name") === "ProductType") {
        setState((prevState) => ({
          ...prevState,
          productID: autoCompleteValue.id,
        }));
      }
    } else {
      setState((prevState) => ({
        ...prevState,
        productID: "",
      }));
    }

    let isAnyFormFieldsPopulated = false;
    isAnyFormFieldsPopulated =
      validation.ProductType !== null ||
      validation.SubCategoryType !== null ||
      validation.name !== "";

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

  // const handleAdvancedSearchOnChange = (event, autoCompleteValue, ref) => {
  //   console.log(autoCompleteValue)
  //   debugger
  //   const { target: input } = event;
  //   const errors = { ...state.advancedSearchValidationErrors };
  //   const validation = { ...state.advancedSearchValidation };
  //   if (ref) {
  //     const errorMessage = advanceSearchValidateProperty(
  //       input,
  //       autoCompleteValue,
  //       ref
  //     );

  //     if (errorMessage) errors[ref.current.getAttribute("name")] = errorMessage;
  //     else delete errors[ref.current.getAttribute("name")];

  //     autoCompleteValue
  //       ? (validation[ref.current.getAttribute("name")] =
  //           autoCompleteValue.name)
  //       : (validation[ref.current.getAttribute("name")] = autoCompleteValue);
  //   } else {
  //     const errorMessage = advanceSearchValidateProperty(input);
  //     if (errorMessage) errors[input.name] = errorMessage;
  //     else delete errors[input.name];
  //     validation[input.name] = input.value;
  //   }
  //   if (autoCompleteValue) {
  //     debugger
  //     if (ref.current.getAttribute("name") === "SubCategoryType") {
  //       debugger
  //       //const getsubcatid = getSubcatorgyItem(autoCompleteValue)
  //      const getsubcatid = state.categoryData.find(n=>n.name===autoCompleteValue)
  //       setState((prevState) => ({
  //         ...prevState,
  //         catID:  (getsubcatid || {}).categoryId ,
  //       }));
  //     }
  //   } else {
  //     setState((prevState) => ({
  //       ...prevState,
  //       catID: "",
  //     }));
  //   }

  //   if (autoCompleteValue) {
  //     debugger
  //     if (ref.current.getAttribute("name") === "ProductType") {
  //       debugger
  //       const getproductid = state.productTypeData.find(n=>n.name===autoCompleteValue)
  //       setState((prevState) => ({
  //         ...prevState,
  //         productID: (getproductid||{}).id,
  //       }));
  //     }
  //   } else {
  //     setState((prevState) => ({
  //       ...prevState,
  //       productID: "",
  //     }));
  //   }

  //   let isAnyFormFieldsPopulated = false;
  //   isAnyFormFieldsPopulated =
  //     validation.ProductType !== null ||
  //     validation.SubCategoryType !== null ||
  //     validation.name !== "";

  //   if (isAnyFormFieldsPopulated && isObjEmpty(errors)) {
  //     setState((prevState) => ({
  //       ...prevState,
  //       advancedSearchValidation: validation,
  //       advancedSearchValidationErrors: errors,
  //       isAdvancedSearchValidationText: false,
  //     }));
  //   } else if (!isAnyFormFieldsPopulated && !isObjEmpty(errors)) {
  //     setState((prevState) => ({
  //       ...prevState,
  //       advancedSearchValidation: validation,
  //       advancedSearchValidationErrors: errors,
  //       isAdvancedSearchValidationText: false,
  //     }));
  //   } else if (isAnyFormFieldsPopulated && !isObjEmpty(errors)) {
  //     setState((prevState) => ({
  //       ...prevState,
  //       advancedSearchValidation: validation,
  //       advancedSearchValidationErrors: errors,
  //       isAdvancedSearchValidationText: false,
  //     }));
  //   } else {
  //     setState((prevState) => ({
  //       ...prevState,
  //       advancedSearchValidation: validation,
  //       advancedSearchValidationErrors: errors,
  //       isAdvancedSearchValidationText: true,
  //     }));
  //   }
  // };

  const categoryReset = () => {
    // setCatgoryValue("");
    setState((prevState) => ({
      ...prevState,
      advancedSearchValidation: {
        SubCategoryType: "",
      },
      isInfoAlert: false,
      handleAutoCompleteInputReset: !state.handleAutoCompleteInputReset,
    }));
  };

  const productTypeReset = () => {
    // setCatgoryValue("");
    setState((prevState) => ({
      ...prevState,
      advancedSearchValidation: {
        ProductType: "",
      },
      isInfoAlert: false,
      handleAutoCompleteInputReset: !state.handleAutoCompleteInputReset,
    }));
  };

  const handleApplyClick = (e) => {
    apiCallParams.delete("name");
    apiCallParams.delete("subCategoryId");
    apiCallParams.delete("productTypeId");
    e.preventDefault();
    const subCategoryId = state.catID;
    const productTypeId = state.productID;
    const {
      SubCategoryType,
      ProductType,
      name,
    } = state.advancedSearchValidation;

    //validation
    if (name === "" && SubCategoryType === "" && ProductType === "") {
      setState((prevState) => ({
        ...prevState,
        isAdvancedSearchValidationText: true,
      }));
      return;
    } else if (name === "" || SubCategoryType === "" || ProductType === "") {
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
    if (!isEmpty(subCategoryId)) tempArr.push({ subCategoryId });
    if (!isEmpty(productTypeId)) tempArr.push({ productTypeId });

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

  const getPageFromBackEnd = async (pageNumber, limit,temp_from,temp_to,pageCount,actionType) => {
    const subCategoryId = state.catID;
    const productTypeId = state.productID;
    const {name} = state.advancedSearchValidation;
 if (!isEmpty(name)){}else{ apiCallParams.delete("name");}
    if (!isEmpty(subCategoryId)){}else{ apiCallParams.delete("subCategoryId");}
    if (!isEmpty(productTypeId)){}else{apiCallParams.delete("productTypeId");}
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
    console.log(searchURL);
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    const result = await apigetUrl(`/insurance/products?` + searchURL);
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
        isLoading: false,
        isInfoAlert: true,
        infoMsg: "Your query did not match any results",
        to: 0,
        pageCount: 0,
      }));
	  }
      
    }
  };

  const nameReset = async () => {
    apiCallParams.set("page", 1);
    apiCallParams.set("limit", state.limit);
    apiCallParams.set("sortBy", state.sortBy);
    apiCallParams.set("sortType", state.sortType);
    apiCallParams.delete("name");

    pageURL.search = apiCallParams.toString();

    const res = await axios.get(pageURL.href);

    const result = await apigetUrl(
      `/insurance/products?page=${1}&limit=${state.limit}&sortBy=${
        state.sortBy
      }&sortType=${state.sortType}`
    );
    if (result.data.responseCode === "200") {
      setState((prevState) => ({
        ...prevState,
        advancedSearchValidation: {
          name: "",
        },
        isInfoAlert: false,
      }));
      setResetData(result.data.dataList);
      setPageNumber(result.data.pagination.page);
      setPageCount(result.data.pagination.count);
      setCurrentUrl(pageURL);
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
    apiCallParams.delete("subCategoryId");
    apiCallParams.delete("productTypeId");

    pageURL.search = apiCallParams.toString();

    const result = await apigetUrl(
      `/insurance/products?page=${state.page}&limit=${state.limit}&sortBy=${state.sortBy}&sortType=${state.sortType}`
    );
    if (result.data.responseCode === "200") {
      setTimeout(() => {
      setState((prevState) => ({
        ...prevState,
        advancedSearchValidation: {
          name: "",
          SubCategoryType: "",
          ProductType: "",
        },
        advancedSearchValidationErrors: {},
        isInfoAlert: false,
        isAdvancedSearchValidationText: false,
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

  const getSuccessUpdate = () => {
    setState((prevState) => ({
      ...prevState,
      // addFormDialogOpen: false,
      isLoading: true,
      isAddFormSubmitDisabled: false,
    }));
   
    ippNotify.success("Successfully New Data is Added");
    
  };

  const getErrorUpdate = () => {
    ippNotify.error("Failed To Add New Data");
  };

  const getEditSuccessUpdate = () => {
    setState((prevState) => ({
      ...prevState,
      // addFormDialogOpen: false,
      isAddFormSubmitDisabled: false,
      isLoading: true,
    }));
    ippNotify.success("Successfully Updated");
  
  };

  const getEditErrorUpdate = () => {
    ippNotify.error("Failed To Update Data");
  };

  const closeAddProduct = () => {
    setState((prevState) => ({
      ...prevState,
      isAddProductActive: false,
    }));
  };

  const onAddButtonClick = () => {
    setState((prevState) => ({
      ...prevState,
      isAddProductActive: true,
    }));
  };

  const closeEditProduct = () => {
    setState((prevState) => ({
      ...prevState,
      isEditProductActive: false,
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
    <React.Fragment>
      {state.isAuditTimelineActive ? (
        <AuditTimeline
          closeAuditTimeline={handleCloseAuditTimeline}
          eventId={state.eventId}
          referenceId={state.referenceId}
        />
      ) : state.isAddProductActive === true ? (
        <div>
          <AddProductMaster
            getSuccessUpdate={getSuccessUpdate}
            getErrorUpdate={getErrorUpdate}
            closeAddProduct={closeAddProduct}
            callLocalBaseURL={callLocalBaseURL}
          />
        </div>
      ) : state.isEditProductActive === true ? (
        <div>
          <EditProductMaster
            getEditSuccessUpdate={getEditSuccessUpdate}
            getEditErrorUpdate={getEditErrorUpdate}
            closeEditProduct={closeEditProduct}
            callLocalBaseURL={callLocalBaseURL}
            selectedId={state.selectedId}
          />
        </div>
      ) : (
        <div className="App">
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
                <IntlMessages id="product.master.modal.deleteconfrimation.message" />
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteDialogClose} color="primary">
                <IntlMessages id="ipp.common.Cancel.button" />
              </Button>
              <Button
                onClick={onInsuranceProducts_DeleteConfirm}
                color="secondary"
                autoFocus
              >
                <IntlMessages id="ipp.common.Delete.button" />
              </Button>
            </DialogActions>
          </Dialog>

          <Grid container spacing={1}>
            <Grid item xs={12}>
              <div>
                {iserror && (
                  <Alert severity="error">
                    {errorMessages.map((msg, i) => {
                      return <div key={i}>{msg}</div>;
                    })}
                  </Alert>
                )}
              </div>
              <div className="row">
                <div className="col-lg-4"></div>
                <div className="col-lg-4"></div>
                <div className="col-lg-4">
                  <IPPNotification />
                </div>
              </div>
              <div className="audit-master-box">
                <EnhancedTableToolbar
                  page={state.page}
                  pageCount={state.pageCount}
                  limit={state.limit}
                  to={state.limit}
                  rowsPerPage={state.rowsPerPage}
                  setAdvancedSearchData={setAdvancedSearchData}
                  setResetData={setResetData}
                  data={state.data}
                  data1={state.data1}
                  categoryOptions={state.categoryOptions}
                  numSelected={state.selected.length}
                  successMessage={state.isSuccessAlert}
                  isActiveSearch={state.isActiveSearch}
                  handleApplyClick={handleApplyClick}
                  callResetData={callResetData}
                  callLocalBaseURL={callLocalBaseURL}
                  nameError={state.errors.name}
                  codeError={state.errors.code}
                  searchValidation={state.searchValidation}
                  /* handleInputChange={handleInputChange} */
                  isAdvancedSearchValidationText={
                    state.isAdvancedSearchValidationText
                  }
                  advancedSearchValidationErrors={
                    state.advancedSearchValidationErrors
                  }
                  categoryData={state.categoryData}
                  productTypeData={state.productTypeData}
                  categoryName={state.categoryName}
                  catID={state.catID}
                  productID={state.productID}
                  categoryValue={categoryValue}
                  categoryReset={categoryReset}
                  productTypeReset={productTypeReset}
                  onAdvancedSearchClickClean={onAdvancedSearchClickClean}
                  handleAutoCompleteInputReset={
                    state.handleAutoCompleteInputReset
                  }
                  handleAdvancedSearchOnChange={handleAdvancedSearchOnChange}
                  name={state.advancedSearchValidation.name}
                  nameReset={nameReset}
                  getErrorUpdate={getErrorUpdate}
                  getSuccessUpdate={getSuccessUpdate}
                  onAddButtonClick={onAddButtonClick}
                />

                <div className="flex-auto">
                  <div className="table-responsive-material">
                    <Table>
                      <EnhancedTableHead
                        numSelected={state.selected.length}
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
                                <TableCell>{n.subCategoryName}</TableCell>
                                <TableCell value={n.productTypeId}>
                                  {n.productTypeName}
                                </TableCell>
                                <TableCell padding="none">
                                  <Tooltip title={<IntlMessages id="ProductMaster.Tooltip.Edit" />}>
                                    <IconButton
                                      id={n.id}
                                      onClick={(e) =>
                                        onTableEditButtonClick(e, n.id)
                                      }
                                    >
                                      <EditIcon color="primary" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title={<IntlMessages id="ProductMaster.Tooltip.Delete" />}>
                                    <IconButton
                                      style={{ marginLeft: "-10px" }}
                                      id={n.id}
                                      onClick={(e) => onTableDeleteButtonClick(e)}
                                    >
                                      <DeleteIcon color="secondary" />
                                    </IconButton>
                                  </Tooltip>
                                  {state.auditEventId >= 1 ? (
                                    <Tooltip title={<IntlMessages id="ProductMaster.Tooltip.View" />}>
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
    </React.Fragment>
  );
}

export default App;
