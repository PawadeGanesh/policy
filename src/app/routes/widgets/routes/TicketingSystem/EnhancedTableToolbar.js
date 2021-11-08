import React, { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import { useHistory } from "react-router-dom";
import "./master.css";
import IntlMessages from "util/IntlMessages";
import {
  IconButton,
  FormControl,
  Select,
  Toolbar,
  Tooltip,
  TextField,
  Typography,
  MenuItem,
  InputLabel,
} from "@material-ui/core";
import CardBox from "./../../../../../components/CardBox/index";
import InputSearchButton from "../CommonComponents/SearchButton";
import InputResetButton from "../CommonComponents/ResetButton";
import InputField from "../CommonComponents/TextField";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import InputDatePicker from "../CommonComponents/DatePicker";

let EnhancedTableToolbar = ({
  numSelected,
  setAdvancedSearchData,
  setResetData,
  page,
  limit,
  setAdvancedSearchError,
  validation,
  getSuccessUpdate,
  isAdvancedSearchValidationText,
  handleSearchClick,
  onAdvancedSearchClickClean,
  searchValidation,
  menuItem,
  setCurrentUrl,
  handleMenuItem,
  itemName,
  callResetData,
  search,
  callLocalBaseURL,
  errors,
  handleInputChange,
  getErrorUpdate,
  sortBy,
  onAddButtonClick,
  sortType,
  onGoBackClick,
  startDate,
  endDate,
  status,
  isendDateDisabled,
  handlestartDate,
  handleendDate,
  handlestatus,
}) => {
  const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);

  //on Advanced Search Click
  const onAdvancedSearchClick = (e) => {
    onAdvancedSearchClickClean();
    setIsAdvancedSearch(!isAdvancedSearch);
  };

  //state
  const [state, setState] = useState({
    event: "",
    errors: {},
  });

  //handle Reset Click
  const handleResetClick = (e) => {
    setState((prevState) => ({
      ...prevState,
      validation: {
        name: "",
        description: "",
      },
    }));

    callResetData();
  };

  return (
    <>
      <Toolbar className="table-header">
        <Tooltip title={<IntlMessages id="EnhancedTableHead.Tooltip.GoBack" />}>
          <IconButton aria-label="Go Back" onClick={() => onGoBackClick()}>
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>
        <div className="spacer" />

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
            <form className="row" autoComplete="off">
              <div className="col-lg-3 col-sm-6 col-12 mb-3">
                <InputField
                  id="outlined-basic"
                  onChange={(event) => handleInputChange(event)}
                  value={searchValidation.ticketNumber}
                  error={errors.name}
                  helperText={errors.name}
                  name="ticketNumber"
                  label={
                    <IntlMessages id="MyTickets.AdvanceSearch.Ticketnumber" />
                  }
                  fullWidth
                />
              </div>
              <div className="col-lg-3 col-sm-6 col-12 mb-3">
                <FormControl variant="outlined" className="w-100 mb-2">
                  <InputLabel id="status">Ticket Status</InputLabel>
                  <Select
                    labelId="status"
                    id="status"
                    label="Ticket Status"
                    fullWidth
                    onChange={handlestatus}
                    value={status}
                    name="status"
                  >
                    <MenuItem value="">
                      <em>Select</em>
                    </MenuItem>
                    <MenuItem value={1}>Open</MenuItem>
                    <MenuItem value={2}>Resolved</MenuItem>
                    <MenuItem value={3}>Closed</MenuItem>
                    <MenuItem value={4}>Archived</MenuItem>
                    <MenuItem value={5}>Deleted</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div
                className="col-lg-3 col-sm-6 col-12 mb-3"
                style={{ position: "relative", zIndex: "999" }}
              >
                <InputDatePicker
                  filterDate={(d) => {
                    return new Date() > d;
                  }}
                  name="startDate"
                  selected={startDate}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  onChange={handlestartDate}
                  customInput={
                    <TextField
                      style={{ width: "100%" }}
                      label={
                        <IntlMessages id="AllNotificationForUser.master.advancedsearch.StartDate" />
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
                  name="endDate"
                  selected={endDate}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  onChange={handleendDate}
                  disabled={isendDateDisabled}
                  customInput={
                    <TextField
                      style={{ width: "100%" }}
                      label={
                        <IntlMessages id="AllNotificationForUser.master.advancedsearch.EndDate" />
                      }
                      variant="outlined"
                    />
                  }
                />
              </div>

              <div className="pt-2 ml-2">
                <InputSearchButton onClick={handleSearchClick} />
              </div>
              <div className="pt-2">
                <InputResetButton
                  onClick={(event) => handleResetClick(event)}
                />
              </div>

              <br />
              <div className="row">
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
  // pageNumber: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortType: PropTypes.string.isRequired,
};

export default EnhancedTableToolbar;
