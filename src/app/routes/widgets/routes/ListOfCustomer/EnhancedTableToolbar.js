import React, { useState } from "react";
import PropTypes from "prop-types";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import "./master.css";
import {
  IconButton,
  Toolbar,
  Tooltip,
  TextField,
  Typography,
} from "@material-ui/core";
import CardBox from "./../../../../../components/CardBox/index";
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
  createdStartDate,
  createdEndDate,
  isCreatedEndDateDisable,
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
  handleCreatedStartDate,
  sortType,
  handleCreatedEndDate,
  callResetData,
  isAdvancedSearch,
  onAdvancedSearchClick,
  locationName,
  dataOFLocation,
  handler,
  handlingDefaultValue,
}) => {
  
  //state
  const [state, setState] = useState({
    event: "",
    errors: {},
    isActive: false,
  });

  //handle Reset Click
  const handleResetClick = (e) => {
    callResetData();
    setState((prevState) => ({
      ...prevState,
      isActive: !state.isActive,
    }));
  };

  //advance search
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
                    value={searchValidation.agentId}
                    error={errors.name}
                    helperText={errors.name}
                    name="agentId"
                    fullWidth
                    label={
                      <IntlMessages id="ListOfCustomer.master.advancedsearch.agentid" />
                    }
                  />
                </div>

                <div className="col-lg-3 col-sm-6 col-12 mb-3">
                  <InputField
                    id="outlined-basic"
                    onChange={(event) => handleInputChange(event)}
                    value={searchValidation.firstName}
                    error={errors.name}
                    helperText={errors.name}
                    name="firstName"
                    label={
                      <IntlMessages id="ListOfCustomer.master.advancedsearch.firstname" />
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
                    label={
                      <IntlMessages id="ListOfCustomer.master.advancedsearch.middlename" />
                    }
                    fullWidth
                  />
                </div>
                <div className="col-lg-3 col-sm-6 col-12 mb-3">
                  <InputField
                    id="outlined-basic"
                    onChange={(event) => handleInputChange(event)}
                    value={searchValidation.lastName}
                    error={errors.name}
                    helperText={errors.name}
                    label={
                      <IntlMessages id="ListOfCustomer.master.advancedsearch.lastname" />
                    }
                    name="lastName"
                    fullWidth
                  />
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col-lg-3 col-sm-6 col-12 mb-3">
                  <InputField
                    id="outlined-basic"
                    onChange={(event) => handleInputChange(event)}
                    value={searchValidation.mobileNo}
                    error={errors.name}
                    helperText={errors.name}
                    name="mobileNo"
                    label={
                      <IntlMessages id="ListOfCustomer.master.advancedsearch.mobilenumber" />
                    }
                    fullWidth
                  />
                </div>

                <div className="col-lg-3 col-sm-6 col-12 mb-3">
                  <InputField
                    id="outlined-basic"
                    onChange={(event) => handleInputChange(event)}
                    value={searchValidation.emailId}
                    error={errors.name}
                    helperText={errors.name}
                    name="emailId"
                    label={
                      <IntlMessages id="ListOfCustomer.master.advancedsearch.emailid" />
                    }
                    fullWidth
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
                    name="createdStartDate"
                    selected={createdStartDate}
                    selectsStart
                    startDate={createdStartDate}
                    endDate={createdEndDate}
                    onChange={handleCreatedStartDate}
                    customInput={
                      <TextField
                        style={{ width: "100%" }}
                        label={
                          <IntlMessages id="ListOfCustomer.master.advancedsearch.StartDate" />
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
                    name="createdEndDate"
                    selected={createdEndDate}
                    selectsEnd
                    startDate={createdStartDate}
                    endDate={createdEndDate}
                    minDate={createdStartDate}
                    onChange={handleCreatedEndDate}
                    disabled={isCreatedEndDateDisable}
                    customInput={
                      <TextField
                        style={{ width: "100%" }}
                        label={
                          <IntlMessages id="ListOfCustomer.master.advancedsearch.EndDate" />
                        }
                        variant="outlined"
                      />
                    }
                  />
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
