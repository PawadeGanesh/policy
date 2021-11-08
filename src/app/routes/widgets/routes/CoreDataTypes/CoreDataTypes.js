import React, { useState, useEffect } from "react";
import { TextField, Button, Tooltip } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import EnhancedTableHead from "../CommonComponents/TableHeadComponent";
import EnhancedTableToolbar from "./EnhancedTableToolbar";
import Dialog from "@material-ui/core/Dialog";
import IntlMessages from "util/IntlMessages";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import "../CommonComponents/tableStyle.css";
import TablePaginationComponent from "../CommonComponents/TablePaginationComponent";
import InfoModal from "../Modal/Info";
import InputLabel from "@material-ui/core/InputLabel";
import { Alert, AlertTitle } from "@material-ui/lab";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import Select from "@material-ui/core/Select";
import "./master.css";
import Joi from "joi-browser";
import DialogContentText from "@material-ui/core/DialogContentText";
import apiInstance from "../../../../../setup/index";
import InputField from "../CommonComponents/TextField";
import InputSubmitButton from "../CommonComponents/SubmitButton";
import InputCancelButton from "../CommonComponents/CancelButton";
import InputSelect from "../CommonComponents/Select";
import { apideleteUrl, apigetUrl, apiputUrl } from "setup/middleware";
import {
  IPPNotification,
  ippNotify,
} from "../CommonComponents/IPPNotification";
import { getRecordsPerPage } from "../../../../../setup/ApplicatoinConfigurations.js";
import AuditTimeline from "../CommonComponents/AuditTimeline/AuditTimeline";
import { Visibility } from "@material-ui/icons";
import Loader from "../CommonComponents/Loader";

const schema = {
  name: Joi.string()
    .required()
    .label("Name"),
  description: Joi.string()
    .optional()
    .label("Description"),
  additionalData: Joi.string()
    .optional()
    .label("Additional Data"),
};

const advancedSearchValidationSchema = {
  name: Joi.string()
    .required()
    .label("Name"),
  description: Joi.string()
    .required()
    .label("Description"),
};

