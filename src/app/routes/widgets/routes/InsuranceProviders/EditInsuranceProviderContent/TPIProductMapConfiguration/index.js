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
import InputAutocomplete from "../../../CommonComponents/Autocomplete";
import InputSubmitButton from "../../../CommonComponents/SubmitButton";
import InputCancelButton from "../../../CommonComponents/CancelButton";
import {
  IPPNotification,
  ippNotify,
} from "../../../CommonComponents/IPPNotification";
import { getRecordsPerPage } from "../../../../../../../setup/ApplicatoinConfigurations.js";
import Loader from "../../../CommonComponents/Loader";

const schema = {
  ProductMapId: Joi.number()
    .required()
    .label("Product Map Id"),
  ConfigurationDetails: Joi.string()
    .required()
    .label("Configuration Details"),
};

const baseURL = `${process.env.REACT_APP_BASE_URL}`;

const TPIProductMapConfiguration = ({
  checkedProductList,
  handleEditDataRequestClose,
  mappedProductDetail,
  apiPathKey,
}) => {
  console.log("##checkedProductList", checkedProductList);
  console.log("##mappedProductDetail", mappedProductDetail);

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
    validation: {
      ProductMapId: "",
      ConfigurationDetails: {},
      rowVersion: null,
    },
    errors: {},
    isEditMode: false,
    isAddMode: false,
    successMsg: "",
    errorMsg: "",
    isSuccessAlert: false,
    isErrorAlert: false,
    deleteItem_DialogOpen: false,
    selectedDeleteId: null,
    productMapListForCreate: mappedProductDetail || [],
  });

  useEffect(() => {
    getProductMapConfigList();
    checkForValidProductMapList();
  }, []);

  const showLoader = () => {
    setTimeout(() => {
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
      }));
    }, 5000);
  };

  const getProductMapConfigList = () => {
    apigetUrl(
      `/tpi/${apiPathKey}/product/map/config?page=${state.page}&limit=${state.limit}`
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
        }, 1000);
      }
    });
  };

  const checkForValidProductMapList = async () => {
    let res = await getAllProductMapConfigList();
    if (res.data && `${res.data.responseCode}` === "200") {
      let { dataList } = res.data;
      let resultedProductMapConfigList = mappedProductDetail.filter((p) => {
        if (!dataList.find((obj) => obj.productMapId === p.id)) {
          return true;
        }
        return false;
      });
      setState((prevState) => ({
        ...prevState,
        productMapListForCreate: resultedProductMapConfigList,
      }));
    }
  };

  const getAllProductMapConfigList = () => {
    return apigetUrl(`/tpi/${apiPathKey}/product/map/config?page=1&limit=1000`);
  };

  // this fun. will handle to 'close' the Dialog
  const handleAddDataRequestClose = (e) => {
    setState((prevState) => ({
      ...prevState,
      addFormDialogOpen: false,
      isAddMode: false,
      validation: {
        ProductMapId: "",
        ConfigurationDetails: {},
        rowVersion: null,
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
        ConfigurationDetails: {},
        rowVersion: null,
      },
      errors: {},
    }));
  };

  const handleSubmitButton = (e, id = null) => {
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    const payload = {
      productMapId: state.validation.ProductMapId,
      configDetails: state.validation.ConfigurationDetails,
    };

    apipostUrl(`/tpi/${apiPathKey}/product/map/config`, payload).then((res) => {
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
        getProductMapConfigList();
        checkForValidProductMapList();
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
      configDetails: state.validation.ConfigurationDetails,
      rowVersion: state.validation.rowVersion,
    };

    apiputUrl(`/tpi/${apiPathKey}/product/map/config/${id}`, payload).then(
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
          getProductMapConfigList();
          checkForValidProductMapList();
          setState((prevState) => ({
            ...prevState,
            isLoading: false,
          }));

          ippNotify.success("Successfully Updated");
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

  // this fun. will handle to 'open' the Dialog
  const onAddButtonClick = (e) => {
    setState((prevState) => ({
      ...prevState,
      addFormDialogOpen: true,
      isAddMode: true,
    }));
  };
  // getRequestPayloadMasterData(); // This function will call API to fetch info from BE

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
      `/tpi/${apiPathKey}/product/map/config?page=${1}&limit=${count}&sortBy=${
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
      `/tpi/${apiPathKey}/product/map/config?page=${pageNumber}&limit=${limit}&sortBy=${state.sortBy}&sortType=${state.sortType}`
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

  const stringToJSON = (value) => {
    try {
      let res = JSON.parse(value, null, 4);
      switch (typeof res) {
        case "string":
          return stringToJSON(res);
        case "object":
          return res;
        default:
          return {};
      }
    } catch (error) {
      return {};
    }
  };

  const onTableEditButtonClick = async (event, id) => {
    const result = await apigetUrl(
      `/tpi/${apiPathKey}/product/map/config/${id}?page=1&limit=100`
    );
    if (result.data.responseCode === "200") {
      setState((prevState) => ({
        ...prevState,
        isEditMode: true,
        editFormDialogOpen: true,
        selectedEditId: id,
        validation: {
          ProductMapId: result.data.productMapId,
          ConfigurationDetails: stringToJSON(result.data.configDetails),
          rowVersion: result.data.rowVersion,
        },
      }));
    } else {
      ippNotify.error(result.data.responseMessage);
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
    //   .delete(`${baseURL}/tpi/${apiPathKey}/product/map/config/${id}`, apiInstance)
    //   .then((res) => {
    //     getProductMapConfigList();

    //     setState((prevState) => ({
    //       ...prevState,
    //       isSuccessAlert: true,
    //       successMsg: "Successfully Deleted"
    //     }));
    //   })
    //   .catch((err) => {
    //     console.log("err", err);
    //   });
  };

  function getFormContent() {
    return state.addFormDialogOpen ? (
      <Form
        isEditMode={state.isEditMode}
        isAddMode={state.isAddMode}
        doesFormDialogOpen={state.addFormDialogOpen}
        errors={state.errors}
        validation={state.validation}
        // productMapList={state.productMapListForCreate}
        productMapList={state.productMapList}
        handleChange={handleChange}
        handleDataRequestClose={handleAddDataRequestClose}
        handleJsonInput={handleJsonInput}
        actionName="Create"
        onSubmit={handleSubmitButton}
      />
    ) : (
      <Form
        isEditMode={state.isEditMode}
        isAddMode={state.isAddMode}
        doesFormDialogOpen={state.editFormDialogOpen}
        errors={state.errors}
        validation={state.validation}
        productMapList={state.productMapList}
        handleChange={handleChange}
        handleDataRequestClose={handleEditClose}
        handleJsonInput={handleJsonInput}
        actionName="Update"
        id={state.selectedEditId}
        onSubmit={handleUpdateButton}
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
      `/tpi/${apiPathKey}/product/map/config?page=${state.page}&limit=${state.limit}&sortBy=${state.sortBy}&sortType=${state.sortType}`
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
    apideleteUrl(`/tpi/${apiPathKey}/product/map/config/${id}`).then((res) => {
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
        getProductMapConfigList();
        checkForValidProductMapList();

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

  const returnFixedLenghtOfString = (str) => {
    if (!str) return "";

    if (typeof str !== "string") {
      str = `${str}`;
    }

    const maxStringLength = 100;
    if (str.length < maxStringLength) {
      return str;
    } else {
      return str.slice(0, maxStringLength).concat("...");
    }
  };

  return (
    <>
      {state.isLoading ? <Loader /> : null}
      <div
        className="int-tab-body"
        style={{ flex: "auto", wordBreak: "break-word" }}
      >
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
              <TableCell width="20%">
                <Tooltip title="Sort" enterDelay={300}>
                  <TableSortLabel
                    active={true}
                    direction={
                      state.sortBy === "productMapId" ? state.sortType : "asc"
                    }
                    onClick={(e) => handleRequestSort(e, "productMapId")}
                  >
                    <IntlMessages id="InsurancePrivider.TPI.ProductMapConfiguration.ProductMapId" />
                  </TableSortLabel>
                </Tooltip>
              </TableCell>

              <TableCell width="60%">
                <IntlMessages id="InsurancePrivider.TPI.ProductMapConfiguration.ConfigurationDetails" />
              </TableCell>
              <TableCell align="center" width="20%">
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
                return (
                  <TableRow key={n.id}>
                    <TableCell align="left" width="20%">
                      {productName || ""}
                    </TableCell>
                    <TableCell align="left" width="60%">
                      {returnFixedLenghtOfString(n.configDetails)}
                    </TableCell>
                    <TableCell align="center" width="20%" padding="none">
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
        <div className="float-right mt-12">
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

export default TPIProductMapConfiguration;

function Form(props) {
  let {
    errors,
    validation,
    handleChange,
    handleDataRequestClose,
    handleSubmitButton,
    handleUpdateButton,
    handleJsonInput,
    isEditMode,
    isAddMode,
    productMapList,
    doesFormDialogOpen,
    onSubmit,
    isAddFormSubmitDisabled,
    actionName,
    id,
  } = props;
  console.log("doesFormDialogOpen", doesFormDialogOpen);
  return (
    <Dialog
      maxWidth="sm"
      open={doesFormDialogOpen || false}
      onClose={handleDataRequestClose}
    >
      <DialogTitle>
        {isEditMode ? (
          <IntlMessages id="InsurancePrivider.TPI.ProductMapConfiguration.modal.edit.tilte" />
        ) : (
          <IntlMessages id="InsurancePrivider.TPI.ProductMapConfiguration.modal.add.tilte" />
        )}
      </DialogTitle>
      <DialogContent>
        <div className="row">
          <div className="col-lg-12">
            <TextField
              required
              name="ProductMapId"
              id="ProductMapId"
              error={errors.ProductMapId}
              select
              label={
                <IntlMessages id="InsurancePrivider.TPI.ProductMapConfiguration.ProductMapId" />
              }
              value={validation.ProductMapId || ""}
              onChange={handleChange}
              margin="normal"
              fullWidth
              helperText={errors.ProductMapId}
              variant="outlined"
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
            </TextField>
          </div>
          <div className="col-lg-12" style={{ marginTop: "10px" }}>
            <IntlMessages id="InsurancePrivider.TPI.ProductMapConfiguration.ConfigurationDetails" />{" "}
            :
            <JSONInput
              id="a_unique_id"
              name="ConfigurationDetails"
              placeholder={validation.ConfigurationDetails}
              onChange={(e) => handleJsonInput(e, "ConfigurationDetails")}
              theme="dark_vscode_tribute"
              locale={locale}
              style={{
                outerBox: {
                  height: "130px",
                  padding: "5px",
                  width: "auto",
                },
                container: {
                  height: "130px",
                  width: "auto",
                },
              }}
            />
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
}
