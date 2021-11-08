import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import "./master.css";
import {
  IconButton,
  FormControl,
  Toolbar,
  Tooltip,
  TextField,
  Typography,
  MenuItem,
  InputLabel,
} from "@material-ui/core";
import CardBox from "./../../../../../components/CardBox/index";
import IntlMessages from "util/IntlMessages";
import InputSearchButton from "../CommonComponents/SearchButton";
import InputResetButton from "../CommonComponents/ResetButton";
import InputField from "../CommonComponents/TextField";
import InputDatePicker from "../CommonComponents/DatePicker";
import LocationFilter from "../CommonComponents/LocationFilter";
import InputSelect from "../CommonComponents/Select";

let EnhancedTableToolbar = ({
  numSelected,
  setAdvancedSearchData,
  setResetData,
  page,
  limit,
  setAdvancedSearchError,
  validation,
  policyIssueStartDate,
  policyIssueEndDate,
  isPolicyIssueDateStartDateActive,
  isPolicyIssueDateEndDateDisabled,
  policyExpiryStartDate,
  policyExpiryEndDate,
  isPolicyExpiryDateStartDateActive,
  isPolicyExpiryDateEndDateDisabled,
  getSuccessUpdate,
  isAdvancedSearchValidationText,
  handleSearchClick,
  onAdvancedSearchClickClean,
  searchValidation,
  menuItem,
  setCurrentUrl,
  handleMenuItem,
  itemName,
  search,
  callLocalBaseURL,
  errors,
  handleInputChange,
  getErrorUpdate,
  sortBy,
  handlePolicyIssueDateStartDate,
  sortType,
  handlePolicyIssueDateEndDate,
  handlePolicyExpiryDateEndDate,
  handlePolicyExpiryDateStartDate,
  callResetData,
  isAdvancedSearch,
  onAdvancedSearchClick,
  policyType,
  handlepolicytype,
  dataOFLocation,
  handler,
  handlingDefaultValue,
}) => {
  const [state, setState] = useState({
    event: "",
    errors: {},
    isActive: false,
  });

  //Reset Button Click Functionality
  const handleResetClick = (e) => {
    callResetData();
    setState((prevState) => ({
      ...prevState,
      isActive: !state.isActive,
    }));
  };

  //Advance Search Design
  return (
    <>
      <Toolbar className="table-header">
        <div className="spacer" />
        <div></div>
        <div className="actions mr-3">
          {numSelected > 0 ? (
            <Tooltip title="Delete">
              <IconButton aria-label="Delete">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip
              title={<IntlMessages id="EnhancedTableHead.Tooltip.List" />}
            >
              <IconButton
                onClick={onAdvancedSearchClick}
                aria-label="Filter list"
              >
                <FilterListIcon />
              </IconButton>
            </Tooltip>
          )}
        </div>
      </Toolbar>

      {isAdvancedSearch ? (
        <div className="row mx-1">
          <CardBox
            styleName="col-12"
            heading={<IntlMessages id="ipp.common.advancedsearch.title" />}
          >
            <form autoComplete="off">
              <div className="row">
                <div className="col-lg-12 col-sm-12 col-12 mb-3">
                  <LocationFilter
                    inputId={dataOFLocation}
                    handler={handler}
                    isActive={state.isActive}
                    handlingDefaultValue={handlingDefaultValue}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-lg-3 col-sm-6 col-12 mb-3">
                  <InputField
                    id="outlined-basic"
                    onChange={(event) => handleInputChange(event)}
                    value={searchValidation.policyNum}
                    error={errors.name}
                    helperText={errors.name}
                    name="policyNum"
                    fullWidth
                    label={
                      <IntlMessages id="ListOfPolicies.master.advancedsearch.PolicyNumber.name" />
                    }
                  />
                </div>
                <div
                  className="col-lg-3 col-sm-6 col-12 mb-3"
                  style={{ position: "relative", zIndex: "999" }}
                >
                  <InputDatePicker
                    filterDate={(d) => {
                      return new Date() > d;
                    }}
                    name="policyIssueStartDate"
                    selected={policyIssueStartDate}
                    selectsStart
                    startDate={policyIssueStartDate}
                    endDate={policyIssueEndDate}
                    onChange={handlePolicyIssueDateStartDate}
                    customInput={
                      <TextField
                        style={{ width: "100%" }}
                        label={
                          <IntlMessages id="ListOfPolicies.master.advancedsearch.PolicyStateIssueDate.name" />
                        }
                        variant="outlined"
                      />
                    }
                  />
                </div>
                <div
                  className="col-lg-3 col-sm-6 col-12 mb-3"
                  style={{ position: "relative", zIndex: "999" }}
                >
                  <InputDatePicker
                    filterDate={(d) => {
                      return new Date() > d;
                    }}
                    name="policyIssueEndDate"
                    selected={policyIssueEndDate}
                    selectsEnd
                    startDate={policyIssueStartDate}
                    endDate={policyIssueEndDate}
                    minDate={policyIssueStartDate}
                    onChange={handlePolicyIssueDateEndDate}
                    disabled={isPolicyIssueDateEndDateDisabled}
                    customInput={
                      <TextField
                        style={{ width: "100%" }}
                        label={
                          <IntlMessages id="ListOfPolicies.master.advancedsearch.PolicyEndIssueDate.name" />
                        }
                        variant="outlined"
                      />
                    }
                  />
                </div>
                <div
                  className="col-lg-3 col-sm-6 col-12 mb-3"
                  style={{ position: "relative", zIndex: "999" }}
                >
                  <InputDatePicker
                    name="policyExpiryStartDate"
                    selected={policyExpiryStartDate}
                    selectsStart
                    startDate={policyExpiryStartDate}
                    endDate={policyExpiryEndDate}
                    onChange={handlePolicyExpiryDateStartDate}
                    customInput={
                      <TextField
                        style={{ width: "100%" }}
                        label={
                          <IntlMessages id="ListOfPolicies.master.advancedsearch.PolicyStartExpiryDate.name" />
                        }
                        variant="outlined"
                      />
                    }
                  />
                </div>
              </div>
              <br />
              <div className="row">
                <div
                  className="col-lg-3 col-sm-6 col-12 mb-3"
                  style={{ position: "relative", zIndex: "999" }}
                >
                  <InputDatePicker
                    name="policyExpiryEndDate"
                    selected={policyExpiryEndDate}
                    selectsEnd
                    startDate={policyExpiryStartDate}
                    endDate={policyExpiryEndDate}
                    minDate={policyExpiryStartDate}
                    onChange={handlePolicyExpiryDateEndDate}
                    disabled={isPolicyExpiryDateEndDateDisabled}
                    customInput={
                      <TextField
                        style={{ width: "100%" }}
                        label={
                          <IntlMessages id="ListOfPolicies.master.advancedsearch.PolicyEndExpiryDate.name" />
                        }
                        variant="outlined"
                      />
                    }
                  />
                </div>
                <div className="col-lg-2 col-sm-6 col-12 mb-3">
                  <FormControl variant="outlined" className="CustomSelect">
                    <InputLabel id="policyType">
                      <IntlMessages id="ListOfPolicies.master.advancedsearch.Type.name" />
                    </InputLabel>
                    <InputSelect
                      labelId="policyType"
                      id="policyType"
                      name="policyType"
                      value={policyType}
                      onChange={(event) => handlepolicytype(event)}
                      renderValue={(value) => `${value}`}
                    >
                      <MenuItem value="">
                        <em>Select</em>
                      </MenuItem>
                      <MenuItem value={"1"}>New</MenuItem>
                      <MenuItem value={"2"}>Renewal</MenuItem>
                    </InputSelect>
                  </FormControl>
                </div>
              </div>
              <br />
              <div className="row">
                <div className="pt-2 ml-2">
                  <InputSearchButton onClick={handleSearchClick} />
                </div>
                <div className="pt-2">
                  <InputResetButton
                    onClick={(event) => handleResetClick(event)}
                  />
                </div>

                <Typography
                  variant="subtitle2"
                  gutterBottom
                  className="ml-3 mt-3"
                  color="error"
                >
                  {!isAdvancedSearchValidationText
                    ? "At least one field should be filled"
                    : null}
                </Typography>
              </div>
            </form>
          </CardBox>
        </div>
      ) : null}
    </>
  );
};

//props
EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  setAdvancedSearchData: PropTypes.func.isRequired,
  setResetData: PropTypes.func.isRequired,
  setCurrentUrl: PropTypes.func.isRequired,
  pageNumber: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortType: PropTypes.string.isRequired,
};

export default EnhancedTableToolbar;
