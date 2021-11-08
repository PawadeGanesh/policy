import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import { useHistory } from "react-router-dom";
import "./master.css";
import {
  makeStyles,
  IconButton,
  Toolbar,
  Tooltip,
  Button,
  TextField,
  Typography,
} from "@material-ui/core";
import CardBox from "./../../../../../components/CardBox/index";
import Joi from "joi-browser";
import IntlMessages from "util/IntlMessages";
import InputSearchButton from "../CommonComponents/SearchButton";
import InputResetButton from "../CommonComponents/ResetButton";
import InputField from "../CommonComponents/TextField";
import InputDatePicker from "../CommonComponents/DatePicker";
import LocationFilter from "../CommonComponents/LocationFilter";

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
  requestDateStartDate,
  requestDateEndDate,
  isPolicyExpiryDateStartDateActive,
  isRequestDateEndDateDisabled,
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
  handlerequestEndDate,
  handlerequestStartDate,
  callResetData,
  onAdvancedSearchClick,
  isAdvancedSearch,
  handler,
  handlingDefaultValue,
  dataOFLocation,
}) => {
  const [state, setState] = useState({
    event: "",
    actionType: "",
    referenceID: "",
    currency: "",
    addForm_Name: "",
    validation: {
      name: "",
      description: "",
    },
    parentId: "",
    dataListId: "",

    errors: {},
    isAddFormSubmitDisabled: false,
    areAllAddFormFieldsPopulated: false,
    isActive: false,
  });

  const handleResetClick = (e) => {
    callResetData();
    setState((prevState) => ({
      ...prevState,
      isActive: !state.isActive,
    }));
  };

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
                onClick={(event) => onAdvancedSearchClick(event)}
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
                    value={searchValidation.firstName}
                    error={errors.name}
                    helperText={errors.name}
                    name="firstName"
                    label={
                      <IntlMessages id="EnquiryList.master.advancedsearch.firstName" />
                    }
                    fullWidth
                  />
                </div>
                <div className="col-lg-3 col-sm-6 col-12 mb-3">
                  <InputField
                    id="outlined-basic"
                    onChange={(event) => handleInputChange(event)}
                    value={searchValidation.middleName}
                    error={errors.name}
                    helperText={errors.name}
                    name="middleName"
                    fullWidth
                    label={
                      <IntlMessages id="EnquiryList.master.advancedsearch.middleName" />
                    }
                  />
                </div>

                <div className="col-lg-3 col-sm-6 col-12 mb-3">
                  <InputField
                    id="outlined-basic"
                    onChange={(event) => handleInputChange(event)}
                    value={searchValidation.lastName}
                    error={errors.name}
                    helperText={errors.name}
                    name="lastName"
                    fullWidth
                    label={
                      <IntlMessages id="EnquiryList.master.advancedsearch.lastName" />
                    }
                  />
                </div>
                <div className="col-lg-3 col-sm-6 col-12 mb-3">
                  <InputField
                    id="outlined-basic"
                    onChange={(event) => handleInputChange(event)}
                    value={searchValidation.mobileNo}
                    error={errors.name}
                    helperText={errors.name}
                    name="mobileNo"
                    fullWidth
                    label={
                      <IntlMessages id="EnquiryList.master.advancedsearch.mobileNo" />
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
                  <InputField
                    id="outlined-basic"
                    onChange={(event) => handleInputChange(event)}
                    value={searchValidation.emailId}
                    error={errors.name}
                    helperText={errors.name}
                    name="emailId"
                    fullWidth
                    label={
                      <IntlMessages id="EnquiryList.master.advancedsearch.emailId" />
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
                    name="requestStartdate"
                    selected={requestDateStartDate}
                    selectsStart
                    startDate={requestDateStartDate}
                    endDate={requestDateEndDate}
                    onChange={handlerequestStartDate}
                    customInput={
                      <TextField
                        style={{ width: "100%" }}
                        label={
                          <IntlMessages id="EnquiryList.master.advancedsearch.StartDate" />
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
                    name="requestEndDate"
                    selected={requestDateEndDate}
                    selectsEnd
                    startDate={requestDateStartDate}
                    endDate={requestDateEndDate}
                    minDate={requestDateStartDate}
                    onChange={handlerequestEndDate}
                    disabled={isRequestDateEndDateDisabled}
                    customInput={
                      <TextField
                        style={{ width: "100%" }}
                        label={
                          <IntlMessages id="EnquiryList.master.advancedsearch.EndDate" />
                        }
                        variant="outlined"
                      />
                    }
                  />
                </div>
                <div className="col-lg-3"></div>
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
