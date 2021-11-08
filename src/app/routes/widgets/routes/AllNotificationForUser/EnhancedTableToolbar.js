/* eslint-disable react/prop-types */
import React, { useState } from "react";
import PropTypes from "prop-types";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import "./master.css";


import {

  IconButton,
  FormControl,
  Select,
  Toolbar,
  Tooltip,
  Button,
  Typography,
  MenuItem,
  InputLabel,
  TextField
} from "@material-ui/core";
import CardBox from "./../../../../../components/CardBox/index";
import IntlMessages from "util/IntlMessages";
import InputSearchButton from "../CommonComponents/SearchButton";
import InputResetButton from "../CommonComponents/ResetButton";
import InputDatePicker from "../CommonComponents/DatePicker";





let EnhancedTableToolbar = ({
  numSelected,
  startDate,
  endDate,
  status,
  isendDateDisabled,
  callResetData,
  isAdvancedSearchValidationText,
  handleSearchClick,
  onAdvancedSearchClickClean,
  handlestartDate,
  handleendDate,
  handlestatus,

}) => {
  const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);

  const onAdvancedSearchClick = () => {
    console.log("Clicked for Search");

    onAdvancedSearchClickClean();
    setIsAdvancedSearch(!isAdvancedSearch);
  };


  // eslint-disable-next-line no-unused-vars
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
  });

  //Reset
  const handleResetClick = () => {callResetData();};

  return (
    <>
    <Toolbar className="table-header">
      <div className="spacer" />
      <div>

      </div>
      <div className="actions mr-3">
        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton aria-label="Delete">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
            <Tooltip title="Filter list">
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
        <CardBox styleName="col-12" heading={<IntlMessages id="ipp.common.advancedsearch.title" />}>
          <form autoComplete="off">
            <div className="row">


              <div className="col-lg-3 col-sm-6 col-12 mb-3">
                <FormControl variant="outlined"
                  className="w-100 mb-2">
                  <InputLabel id="status"><IntlMessages id="AllNotificationForUser.master.advancedsearch.status" /></InputLabel>
                  <Select
                    labelId="status"
                    id="status"
                    label={<IntlMessages id="AllNotificationForUser.master.advancedsearch.status" />}
                    fullWidth
                    onChange={handlestatus}
                    value={status}
                    name="status"
                  >
                    <MenuItem value="">
                      <em>Select</em>
                    </MenuItem>
                    <MenuItem value={"0"}><IntlMessages id="AllNotificationForUser.master.status.type0" /></MenuItem>
                    <MenuItem value={"1"}><IntlMessages id="AllNotificationForUser.master.status.type1" /></MenuItem>
                    <MenuItem value={"2"}><IntlMessages id="AllNotificationForUser.master.status.type2" /></MenuItem>
                  </Select>
                </FormControl>
              </div>

              <div className="col-lg-3 col-sm-6 col-12 mb-3" style={{ position:"relative", zIndex:"999" }}>
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
                    customInput={<TextField 
                      style={{width:"100%"}}
                      label={<IntlMessages id="AllNotificationForUser.master.advancedsearch.StartDate" />}
                      variant="outlined"
                      />}
                  />
              </div>
              <div className="col-lg-3 col-sm-6 col-12 mb-3" style={{ position:"relative", zIndex:"999" }}>
                  <InputDatePicker
                   
                    name="endDate"
                    selected={endDate}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    onChange={handleendDate}
                    disabled={isendDateDisabled}
                    customInput={<TextField 
                      style={{width:"100%"}}
                      label={<IntlMessages id="AllNotificationForUser.master.advancedsearch.EndDate" />}
                      variant="outlined"
                      />}
                  />
              </div>
              <div className="pt-2 ml-2">
                <InputSearchButton
                  onClick={handleSearchClick}
              />
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
