import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Modal,
  TextField,
  Button,
  responsiveFontSizes,
  Checkbox,
  AppBar,
  Tabs,
  Tab,
  TableHead,
  TableFooter,
  TableCell,
  TableBody,
  Tooltip,
  TableRow,
  TableSortLabel,
  TablePagination,
  Table,
  MenuItem,
  IconButton,
  InputLabel,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import TablePaginationComponent from "../../../CommonComponents/TablePaginationComponent";
import IntlMessages from "util/IntlMessages";
import InfoModal from "../../../Modal/Info";
import AddIcon from "@material-ui/icons/Add";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Joi from "joi-browser";
import JSONInput from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/en";
import apiInstance from "../../../../../../../setup/index";
import {
  apigetUrl,
  apipostUrl,
  apiputUrl,
  apideleteUrl,
} from "../../../../../../../setup/middleware";
import SuccessModal from "../../../Modal/Success";
import ErrorModal from "../../../Modal/Error";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { makeStyles } from "@material-ui/core/styles";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputSelect from "../../../CommonComponents/Select";
import InputSubmitButton from "../../../CommonComponents/SubmitButton";
import InputCancelButton from "../../../CommonComponents/CancelButton";
import InputField from "../../../CommonComponents/TextField";
import {
  IPPNotification,
  ippNotify,
} from "../../../CommonComponents/IPPNotification";
import { getRecordsPerPage } from "../../../../../../../setup/ApplicatoinConfigurations.js";
import Loader from "../../../CommonComponents/Loader";

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
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const schema = {
  ProductMapId: Joi.number()
    .required()
    .label("Product Map Id"),
  ActionType: Joi.number()
    .required()
    .label("Configuration Details"),
  SuccessCheck: Joi.string()
    .required()
    .label("Configuration Details"),
  FailureMessage: Joi.string()
    .required()
    .label("Configuration Details"),
  DetailedMessage: Joi.string()
    .required()
    .label("Configuration Details"),
  path: Joi.string()
    .required()
    .label("Configuration Details"),
  valueType: Joi.number()
    .required()
    .label("Configuration Details"),
  expectedValue: Joi.string()
    .required()
    .label("Configuration Details"),
};

const baseURL = `${process.env.REACT_APP_BASE_URL}`;

