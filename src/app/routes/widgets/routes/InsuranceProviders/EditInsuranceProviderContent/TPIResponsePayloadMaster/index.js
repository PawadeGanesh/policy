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
  IconButton,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import TablePaginationComponent from "../../../CommonComponents/TablePaginationComponent";
import IntlMessages from "util/IntlMessages";
import InfoModal from "../../../Modal/Info";
import AddIcon from "@material-ui/icons/Add";
import ResponsePayloadMasterFrom from "./AddTPIResponsePayloadMasterField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import apiInstance from "../../../../../../../setup/index";
import Joi from "joi-browser";
import SuccessModal from "../../../Modal/Success";
import ErrorModal from "../../../Modal/Error";
import {
  apigetUrl,
  apipostUrl,
  apiputUrl,
  apideleteUrl,
} from "../../../../../../../setup/middleware";
import InputCancelButton from "../../../CommonComponents/CancelButton";
import {
  IPPNotification,
  ippNotify,
} from "../../../CommonComponents/IPPNotification";
import { getRecordsPerPage } from "../../../../../../../setup/ApplicatoinConfigurations.js";
import Loader from "../../../CommonComponents/Loader";

const schema = {
  PayloadFieldName: Joi.string()
    .required()
    .label("Payload Field Name"),
  ProductName: Joi.number()
    .required()
    .label("Product Name"),
  ValueType: Joi.number()
    .required()
    .label("Value Type"),
  FieldPath: Joi.string()
    .required()
    .label("Field Ids"),
  ActionType: Joi.number()
    .required()
    .label("Field Ids"),
};

const baseURL = `${process.env.REACT_APP_BASE_URL}`;

