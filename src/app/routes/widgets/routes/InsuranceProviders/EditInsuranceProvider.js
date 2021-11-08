import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  Modal,
  TextField,
  Button,
  responsiveFontSizes,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import IntlMessages from "util/IntlMessages";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import CardBox from "./../../../../../components/CardBox";
import { useHistory } from "react-router-dom";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import PublishOutlinedIcon from "@material-ui/icons/PublishOutlined";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { AiOutlineArrowRight, AiOutlineArrowLeft } from "react-icons/ai";

import "./root.component.css";
import Joi from "joi-browser";
import {
  TPIRequestPayloadMaster,
  TPIResponsePayloadMaster,
  TPIProductMapConfiguration,
  TPIProductMapResponseCheck,
} from "./EditInsuranceProviderContent/index";
import JSONInput from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/en";
import InputAutocomplete from "../CommonComponents/Autocomplete";
import InputSubmitButton from "../CommonComponents/SubmitButton";
import InputCancelButton from "../CommonComponents/CancelButton";
import InputField from "../CommonComponents/TextField";
import {
  IPPNotification,
  ippNotify,
} from "../CommonComponents/IPPNotification";
import { apigetUrl, apiputUrl } from "setup/middleware";

const schema = {
  productId: Joi.string()
    .required()
    .label("Product Name"),
  customizedName: Joi.string()
    .required()
    .label("customized Name"),
  name: Joi.string()
    .required()
    .label("Name"),
  kafkaTopic: Joi.string()
    .required()
    .label("Kafka Topic"),
  integrationDetails: Joi.string()
    .required()
    .label("Integration Details"),
};

/** Declaring constants to use same vlaue at multiple places */
let PRODUCT_MAPPING = "Product Mapping";
let TPI_REQUEST_PAYLOAD_MASTER = "Integration Request Payload Master";
let TPI_RESPONSE_PAYLOAD_MASTER = "Integration Response Payload Master";
let TPI_PRODUCT_MAP_CONFIGURATION = "Integration Product Map Configuration";
let TPI_PRODUCT_MAP_RESPONSE_CHECK = "Integration Product Map Response Check";

