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
import InputField from "../../../CommonComponents/TextField";
import InputSubmitButton from "../../../CommonComponents/SubmitButton";
import InputCancelButton from "../../../CommonComponents/CancelButton";
import InputSelect from "../../../CommonComponents/Select";

const baseURL = `${process.env.REACT_APP_BASE_URL}`;

const ResponsePayloadMasterFrom = ({
  productId,
  handleDataRequestClose,
  handleChange,
  handleAddFormDataSubmit,
  validation,
  errors,
  doesFormDialogOpen,
  isEditMode,
  onSubmit,
  actionName,
  id,
  checkedProductList,
  valueTypes,
  actionTypes,
}) => {
  const [state, setState] = useState({
    products: checkedProductList,
    valueTypes: valueTypes || [],
    actionTypes: actionTypes || [],
    isAddFormSubmitDisabled: false,
  });
  useEffect(() => {
    // getValueTypes();
    // getActionTypes();
  }, []);

  // const getValueTypes = async () => {
  //   // typeId for 'ValueTypes' is 1005
  //   let response = await apigetUrl(`/tpi/core-data?page=1&limit=1000&typeId=1005`);
  //   if (response.data.responseCode === "200") {
  //     setState((prevState) => ({
  //       ...prevState,
  //       valueTypes: (response.data || {}).dataList || []
  //     }));
  //   }
  // };

  // const getActionTypes = async () => {
  //   // typeId for 'ActionTypes' is 1006
  //   let response = await apigetUrl(`/tpi/core-data?page=1&limit=1000&typeId=1006`);
  //   if (response.data.responseCode === "200") {
  //     setState((prevState) => ({
  //       ...prevState,
  //       actionTypes: (response.data || {}).dataList || []
  //     }));
  //   }
  // };

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
          <IntlMessages id="InsurancePrivider.TPI.ResponsePayloadMaster.modal.edit.tilte" />
        ) : (
          <IntlMessages id="InsurancePrivider.TPI.ResponsePayloadMaster.modal.add.tilte" />
        )}
      </DialogTitle>
      <DialogContent>
        <div className="row">
          <div className="col-lg-6">
            <InputField
              required
              className={classes.formControl}
              autoFocus
              id="PayloadFieldName"
              error={errors.PayloadFieldName}
              label={
                <IntlMessages id="InsurancePrivider.TPI.ResponsePayloadMaster.PayloadFieldName" />
              }
              name="PayloadFieldName"
              onChange={handleChange}
              value={validation.PayloadFieldName}
              fullWidth
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
                <IntlMessages id="InsurancePrivider.TPI.ResponsePayloadMaster.ProductName" />
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
              error={errors.ValueType}
              fullWidth
            >
              <InputLabel id="demo-simple-select-outlined-label">
                <IntlMessages id="InsurancePrivider.TPI.ResponsePayloadMaster.ValueType" />
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
          <div className="col-lg-6">
            <InputField
              required
              className={classes.formControl}
              autoFocus
              id="FieldPath"
              error={errors.FieldPath}
              label={
                <IntlMessages id="InsurancePrivider.TPI.ResponsePayloadMaster.FieldPath" />
              }
              name="FieldPath"
              onChange={handleChange}
              value={validation.FieldPath}
              fullWidth
              helperText={errors.FieldPath}
            />
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
                <IntlMessages id="InsurancePrivider.TPI.ResponsePayloadMaster.ActionType" />
              </InputLabel>
              <InputSelect
                labelId="ActionType"
                id="ActionType"
                name="ActionType"
                value={validation.ActionType}
                onChange={handleChange}
                renderValue={(value) => `${value}`}
                label="ActionType"
                required
              >
                <MenuItem value="">
                  <em>Select</em>
                </MenuItem>
                {state.actionTypes.map((option) => (
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

export default ResponsePayloadMasterFrom;