const App = () => {
  const [state, setState] = useState({
    isLoading: false,
    sortType: "asc",
    sortBy: "name",
    page: 1,
    rowsPerPage: 5,
    from: 1,
    to: 0,
    pageCount: 0,
    limit: getRecordsPerPage(),
    isSortAsc: true,
    data: [],
    allData: [],
    moduleData: [],
    coreValue: "",
    coreDataName: "",
    typeId: 0,
    selectedEditId: 0,
    successMsg: "",
    SuccessModal: false,
    errorMsg: "",
    ErrorModal: false,
    formDialogOpen: false,
    isEditFormSubmitDisabled: false,
    isEditable: 0,
    description: "",
    additionalData: "",
    value: "",
    validation: {
      name: "",
    },
    advancedSearchValidation: {
      name: "",
      description: "",
    },
    errors: {},
    advancedSearchValidationErrors: {},
    isAdvancedSearchValidationText: false,
    handleAutoCompleteInputReset: false,
    isCoreActive: false,
    isSearchActive: false,
    deleteFormDialogOpen: false,
    isModuleActive: false,
    dataTypeFormDialogOpen: false,
    isAuditTimelineActive: false,
    eventId: "",
    referenceId: "",
    auditEventId: "",
    headCells: [
      {
        id: "name",
        isActive: true,
        label: "coredata.master.tableheader.Name.label",
      },
      {
        id: "description",
        isActive: false,
        label: "coredata.master.tableheader.Description.label",
      },
      {
        id: "isEditable",
        isActive: false,
        label: "coredata.master.tableheader.IsEditable.label",
      },
      {
        id: "actions",
        isActive: false,
        label: "notificationtempalet.master.tableheader.Actions.label",
      },
    ],
  });

  console.log("CORE_VALUE", state.coreValue);

  const baseURL = `${process.env.REACT_APP_BASE_URL}`;
  const perPageURL = `/${state.coreValue}/core-data?typeId=${state.typeId}`;

  const pageURL = new URL(baseURL + perPageURL);
  console.log("pageURL = ", pageURL);

  let apiCallParams = new URLSearchParams(pageURL.search, apiInstance);
  console.log("apiCallParams = ", apiCallParams);

  let pageNumber = 1;

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

  const handleProductChange = (event) => {
    event.preventDefault();
    console.log("name", event.target.value);

    if (event.target.value) {
      setState((prevState) => ({
        ...prevState,
        coreValue: event.target.value || null,
        isModuleActive: true,
      }));
      // getOptions(event.target.value);
    } else if (!event.target.value) {
      setState((prevState) => ({
        ...prevState,
        isModuleActive: false,
      }));
    }
  };

  useEffect(() => {
    callProviderURL();
  }, []);

  const callProviderURL = async () => {
    const result = await apigetUrl(
      `/insurance/providers?page=${state.page}&limit=1000`
    );
    console.log("res", result);
    if (result.data.responseCode === "200") {
      let res = result.data.dataList;
      console.log(
        "res",
        res.map((n) => n)
      );
      setState((prevState) => ({
        ...prevState,
        moduleData: res,
      }));
    } else {
      ippNotify.error(result.data.responseMessage);
    }
  };

  useEffect(() => {
    apigetUrl(
      `/${state.coreValue}/core-data-types?page=${state.page}&limit=1000&isVisible=1`
    )
      .then((res) => {
        console.log("response-core", res);
        if (res.data.responseCode === "200") {
          setState((prevState) => ({
            ...prevState,
            allData: res.data.dataList,
          }));
        }
      })
      .catch((err) => console.log("err-core", err));
  }, [state.coreValue]);

  const handleChange = (event) => {
    event.preventDefault();
    console.log("name123", state.allData);
    const searchId = (state.allData || []).find(
      (n) => n.name === event.target.value
    );
    const setId = searchId.id;
    setState({
      ...state,
      // [name]: event.target.value
      coreDataName: event.target.value,
      typeId: setId,
      isCoreActive: true,
    });
    handleSearch(setId);
  };

  const handleSearch = (typeId) => {
    console.log("coreDataID", typeId);
    getCoreDataTypes(typeId);
  };

  const getCoreDataTypes = async (typeId) => {
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    apigetUrl(
      `/${state.coreValue}/core-data?page=${state.page}&limit=${state.limit}&typeId=${typeId}&sortBy=${state.sortBy}&sortType=${state.sortType}`
    )
      .then((res) => {
        console.log("Response", res.data.dataList);
        const isEditable = res.data.dataList.map((n) => n.isEditable);
        console.log("isEditable", isEditable);
        if (res.data.responseCode === "200") {
          setTimeout(() => {
            setState((prevState) => ({
              ...prevState,
              data: res.data.dataList,
              page: res.data.pagination.page,
              pageCount: res.data.pagination.count,
              limit: res.data.pagination.limit,
              to: res.data.pagination.limit,
              from: 1,
              isEditable: isEditable,
              auditEventId: res.data.auditEventId,
              isLoading: false,
            }));
          }, 1000);
        }
      })
      .catch((error) => {
        console.log("err", error);
        showLoader();
      });
  };

  const showLoader = () => {
    setTimeout(() => {
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
      }));
    }, 5000);
  };

  const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));

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

  const requestSortData = async (sortBy, sortType) => {
    console.log("property = ", sortBy);
    console.log("sortType = ", sortType);
    const { description, name } = state.advancedSearchValidation;
    apiCallParams.set("page", state.page);
    apiCallParams.set("limit", state.limit);
    apiCallParams.set("sortBy", sortBy);
    apiCallParams.set("sortType", sortType);
    let tempArr = [];
    if (!isEmpty(name)) tempArr.push({ name });
    if (!isEmpty(description)) tempArr.push({ description });
    tempArr.map((p) => {
      for (var key in p) {
        if (p.hasOwnProperty(key)) {
          console.log(key + " -> " + p[key]);
          apiCallParams.set(key, p[key]);
        }
      }
    });

    pageURL.search = apiCallParams.toString();
    console.log("pageURL = ", pageURL.href);
    console.log("pageURL = ", apiCallParams.toString());
    console.log("pageURL = ", pageURL.search);

    setCurrentUrl(pageURL, apiInstance);

    const result = await apigetUrl(
      `${pageURL.pathname}?${apiCallParams.toString()}`
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
      ippNotify.error(result.data.responseMessage);
      showLoader();
    }
  };

  const handleChangeRowsPerPage = (event) => {
    console.log("RowsPerPage", event.target.value);
    let target = event.target;
    setState((prevState) => ({
      ...prevState,
      page: 1,
      isLoading: true,
    }));
    requestPageLimitCountChange(target.value);
  };

  const requestPageLimitCountChange = async (count) => {
    console.log("page limit change requested");
    console.log("count = ", count);

    apiCallParams.set("page", 1);
    apiCallParams.set("limit", count);
    apiCallParams.set("sortBy", state.sortBy);
    apiCallParams.set("sortType", state.sortType);

    pageURL.search = apiCallParams.toString();

    setCurrentUrl(pageURL, apiInstance);

    console.log("before call = ", pageURL.href);

    const result = await apigetUrl(
      `${pageURL.pathname}?${apiCallParams.toString()}`
    );
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
      ippNotify.error(result.data.responseMessage);
      showLoader();
    }
  };

  const isSelectedFunc = (id) => {};

  const handleRequestClose = () => {
    setState((prevState) => ({
      ...prevState,
      isLoading: false,
      formDialogOpen: false,
    }));
  };
  const classes = useStyles();

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

  const getSuccessUpdate = () => {
    setState((prevState) => ({
      ...prevState,
      isAddFormSubmitDisabled: false,
      isSuccessAlert: true,
      successMsg: "Successfully Data is Edited",
    }));
  };

  const getSuccessPost = () => {
    ippNotify.success("Successfully New Data is Added");
    setState((prevState) => ({
      ...prevState,
      isAddFormSubmitDisabled: false,
      isSuccessAlert: true,
      successMsg: "Successfully Data is Added",
    }));
  };

  const getErrorPost = (err) => {
    console.log("err", err);
    ippNotify.error(err.data.responseMessage || err.statusText);
  };

  const getPageFromBackEnd = async (
    pageNumber,
    limit,
    temp_from,
    temp_to,
    pageCount,
    actionType
  ) => {
    const { description, name } = state.advancedSearchValidation;
    if (!isEmpty(name)) {
    } else {
      apiCallParams.delete("name");
    }
    if (!isEmpty(description)) {
    } else {
      apiCallParams.delete("description");
    }
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));

    apiCallParams.set("page", pageNumber);
    apiCallParams.set("limit", limit);

    pageURL.search = apiCallParams.toString();

    console.log("pageURL.href = ", pageURL.href);

    const result = await apigetUrl(
      `${pageURL.pathname}?${apiCallParams.toString()}`
    );

    if (result.data.responseCode === "200") {
      setTimeout(() => {
        if (actionType === "handleNextButtonClick") {
          update_from(temp_from);
          if (temp_to >= pageCount) {
            update_to(pageCount);
          } else {
            update_to(temp_to);
          }
        } else if (actionType === "handleBackButtonClick") {
          update_from(temp_from);
          update_to(temp_to);
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
      ippNotify.error(result.data.responseMessage);
      showLoader();
    }
  };

  const isEditableTextReturn = (isEditable) => {
    switch (isEditable) {
      case 0:
        return "No";
      case 1:
        return "Yes";
      case "":
        return "";
    }
  };

  const onTableDeleteButtonClick = (event, id) => {
    console.log("DeleteId", id);
    setState((prevState) => ({
      ...prevState,
      deleteFormDialogOpen: true,
      selectedId: id,
    }));

    const onDeleteButtonClickedIndex = state.data
      .map(function(e) {
        return e.id;
      })
      .indexOf(parseInt(event.currentTarget.id));
    console.log("onDeleteButtonClickedIndex = ", onDeleteButtonClickedIndex);
  };

  const handleDeleteDialogClose = (e) => {
    setState((prevState) => ({
      ...prevState,
      deleteFormDialogOpen: false,
    }));
  };

  const onDeleteConfirm = () => {
    deleteItem();
    console.log("Delete");
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
  };

  const deleteItem = () => {
    console.log("DeleteId", state.selectedId);
    apideleteUrl(`/${state.coreValue}/core-data/${state.selectedId}`)
      .then((res) => {
        console.log("DELETE_RES", res);
        setState((prevState) => ({
          ...prevState,
          deleteFormDialogOpen: false,
        }));
        if (res.status === 200) {
          setTimeout(() => {
            ippNotify.success("Deleted Successfully");
            setState((prevState) => ({
              ...prevState,
              isLoading: false,
            }));
            getCoreDataTypes(state.typeId);
          }, 1000);
        }
        if (res.data.responseStatus === "failure") {
          ippNotify.error(res.data.responseMessage);
          showLoader();
          setState((prevState) => ({
            ...prevState,
            formDialogOpen: false,
          }));
        }
      })
      .catch((err) => {
        ippNotify.error(err.data.responseMessage);
        setState((prevState) => ({
          ...prevState,
          deleteFormDialogOpen: true,
        }));
        showLoader();
      });
  };

  const handleEditChange = (e) => {
    setState((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
      isEditFormSubmitDisabled: true,
    }));
  };

  const handleEditFormChange = ({ target: input }) => {
    console.log("input = ", input.name);
    console.log("value = ", input.value);

    const errors = { ...state.errors };

    const errorMessage = validateProperty(input);
    console.log("errMsg", errorMessage);
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
      isEditFormSubmitDisabled: allFormFieldsPopulated && isObjEmpty(errors),
    }));
  };

  const validateProperty = ({ name, value }) => {
    const obj = { [name]: value };

    const propertySchema = { [name]: schema[name] };
    const { error } = Joi.validate(obj, propertySchema);
    return error ? error.details[0].message : null;
  };

  const advanceSeacrhValidateProperty = ({ name, value }) => {
    const obj = { [name]: value };

    const propertySchema = {
      [name]: advancedSearchValidationSchema[name],
    };
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

  const onTableEditButtonClick = (e, id) => {
    console.log("e", e.currentTarget.id);

    apigetUrl(`/${state.coreValue}/core-data/${id}`)
      .then((res) => {
        console.log("Response of Edit", res.data);
        const response = res.data;
        if (res.data.responseCode === "200") {
          setState((prevState) => ({
            ...prevState,
            selectedEditId: id,
            formDialogOpen: true,
            validation: {
              name: response.name,
            },
            description: response.description,
            additionalData: JSON.stringify(response.additionalData),
          }));
        }
        if (res.data.responseStatus === "failure") {
          ippNotify.error(res.data.responseMessage);
        }
      })
      .catch((error) => {
        ippNotify.error(error.data.responseMessage);
      });
  };

  const updateEditInBackend = async () => {
    let putObj = {
      name: state.validation.name,
      description: state.description,
      additionalData: JSON.parse(state.additionalData),
      typeId: state.typeId,
    };
    console.log("Post-Response", putObj);
    const result = await apiputUrl(
      `/${state.coreValue}/core-data/${state.selectedEditId}`,
      putObj
    );
    console.log(result.status);
    if (result.status === 200) {
      setState((prevState) => ({
        ...prevState,
        data: state.data,
        formDialogOpen: false,
      }));
      getSuccessPost();
      getCoreDataTypes(state.typeId);
    } else {
      setState((prevState) => ({
        ...prevState,
        data: state.data,
        addFormDialogOpen: true,
      }));
      console.log("before error post");
      getErrorPost(result);
      getCoreDataTypes(state.typeId);
    }
  };

  const handleEditFormSubmit = async (e) => {
    updateEditInBackend();
  };

  const isEmpty = (str) => {
    return !str || 0 === str.length;
  };

  const handleApplyClick = (e) => {
    apiCallParams.delete("name");
    apiCallParams.delete("description");
    e.preventDefault();
    console.log("name", state.name);

    const { description, name } = state.advancedSearchValidation;
    console.log(
      "state.advancedSearchValidation",
      state.advancedSearchValidation
    );

    if (description === "" && name === "") {
      console.log("when no data entered");
      setState((prevState) => ({
        ...prevState,
        isAdvancedSearchValidationText: true,
      }));
      return;
    } else if (name === "" || description === "") {
      console.log("when any data entered");
      setState((prevState) => ({
        ...prevState,
        isAdvancedSearchValidationText: false,
        advancedSearchValidationErrors: {},
      }));
    } else {
      console.log("when both data entered");
      setState((prevState) => ({
        ...prevState,
        isAdvancedSearchValidationText: false,
        advancedSearchValidationErrors: {},
      }));
    }

    console.log(`"name = "${name},"description = "${description},`);

    let tempArr = [];
    if (!isEmpty(name)) tempArr.push({ name });
    if (!isEmpty(description)) tempArr.push({ description });
    console.log("tempArr", tempArr);
    apiCallParams.set("page", 1);
    apiCallParams.set("limit", state.limit);
    apiCallParams.set("sortBy", state.sortBy);
    apiCallParams.set("sortType", state.sortType);

    tempArr.map((p) => {
      for (var key in p) {
        if (p.hasOwnProperty(key)) {
          console.log(key + " -> " + p[key]);
          apiCallParams.set(key, p[key]);
        }
      }
    });

    console.log("to string = ", apiCallParams.toString());
    pageURL.search = apiCallParams.toString();
    console.log("pageURL = ", apiCallParams.toString());

    search(apiCallParams.toString());
  };

  const handleResetClick = (e) => {
    callResetData();
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
    apiCallParams.delete("description");

    pageURL.search = apiCallParams.toString();

    console.log("pageURL.href = ", pageURL.href);

    const res = await apigetUrl(
      `${pageURL.pathname}?${apiCallParams.toString()}`
    );
    console.log("res = ", res.data.dataList);
    if (res.data.responseCode === "200") {
      setTimeout(() => {
        setState((prevState) => ({
          ...prevState,
          advancedSearchValidation: {
            name: "",
            description: "",
          },
          isInfoAlert: false,
          isLoading: false,
        }));
        setResetData(res.data.dataList);
        setPageNumber(1);
        setPageCount(res.data.pagination.count);
        setCurrentUrl(pageURL, apiInstance);
      }, 1000);
    } else {
      ippNotify.error(res.data.responseMessage);
      showLoader();
    }
  };

  const search = async (searchURL) => {
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    console.log("URL", `${pageURL.pathname}?${searchURL}`);
    await apigetUrl(`${pageURL.pathname}?${searchURL}`)
      .then((res) => {
        console.log("advanced serach data = ", res.data);
        if (res.data.responseCode === "200") {
          setTimeout(() => {
            setAdvancedSearchData(res.data.dataList);
            setPageNumber(res.data.pagination.page);
            setPageCount(res.data.pagination.count);
            setState((prevState) => ({
              ...prevState,
              isInfoAlert: false,
              isLoading: false,
            }));
          }, 1000);
        }
      })
      .catch((error) => {
        setState((prevState) => ({
          ...prevState,
          error,
          isInfoAlert: true,
          infoMsg: "Your query did not match any results",
          to: 0,
          pageCount: 0,
        }));
        showLoader();
      });
  };

  const handleAdvancedSearchOnChange = (event) => {
    const { target: input } = event;
    const errors = { ...state.errors };
    const advancedSearchValidation = {
      ...state.advancedSearchValidation,
    };

    const errorMessage = advanceSeacrhValidateProperty(input);
    console.log("advance-search errorMessage", errorMessage);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];
    advancedSearchValidation[input.name] = input.value;

    let isAnyFormFieldsPopulated = false;
    isAnyFormFieldsPopulated =
      advancedSearchValidation.name !== "" ||
      advancedSearchValidation.description !== "";

    console.log("allFormFieldsPopulated = ", isAnyFormFieldsPopulated);
    if (isAnyFormFieldsPopulated && isObjEmpty(errors)) {
      setState((prevState) => ({
        ...prevState,
        advancedSearchValidation,
        advancedSearchValidationErrors: errors,
        isAdvancedSearchValidationText: false,
      }));
    } else if (!isAnyFormFieldsPopulated && !isObjEmpty(errors)) {
      setState((prevState) => ({
        ...prevState,
        advancedSearchValidation,
        advancedSearchValidationErrors: errors,
        isAdvancedSearchValidationText: true,
      }));
    } else if (isAnyFormFieldsPopulated && !isObjEmpty(errors)) {
      setState((prevState) => ({
        ...prevState,
        advancedSearchValidation,
        advancedSearchValidationErrors: errors,
        isAdvancedSearchValidationText: false,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        advancedSearchValidation,
        advancedSearchValidationErrors: errors,
        isAdvancedSearchValidationText: true,
      }));
    }
  };

  // const handleAdd = () => {
  //   setState((prevState) => ({
  //     ...prevState,
  //     dataTypeFormDialogOpen: true,
  //   }));
  // };

  const handleDataTypeDialogClose = () => {
    setState((prevState) => ({
      ...prevState,
      dataTypeFormDialogOpen: false,
    }));
  };

  const handleAddDataTypeFormSubmit = () => {
    console.log("EVENT", state.coreValue);
    // use Post API here
    setState((prevState) => ({
      ...prevState,
      dataTypeFormDialogOpen: false,
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
      ippNotify.error(result.data.responseMessage);
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
      ) : (
        <div className="App">
          <Dialog
            maxWidth="xs"
            open={state.formDialogOpen}
            onClose={handleRequestClose}
          >
            <DialogTitle>
              <IntlMessages id="coredata.master.modal.edit.tilte" />
            </DialogTitle>
            <DialogContent>
              <InputField
                className="mb-3"
                required
                autoFocus
                id="name"
                error={state.errors.name}
                label={
                  <IntlMessages id="coredata.master.modal.edit.felid.Name" />
                }
                name="name"
                onChange={(e) => handleEditFormChange(e)}
                value={state.validation.name}
                fullWidth
                helperText={state.errors.name}
              />
              <InputField
                className="mb-3"
                id="description"
                label={
                  <IntlMessages id="coredata.master.modal.edit.felid.Description" />
                }
                name="description"
                onChange={(e) => handleEditChange(e)}
                value={state.description}
                fullWidth
              />
              <InputField
                autoFocus
                id="outlined-multiline-static"
                placeholder="Only JSON data is allowed"
                label={
                  <IntlMessages id="coredata.master.modal.edit.felid.AdditionalData" />
                }
                name="additionalData"
                multiline
                rows={2}
                fullWidth
                onChange={(e) => handleEditChange(e)}
                value={state.additionalData}
              />
            </DialogContent>
            <DialogActions>
              <InputCancelButton onClick={(e) => handleRequestClose(e)} />

              <InputSubmitButton
                onClick={(e) => handleEditFormSubmit(e)}
                disabled={!state.isEditFormSubmitDisabled}
              />
            </DialogActions>
          </Dialog>

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
                <IntlMessages id="coredata.master.modal.deleteconfrimation.message" />
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteDialogClose} color="primary">
                <IntlMessages id="ipp.common.Cancel.button" />
              </Button>
              <Button onClick={onDeleteConfirm} color="secondary" autoFocus>
                <IntlMessages id="ipp.common.Delete.button" />
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            maxWidth="xs"
            open={state.dataTypeFormDialogOpen}
            onClose={handleDataTypeDialogClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle>Add Core Data Type</DialogTitle>
            <DialogContent>
              <TextField
                className="mb-2"
                required
                autoFocus
                id="name"
                error={state.errors.name}
                label={
                  <IntlMessages id="coredata.master.modal.edit.felid.Name" />
                }
                name="name"
                onChange={(e) => handleEditFormChange(e)}
                value={state.validation.name}
                fullWidth
                helperText={state.errors.name}
              />
              <DialogActions>
                <Button
                  onClick={(e) => handleDataTypeDialogClose(e)}
                  variant="contained"
                  color="secondary"
                >
                  <IntlMessages id="ipp.common.Cancel.button" />
                </Button>
                <Button
                  onClick={(e) => handleAddDataTypeFormSubmit(e)}
                  color="primary"
                  variant="contained"
                >
                  <IntlMessages id="ipp.common.submit.button" />
                </Button>
              </DialogActions>
            </DialogContent>
          </Dialog>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <div className="row">
                <div className="col-lg-4"></div>
                <div className="col-lg-4"></div>
                <div className="col-lg-4">
                  <IPPNotification />
                </div>
              </div>
              <div className="audit-master-box">
                <div className="row mt-5">
                  <div className="col-lg-3"></div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <FormControl variant="outlined" className="w-100 mb-3">
                      <InputLabel htmlFor="outlined-coreDataProduct-native-simple">
                        <IntlMessages id="coredata.master.dropdown.name.CoreDataProduct" />
                      </InputLabel>
                      <InputSelect
                        native
                        // value={state.coreDataName}
                        onChange={(event) => handleProductChange(event)}
                        label={
                          <IntlMessages id="coredata.master.dropdown.name.CoreDataProduct" />
                        }
                        inputProps={{
                          name: "coreDataProduct",
                          id: "outlined-coreDataProduct-native-simple",
                        }}
                      >
                        <option value=""></option>
                        <option value="config">Configuration</option>
                        <option value="insurance">Insurance</option>
                        <option value="notify">Notification</option>
                        {((state.moduleData && state.moduleData) || []).map(
                          (n) => {
                            return (
                              <>
                                <option value={`tpi/${n.key}`}>{n.name}</option>
                              </>
                            );
                          }
                        )}
                      </InputSelect>
                    </FormControl>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <FormControl variant="outlined" className="w-100 mb-3">
                      <InputLabel htmlFor="outlined-coreDataName-native-simple">
                        <IntlMessages id="coredata.master.dropdown.name.CoreDataType" />
                      </InputLabel>
                      <Select
                        native
                        value={state.coreDataName || {}}
                        onChange={(e) => handleChange(e)}
                        label={
                          <IntlMessages id="coredata.master.dropdown.name.CoreDataType" />
                        }
                        inputProps={{
                          name: "coreDataName",
                          id: "outlined-coreDataName-native-simple",
                        }}
                      >
                        <option value=""></option>
                        {(state.allData || []).map((item, i) => {
                          return (
                            <>
                              <option key={i} value={item.name}>
                                {item.name}
                              </option>
                            </>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </div>
                  {/* <div className="col-lg-2 col-sm-6 col-12 pt-2 ml-2">
                    <Button
                      variant="contained"
                      color="primary"
                      className="mx-2"
                      disabled={!state.isModuleActive}
                      onClick={(e) => handleAdd(e)}
                    >
                      Add Data Type
                    </Button>
                  </div> */}
                </div>
                {state.isCoreActive ? (
                  <div>
                    <EnhancedTableToolbar
                      coreValue={state.coreValue}
                      data={state.data}
                      pageCount={state.pageCount}
                      page={state.page}
                      pageCount={state.pageCount}
                      limit={state.limit}
                      to={state.limit}
                      rowsPerPage={state.rowsPerPage}
                      sortBy={state.sortBy}
                      sortType={state.sortType}
                      name={state.advancedSearchValidation.name}
                      description={state.advancedSearchValidation.description}
                      getCoreDataTypes={getCoreDataTypes}
                      typeId={state.typeId}
                      setAdvancedSearchData={setAdvancedSearchData}
                      setResetData={setResetData}
                      getSuccessPost={getSuccessPost}
                      getErrorPost={getErrorPost}
                      handleApplyClick={handleApplyClick}
                      handleResetClick={handleResetClick}
                      handleAdvancedSearchOnChange={
                        handleAdvancedSearchOnChange
                      }
                      advancedSearchValidationErrors={
                        state.advancedSearchValidationErrors
                      }
                      isAdvancedSearchValidationText={
                        state.isAdvancedSearchValidationText
                      }
                      handleAutoCompleteInputReset={
                        state.handleAutoCompleteInputReset
                      }
                    />
                    <div className="flex-auto">
                      <div className="table-responsive-material">
                        <Table>
                          <EnhancedTableHead
                            order={state.sortType}
                            orderBy={state.sortBy}
                            onRequestSort={handleRequestSort}
                            // rowCount={state.data.length}
                            headCell={state.headCells}
                          />
                          {state.isLoading ? <Loader /> : null}
                          {state.isInfoAlert === true ||
                          (state.data.length === 0 &&
                            state.isLoading === false) ? (
                            <InfoModal message="Your query did not match any results" />
                          ) : (
                            <TableBody>
                              {state.data.map((n) => {
                                let isEditable = n.isEditable;
                                console.log("check isEdit", isEditable);
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
                                    <TableCell>
                                      {isEditableTextReturn(n.isEditable)}
                                    </TableCell>
                                    {isEditable === 0 ? (
                                      <TableCell padding="none">
                                        <Tooltip
                                          title={
                                            <IntlMessages id="CoreDataTypes.Tooltip.Edit" />
                                          }
                                        >
                                          <IconButton
                                            id={n.id}
                                            disabled
                                            onClick={(e) =>
                                              onTableEditButtonClick(e, n.id)
                                            }
                                          >
                                            <EditIcon color="disabled" />
                                          </IconButton>
                                        </Tooltip>
                                        <Tooltip
                                          title={
                                            <IntlMessages id="CoreDataTypes.Tooltip.Delete" />
                                          }
                                        >
                                          <IconButton
                                            style={{ marginLeft: "-10px" }}
                                            id={n.id}
                                            disabled
                                            onClick={(e) =>
                                              onTableDeleteButtonClick(e, n.id)
                                            }
                                          >
                                            <DeleteIcon color="disabled" />
                                          </IconButton>
                                        </Tooltip>
                                        {state.auditEventId >= 1 ? (
                                          <Tooltip
                                            title={
                                              <IntlMessages id="CoreDataTypes.Tooltip.View" />
                                            }
                                          >
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
                                    ) : (
                                      <TableCell padding="none">
                                        <Tooltip
                                          title={
                                            <IntlMessages id="CoreDataTypes.Tooltip.Edit" />
                                          }
                                        >
                                          <IconButton
                                            id={n.id}
                                            onClick={(e) =>
                                              onTableEditButtonClick(e, n.id)
                                            }
                                          >
                                            <EditIcon color="primary" />
                                          </IconButton>
                                        </Tooltip>
                                        <Tooltip
                                          title={
                                            <IntlMessages id="CoreDataTypes.Tooltip.Delete" />
                                          }
                                        >
                                          <IconButton
                                            style={{ marginLeft: "-10px" }}
                                            id={n.id}
                                            onClick={(e) =>
                                              onTableDeleteButtonClick(e, n.id)
                                            }
                                          >
                                            <DeleteIcon color="secondary" />
                                          </IconButton>
                                        </Tooltip>
                                        {state.auditEventId >= 1 ? (
                                          <Tooltip
                                            title={
                                              <IntlMessages id="CoreDataTypes.Tooltip.View" />
                                            }
                                          >
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
                                    )}
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
                ) : (
                  <div className="m-5">
                    <Alert className="p-5" severity="info">
                      <AlertTitle>Info</AlertTitle>
                      For Kind Information —
                      <strong>Plese Select Core Data Product and Types</strong>
                    </Alert>
                  </div>
                )}
              </div>
            </Grid>
          </Grid>
        </div>
      )}
    </React.Fragment>
  );
};

export default App;