const TPIResponsePayloadMaster = ({
  checkedProductList,
  handleEditDataRequestClose,
  apiPathKey,
}) => {
  console.log("##checkedProductList", checkedProductList);

  const [state, setState] = useState({
    isLoading: true,
    reqeustPayloadItems: [],
    isEditFormOpened: false,
    tabValue:
      (checkedProductList &&
        checkedProductList[0] &&
        checkedProductList[0].id) ||
      0,
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
    errors: {},
    validation: {
      PayloadFieldName: "",
      ProductName:
        (checkedProductList &&
          checkedProductList[0] &&
          checkedProductList[0].id) ||
        "",
      ValueType: "",
      FieldPath: "",
      ActionType: "",
    },
    isEditFormSubmitDisabled: true,
    isEditMode: false,
    selectedEditId: null,
    valueTypes: [],
    actionTypes: [],
    ActionType: "",
    SuccessCheck: [],
    FailureMessage: [],
    DetailedMessage: [],
    deleteItem_DialogOpen: false,
    selectedDeleteId: null,
  });

  useEffect(() => {
    getResponsePayloadMasterInfoByProductMapId(state.tabValue);
    getValueTypes();
    getActionTypes();
  }, []);

  const showLoader = () => {
    setTimeout(() => {
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
      }));
    }, 5000);
  };

  const getResponsePayloadMasterInfoByProductMapId = (productId) => {
    apigetUrl(
      `/tpi/${apiPathKey}/payload/response/${productId}?page=${state.page}&limit=${state.limit}`
    ).then((res) => {
      console.log("Response-123", res);
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
        }, 1000);
      }
    });
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

  const handleTabChange = (event, value) => {
    getResponsePayloadMasterInfoByProductMapId(value);
    retractCurrentTabOpenAccordians(state.tabValue);
    let { validation } = state;
    validation.ProductName = value;
    setState((prevState) => ({
      ...prevState,
      tabValue: value,
      validation,
    }));
    //callTabData(value);
  };

  const retractCurrentTabOpenAccordians = () => {
    // console.log("state.expanded = ", state.expansionPanelOpen);
  };

  // this fun. will handle to 'close' the Dialog
  const handleAddDataRequestClose = (e) => {
    setState((prevState) => ({
      ...prevState,
      addFormDialogOpen: false,
      validation: {
        PayloadFieldName: "",
        ProductName: prevState.tabValue,
        ValueType: "",
        FieldPath: "",
        ActionType: "",
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
      selectedEditId: null,
      validation: {
        PayloadFieldName: "",
        ProductName: prevState.tabValue,
        ValueType: "",
        FieldPath: "",
        ActionType: "",
      },
      errors: {},
    }));
  };

  // this fun. will handle to 'open' the Dialog
  const onAddButtonClick = (e) => {
    setState((prevState) => ({
      ...prevState,
      addFormDialogOpen: true,
    }));
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
    // debugger;
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

    validation[input.name] = input.value;
    // debugger;
    setState((prevState) => ({
      ...prevState,
      validation,
      errors,
      fieldPopulated: allFormFieldsPopulated && isObjEmpty(errors),
      isEditFormSubmitDisabled: allFormFieldsPopulated && isObjEmpty(errors),
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

  const checkAreAllAddFormFieldsPopulated = (obj) => {
    return !Object.values(obj).some((x) => x === "");
  };

  const handleAddFormDataSubmit = (e, productId, id = null) => {
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    console.log("##formData: ", state.validation);
    // debugger;
    // AddNewDataInBackend();
    let payload = {
      ProductId: state.validation.ProductName,
      fieldName: state.validation.PayloadFieldName,
      valueType: state.validation.ValueType,
      fieldPath: state.validation.FieldPath,
      actionType: state.validation.ActionType,
    };

    apipostUrl(
      `/tpi/${apiPathKey}/payload/response/${productId}`,
      payload
    ).then((res) => {
      if (`${res.status}` !== "200") {
        showLoader();
        ippNotify.error((res.data || {}).responseMessage || "");
        return false;
      }

      handleAddDataRequestClose();
      setTimeout(() => {
        getResponsePayloadMasterInfoByProductMapId(state.tabValue);

        ippNotify.success("Successfully New Data is Added");
        setState((prevState) => ({
          ...prevState,
          isLoading: false,
        }));
      }, 1000);

      // setState((prevState) => ({
      //   ...prevState,
      //   isSuccessAlert: true,
      //   successMsg: "Successfully New Data is Added"
      // }));
    });
  };

  const handleEditFormDataSubmit = (e, productId, id = "") => {
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    console.log("##formData: ", state.validation);
    let payload = {
      ProductId: state.validation.ProductName,
      fieldName: state.validation.PayloadFieldName,
      valueType: state.validation.ValueType,
      fieldPath: state.validation.FieldPath,
      actionType: state.validation.ActionType,
      rowVersion: state.validation.rowVersion,
    };

    apiputUrl(
      `/tpi/${apiPathKey}/payload/response/${productId}/${id}`,
      payload
    ).then((res) => {
      if (`${res.data.responseCode}` !== "200") {
        showLoader();
        ippNotify.error((res.data || {}).responseMessage || "");
        return false;
      }

      handleEditClose();
      setTimeout(() => {
        getResponsePayloadMasterInfoByProductMapId(state.tabValue);

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
    });
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

  const onTableEditButtonClick = async (event, productId, id) => {
    const result = await apigetUrl(
      `/tpi/${apiPathKey}/payload/response/${productId}/${id}?page=1&limit=100`
    );
    if (result.data.responseCode === "200") {
      setState((prevState) => ({
        ...prevState,
        isEditMode: true,
        editFormDialogOpen: true,
        selectedEditId: id,
        validation: {
          PayloadFieldName: result.data.fieldName,
          ProductName: result.data.productId,
          ValueType: result.data.valueType,
          FieldPath: result.data.fieldPath,
          ActionType: result.data.actionType,
          rowVersion: result.data.rowVersion,
        },
      }));

      // if (result.data.secData != "") {
      //   for (var i = 0; i < state.forEachFieldOptions.length; i++) {
      //     if (state.forEachFieldOptions[i].id == result.data.secData) {
      //       checkAndLoadTitleFields(
      //         state.forEachFieldOptions[i].fieldComposition,
      //         state.forEachFieldOptions[i].id
      //       );
      //     }
      //   }
      // }
    } else {
      ippNotify.error(result.data.responseMessage);
      // setState((prevState) => ({
      //   ...prevState,
      //   isErrorAlert: true,
      //   errorMsg: result.data.responseMessage,
      // }));
    }
  };

  const onTableDeleteButtonClick = (event, productId, id) => {
    setState((prevState) => ({
      ...prevState,
      deleteItem_DialogOpen: true,
      selectedDeleteId: id,
    }));
    // axios
    //   .delete(`${baseURL}/tpi/${apiPathKey}/payload/response/${productId}/${id}`, apiInstance)
    //   .then((res) => {
    //     console.log("Response of Add Submit", res.data);
    //     getResponsePayloadMasterInfoByProductMapId(state.tabValue);

    //     setState((prevState) => ({
    //       ...prevState,
    //       isSuccessAlert: true,
    //       successMsg: "Successfully Deleted"
    //     }));
    //   })
    //   .catch((err) => {
    //     console.log("err", err);
    //     setState((prevState) => ({
    //       ...prevState,
    //       isErrorAlert: true,
    //       errorMsg: (err.response.data || {}).responseMessage || ''
    //     }));
    //   });
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
      `/tpi/${apiPathKey}/payload/response/${
        state.tabValue
      }?page=${1}&limit=${count}&sortBy=${state.sortBy}&sortType=${
        state.sortType
      }`
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
      ippNotify.error(result.data.responseMessage);
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
      `/tpi/${apiPathKey}/payload/response/${state.tabValue}?page=${pageNumber}&limit=${limit}&sortBy=${state.sortBy}&sortType=${state.sortType}`
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
      ippNotify.error(result.data.responseMessage);
      // setState((prevState) => ({
      //   ...prevState,
      //   isErrorAlert: true,
      //   errorMsg: result.data.responseMessage,
      // }));
    }
  };

  function getFormContent(tabValue) {
    return state.addFormDialogOpen ? (
      <ResponsePayloadMasterFrom
        isEditMode={state.isEditMode}
        productId={tabValue}
        validation={state.validation}
        errors={state.errors}
        doesFormDialogOpen={state.addFormDialogOpen}
        handleDataRequestClose={handleAddDataRequestClose}
        handleChange={handleChange}
        onSubmit={handleAddFormDataSubmit}
        actionName="Create"
        checkedProductList={checkedProductList}
        valueTypes={state.valueTypes}
        actionTypes={state.actionTypes}
      />
    ) : (
      <ResponsePayloadMasterFrom
        isEditMode={state.isEditMode}
        productId={tabValue}
        validation={state.validation}
        errors={state.errors}
        doesFormDialogOpen={state.editFormDialogOpen}
        handleDataRequestClose={handleEditClose}
        handleChange={handleChange}
        onSubmit={handleEditFormDataSubmit}
        actionName="Update"
        id={state.selectedEditId}
        checkedProductList={checkedProductList}
        valueTypes={state.valueTypes}
        actionTypes={state.actionTypes}
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
      `/tpi/${apiPathKey}/payload/response/${state.tabValue}?page=${state.page}&limit=${state.limit}&sortBy=${state.sortBy}&sortType=${state.sortType}`
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
    let productId = state.tabValue;
    apideleteUrl(`/tpi/${apiPathKey}/payload/response/${productId}/${id}`).then(
      (res) => {
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
          getResponsePayloadMasterInfoByProductMapId(state.tabValue);

          ippNotify.success("Successfully Deleted");
          setState((prevState) => ({
            ...prevState,
            deleteFormDialogOpen: false,
            isSuccessAlert: true,
            successMsg: "Successfully Deleted",
            isLoading: false,
          }));
        }, 1000);
      }
    );
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

  const getTabContent = (tabValue) => {
    // getRequestPayloadMasterData(); // This function will call API to fetch info from BE
    const style = {
      width: "15%",
      // disablePadding: true,
    };

    return (
      <>
        {state.isLoading ? <Loader /> : null}
        <div className="cardBox" style={{ flex: "auto" }}>
          <div>
            {!(state.addFormDialogOpen || state.editFormDialogOpen)
              ? ""
              : getFormContent(tabValue)}
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
                <TableCell width="40%">
                  <Tooltip title="Sort" enterDelay={300}>
                    <TableSortLabel
                      active={true}
                      direction={
                        state.sortBy === "fieldName" ? state.sortType : "asc"
                      }
                      onClick={(e) => handleRequestSort(e, "fieldName")}
                    >
                      <IntlMessages id="InsurancePrivider.TPI.ResponsePayloadMaster.PayloadFieldName" />
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
                {/* <TableCell style={style}>
                <Tooltip title="Sort" enterDelay={300}>
                  <TableSortLabel
                    active={true}
                  // direction={order}
                  // onClick={createSortHandler("key")}
                  >
                    <IntlMessages id="InsurancePrivider.TPI.ResponsePayloadMaster.ProductName" />
                  </TableSortLabel>
                </Tooltip>
              </TableCell> */}
                <TableCell width="20%">
                  <IntlMessages id="InsurancePrivider.TPI.ResponsePayloadMaster.ValueType" />
                </TableCell>
                <TableCell width="20%">
                  <IntlMessages id="InsurancePrivider.TPI.ResponsePayloadMaster.ActionType" />
                </TableCell>
                <TableCell align="center" width="20%">
                  <IntlMessages id="InsurancePrivider.TPI.tableheader.Actions.label" />
                </TableCell>
              </TableRow>
            </TableHead>
            {state.data.length === 0 ? (
              <TableBody>
                <TableRow>
                  <TableCell>
                    <InfoModal
                      message={"Your query did not match any results"}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>
                {state.data.map((n) => {
                  let actionTypeName = (
                    state.actionTypes.filter((p) => p.id === n.actionType)[0] ||
                    {}
                  ).name;
                  let valueTypeName = (
                    state.valueTypes.filter((p) => p.id === n.valueType)[0] ||
                    {}
                  ).name;
                  return (
                    <TableRow key={n.id}>
                      <TableCell align="left" width="10%">
                        {n.fieldName}
                      </TableCell>
                      {/* <TableCell align="left" width="10%">
                          {n.name}
                        </TableCell> */}
                      <TableCell align="left" width="10%">
                        {valueTypeName || ""}
                      </TableCell>
                      <TableCell align="left" width="10%">
                        {actionTypeName || ""}
                      </TableCell>
                      <TableCell align="center" width="15%" padding="none">
                        <IconButton
                          id={n.id}
                          onClick={(e) =>
                            onTableEditButtonClick(e, state.tabValue, n.id)
                          }
                        >
                          <EditIcon color="primary" />
                        </IconButton>
                        <IconButton
                          id={n.id}
                          onClick={(e) =>
                            onTableDeleteButtonClick(e, state.tabValue, n.id)
                          }
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
        </div>
      </>
    );
  };

  return (
    <div>
      {checkedProductList.length === 0 ? (
        <div>
          <h4
            style={{
              fontSize: "x-large",
              fontWeight: "bold",
              color: "grey",
              textAlign: "center",
            }}
          >
            You were not selected any products in previous screen
          </h4>
        </div>
      ) : (
        <div className="row">
          <AppBar position="static" color="default">
            <Tabs
              //indicatorColor="primary"
              //textColor="primary"
              value={state.tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="on"
            >
              {(checkedProductList || []).map((n, i) => {
                return (
                  <Tab
                    value={n.id}
                    label={n.name}
                    id={n.id}
                    key={n.id}
                    // typeId={n.typeId}
                  />
                );
              })}
            </Tabs>
          </AppBar>
          <br />
          {getTabContent(state.tabValue)}
          <IPPNotification />
        </div>
      )}
    </div>
  );
};

export default TPIResponsePayloadMaster;
