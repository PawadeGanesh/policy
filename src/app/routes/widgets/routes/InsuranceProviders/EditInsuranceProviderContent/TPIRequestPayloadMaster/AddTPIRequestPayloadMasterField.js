import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Button, TextField, MenuItem, InputLabel } from "@material-ui/core";
import IntlMessages from "util/IntlMessages";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import { makeStyles } from "@material-ui/core/styles";
import FormHelperText from "@material-ui/core/FormHelperText";
import apiInstance from "../../../../../../../setup/index";
import { apigetUrl } from "../../../../../../../setup/middleware";
import InputSelect from "../../../CommonComponents/Select";
import InputSubmitButton from "../../../CommonComponents/SubmitButton";
import InputCancelButton from "../../../CommonComponents/CancelButton";
import InputField from "../../../CommonComponents/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

const baseURL = `${process.env.REACT_APP_BASE_URL}`;

const RequestPayloadMasterFrom = ({
  productId,
  handleDataRequestClose,
  handleChange,
  handleFieldChange,
  onSubmit,
  validation,
  errors,
  doesFormDialogOpen,
  isEditMode,
  actionName,
  id,
  checkedProductList,
  apiPathKey,
  isFieldChangeActive,
}) => {
  console.log("ActionName: ", validation.FieldIds);
  const [state, setState] = useState({
    parentsList: [],
    products: checkedProductList || [],
    contentTypes: [],
    valueTypes: [],
    filelds: [],
    computeTypes: [],
    objectPickModeList: [],
    masterTypes: [],
    masterFields: [],
    isAddFormSubmitDisabled: false,
    OperationTypes: [],
  });

  useEffect(() => {
    getOperationTypes();
    getMasterTypes();
    getFields();
    getParentFields();
    getComputeTypes();
    getContentTypes();
    getObjectPicModes();
    getValueTypes();
  }, []);

  const getMasterTypes = async () => {
    // typeId for 'OperationTypes' is 1000
    let response = await apigetUrl(
      `/tpi/${apiPathKey}/core-data-types?page=1&limit=1000`
    );
    if (response.data.responseCode === "200") {
      setState((prevState) => ({
        ...prevState,
        masterTypes: response.data.dataList || [],
      }));
    }
  };

  const getValueTypes = async () => {
    // typeId for 'OperationTypes' is 1003
    let response = await apigetUrl(
      `/tpi/${apiPathKey}/core-data?page=1&limit=1000&typeId=1003`
    );
    if (response.data.responseCode === "200") {
      setState((prevState) => ({
        ...prevState,
        valueTypes: response.data.dataList || [],
      }));
    }
  };

  const getOperationTypes = async () => {
    // typeId for 'OperationTypes' is 1006
    let response = await apigetUrl(
      `/tpi/${apiPathKey}/core-data?page=1&limit=1000&typeId=1006`
    );
    if (response.data.responseCode === "200") {
      setState((prevState) => ({
        ...prevState,
        OperationTypes: response.data.dataList || [],
      }));
    }
  };

  const getFields = async () => {
    let response = await apigetUrl(`/insurance/products/${productId}`);
    if (response.data.responseCode === "200") {
      setState((prevState) => ({
        ...prevState,
        filelds: response.data.inputFields || [],
      }));
    }
  };

  const getComputeTypes = async () => {
    // typeId for 'Compute types' is 1000
    let response = await apigetUrl(
      `/tpi/${apiPathKey}/core-data?page=1&limit=1000&typeId=1000`
    );
    if (response.data.responseCode === "200") {
      setState((prevState) => ({
        ...prevState,
        computeTypes: response.data.dataList,
      }));
    }
  };

  const getContentTypes = async () => {
    // typeId for 'Content types' is 1001
    let response = await apigetUrl(
      `/tpi/${apiPathKey}/core-data?page=1&limit=1000&typeId=1001`
    );
    if (response.data.responseCode === "200") {
      setState((prevState) => ({
        ...prevState,
        contentTypes: response.data.dataList,
      }));
    }
  };

  const getObjectPicModes = async () => {
    // typeId for 'ObjectPicMode' is 1002
    let response = await apigetUrl(
      `/tpi/${apiPathKey}/core-data?page=1&limit=1000&typeId=1002`
    );
    if (response.data.responseCode === "200") {
      setState((prevState) => ({
        ...prevState,
        objectPickModeList: response.data.dataList,
      }));
    }
  };

  const getParentFields = async () => {
    let response = await apigetUrl(
      `/tpi/${apiPathKey}/payload/request/${productId}?page=1&limit=100`
    );
    if (response.data.responseCode === "200") {
      setState((prevState) => ({
        ...prevState,
        parentsList: !id
          ? response.data.dataList
          : response.data.dataList.filter((obj) => obj.id !== id),
      }));
    }
  };

  const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 200,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));

  const classes = useStyles();

  return (
    <Dialog
      maxWidth="sm"
      open={doesFormDialogOpen || false}
      onClose={handleDataRequestClose}
    >
      <DialogTitle>
        {isEditMode ? (
          <IntlMessages id="InsurancePrivider.TPI.RequestPayloadMaster.modal.edit.tilte" />
        ) : (
          <IntlMessages id="InsurancePrivider.TPI.RequestPayloadMaster.modal.add.tilte" />
        )}
      </DialogTitle>
      <DialogContent>
        <div className="row">
          <div className="col-lg-6">
            <InputField
              required
              autoFocus
              id="PayloadFieldName"
              className={classes.formControl}
              label={
                <IntlMessages id="InsurancePrivider.TPI.RequestPayloadMaster.PayloadFieldName" />
              }
              name="PayloadFieldName"
              onChange={handleChange}
              value={validation.PayloadFieldName}
              fullWidth
              error={errors.PayloadFieldName}
              helperText={errors.PayloadFieldName}
            />
          </div>
          <div className="col-lg-6">
            <FormControl
              variant="outlined"
              className={classes.formControl}
              required
              error={errors.ProductName}
              fullWidth
              disabled
            >
              <InputLabel id="demo-simple-select-outlined-label">
                <IntlMessages id="InsurancePrivider.TPI.RequestPayloadMaster.ProductName" />
              </InputLabel>
              <InputSelect
                labelId="ProductName"
                id="ProductName"
                name="ProductName"
                value={validation.ProductName}
                onChange={handleChange}
                renderValue={(value) => `${value}`}
                label="ProductName"
                required
              >
                <MenuItem value="">
                  <em>Select</em>
                </MenuItem>
                {state.products.map((option) => (
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
              {!errors.ProductName ? null : (
                <FormHelperText style={{ color: "red" }}>
                  {errors.ProductName}
                </FormHelperText>
              )}
            </FormControl>
          </div>
          <div className="col-lg-6">
            <FormControl
              variant="outlined"
              className={classes.formControl}
              required
              error={errors.ParentName}
              fullWidth
            >
              <InputLabel id="demo-simple-select-outlined-label">
                <IntlMessages id="InsurancePrivider.TPI.RequestPayloadMaster.ParentName" />
              </InputLabel>
              <InputSelect
                labelId="ParentName"
                id="ParentName"
                name="ParentName"
                value={validation.ParentName}
                onChange={handleChange}
                renderValue={(value) => `${value}`}
                label="ParentName"
                required
              >
                <MenuItem value="">
                  <em>Select</em>
                </MenuItem>
                {state.parentsList.map((option) => (
                  <MenuItem
                    name="fieldType"
                    key={option.id}
                    attfieldtypesname={option.payloadField}
                    value={option.id}
                  >
                    {option.payloadField}
                  </MenuItem>
                ))}
              </InputSelect>
              {!errors.ParentName ? null : (
                <FormHelperText style={{ color: "red" }}>
                  {errors.ParentName}
                </FormHelperText>
              )}
            </FormControl>
          </div>
          <div className="col-lg-6">
            <FormControl
              variant="outlined"
              className={classes.formControl}
              required
              error={errors.ContentType}
              fullWidth
            >
              <InputLabel id="demo-simple-select-outlined-label">
                <IntlMessages id="InsurancePrivider.TPI.RequestPayloadMaster.ContentType" />
              </InputLabel>
              <InputSelect
                labelId="ContentType"
                id="ContentType"
                name="ContentType"
                value={validation.ContentType}
                onChange={handleChange}
                renderValue={(value) => `${value}`}
                label="ContentType"
                required
              >
                <MenuItem value="">
                  <em>Select</em>
                </MenuItem>
                {state.contentTypes.map((option) => (
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
              {!errors.ContentType ? null : (
                <FormHelperText style={{ color: "red" }}>
                  {errors.ContentType}
                </FormHelperText>
              )}
            </FormControl>
          </div>
          <div className="col-lg-6">
            <FormControl
              variant="outlined"
              className={classes.formControl}
              required
              error={errors.ValueType}
              fullWidth
            >
              <InputLabel id="demo-simple-select-outlined-label">
                <IntlMessages id="InsurancePrivider.TPI.RequestPayloadMaster.ValueType" />
              </InputLabel>
              <InputSelect
                labelId="ValueType"
                id="ValueType"
                name="ValueType"
                value={validation.ValueType}
                onChange={handleChange}
                renderValue={(value) => `${value}`}
                label="ValueType"
                required
              >
                <MenuItem value="">
                  <em>Select</em>
                </MenuItem>
                {state.valueTypes.map((option) => (
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
              {!errors.ValueType ? null : (
                <FormHelperText style={{ color: "red" }}>
                  {errors.ValueType}
                </FormHelperText>
              )}
            </FormControl>
          </div>
          {![100302, 100303, 100304].includes(validation.ValueType) ? (
            ""
          ) : (
            <div className="col-lg-6">
              {/* <FormControl
                variant="outlined"
                className={classes.formControl}
                required
                error={errors.FieldIds}
                fullWidth
              >
                <InputLabel id="demo-simple-select-outlined-label">
                  <IntlMessages id="InsurancePrivider.TPI.RequestPayloadMaster.FieldIds" />
                </InputLabel>
                <InputSelect
                  labelId="FieldIds"
                  id="FieldIds"
                  name="FieldIds"
                  value={validation.FieldIds}
                  onChange={handleChange}
                  renderValue={(value) => `${value}`}
                  label="FieldIds"
                  required
                >
                  <MenuItem value="">
                    <em>Select</em>
                  </MenuItem>
                  {state.filelds.map((option) => (
                    <MenuItem
                      name="fieldType"
                      key={option.fieldIdObj.id}
                      attfieldtypesname={option.fieldIdObj.name}
                      value={option.fieldIdObj.id}
                    >
                      {option.fieldIdObj.name}
                    </MenuItem>
                  ))}
                </InputSelect>
                {!errors.FieldIds ? null : (
                  <FormHelperText style={{ color: "red" }}>
                    {errors.FieldIds}
                  </FormHelperText>
                )}
              </FormControl> */}

              {isFieldChangeActive ? (
                <Autocomplete
                  multiple
                  limitTags={0}
                  id="FieldIds"
                  name="FieldIds"
                  onChange={(e, value) => handleFieldChange(e, value)}
                  options={state.filelds}
                  getOptionLabel={(option) => option.fieldIdObj.name}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error
                      helperText="FieldId is Required"
                      variant="outlined"
                      label={
                        <IntlMessages id="InsurancePrivider.TPI.RequestPayloadMaster.FieldIds" />
                      }
                      placeholder="FieldIds List"
                    />
                  )}
                />
              ) : (
                <Autocomplete
                  multiple
                  limitTags={0}
                  id="FieldIds"
                  name="FieldIds"
                  onChange={(e, value) => handleFieldChange(e, value)}
                  options={state.filelds}
                  getOptionLabel={(option) => option.fieldIdObj.name}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label={
                        <IntlMessages id="InsurancePrivider.TPI.RequestPayloadMaster.FieldIds" />
                      }
                      placeholder="FieldIds List"
                    />
                  )}
                />
              )}
            </div>
          )}
          {![100302, 100303, 100304].includes(validation.ValueType) ? (
            ""
          ) : (
            <div className="col-lg-6">
              <FormControl
                variant="outlined"
                className={classes.formControl}
                required
                error={errors.ComputeType}
                fullWidth
              >
                <InputLabel id="demo-simple-select-outlined-label">
                  <IntlMessages id="InsurancePrivider.TPI.RequestPayloadMaster.ComputeType" />
                </InputLabel>
                <InputSelect
                  labelId="ComputeType"
                  id="ComputeType"
                  name="ComputeType"
                  value={validation.ComputeType}
                  onChange={handleChange}
                  renderValue={(value) => `${value}`}
                  label="ComputeType"
                  required
                >
                  <MenuItem value="">
                    <em>Select</em>
                  </MenuItem>
                  {state.computeTypes.map((option) => (
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
                {!errors.ComputeType ? null : (
                  <FormHelperText style={{ color: "red" }}>
                    {errors.ComputeType}
                  </FormHelperText>
                )}
              </FormControl>
            </div>
          )}
          <div className="col-lg-6">
            <FormControl
              variant="outlined"
              className={classes.formControl}
              required
              error={errors.ObjectPicMode}
              fullWidth
            >
              <InputLabel id="demo-simple-select-outlined-label">
                <IntlMessages id="InsurancePrivider.TPI.RequestPayloadMaster.ObjectPicMode" />
              </InputLabel>
              <InputSelect
                labelId="ObjectPicMode"
                id="ObjectPicMode"
                name="ObjectPicMode"
                value={validation.ObjectPicMode}
                onChange={handleChange}
                renderValue={(value) => `${value}`}
                label="ObjectPicMode"
                required
              >
                <MenuItem value="">
                  <em>Select</em>
                </MenuItem>
                {state.objectPickModeList.map((option) => (
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
              {!errors.ObjectPicMode ? null : (
                <FormHelperText style={{ color: "red" }}>
                  {errors.ObjectPicMode}
                </FormHelperText>
              )}
            </FormControl>
          </div>
          <div className="col-lg-6">
            <FormControl
              variant="outlined"
              className={classes.formControl}
              required
              error={errors.IsCheckFullPayload}
              fullWidth
            >
              <InputLabel id="demo-simple-select-outlined-label">
                <IntlMessages id="InsurancePrivider.TPI.RequestPayloadMaster.IsCheckFullPayload" />
              </InputLabel>
              <InputSelect
                labelId="IsCheckFullPayload"
                id="IsCheckFullPayload"
                name="IsCheckFullPayload"
                value={validation.IsCheckFullPayload}
                onChange={handleChange}
                renderValue={(value) => `${value}`}
                label="IsCheckFullPayload"
                required
              >
                <MenuItem value="">
                  <em>Select</em>
                </MenuItem>
                <MenuItem name="Yes" attfieldtypesname="Yes" value="1">
                  Yes
                </MenuItem>
                <MenuItem name="No" attfieldtypesname="No" value="0">
                  No
                </MenuItem>
              </InputSelect>
              {!errors.IsCheckFullPayload ? null : (
                <FormHelperText style={{ color: "red" }}>
                  {errors.IsCheckFullPayload}
                </FormHelperText>
              )}
            </FormControl>
          </div>
          <div className="col-lg-6">
            <FormControl
              variant="outlined"
              className={classes.formControl}
              required
              error={errors.IsMandatory}
              fullWidth
            >
              <InputLabel id="demo-simple-select-outlined-label">
                <IntlMessages id="InsurancePrivider.TPI.RequestPayloadMaster.IsMandatory" />
              </InputLabel>
              <InputSelect
                labelId="IsMandatory"
                id="IsMandatory"
                name="IsMandatory"
                value={validation.IsMandatory}
                onChange={handleChange}
                renderValue={(value) => `${value}`}
                label="IsMandatory"
                required
              >
                <MenuItem value="">
                  <em>Select</em>
                </MenuItem>
                <MenuItem name="Yes" attfieldtypesname="Yes" value="1">
                  Yes
                </MenuItem>
                <MenuItem name="No" attfieldtypesname="No" value="0">
                  No
                </MenuItem>
              </InputSelect>
              {!errors.IsMandatory ? null : (
                <FormHelperText style={{ color: "red" }}>
                  {errors.IsMandatory}
                </FormHelperText>
              )}
            </FormControl>
          </div>
          {![100301, 100305, 100306].includes(validation.ValueType) ? (
            ""
          ) : (
            <div className="col-lg-6">
              <InputField
                required
                autoFocus
                id="FixedValue"
                className={classes.formControl}
                label={
                  <IntlMessages id="InsurancePrivider.TPI.RequestPayloadMaster.FixedValue" />
                }
                name="FixedValue"
                onChange={handleChange}
                value={validation.FixedValue}
                fullWidth
                error={errors.FixedValue}
                helperText={errors.FixedValue}
              />
            </div>
          )}
          <div className="col-lg-6">
            <FormControl
              variant="outlined"
              className={classes.formControl}
              required
              error={errors.IsForQuote}
              fullWidth
            >
              <InputLabel id="demo-simple-select-outlined-label">
                <IntlMessages id="InsurancePrivider.TPI.RequestPayloadMaster.IsForQuote" />
              </InputLabel>
              <InputSelect
                labelId="IsForQuote"
                id="IsForQuote"
                name="IsForQuote"
                value={validation.IsForQuote}
                onChange={handleChange}
                renderValue={(value) => `${value}`}
                label="IsForQuote"
                required
              >
                <MenuItem value="">
                  <em>Select</em>
                </MenuItem>
                {state.OperationTypes.map((option) => (
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
              {!errors.IsForQuote ? null : (
                <FormHelperText style={{ color: "red" }}>
                  {errors.IsForQuote}
                </FormHelperText>
              )}
            </FormControl>
          </div>
          {![100303].includes(validation.ValueType) ? (
            ""
          ) : (
            <>
              <div className="col-lg-6">
                <FormControl
                  variant="outlined"
                  className={classes.formControl}
                  required
                  error={errors.MasterType}
                  fullWidth
                >
                  <InputLabel id="demo-simple-select-outlined-label">
                    <IntlMessages id="InsurancePrivider.TPI.RequestPayloadMaster.MasterType" />
                  </InputLabel>
                  <InputSelect
                    labelId="MasterType"
                    id="MasterType"
                    name="MasterType"
                    value={validation.MasterType}
                    onChange={handleChange}
                    renderValue={(value) => `${value}`}
                    label="MasterType"
                    required
                  >
                    <MenuItem value="">
                      <em>Select</em>
                    </MenuItem>
                    {state.masterTypes.map((option) => (
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
                  {!errors.MasterType ? null : (
                    <FormHelperText style={{ color: "red" }}>
                      {errors.MasterType}
                    </FormHelperText>
                  )}
                </FormControl>
              </div>
              <div className="col-lg-6">
                <FormControl
                  variant="outlined"
                  className={classes.formControl}
                  required
                  error={errors.MasterField}
                  fullWidth
                >
                  <InputLabel id="demo-simple-select-outlined-label">
                    <IntlMessages id="InsurancePrivider.TPI.RequestPayloadMaster.MasterField" />
                  </InputLabel>
                  <InputSelect
                    labelId="MasterField"
                    id="MasterField"
                    name="MasterField"
                    value={validation.MasterField}
                    onChange={handleChange}
                    renderValue={(value) => `${value}`}
                    label="MasterField"
                    required
                  >
                    <MenuItem value="">
                      <em>Select</em>
                    </MenuItem>
                    {state.masterFields.map((option) => (
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
                  {!errors.MasterField ? null : (
                    <FormHelperText style={{ color: "red" }}>
                      {errors.MasterField}
                    </FormHelperText>
                  )}
                </FormControl>
              </div>
            </>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <InputCancelButton onClick={(e) => handleDataRequestClose(e)} />
        <InputSubmitButton
          onClick={(e) => onSubmit(e, productId, id)}
          // disabled={!isAddFormSubmitDisabled}
        />
      </DialogActions>
    </Dialog>
  );
};

export default RequestPayloadMasterFrom;
