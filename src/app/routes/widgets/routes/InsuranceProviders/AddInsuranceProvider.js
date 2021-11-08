import React, { useState, useEffect, useRef } from "react";
import { TextField, Button } from "@material-ui/core";
import IntlMessages from "util/IntlMessages";
import CardBox from "./../../../../../components/CardBox";
import { useHistory } from "react-router-dom";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import PublishOutlinedIcon from "@material-ui/icons/PublishOutlined";
import "./root.component.css";
import Joi from "joi-browser";
import JSONInput from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/en";
import InputAutocomplete from "../CommonComponents/Autocomplete";
import {
  IPPNotification,
  ippNotify,
} from "../CommonComponents/IPPNotification";
import { apigetUrl, apipostUrl } from "setup/middleware";

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
  apiPathKey: Joi.string()
    .required()
    .label("API Path"),
};

const AddInsuranceProvider = ({
  page,
  pageCount,
  getSuccessUpdate,
  closeAddProduct,
  callLocalBaseURL,
}) => {
  const itemEls = useRef(new Array());

  const [state, setState] = useState({
    file: null,
    base64: null,
    imgMsg: "",
    invalidImage: false,
    defaultImage: "http://via.placeholder.com/100",
    allData: [],
    page: 0,
    pageCount: 1,
    name: "",
    logo: "",
    kafkaTopic: "",
    integrationDetails: {},
    productDetail: [
      {
        productId: "",
        customizedName: "",
        isProductNameValidate: false,
        isCustomNameValidate: false,
      },
    ],
    data: [],
    validation: {
      name: "",
      // logo: "",
      kafkaTopic: "",
      integrationDetails: {},
    },
    errors: {},
    isAddFormSubmitDisabled: false,
    fieldPopulated: false,
    productsPopulated: false,
    productNamePopulated: false,
    isActive: false,
  });

  let inputFileRef = useRef(null);

  useEffect(() => {
    apigetUrl(`/insurance/products?page=${page}&limit=${pageCount}`)
      .then((res) => {
        if (`${res.data.responseCode}` !== "200") {
          return false;
        }

        let { dataList } = res.data || [];
        let response = dataList.map((n) => n);
        setState((prevState) => ({
          ...prevState,
          allData: response,
        }));
      })
      .catch((err) => console.log("err", err));
  }, []);

  const handleAddDataRequestClose = () => {
    closeAddProduct();
  };

  console.log("int-detail", state.integrationDetails);

  const handleAddFormDataSubmit = (e) => {
    console.log("click", e.target.value);

    let obj = state.productDetail;
    for (var i = 0, len = obj.length; i < len; i++) {
      delete obj[i].isData;
      delete obj[i].isProductName;
      delete obj[i].isProductNameValidate;
      delete obj[i].isCustomNameValidate;
    }
    console.log("obj", obj);
    const addObj = {
      name: state.validation.name,
      // //logo: "#F00",
      // // once the backend logo issue is fixed uncomment the below one and delete above one
      logo: state.base64,
      key: state.validation.apiPathKey,
      kafkaTopic: state.validation.kafkaTopic,
      integrationDetails: state.validation.integrationDetails,
      products: obj,
    };

    apipostUrl(`/insurance/providers`, addObj).then((res) => {
      if (`${res.data.responseCode}` !== "200") {
        ippNotify.error((res.data || {}).responseMessage || "");
        return false;
      }
      ippNotify.success("Successfully New Data is Added");

      setState((prevState) => ({
        ...prevState,
        data: state.data,
      }));
      getSuccessUpdate();
      callLocalBaseURL();
      setTimeout(() => {
        closeAddProduct();
      }, 2000);
    });
  };

  const handleRemoveClick = (index) => {
    console.log("is-Data", state.isData);
    const list = [...state.productDetail];
    list.splice(index, 1);
    setState((prevState) => ({
      ...prevState,
      productDetail: list,
      isAddFormSubmitDisabled: true,
    }));
  };

  const handleAddClick = () => {
    setState((prevState) => ({
      ...prevState,
      isAddFormSubmitDisabled: false,
      productDetail: [
        ...state.productDetail,
        {
          productId: "",
          customizedName: "",
          isProductNameValidate: true,
          isCustomNameValidate: true,
        },
      ],
    }));
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

  const handleCustomName = (e, index) => {
    const { name, value } = e.target;
    const list = [...state.productDetail];
    const errors = { ...state.errors };
    const errorMessage = validateProperty({ name, value });

    if (errorMessage) errors[`${name}_${index}`] = errorMessage;
    else delete errors[`${name}_${index}`];

    if (e.target.value) {
      list[index][name] = value;
      list[index]["isData"] = false;
      list[index]["isCustomNameValidate"] = false;
      setState((prevState) => ({
        ...prevState,
        productDetail: list,
        isAddFormSubmitDisabled: true,
      }));
    } else if (!e.target.value) {
      list[index][name] = value;
      list[index]["isData"] = true;
      setState((prevState) => ({
        ...prevState,
        productDetail: list,
      }));
    }
  };

  const handleProductName = (e, value, index) => {
    console.log("target", e.target);
    const { target: input } = e;
    const list = [...state.productDetail];
    const errors = { ...state.errors };
    const errorMessage = validateProperty({ name: "productId", value });

    if (errorMessage) errors[`productId_${index}`] = errorMessage;
    else delete errors[`productId_${index}`];

    if (!list[index]) {
      list.push({ productId: "", isData: false, isProductName: false });
    }
    if (value) {
      let selectedProductInfo = (state.allData || []).filter(
        (n) => n.name === value
      )[0];
      list[index]["productId"] = (selectedProductInfo || {}).id;
      list[index]["isProductName"] = false;
      list[index]["isProductNameValidate"] = false;
      setState((prevState) => ({
        ...prevState,
        productDetail: list,
        isAddFormSubmitDisabled: true,
      }));
    } else if (!value) {
      list[index]["productId"] = value;
      list[index]["isProductName"] = true;
      setState((prevState) => ({
        ...prevState,
        productDetail: list,
      }));
    }
  };

  useEffect(() => {
    if (
      state.validation.name === "" ||
      state.validation.kafkaTopic === "" ||
      state.base64 === null
    ) {
      setState((prevState) => ({
        ...prevState,
        isAddFormSubmitDisabled: false,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        isAddFormSubmitDisabled: true,
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
            isAddFormSubmitDisabled: false,
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
    /** if file is not  found, don't proceed to next */
    if (!file) return false;

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
      // this.setState({ invalidImage: "Please select valid image." });
      // alert("Please select valid image.");
      return;
    }

    // store reference to the File object and a base64 representation of it
    readDataUrl(file).then((dataUrl) => {
      setState((prevState) => ({
        ...prevState,
        file,
        base64: dataUrl,
        invalidImage: false,
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

  const validateProperty = ({ name, value, index }) => {
    let obj = {};
    if (name === "customizedName") {
      obj = { [name]: value };
    } else {
      obj = { [name]: value };
    }

    // const obj = { [name]: value };
    // const propertySchema = { [name]: schema[name] };

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

  const getProductName = (productId) => {
    const item = (state.allData || []).find((n) => n.id === productId);
    return (item || {}).name || "";
  };

  return (
    <div className="row">
      <CardBox styleName="col-md-12">
        <div className="cardBox">
          <div className="row" style={{ marginLeft: "auto" }}>
            <div className="col-lg-4">
              <div className="row">
                <TextField
                  required
                  className="mb-4"
                  autoFocus
                  id="name"
                  label={
                    <IntlMessages id="InsuranceProviders.master.modal.add.felid.Name" />
                  }
                  name="name"
                  onChange={(e) => handleChange(e)}
                  value={state.validation.name}
                  error={state.errors.name}
                  helperText={state.errors.name}
                  variant="outlined"
                  fullWidth
                />
              </div>
              <div className="row">
                <TextField
                  required
                  className="mb-4"
                  autoFocus
                  id="kafkaTopic"
                  label={
                    <IntlMessages id="InsuranceProviders.master.modal.add.felid.KakaTopic" />
                  }
                  name="kafkaTopic"
                  onChange={(e) => handleChange(e)}
                  value={state.validation.kafkaTopic}
                  error={state.errors.kafkaTopic}
                  helperText={state.errors.kafkaTopic}
                  variant="outlined"
                  fullWidth
                />
              </div>
              <div className="row">
                <TextField
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
                      <IntlMessages id="InsuranceProviders.master.modal.add.felid.UploadImage" />
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
                        src={state.base64 || state.defaultImage}
                        // ref={(img) => (imgRef = img)}
                        width="100px"
                        // height="100px"
                      />
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="tesing111" style={{ height: "100%" }}>
                <fieldset>
                  <legend class="fieldLegend">
                    <IntlMessages id="InsuranceProviders.master.modal.edit.felid.IntegrationDetails" />
                  </legend>
                  <JSONInput
                    id="a_unique_id"
                    name="integrationDetails"
                    placeholder={state.validation.integrationDetails}
                    onChange={(e) => handleJsonInput(e, "integrationDetails")}
                    theme="dark_vscode_tribute"
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
                <IntlMessages id="InsuranceProviders.master.modal.edit.felid.CustomizeTheProducts" />
              </legend>
              {state.productDetail.map((x, i) => {
                return (
                  <div
                    key={x.id}
                    className="row px-4 py-1 mb-1"
                    style={{ alignItems: "center" }}
                  >
                    {x.isProductName ? (
                      <div className="col-lg-4">
                        <InputAutocomplete
                          id="productId"
                          name="productId"
                          key={x}
                          ref={(x) => itemEls.current.push(x)}
                          options={state.allData.map((n) => n.name)}
                          onChange={(e, value) =>
                            handleProductName(e, value, i)
                          }
                          value={getProductName(x.productId)}
                          renderInput={(params) => (
                            <TextField
                              required
                              error
                              {...params}
                              label={
                                <IntlMessages id="InsuranceProviders.master.modal.add.felid.ProductName" />
                              }
                              helperText="ProductName is Required"
                              variant="outlined"
                            />
                          )}
                          fullWidth
                        />
                      </div>
                    ) : (
                      <div className="col-lg-4">
                        <InputAutocomplete
                          id="productId"
                          name="productId"
                          key={x}
                          ref={(x) => itemEls.current.push(x)}
                          options={state.allData.map((n) => n.name)}
                          onChange={(e, value) =>
                            handleProductName(e, value, i)
                          }
                          value={getProductName(x.productId)}
                          renderInput={(params) => (
                            <TextField
                              required
                              {...params}
                              label={
                                <IntlMessages id="InsuranceProviders.master.modal.add.felid.ProductName" />
                              }
                              variant="outlined"
                            />
                          )}
                          fullWidth
                        />
                      </div>
                    )}
                    <div className="col-lg-1"></div>
                    {x.isData ? (
                      <div className="col-lg-4">
                        <TextField
                          required
                          variant="outlined"
                          autoFocus
                          id="customizedName"
                          label={
                            <IntlMessages id="InsuranceProviders.master.modal.add.felid.CustomizedName" />
                          }
                          name="customizedName"
                          value={x.customizedName}
                          error
                          helperText="Customized Name is Required"
                          onChange={(e) => handleCustomName(e, i)}
                          fullWidth
                        />
                      </div>
                    ) : (
                      <div className="col-lg-4">
                        <TextField
                          required
                          variant="outlined"
                          autoFocus
                          id="customizedName"
                          label={
                            <IntlMessages id="InsuranceProviders.master.modal.add.felid.CustomizedName" />
                          }
                          name="customizedName"
                          value={x.customizedName}
                          onChange={(e) => handleCustomName(e, i)}
                          fullWidth
                        />
                      </div>
                    )}

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
                          onClick={() => handleRemoveClick(i)}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </fieldset>
          </div>
          <div className="float-right mt-4">
            <Button
              onClick={(e) => handleAddDataRequestClose(e)}
              color="secondary"
              className="mr-2"
              variant="contained"
            >
              <IntlMessages id="ipp.common.Cancel.button" />
            </Button>
            <Button
              variant="contained"
              onClick={(e) => handleAddFormDataSubmit(e)}
              disabled={!state.isAddFormSubmitDisabled}
              color="primary"
            >
              <IntlMessages id="ipp.common.submit.button" />
            </Button>
          </div>

          <IPPNotification />
        </div>
      </CardBox>
    </div>
  );
};

export default AddInsuranceProvider;