const TPIProductMapResponseCheck = ({
  checkedProductList,
  handleEditDataRequestClose,
  mappedProductDetail,
  apiPathKey,
}) => {
  console.log("##checkedProductList", checkedProductList);

  const [state, setState] = useState({
    isLoading: true,
    reqeustPayloadItems: [],
    isEditFormOpened: false,
    tabValue: 0,
    limit: getRecordsPerPage(),
    data: [],
    page: 1,
    from: 1,
    to: 5,
    pageCount: 1,
    sortBy: "",
    sortType: "",
    currentUrl: "",
    addFormDialogOpen: false,
    editFormDialogOpen: false,
    productMapList: mappedProductDetail || [],
    actionTypes: [],
    valueTypes: [],
    validation: {
      ProductMapId: "",
      ActionType: "",
      SuccessCheck: [
        {
          path: "",
          expectedValue: "",
          valueType: null,
        },
      ],
      FailureMessage: [
        {
          path: "",
        },
      ],
      DetailedMessage: [
        {
          path: "",
        },
      ],
    },
    errors: {},
    isEditMode: false,
    successMsg: "",
    errorMsg: "",
    isSuccessAlert: false,
    isErrorAlert: false,
    deleteItem_DialogOpen: false,
    selectedDeleteId: null,
    allData: [],
  });

  useEffect(() => {
    getProductMapResponseCheckList();
    getActionTypes();
    getValueTypes();
  }, []);

  const showLoader = () => {
    setTimeout(() => {
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
      }));
    }, 5000);
  };

  const getProductMapResponseCheckList = () => {
    apigetUrl(
      `/tpi/${apiPathKey}/product/map/checks?page=${state.page}&limit=${state.limit}`
    ).then((res) => {
      if (`${res.data.responseCode}` === "200") {
        setTimeout(() => {
          setState((prevState) => ({
            ...prevState,
            data: (res.data || {}).dataList || [],
            ...(res.data || {}).pagination,
            pageCount: res.data.pagination.count,
            to: res.data.pagination.limit,
            limit: res.data.pagination.limit,
            isLoading: false,
          }));
          getAllProductMapResponseCheckList();
        }, 1000);
      }
    });
  };

  const getAllProductMapResponseCheckList = () => {
    return apigetUrl(
      `/tpi/${apiPathKey}/product/map/checks?page=1&limit=1000`
    ).then((res) => {
      if (`${res.data.responseCode}` === "200") {
        setState((prevState) => ({
          ...prevState,
          allData: (res.data || {}).dataList || [],
        }));
      }
    });
  };

  const getActionTypes = async () => {
    // typeId for 'ActionTypes' is 1006
    let response = await apigetUrl(
      `/tpi/${apiPathKey}/core-data?page=1&limit=1000&typeId=1006`
    );
    if (response.data.responseCode === "200") {
      setState((prevState) => ({
        ...prevState,
        actionTypes: (response.data || {}).dataList || [],
      }));
    }
  };

  const getValueTypes = async () => {
    // typeId for 'ValueTypes' is 1005
    let response = await apigetUrl(
      `/tpi/${apiPathKey}/core-data?page=1&limit=1000&typeId=1005`
    );
    if (response.data.responseCode === "200") {
      setState((prevState) => ({
        ...prevState,
        valueTypes: (response.data || {}).dataList || [],
      }));
    }
  };

  // this fun. will handle to 'close' the Dialog
  const handleAddDataRequestClose = (e) => {
    setState((prevState) => ({
      ...prevState,
      addFormDialogOpen: false,
      validation: {
        ProductMapId: "",
        ActionType: "",
        SuccessCheck: [
          {
            path: "",
            expectedValue: "",
            valueType: null,
          },
        ],
        FailureMessage: [
          {
            path: "",
          },
        ],
        DetailedMessage: [
          {
            path: "",
          },
        ],
      },
      errors: {},
    }));
  };

  // this fun. will handle to 'close' the Dialog
  const handleEditClose = (e) => {
    setState((prevState) => ({
      ...prevState,
      editFormDialogOpen: false,
      isEditMode: false,
      validation: {
        ProductMapId: "",
        ActionType: "",
        SuccessCheck: [
          {
            path: "",
            expectedValue: "",
            valueType: null,
          },
        ],
        FailureMessage: [
          {
            path: "",
          },
        ],
        DetailedMessage: [
          {
            path: "",
          },
        ],
        rowVersion: null,
      },
      errors: {},
      isAddFormSubmitDisabled: false,
    }));
  };

  // this fun. will handle to 'open' the Dialog
  const onAddButtonClick = (e) => {
    setState((prevState) => ({
      ...prevState,
      addFormDialogOpen: true,
    }));
  };
  // getRequestPayloadMasterData(); // This function will call API to fetch info from BE

  const handleSubmitButton = (e, id = null) => {
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    const payload = {
      productMapId: state.validation.ProductMapId,
      actionType: state.validation.ActionType,
      successCheck: state.validation.SuccessCheck,
      detailedMessage: state.validation.DetailedMessage,
      failureMessage: state.validation.FailureMessage,
    };

    apipostUrl(`/tpi/${apiPathKey}/product/map/checks`, payload).then((res) => {
      if (`${res.status}` !== "200") {
        showLoader();
        ippNotify.error((res.data || {}).responseMessage || "");
        // setState((prevState) => ({
        //   ...prevState,
        //   isErrorAlert: true,
        //   errorMsg: (res.data || {}).responseMessage || ''
        // }));
        return false;
      }
      handleAddDataRequestClose();
      setTimeout(() => {
        getProductMapResponseCheckList();
        setState((prevState) => ({
          ...prevState,
          isLoading: false,
        }));

        ippNotify.success("Successfully New Data is Added");
      }, 1000);
      // setState((prevState) => ({
      //   ...prevState,
      //   isSuccessAlert: true,
      //   successMsg: "Successfully New Data is Added"
      // }));
    });
  };

  const handleUpdateButton = (e, id) => {
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    const payload = {
      productMapId: state.validation.ProductMapId,
      actionType: state.validation.ActionType,
      successCheck: state.validation.SuccessCheck,
      detailedMessage: state.validation.DetailedMessage,
      failureMessage: state.validation.FailureMessage,
      rowVersion: state.validation.rowVersion,
    };

    apiputUrl(`/tpi/${apiPathKey}/product/map/checks/${id}`, payload).then(
      (res) => {
        if (`${res.data.responseCode}` !== "200") {
          showLoader();
          ippNotify.error((res.data || {}).responseMessage || "");
          // setState((prevState) => ({
          //   ...prevState,
          //   isErrorAlert: true,
          //   errorMsg: (res.data || {}).responseMessage || ''
          // }));
          return false;
        }
        handleEditClose();

        setTimeout(() => {
          getProductMapResponseCheckList();

          ippNotify.success("Successfully Updated");
          setState((prevState) => ({
            ...prevState,
            isLoading: false,
          }));
        }, 1000);
        // setState((prevState) => ({
        //   ...prevState,
        //   isSuccessAlert: true,
        //   successMsg: "Successfully Updated"
        // }));
      }
    );
  };

  const validateProperty = ({ name, value, index }) => {
    let obj = {};
    obj = { [name]: value };

    // if 'schema' is not defined for an input, just ignore the validation
    if (!schema[name]) return null;

    const propertySchema = { [name]: schema[name] };
    const { error } = Joi.validate(obj, propertySchema);
    return error ? error.details[0].message : null;
  };

  const handleChange = ({ target: input }) => {
    /**
     * check for 'Duplicat combiantion' of ProductMapId & ActoinType
     * If, Dupications are there, don't allow to create it
     */
    let duplicatObj;
    if (input.name === "ProductMapId") {
      duplicatObj = handleDuplicateCombination(
        input.value,
        state.validation.ActionType
      );
    }

    if (input.name === "ActionType") {
      duplicatObj = handleDuplicateCombination(
        state.validation.ProductMapId,
        input.value
      );
    }

    if (duplicatObj) {
      ippNotify.error(
        "You are not allowed to create a Duplicat for this combination of Product Map & Action Type"
      );
      return;
    }

    const errors = { ...state.errors };
    const errorMessage = validateProperty(input);

    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const validation = { ...state.validation };
    validation[input.name] = input.value;
    const allFormFieldsPopulated = checkAreAllAddFormFieldsPopulated(
      validation
    );

    validation[input.name] = input.value;
    setState((prevState) => ({
      ...prevState,
      validation,
      errors,
      isAddFormSubmitDisabled: allFormFieldsPopulated && isObjEmpty(errors),
    }));
  };

  const handleInputChange = (e, index, objName) => {
    let { target: input } = e;
    const errors = { ...state.errors };
    const errorMessage = validateProperty(input);

    if (errorMessage) {
      !errors[objName] && (errors[objName] = [{}]);
      errors[objName][index][input.name] = errorMessage;
    } else {
      errors[objName] &&
        errors[objName][index] &&
        delete errors[objName][index][input.name];
    }

    const validation = { ...state.validation };
    validation[objName][index][input.name] = input.value;
    const allFormFieldsPopulated = checkAreAllAddFormFieldsPopulated(
      validation
    );

    validation[objName][index][input.name] = input.value;
    setState((prevState) => ({
      ...prevState,
      validation,
      errors,
      isAddFormSubmitDisabled: allFormFieldsPopulated && isObjEmpty(errors),
    }));
  };

  const handleJsonInput = (event, fieldName) => {
    const errors = { ...state.errors };
    const validation = { ...state.validation };

    if (event.error) {
      errors[fieldName] = (event.error || {}).reason;
      setState((prevState) => ({
        ...prevState,
        errors,
      }));
    } else {
      validation[fieldName] = event.jsObject;
      delete errors[fieldName];
      setState((prevState) => ({
        ...prevState,
        errors,
        validation,
      }));
    }
  };

  const checkAreAllAddFormFieldsPopulated = (obj) => {
    return !Object.values(obj).some((x) => x === "");
  };

  function isObjEmpty(obj) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }

    return JSON.stringify(obj) === JSON.stringify({});
  }

  const style = {
    width: "15%",
    // disablePadding: true,
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

  const handleChangeRowsPerPage = (event) => {
    let target = event.target;
    setState((prevState) => ({
      ...prevState,
      limit: target.value,
      page: 1,
      isLoading: true,
    }));
    requestPageLimitCountChange(target.value);
  };

  const requestPageLimitCountChange = async (count) => {
    update_to(count);
    update_from(1);

    const result = await apigetUrl(
      `/tpi/${apiPathKey}/product/map/checks?page=${1}&limit=${count}&sortBy=${
        state.sortBy
      }&sortType=${state.sortType}`
    );
    if (result.data.responseCode === "200") {
      setTimeout(() => {
        setState((prevState) => ({
          ...prevState,
          data: result.data.dataList,
          page: 1,
          pageCount: result.data.pagination.count,
          limit: result.data.pagination.limit,
          isLoading: false,
        }));
      }, 1000);
    } else {
      showLoader();
      ippNotify.error(result.data.responseMessage || "");
      // setState((prevState) => ({
      //   ...prevState,
      //   isErrorAlert: true,
      //   errorMsg: result.data.responseMessage,
      // }));
    }
  };

  const getPageFromBackEnd = async (
    pageNumber,
    limit,
    temp_from,
    temp_to,
    pageCount,
    actionType
  ) => {
    setState((prevState) => ({
      ...prevState,
      page: pageNumber,
      isLoading: true,
    }));

    const result = await apigetUrl(
      `/tpi/${apiPathKey}/product/map/checks?page=${pageNumber}&limit=${limit}&sortBy=${state.sortBy}&sortType=${state.sortType}`
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
      showLoader();
      ippNotify.error(result.data.responseMessage || "");
      // setState((prevState) => ({
      //   ...prevState,
      //   isErrorAlert: true,
      //   errorMsg: result.data.responseMessage,
      // }));
    }
  };

  const onTableEditButtonClick = async (event, id) => {
    const result = await apigetUrl(
      `/tpi/${apiPathKey}/product/map/checks/${id}?page=1&limit=100`
    );
    if (result.data.responseCode === "200") {
      setState((prevState) => ({
        ...prevState,
        isEditMode: true,
        editFormDialogOpen: true,
        selectedEditId: id,
        validation: {
          ProductMapId: result.data.productMapId,
          ActionType: result.data.actionType,
          SuccessCheck: result.data.successCheck,
          FailureMessage: result.data.failureMessage,
          DetailedMessage: result.data.detailedMessage,
          rowVersion: result.data.rowVersion,
        },
      }));
    } else {
      ippNotify.error(result.data.responseMessage || "");
      // setState((prevState) => ({
      //   ...prevState,
      //   isErrorAlert: true,
      //   errorMsg: result.data.responseMessage,
      // }));
    }
  };

  const onTableDeleteButtonClick = (event, id) => {
    setState((prevState) => ({
      ...prevState,
      deleteItem_DialogOpen: true,
      selectedDeleteId: id,
    }));
    // axios
    //   .delete(`${baseURL}/tpi/${apiPathKey}/product/map/checks/${id}`, apiInstance)
    //   .then((res) => {
    //     getProductMapResponseCheckList();

    //     setState((prevState) => ({
    //       ...prevState,
    //       isSuccessAlert: true,
    //       successMsg: "Successfully Deleted"
    //     }));
    //   })
    //   .catch((error) => {
    //     console.log("err", error);
    //     setState((prevState) => ({
    //       ...prevState,
    //       isErrorAlert: true,
    //       errorMsg: (error.response.data || {}).responseMessage || ''
    //     }));
    //   });
  };

  const handleAddClick = (event, objName) => {
    let validation = { ...state.validation };

    !validation[objName] && (validation[objName] = []);
    //insert new-record
    switch (objName) {
      case "SuccessCheck":
        validation[objName].push({
          path: "",
          expectedValue: "",
          valueType: null,
        });
        break;
      case "FailureMessage":
        validation[objName].push({
          path: "",
        });
        break;
      case "DetailedMessage":
        validation[objName].push({
          path: "",
        });
        break;
    }

    setState((prevState) => ({
      ...prevState,
      validation,
    }));
  };

  const handleRemoveClick = (index, objName) => {
    let validation = { ...state.validation };

    !validation[objName] && (validation[objName] = []);

    validation[objName].splice(index, 1);
    setState((prevState) => ({
      ...prevState,
      validation,
    }));
  };

  const handleDuplicateCombination = (productMapId, actionType) => {
    return (state.allData || []).filter(
      (obj) =>
        obj.productMapId === productMapId && obj.actionType === actionType
    )[0];
  };

  function getFormContent() {
    return state.addFormDialogOpen ? (
      <AddOrEditTPIRequestPayloadMasterField
        isEditMode={state.isEditMode}
        doesFormDialogOpen={state.addFormDialogOpen}
        errors={state.errors}
        validation={state.validation}
        productMapList={state.productMapList}
        actionTypes={state.actionTypes}
        valueTypes={state.valueTypes}
        handleChange={handleChange}
        handleInputChange={handleInputChange}
        handleDataRequestClose={handleAddDataRequestClose}
        handleJsonInput={handleJsonInput}
        actionName="Create"
        onSubmit={handleSubmitButton}
        handleAddClick={handleAddClick}
        handleRemoveClick={handleRemoveClick}
      />
    ) : (
      <AddOrEditTPIRequestPayloadMasterField
        isEditMode={state.isEditMode}
        doesFormDialogOpen={state.editFormDialogOpen}
        errors={state.errors}
        validation={state.validation}
        productMapList={state.productMapList}
        actionTypes={state.actionTypes}
        valueTypes={state.valueTypes}
        handleChange={handleChange}
        handleInputChange={handleInputChange}
        handleDataRequestClose={handleEditClose}
        handleJsonInput={handleJsonInput}
        actionName="Update"
        id={state.selectedEditId}
        onSubmit={handleUpdateButton}
        handleAddClick={handleAddClick}
        handleRemoveClick={handleRemoveClick}
      />
    );
  }

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
    const res = await apigetUrl(
      `/tpi/${apiPathKey}/product/map/checks?page=${state.page}&limit=${state.limit}&sortBy=${state.sortBy}&sortType=${state.sortType}`
    );
    if (res.data && res.data.dataList) {
      setTimeout(() => {
        setState((prevState) => ({
          ...prevState,
          data: res.data.dataList,
          isLoading: false,
        }));
      }, 1000);
    }
  };

  const deleteItemInBackend = async (id) => {
    apideleteUrl(`/tpi/${apiPathKey}/product/map/checks/${id}`).then((res) => {
      if (`${res.status}` !== "200") {
        showLoader();
        ippNotify.error((res.data || {}).responseMessage || "");
        setState((prevState) => ({
          ...prevState,
          deleteFormDialogOpen: false,
          isErrorAlert: true,
          errorMsg: (res.data || {}).responseMessage || "",
        }));
        return false;
      }
      setTimeout(() => {
        getProductMapResponseCheckList();

        ippNotify.success("Successfully Deleted");
        setState((prevState) => ({
          ...prevState,
          deleteFormDialogOpen: false,
          isSuccessAlert: true,
          successMsg: "Successfully Deleted",
          isLoading: false,
        }));
      }, 1000);
    });
  };

  const deleteForm_NoConfirm = () => {
    setState((prevState) => ({ ...prevState, deleteItem_DialogOpen: false }));
  };

  const deleteForm_YesConfirm = () => {
    deleteItemInBackend(state.selectedDeleteId);
    setState((prevState) => ({
      ...prevState,
      deleteItem_DialogOpen: false,
      isLoading: true,
    }));
  };

  const handle_Delete_Item_RequestClose = () => {
    setState((prevState) => ({
      ...prevState,
      deleteItem_DialogOpen: false,
      errors: {},
    }));
  };

  const deleteItem_content = (
    <>
      <DialogTitle>
        <IntlMessages id="ipp.common.modal.deleteconfirmation.title" />
      </DialogTitle>
      <DialogContent>
        <p>
          <b>
            <IntlMessages id="ipp.common.modal.deleteconfirmation.message" />
          </b>
        </p>
      </DialogContent>
      <DialogActions>
        <Button onClick={(e) => deleteForm_YesConfirm(e)} color="secondary">
          <IntlMessages id="ipp.common.Yes.button" />
        </Button>
        <Button onClick={(e) => deleteForm_NoConfirm(e)} color="primary">
          <IntlMessages id="ipp.common.No.button" />
        </Button>
      </DialogActions>
    </>
  );

  return (
    <>
      {state.isLoading ? <Loader /> : null}
      <div className="int-tab-body" style={{ flex: "auto" }}>
        <div>
          {!(state.addFormDialogOpen || state.editFormDialogOpen)
            ? ""
            : getFormContent()}
        </div>
        <div style={{ textAlign: "right", padding: "10px" }}>
          <Button
            variant="contained"
            color="primary"
            // className={classes_AddButton.button}
            startIcon={<AddIcon />}
            onClick={() => onAddButtonClick()}
          >
            <IntlMessages id="ipp.common.ADD.button" />
          </Button>
        </div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={style}>
                <Tooltip title="Sort" enterDelay={300}>
                  <TableSortLabel
                    active={true}
                    direction={
                      state.sortBy === "productMapId" ? state.sortType : "asc"
                    }
                    onClick={(e) => handleRequestSort(e, "productMapId")}
                  >
                    <IntlMessages id="InsurancePrivider.TPI.ProductMapResponseCheck.ProductMapId" />
                  </TableSortLabel>
                </Tooltip>
              </TableCell>

              <TableCell style={style}>
                <Tooltip title="Sort" enterDelay={300}>
                  <TableSortLabel
                    active={true}
                    direction={
                      state.sortBy === "actionType" ? state.sortType : "asc"
                    }
                    onClick={(e) => handleRequestSort(e, "actionType")}
                  >
                    <IntlMessages id="InsurancePrivider.TPI.ProductMapResponseCheck.ActionType" />
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
              {/* <TableCell style={style}>
              <IntlMessages id="InsurancePrivider.TPI.ProductMapResponseCheck.IsDeleted" />
            </TableCell> */}
              <TableCell align="center" width="15%">
                <IntlMessages id="InsurancePrivider.TPI.tableheader.Actions.label" />
              </TableCell>
            </TableRow>
          </TableHead>
          {state.data.length === 0 ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan="3">
                  <InfoModal message={"Your query did not match any results"} />
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {state.data.map((n) => {
                let productName = (
                  state.productMapList.filter(
                    (p) => p.id === n.productMapId
                  )[0] || {}
                ).customizedName;
                let actionTypeName = (
                  state.actionTypes.filter((a) => a.id === n.actionType)[0] ||
                  {}
                ).name;
                return (
                  <TableRow key={n.id}>
                    <TableCell align="left" width="10%">
                      {productName}
                    </TableCell>
                    <TableCell align="left" width="10%">
                      {actionTypeName}
                    </TableCell>
                    {/* <TableCell align="left" width="10%">
                        {n.name}
                      </TableCell> */}
                    <TableCell align="center" width="15%" padding="none">
                      <IconButton
                        id={n.id}
                        onClick={(e) => onTableEditButtonClick(e, n.id)}
                      >
                        <EditIcon color="primary" />
                      </IconButton>
                      <IconButton
                        id={n.id}
                        onClick={(e) => onTableDeleteButtonClick(e, n.id)}
                      >
                        <DeleteIcon color="secondary" />
                      </IconButton>
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
        <div className="float-right mt-4">
          <InputCancelButton onClick={(e) => handleEditDataRequestClose(e)} />
          {/* <Button
            variant="contained"
            // onClick={(e) => handleEditFormDataSubmit(e)}
            disabled={!state.isEditFormSubmitDisabled}
            color="primary"
          >
            Submit
          </Button> */}
        </div>
        <Dialog
          maxWidth="sm"
          open={state.deleteItem_DialogOpen}
          onClose={handle_Delete_Item_RequestClose}
        >
          {deleteItem_content}
        </Dialog>
        <IPPNotification />
      </div>
    </>
  );
};

export default TPIProductMapResponseCheck;

const AddOrEditTPIRequestPayloadMasterField = (props) => {
  let {
    errors,
    validation,
    handleChange,
    handleInputChange,
    handleDataRequestClose,
    doesFormDialogOpen,
    handleSubmitButton,
    handleUpdateButton,
    handleJsonInput,
    isEditMode,
    productMapList,
    actionTypes,
    valueTypes,
    isAddFormSubmitDisabled,
    actionName,
    onSubmit,
    id,
    handleAddClick,
    handleRemoveClick,
  } = props;
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleAccordion = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Dialog
      maxWidth="md"
      open={doesFormDialogOpen || false}
      onClose={handleDataRequestClose}
    >
      <DialogTitle>
        {isEditMode ? (
          <IntlMessages id="InsurancePrivider.TPI.ProductMapResponseCheck.modal.edit.tilte" />
        ) : (
          <IntlMessages id="InsurancePrivider.TPI.ProductMapResponseCheck.modal.add.tilte" />
        )}
      </DialogTitle>
      <DialogContent>
        <div className="row">
          <div className="col-lg-6">
            <FormControl
              variant="outlined"
              className={classes.formControl}
              required
              error={errors.ProductMapId}
              fullWidth
            >
              <InputLabel id="demo-simple-select-outlined-label">
                <IntlMessages id="InsurancePrivider.TPI.ProductMapResponseCheck.ProductMapId" />
              </InputLabel>
              <InputSelect
                labelId="ProductMapId"
                name="ProductMapId"
                id="ProductMapId"
                value={validation.ProductMapId}
                onChange={handleChange}
                renderValue={(value) => `${value}`}
                label="Product Map"
                required
              >
                <MenuItem value="">
                  <em>Select</em>
                </MenuItem>
                {productMapList.map((option) => (
                  <MenuItem
                    name="fieldType"
                    key={option.id}
                    attfieldtypesname={option.customizedName}
                    value={option.id}
                  >
                    {option.customizedName}
                  </MenuItem>
                ))}
              </InputSelect>
              {!errors.ProductMapId ? null : (
                <FormHelperText style={{ color: "red" }}>
                  {errors.ProductMapId}
                </FormHelperText>
              )}
            </FormControl>
          </div>
          <div className="col-lg-6">
            <FormControl
              variant="outlined"
              className={classes.formControl}
              required
              error={errors.ActionType}
              fullWidth
            >
              <InputLabel id="demo-simple-select-outlined-label">
                <IntlMessages id="InsurancePrivider.TPI.ProductMapResponseCheck.ActionType" />
              </InputLabel>
              <InputSelect
                labelId="ActionType"
                name="ActionType"
                id="ActionType"
                value={validation.ActionType}
                onChange={handleChange}
                renderValue={(value) => `${value}`}
                label="ActionType"
                required
              >
                <MenuItem value="">
                  <em>Select</em>
                </MenuItem>
                {actionTypes.map((option) => (
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
              {!errors.ActionType ? null : (
                <FormHelperText style={{ color: "red" }}>
                  {errors.ActionType}
                </FormHelperText>
              )}
            </FormControl>
          </div>
          <div className="col-lg-12" style={{ marginTop: "10px" }}>
            <Accordion
              expanded={expanded === "SuccessCheck"}
              onChange={handleAccordion("SuccessCheck")}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
                style={{ backgroundColor: "gainsboro" }}
              >
                <Typography className={classes.heading}>
                  <IntlMessages id="InsurancePrivider.TPI.ProductMapResponseCheck.SuccessCheck" />
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Table style={{ backgroundColor: "gainsboro" }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        {" "}
                        <h4>Path</h4>{" "}
                      </TableCell>
                      <TableCell>
                        {" "}
                        <h4>Expected Value</h4>{" "}
                      </TableCell>
                      <TableCell>
                        {" "}
                        <h4>Value Type</h4>{" "}
                      </TableCell>
                      <TableCell>
                        {" "}
                        <h4>Action</h4>{" "}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(validation.SuccessCheck || []).map((obj, i) => {
                      let erroObj =
                        (errors["SuccessCheck"] && errors["SuccessCheck"][i]) ||
                        {};
                      return (
                        <TableRow key={i}>
                          <TableCell>
                            <InputField
                              required
                              autoFocus
                              id="path"
                              className={classes.formControl}
                              label={
                                <IntlMessages id="InsurancePrivider.TPI.ProductMapResponseCheck.Path" />
                              }
                              name="path"
                              onChange={(e) =>
                                handleInputChange(e, i, "SuccessCheck")
                              }
                              value={obj.path}
                              fullWidth
                              error={erroObj && erroObj.path}
                              helperText={erroObj && erroObj.path}
                            />
                          </TableCell>
                          <TableCell>
                            <InputField
                              required
                              autoFocus
                              id="expectedValue"
                              className={classes.formControl}
                              label={
                                <IntlMessages id="InsurancePrivider.TPI.ProductMapResponseCheck.ExpectedValue" />
                              }
                              name="expectedValue"
                              onChange={(e) =>
                                handleInputChange(e, i, "SuccessCheck")
                              }
                              value={obj.expectedValue}
                              fullWidth
                              error={erroObj && erroObj.expectedValue}
                              helperText={erroObj && erroObj.expectedValue}
                            />
                          </TableCell>
                          <TableCell>
                            <FormControl
                              variant="outlined"
                              className={classes.formControl}
                              required
                              error={erroObj && erroObj.valueType}
                              fullWidth
                            >
                              <InputLabel id="demo-simple-select-outlined-label">
                                <IntlMessages id="InsurancePrivider.TPI.ProductMapResponseCheck.ValueType" />
                              </InputLabel>
                              <InputSelect
                                labelId="valueType"
                                name="valueType"
                                id="valueType"
                                value={obj.valueType || ""}
                                onChange={(e) =>
                                  handleInputChange(e, i, "SuccessCheck")
                                }
                                renderValue={(value) => `${value}`}
                                label="valueType"
                              >
                                <MenuItem value="">
                                  <em>Select</em>
                                </MenuItem>
                                {valueTypes.map((option) => (
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
                              {!erroObj.valueType ? null : (
                                <FormHelperText style={{ color: "red" }}>
                                  {erroObj.valueType}
                                </FormHelperText>
                              )}
                            </FormControl>
                          </TableCell>
                          <TableCell>
                            {validation.SuccessCheck.length - 1 === i && (
                              <AddCircleOutlineIcon
                                style={{
                                  cursor: "pointer",
                                  marginRight: "10px",
                                }}
                                onClick={(e) =>
                                  handleAddClick(e, "SuccessCheck")
                                }
                              />
                            )}
                            {validation.SuccessCheck.length !== 1 && (
                              <RemoveCircleOutlineIcon
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                  handleRemoveClick(i, "SuccessCheck")
                                }
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </AccordionDetails>
            </Accordion>
          </div>
          <div className="col-lg-12" style={{ marginTop: "10px" }}>
            <Accordion
              expanded={expanded === "FailureMessage"}
              onChange={handleAccordion("FailureMessage")}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
                style={{ backgroundColor: "gainsboro" }}
              >
                <Typography className={classes.heading}>
                  <IntlMessages id="InsurancePrivider.TPI.ProductMapResponseCheck.FailureMessage" />
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Table style={{ backgroundColor: "gainsboro" }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        {" "}
                        <h4>Path</h4>{" "}
                      </TableCell>
                      <TableCell>
                        {" "}
                        <h4>Action</h4>{" "}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(validation.FailureMessage || []).map((obj, i) => {
                      let erroObj =
                        (errors["FailureMessage"] &&
                          errors["FailureMessage"][i]) ||
                        {};
                      return (
                        <TableRow key={i}>
                          <TableCell>
                            <InputField
                              required
                              autoFocus
                              id="path"
                              className={classes.formControl}
                              label={
                                <IntlMessages id="InsurancePrivider.TPI.ProductMapResponseCheck.Path" />
                              }
                              name="path"
                              onChange={(e) =>
                                handleInputChange(e, i, "FailureMessage")
                              }
                              value={obj.path}
                              fullWidth
                              error={erroObj && erroObj.path}
                              helperText={erroObj && erroObj.path}
                            />
                          </TableCell>
                          <TableCell>
                            {validation.FailureMessage.length - 1 === i && (
                              <AddCircleOutlineIcon
                                style={{
                                  cursor: "pointer",
                                  marginRight: "10px",
                                }}
                                onClick={(e) =>
                                  handleAddClick(e, "FailureMessage")
                                }
                              />
                            )}
                            {validation.FailureMessage.length !== 1 && (
                              <RemoveCircleOutlineIcon
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                  handleRemoveClick(i, "FailureMessage")
                                }
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </AccordionDetails>
            </Accordion>
          </div>
          <div className="col-lg-12" style={{ marginTop: "10px" }}>
            <Accordion
              expanded={expanded === "DetailedMessage"}
              onChange={handleAccordion("DetailedMessage")}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
                style={{ backgroundColor: "gainsboro" }}
              >
                <Typography className={classes.heading}>
                  <IntlMessages id="InsurancePrivider.TPI.ProductMapResponseCheck.DetailedMessage" />
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Table style={{ backgroundColor: "gainsboro" }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        {" "}
                        <h4>Path</h4>{" "}
                      </TableCell>
                      <TableCell>
                        {" "}
                        <h4>Action</h4>{" "}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(validation.DetailedMessage || []).map((obj, i) => {
                      let erroObj =
                        (errors["DetailedMessage"] &&
                          errors["DetailedMessage"][i]) ||
                        {};
                      return (
                        <TableRow key={i}>
                          <TableCell>
                            <InputField
                              required
                              autoFocus
                              id="path"
                              className={classes.formControl}
                              label={
                                <IntlMessages id="InsurancePrivider.TPI.ProductMapResponseCheck.Path" />
                              }
                              name="path"
                              onChange={(e) =>
                                handleInputChange(e, i, "DetailedMessage")
                              }
                              value={obj.path}
                              fullWidth
                              error={erroObj && erroObj.path}
                              helperText={erroObj && erroObj.path}
                            />
                          </TableCell>
                          <TableCell>
                            {validation.DetailedMessage.length - 1 === i && (
                              <AddCircleOutlineIcon
                                style={{
                                  cursor: "pointer",
                                  marginRight: "10px",
                                }}
                                onClick={(e) =>
                                  handleAddClick(e, "DetailedMessage")
                                }
                              />
                            )}
                            {validation.DetailedMessage.length !== 1 && (
                              <RemoveCircleOutlineIcon
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                  handleRemoveClick(i, "DetailedMessage")
                                }
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </AccordionDetails>
            </Accordion>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <InputCancelButton onClick={(e) => handleDataRequestClose(e)} />
        <InputSubmitButton
          onClick={(e) => onSubmit(e, id)}
          // disabled={!isAddFormSubmitDisabled}
        />
      </DialogActions>
    </Dialog>
  );
};