const EditInsuranceProvider = ({
  closeEditProduct,
  page,
  pageCount,
  getSuccessUpdate,
  getErrorUpdate,
  // closeEditProduct,
  callLocalBaseURL,
  selectedId,
  allDatas,
}) => {
  const [state, setState] = useState({
    page: 1,
    file: null,
    base64: null,
    imgMsg: "",
    invalidImage: false,
    productName: "xyz",
    allData: [],
    name: "",
    kafkaTopic: "",
    logo: "",
    integrationDetails: {},
    productDetail: [],
    productId: 0,
    error: false,
    validation: {
      name: "",
      // logo: "",
      kafkaTopic: "",
      apiPathKey: "",
      integrationDetails: {},
    },
    errors: {},
    checkboxErrors: {},
    isEditFormSubmitDisabled: false,
    fieldPopulated: false,
    productsPopulated: false,
    productNamePopulated: false,
    checkedProductList: [],
    activeStep: 0,
    deleteItem_DialogOpen: false,
    selectedDeleteId: null,
    selectedDeleteItemIndex: null,
  });

  let inputFileRef = useRef(null);

  console.log("data", page);

  console.log("productId", state.productName);

  let history = useHistory();

  const location = useLocation();

  useEffect(() => {
    console.log("productDetail", state.productDetail);
  }, [state.productDetail]);

  useEffect(() => {
    getEditProduct();
  }, []);

  const getEditProduct = () => {
    apigetUrl(`/insurance/providers/${selectedId}`).then((res) => {
      if (`${res.data.responseCode}` !== "200") {
        return null;
      }

      let products = (res.data || {}).products || [];
      let checkedProductList = [];

      // inserting 'action' attribute, as Update-API is required one of action from [none, add, update, delte]
      products = products.map((obj) => {
        obj["action"] = "none";
        return obj;
      });

      products.forEach((p) => {
        let obj = allDatas.find((o) => o.id === p.productId);

        if (obj && !checkedProductList.find((o) => o.id === p.productId)) {
          checkedProductList.push(obj);
        }
      });

      setState((prevState) => ({
        ...prevState,
        validation: {
          name: res.data.name,
          apiPathKey: res.data.key,
          kafkaTopic: res.data.kafkaTopic,
          integrationDetails: res.data.integrationDetails,
        },
        productDetail: res.data.products,
        logo: res.data.logo,
        checkedProductList,
      }));
    });
  };

  const handleEditDataRequestClose = () => {
    closeEditProduct();
  };

  const handleEditFormDataSubmit = (e) => {
    console.log("click", e.target.value);
    let obj = state.productDetail;
    for (var i = 0, len = obj.length; i < len; i++) {
      delete obj[i].createdDate;
      // delete obj[i].id;
      delete obj[i].isDeleted;
      delete obj[i].modifiedDate;
      delete obj[i].modifiedBy;
      delete obj[i].createdBy;
      // delete obj[i].providerId;
      // delete obj[i].rowVersion;
      delete obj[i].isData;
      delete obj[i].isProductName;
    }
    console.log("obj", obj);
    const addObj = {
      name: state.validation.name,
      // logo: state.base64,
      logo: state.logo,
      key: state.validation.apiPathKey,
      kafkaTopic: state.validation.kafkaTopic,
      integrationDetails: state.validation.integrationDetails,
      // products: state.productDetail,
      products: obj,
    };

    apiputUrl(`/insurance/providers/${selectedId}`, addObj)
      .then((res) => {
        if (`${res.data.responseCode}` !== "200") {
          ippNotify.error((res.data || {}).responseMessage || "");
          setState((prevState) => ({
            ...prevState,
            data: state.data,
            isErrorAlert: true,
            errorMsg: (res.data || {}).responseMessage || "",
          }));

          // getErrorUpdate(err);
          return null;
        }

        ippNotify.success("Successfully Updated");
        setState((prevState) => ({
          ...prevState,
          data: state.data,
          isSuccessAlert: true,
          isEditFormSubmitDisabled: false,
          successMsg: "Successfully Updated",
        }));
        getSuccessUpdate();
        callLocalBaseURL();
      })
      .catch((err) => {
        ippNotify.error((err.response.data || {}).responseMessage || "");
        setState((prevState) => ({
          ...prevState,
          data: state.data,
          isErrorAlert: true,
          errorMsg: (err.response.data || {}).responseMessage || "",
        }));
        console.log("err", err);
        getErrorUpdate(err);
      });
    // closeEditProduct();
  };

  const handleRemoveClick = (index, productMapId) => {
    // setState((prevState) => ({
    //   ...prevState,
    //   deleteItem_DialogOpen: true,
    //   selectedDeleteId: productMapId,
    //   selectedDeleteItemIndex: index,
    // }));

    const list = [...state.productDetail];
    list.splice(index, 1);
    // list[index]["action"] = 'delete';
    setState((prevState) => ({
      ...prevState,
      productDetail: list,
      isEditFormSubmitDisabled: true,
    }));
    // setInputList(list);
  };

  const handleAddClick = () => {
    setState((prevState) => ({
      ...prevState,
      isEditFormSubmitDisabled: false,
      productDetail: [
        ...state.productDetail,
        {
          productId: "",
          customizedName: "",
          action: "add",
          isProductNameValidate: true,
          isCustomNameValidate: true,
        },
      ],
    }));
  };

  const validateProperty = ({ name, value, index }) => {
    let obj = {};
    if (name === "customizedName") {
      obj = { [name]: value };
    } else {
      obj = { [name]: value };
    }

    // if 'schema' is not defined for an input, just ignore the validation
    if (!schema[name]) return null;

    const propertySchema = { [name]: schema[name] };
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

  const handleChange = ({ target: input }) => {
    // e.persist();
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

    validation[input.name] = input.value;
    setState((prevState) => ({
      ...prevState,
      validation,
      errors,
      fieldPopulated: allFormFieldsPopulated && isObjEmpty(errors),
      isEditFormSubmitDisabled: allFormFieldsPopulated && isObjEmpty(errors),
    }));
  };

  const handleCustomName = (e, index) => {
    const { name, value } = e.target;
    console.log("i", index);
    const list = [...state.productDetail];
    const errors = { ...state.errors };
    const errorMessage = validateProperty({ name, value });

    if (errorMessage) errors[`${name}_${index}`] = errorMessage;
    else delete errors[`${name}_${index}`];

    if (e.target.value) {
      list[index][name] = value;
      list[index]["isData"] = false;
      list[index]["isCustomNameValidate"] = false;

      if (
        list[index]["action"] === undefined ||
        list[index]["action"] !== "add"
      ) {
        list[index]["action"] = "update";
      }

      setState((prevState) => ({
        ...prevState,
        // customizedName: list,
        productDetail: list,
        isEditFormSubmitDisabled: true,
        errors,
      }));
    } else if (!e.target.value) {
      list[index][name] = value;
      list[index]["isData"] = true;
      console.log("list", list[index][name]);
      setState((prevState) => ({
        ...prevState,
        // customizedName: list,
        productDetail: list,
      }));
    }
  };

  const handleProductName = (e, value, index) => {
    const list = [...state.productDetail];
    const errors = { ...state.errors };
    const errorMessage = validateProperty({ name: "productId", value });

    if (errorMessage) errors[`productId_${index}`] = errorMessage;
    else delete errors[`productId_${index}`];

    if (!list[index]) {
      list.push({ productId: "", isData: false, isProductName: false });
    }
    if (value === null) {
      list[index]["productId"] = "";
      list[index]["isProductName"] = true;
      setState((prevState) => ({
        ...prevState,
        productDetail: list,
        productNamePopulated: false,
        isEditFormSubmitDisabled: false,
        errors,
      }));
    } else {
      allDatas &&
        allDatas.filter((n) => {
          if (n.name === value) {
            list[index]["productId"] = n.id;
            list[index]["isProductName"] = false;
            list[index]["isProductNameValidate"] = false;

            if (
              list[index]["action"] === undefined ||
              list[index]["action"] !== "add"
            ) {
              list[index]["action"] = "update";
            }

            setState((prevState) => ({
              ...prevState,
              productDetail: list,
              productNamePopulated: true,
              isEditFormSubmitDisabled: true,
              errors,
            }));
          }
        });
    }
  };

  useEffect(() => {
    if (
      state.validation.name === "" ||
      state.validation.kafkaTopic === ""
      //  ||  state.base64 === null
    ) {
      setState((prevState) => ({
        ...prevState,
        isEditFormSubmitDisabled: false,
      }));
    }

    if (
      state.productDetail.map((m) => {
        if (
          m.isCustomNameValidate ||
          m.customizedName === "" ||
          m.isProductNameValidate ||
          m.productId === null ||
          m.productId === ""
        ) {
          setState((prevState) => ({
            ...prevState,
            isEditFormSubmitDisabled: false,
          }));
        }
      })
    ) {
    }
  }, [state.productDetail, state.validation, state.base64]);

  const handleChangePhotoButton = (e) => {
    e.preventDefault();
    inputFileRef.click();
  };

  const handleChangePhotoFileInput = (e) => {
    const target = e.currentTarget;
    const file = target.files.item(0);
    // validate file as image
    if (!file.type.startsWith("image/")) {
      setState((prevState) => ({
        ...prevState,
        invalidImage: true,
        imgMsg: "File is not an image",
      }));
      // alert("File is not an image");
      return;
    }

    if (!file.name.match(/\.(jpg|jpeg|png|gif)$/)) {
      setState((prevState) => ({
        ...prevState,
        invalidImage: true,
        imgMsg: "Please select valid image.",
      }));
      return;
    }

    // store reference to the File object and a base64 representation of it
    readDataUrl(file).then((dataUrl) => {
      setState((prevState) => ({
        ...prevState,
        file,
        base64: dataUrl,
        // objectUrl: URL.createObjectURL(file),
      }));
    });
  };

  const readDataUrl = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      // async event handlers
      reader.onload = (e) => resolve(reader.result);
      reader.onerror = (e) => reject(reader.error);
      reader.readAsDataURL(file);
    });
  };

  const getSelectedItem = (productId) => {
    const item = allDatas.find((n) => n.id === productId);
    return (item || {}).name;
  };

  const isChecked = (productId) => {
    const item = state.checkedProductList.find((n) => n.id === productId);
    return (item || {}).name ? true : false;
  };

  const handleCheckedProductList = (e, productId) => {
    let { checkedProductList, checkboxErrors } = state;
    if (e.currentTarget.checked) {
      let newItem = allDatas.find((n) => n.id === productId);
      checkedProductList.push(newItem);
    } else {
      // we shoud not allow to uncheck the product, which is used for creating "Product-Map"
      if (state.productDetail.find((x) => x.productId === productId)) {
        ippNotify.error(
          "You can't un-check this product because you have created a ProductMap on this Product"
        );
      } else {
        delete checkboxErrors[productId];
        checkedProductList = checkedProductList.filter(
          (n) => n.id !== productId
        );
      }
    }
    setState((prevState) => ({
      ...prevState,
      checkedProductList,
      checkboxErrors,
    }));
  };

  const checkForUnusedProductList = () => {
    let { checkedProductList, checkboxErrors } = state;
    let productIds = checkedProductList.map((p) => p.id);

    productIds.forEach((pId) => {
      if (!state.productDetail.find((x) => x.productId === pId)) {
        checkboxErrors[pId] =
          "Please Un-check this Product, If you are not going to create a Product-Map with this Prodcut";
      }
    });

    setState((prevState) => ({
      ...prevState,
      checkboxErrors,
    }));
  };
  const getSteps = () => {
    return [
      PRODUCT_MAPPING,
      TPI_REQUEST_PAYLOAD_MASTER,
      TPI_RESPONSE_PAYLOAD_MASTER,
      TPI_PRODUCT_MAP_CONFIGURATION,
      TPI_PRODUCT_MAP_RESPONSE_CHECK,
    ];
  };

  const handleNext = async (e, step) => {
    checkForUnusedProductList();

    if (Object.keys(state.checkboxErrors).length) {
      ippNotify.error("you are not allowed to go next");
    } else {
      setState((prevState) => ({
        ...prevState,
        activeStep: prevState.activeStep + 1,
      }));
    }
  };

  const handleBack = () => {
    const { activeStep } = state;
    const steps = getSteps();
    // let ind = state.sections.findIndex((x) => x.id === activeStep);
    setState((prevState) => ({
      ...prevState,
      activeStep: activeStep - 1,
      step: steps.length - 1 === activeStep - 1 ? "otp" : null,
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

  const getProductMapConfingsByProductMapId = (productMapId) => {
    return apigetUrl(
      `/tpi/product/map/config?page=1&limit=10&productMapId=${productMapId}`
    );
  };

  const getProductMapResponseChecksByProductMapId = (productMapId) => {
    return apigetUrl(
      `/tpi/product/map/checks?page=1&limit=10&productMapId=${productMapId}`
    );
  };

  const deleteForm_NoConfirm = () => {
    setState((prevState) => ({
      ...prevState,
      deleteItem_DialogOpen: false,
      selectedDeleteId: null,
      selectedDeleteItemIndex: null,
    }));
  };

  const deleteForm_YesConfirm = async () => {
    let { selectedDeleteId, selectedDeleteItemIndex } = state;
    const list = [...state.productDetail];

    if (!selectedDeleteId) {
      // list.splice(selectedDeleteItemIndex, 1);
      setState((prevState) => ({
        ...prevState,
        productDetail: list,
        deleteItem_DialogOpen: false,
        selectedDeleteId: null,
        selectedDeleteItemIndex: null,
        isEditFormSubmitDisabled: true,
      }));
      // ippNotify.success('This Item will be getting Deleted after you click Submit button');
      return true;
    }

    /**
     * check Whether any proudct-map-configarations were created on selected ProductMapId (or) not
     * if cretaed, we should allow to delete the seletect Product-Map, until it's Product-map-configurations were deleted
     */
    let res = await getProductMapConfingsByProductMapId(selectedDeleteId);
    if (res.data && res.data.dataList && res.data.dataList.length) {
      ippNotify.error(
        "You cann't deletet this Product-Map, Untli unless you delete it's Product-Map-Configuratoins"
      );
      return false;
    }

    /**
     * check Whether any proudct-map-response-checks were created on selected ProductMapId (or) not
     * if cretaed, we should allow to delete the seletect Product-Map, until it's Product-map-resposne-checks were deleted
     */
    let res1 = await getProductMapResponseChecksByProductMapId(
      selectedDeleteId
    );
    if (res1.data && res1.data.dataList && res1.data.dataList.length) {
      ippNotify.error(
        "You cann't deletet this Product-Map, Untli unless you delete it's Product-Map-Response-Checks"
      );
      return false;
    }

    /**
     * If any Produc-map-configs & Proudct-map-response-checks were not creted for the selected product-map,
     * then we can allow the user to delete it
     */
    list[selectedDeleteItemIndex] &&
      (list[selectedDeleteItemIndex]["action"] = "delete");
    // ippNotify.success('This Item will be getting Deleted after you click Submit button');

    // list.splice(selectedDeleteItemIndex, 1);
    setState((prevState) => ({
      ...prevState,
      productDetail: list,
      deleteItem_DialogOpen: false,
      selectedDeleteId: null,
      selectedDeleteItemIndex: null,
      isEditFormSubmitDisabled: true,
    }));
    return true;
  };

  const handle_Delete_Item_RequestClose = () => {
    setState((prevState) => ({
      ...prevState,
      deleteItem_DialogOpen: false,
      selectedDeleteId: null,
      selectedDeleteItemIndex: null,
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

  const getStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return (
          <div className="cardBox">
            <div className="row" style={{ marginLeft: "auto" }}>
              <div className="col-lg-4">
                <div className="row">
                  <InputField
                    required
                    className="mb-4"
                    autoFocus
                    id="name"
                    label={
                      <IntlMessages id="InsuranceProviders.master.modal.edit.felid.Name" />
                    }
                    name="name"
                    value={state.validation.name}
                    onChange={(e) => handleChange(e)}
                    fullWidth
                    error={state.errors.name}
                    helperText={state.errors.name}
                  />
                </div>
                <div className="row">
                  <InputField
                    required
                    className="mb-4"
                    autoFocus
                    id="kafkaTopic"
                    label={
                      <IntlMessages id="InsuranceProviders.master.modal.edit.felid.KakaTopic" />
                    }
                    name="kafkaTopic"
                    value={state.validation.kafkaTopic}
                    onChange={(e) => handleChange(e)}
                    fullWidth
                    error={state.errors.kafkaTopic}
                    helperText={state.errors.kafkaTopic}
                  />
                </div>
                <div className="row">
                  <TextField
                    disabled
                    required
                    className="mb-4"
                    autoFocus
                    id="apiPathKey"
                    label={
                      <IntlMessages id="InsuranceProviders.master.modal.add.felid.ApiPath" />
                    }
                    name="apiPathKey"
                    onChange={(e) => handleChange(e)}
                    value={state.validation.apiPathKey}
                    error={state.errors.apiPathKey}
                    helperText={state.errors.apiPathKey}
                    variant="outlined"
                    fullWidth
                  />
                </div>
                <div className="row uploader">
                  <div className="col-md-6">
                    <input
                      onChange={handleChangePhotoFileInput}
                      ref={(input) => (inputFileRef = input)}
                      style={{ display: "none" }}
                      type="file"
                    />

                    <Button
                      className="file"
                      variant="contained"
                      color="primary"
                      startIcon={<PublishOutlinedIcon />}
                      onClick={handleChangePhotoButton}
                      style={{ marginTop: "45px" }}
                    >
                      {
                        <IntlMessages id="InsuranceProviders.master.modal.edit.felid.ChangeImage" />
                      }
                    </Button>
                  </div>
                  <div className="col-md-6">
                    {state.invalidImage === true ? (
                      <div className="imgMsg">{state.imgMsg}</div>
                    ) : (
                      <span>
                        <img
                          className="imgPreview"
                          src={state.base64 || state.logo}
                          // ref={(img) => (imgRef = img)}
                          width="100px"
                        />
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-lg-8">
                <div style={{ height: "100%" }}>
                  <fieldset>
                    <legend class="fieldLegend">
                      <IntlMessages id="InsuranceProviders.master.modal.edit.felid.IntegrationDetails" />
                    </legend>
                    <JSONInput
                      id="a_unique_id"
                      name="integrationDetails"
                      placeholder={state.validation.integrationDetails}
                      onChange={(e) => handleJsonInput(e, "integrationDetails")}
                      theme="light_vscode_tribute"
                      locale={locale}
                      style={{
                        outerBox: {
                          height: "inherit",
                          padding: "5px",
                          width: "auto",
                        },
                        container: {
                          height: "inherit",
                          width: "auto",
                        },
                      }}
                    />
                  </fieldset>
                </div>
              </div>
            </div>
            <div className="mt-4 mx-1">
              <fieldset>
                <legend class="fieldLegend">
                  <IntlMessages id="InsuranceProviders.master.modal.edit.felid.CheckOutTheProdocuts" />
                </legend>
                <div className="row">
                  {(allDatas || []).map((item, i) => {
                    return (
                      <div className="col-4 col-lg-4" key={i}>
                        <FormControl variant="outlined" fullWidth>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={isChecked(item.id)}
                                onChange={(e) =>
                                  handleCheckedProductList(e, item.id)
                                }
                                name={item.name}
                              />
                            }
                            label={item.name}
                          />
                          <FormHelperText style={{ color: "red" }}>
                            {state.checkboxErrors &&
                              state.checkboxErrors[item.id]}
                          </FormHelperText>
                        </FormControl>
                      </div>
                    );
                  })}
                </div>
              </fieldset>
            </div>
            <div className="mt-4 mx-1">
              <fieldset>
                <legend class="fieldLegend">
                  <IntlMessages id="InsuranceProviders.master.modal.edit.felid.CustomizeTheProducts" />
                </legend>

                {state.productDetail
                  .filter((obj) => obj.action !== "delete")
                  .map((x, i) => {
                    return (
                      <div key={i} className="row px-4 py-1 mb-1">
                        <div className="col-lg-4">
                          <InputAutocomplete
                            id="productId"
                            name="productId"
                            onChange={(e, value) =>
                              handleProductName(e, value, i, x.productId)
                            }
                            options={
                              state.checkedProductList.map((n) => n.name) || ""
                            }
                            value={getSelectedItem(x.productId)}
                            renderInput={(params) => (
                              <TextField
                                error={state.errors[`productId_${i}`]}
                                required
                                variant="outlined"
                                {...params}
                                label={
                                  <IntlMessages id="InsuranceProviders.master.modal.edit.felid.ProductName" />
                                }
                                helperText={state.errors[`productId_${i}`]}
                              />
                            )}
                            fullWidth
                          />
                        </div>

                        <div className="col-lg-1"></div>
                        <div className="col-lg-4">
                          <InputField
                            required
                            className="mb-2"
                            autoFocus
                            id="customizedName"
                            error={state.errors[`customizedName_${i}`]}
                            label={
                              <IntlMessages id="InsuranceProviders.master.modal.edit.felid.CustomizedName" />
                            }
                            name="customizedName"
                            onChange={(e) => handleCustomName(e, i)}
                            value={x.customizedName}
                            fullWidth
                            helperText={state.errors[`customizedName_${i}`]}
                          />
                        </div>
                        <div className="col-lg-1"></div>
                        <div className="col-lg-2">
                          {state.productDetail.length - 1 === i && (
                            <AddCircleOutlineIcon
                              style={{
                                cursor: "pointer",
                                marginTop: "20px",
                                marginRight: "10px",
                              }}
                              onClick={handleAddClick}
                            />
                          )}
                          {state.productDetail.length !== 1 && (
                            <RemoveCircleOutlineIcon
                              style={{ cursor: "pointer", marginTop: "20px" }}
                              onClick={() => handleRemoveClick(i, x.id)}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
              </fieldset>
            </div>
            <div className="float-right mt-4">
              <InputCancelButton
                onClick={(e) => handleEditDataRequestClose(e)}
              />
              <InputSubmitButton
                onClick={(e) => handleEditFormDataSubmit(e)}
                disabled={!state.isEditFormSubmitDisabled}
              />
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
        );
      case 1:
        return (
          <TPIRequestPayloadMaster
            apiPathKey={(state.validation || {}).apiPathKey || ""}
            checkedProductList={state.checkedProductList}
            handleEditDataRequestClose={handleEditDataRequestClose}
          />
        );
      case 2:
        return (
          <TPIResponsePayloadMaster
            apiPathKey={(state.validation || {}).apiPathKey || ""}
            checkedProductList={state.checkedProductList}
            handleEditDataRequestClose={handleEditDataRequestClose}
          />
        );
      case 3:
        return (
          <TPIProductMapConfiguration
            apiPathKey={(state.validation || {}).apiPathKey || ""}
            checkedProductList={state.checkedProductList}
            handleEditDataRequestClose={handleEditDataRequestClose}
            mappedProductDetail={state.productDetail}
          />
        );
      case 4:
        return (
          <TPIProductMapResponseCheck
            apiPathKey={(state.validation || {}).apiPathKey || ""}
            checkedProductList={state.checkedProductList}
            handleEditDataRequestClose={handleEditDataRequestClose}
            mappedProductDetail={state.productDetail}
          />
        );
      default:
        return null;
    }
  };

  const steps = getSteps();
  const { activeStep } = state;

  return (
    <CardBox className="container" styleName="col-md-12">
      <div>
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          className="horizontal-stepper-linear"
        >
          {steps.map((label) => {
            return (
              <Step
                key={label}
                className={`horizontal-stepper ${
                  label.id === activeStep ? "active" : ""
                }`}
                // completed={false}
              >
                <StepLabel className="stepperlabel">{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>

        <div>
          {state.loading ? (
            <div className="col-xs-8 col-sm-6 col-md-5 int-content-center">
              <CircularProgress></CircularProgress>
            </div>
          ) : (
            <div styleName="col-md-12">{getStepContent(activeStep)}</div>
          )}
          {!state.loading && (
            <div className="text-center">
              <div className="row">
                <br></br>
              </div>
              <Button
                disabled={activeStep === 0}
                onClick={(e) => handleBack(e, activeStep)}
                className="mr-2"
              >
                <AiOutlineArrowLeft />
                &nbsp;&nbsp;
                <IntlMessages id="retailinsurance.health.button.back" />
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={(e) => handleNext(e, activeStep)}
                disabled={activeStep === steps.length - 1 && !state.agreeTC}
              >
                <IntlMessages id={"retailinsurance.health.button.next"} />
                &nbsp;&nbsp;
                <AiOutlineArrowRight />
              </Button>
            </div>
          )}
          {state.err && (
            <FormHelperText error={Boolean(state.err)}>
              {state.err.responseMessage}
            </FormHelperText>
          )}
        </div>
      </div>
    </CardBox>
  );
};

export default EditInsuranceProvider;
