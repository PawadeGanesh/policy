import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import keycode from "keycode";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import fetch from "cross-fetch";
import { Autocomplete, Alert } from "@material-ui/lab";
import DateFnsUtils from "@date-io/date-fns";
import "./master.css";
import FormDialog from "./FormDialog";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import IntlMessages from "util/IntlMessages";
import {
  ListItemIcon,
  Modal,
  CircularProgress,
  TableHead,
  TableFooter,
  TableCell,
  TableBody,
  IconButton,
  FormControl,
  Select,
  Toolbar,
  Tooltip,
  TableRow,
  TableSortLabel,
  TablePagination,
  Button,
  Grid,
  Card,
  Table,
  Typography,
  CardContent,
  MenuItem,
  InputLabel,
} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import CardBox from "./../../../../../components/CardBox/index";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import { FormHelperText } from "@material-ui/core";
import InputSearchButton from "../CommonComponents/SearchButton";
import InputResetButton from "../CommonComponents/ResetButton";
import InputDatePicker from "../CommonComponents/DatePicker";
import InputSelect from "../CommonComponents/Select";

const baseURL = `${process.env.REACT_APP_BASE_URL}`;
const api = axios.create({
  baseURL: baseURL,
});

let EnhancedTableToolbar = (props) => {
  const {
    numSelected,
    setAdvancedSearchData,
    setResetData,
    setCurrentUrl,
    pageNumber,
    limit,
    page,
    sortBy,
    sortType,
    setAdvancedSearchError,
    searchedProperty,
    handleAdvancedSearchOnChange,
    advancedSearchValidation,
    selectedStartDate_Time,
    selectedEndDate_Time,
    idNameData,
    handleResetClick,
    handleSearchClick,
    handleStartDate_TimeChange,
    handleEndDate_TimeChange,
    isAdvancedSearchValidationText,
    handleAutoCompleteInputReset,
    advancedSearchValidationErrors,
    startDate,
    endDate,
    isStartDateActive,
    isEndDateDisabled,
    handleStartDate,
    handleEndDate,
    onAdvancedSearchClickClean,
    handleAdvancedSearchChange,
    isEventIdEmpty,
  } = props;

  const eventID_AutoComplete_Ref = useRef();

  const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);
  const [startDateError, setStartDateError] = useState("");
  const [endDateError, setEndDateError] = useState("");

  const onAdvancedSearchClick = (e) => {
    onAdvancedSearchClickClean();
    setIsAdvancedSearch(!isAdvancedSearch);
  };
  const useStyles = makeStyles((theme) => ({
    root: {
      width: "100%",
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: "33.33%",
      flexShrink: 0,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
  }));

  useEffect(() => {
    if (advancedSearchValidationErrors.startDate_Time) {
      setStartDateError(advancedSearchValidationErrors.startDate_Time.message);
    } else if (!advancedSearchValidationErrors.startDate_Time) {
      setStartDateError(advancedSearchValidationErrors.startDate_Time);
    }

    if (advancedSearchValidationErrors.endDate_Time) {
      setEndDateError(advancedSearchValidationErrors.endDate_Time.message);
    } else if (!advancedSearchValidationErrors.endDate_Time) {
      setEndDateError(advancedSearchValidationErrors.endDate_Time);
    }
  }, [advancedSearchValidationErrors]);

  return (
    <>
      <Toolbar className="table-header">
        <div className="title">
          {numSelected > 0 ? (
            <Typography variant="subheading">{numSelected} selected</Typography>
          ) : (
            <Typography variant="title"></Typography>
          )}
        </div>
        <div className="spacer" />
        <div className="actions">
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
        <div className="row mx-3">
          <CardBox
            styleName="col-12"
            heading={<IntlMessages id="ipp.common.advancedsearch.title" />}
          >
            <form className="row" autoComplete="off">
              <div className="col-lg-3 col-sm-6 col-12 mb-1">
                <Autocomplete
                  multiple
                  key={handleAutoCompleteInputReset}
                  ref={eventID_AutoComplete_Ref}
                  autoFocus
                  onChange={(event, value) =>
                    handleAdvancedSearchChange(event, value)
                  }
                  label="Event Name"
                  name="eventId"
                  className="mb-4"
                  id="eventId"
                  options={idNameData}
                  getOptionLabel={(option) => option.name}
                  // style={{ width: 300 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <IntlMessages id="auditmaster.master.advancedsearch.Event" />
                      }
                      variant="outlined"
                      error={isEventIdEmpty}
                      helperText={
                        isEventIdEmpty
                          ? ' "Event name" is not allowed to be empty'
                          : null
                      }
                    />
                  )}
                  fullWidth
                  //error={state.errors.eventId}
                  //helperText={state.errors.eventId}
                />
              </div>
              <div className="col-lg-3 col-sm-6 col-12 mb-1">
                <FormControl
                  // error={state.errors.actionType}
                  // helperText={state.errors.actionType}
                  variant="outlined"
                  className="w-100 mb-2"
                >
                  <InputLabel id="actionType">
                    {" "}
                    <IntlMessages id="auditmaster.master.advancedsearch.ActionType" />
                  </InputLabel>
                  <InputSelect
                    labelId="actionType"
                    id="actionType"
                    value={advancedSearchValidation.actionType}
                    onChange={handleAdvancedSearchOnChange}
                    name="actionType"
                    label={
                      <IntlMessages id="auditmaster.master.advancedsearch.ActionType" />
                    }
                  >
                    <MenuItem value="">
                      <em>Select</em>
                    </MenuItem>
                    <MenuItem value={"0"}>Add / Create operation</MenuItem>
                    <MenuItem value={"1"}>Modify operation</MenuItem>
                    <MenuItem value={"2"}>View operation</MenuItem>
                    <MenuItem value={"4"}>Delete operation</MenuItem>
                  </InputSelect>
                  <FormHelperText style={{ color: "red" }}>
                    {advancedSearchValidationErrors.actionType
                      ? advancedSearchValidationErrors.actionType
                      : " "}
                  </FormHelperText>
                </FormControl>
              </div>

              <div className="col-lg-3 col-sm-6 col-12 mb-4">
                <TextField
                  id="outlined-basic"
                  label={
                    <IntlMessages id="auditmaster.master.advancedsearch.UserName" />
                  }
                  variant="outlined"
                  onChange={(event) => handleAdvancedSearchOnChange(event)}
                  value={advancedSearchValidation.userName}
                  error={advancedSearchValidationErrors.userName}
                  helperText={advancedSearchValidationErrors.userName}
                  name="userName"
                  fullWidth
                />
              </div>

              <div className="col-lg-3 col-sm-6 col-12 mb-4">
                <TextField
                  id="outlined-basic"
                  label={
                    <IntlMessages id="auditmaster.master.advancedsearch.Description" />
                  }
                  variant="outlined"
                  onChange={(event) => handleAdvancedSearchOnChange(event)}
                  value={advancedSearchValidation.description}
                  error={advancedSearchValidationErrors.description}
                  helperText={advancedSearchValidationErrors.description}
                  name="description"
                  fullWidth
                />
              </div>

              <div className="col-lg-3 col-sm-6 col-12  mb-4">
                <TextField
                  id="outlined-basic"
                  label={
                    <IntlMessages id="auditmaster.master.advancedsearch.ReferenceID" />
                  }
                  variant="outlined"
                  onChange={(event) => handleAdvancedSearchOnChange(event)}
                  value={advancedSearchValidation.referenceId}
                  error={advancedSearchValidationErrors.referenceId}
                  helperText={advancedSearchValidationErrors.referenceId}
                  name="referenceId"
                  fullWidth
                />
              </div>

              <div
                className="col-lg-3 col-sm-6 col-12  mb-4"
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
                  onChange={handleStartDate}
                  customInput={
                    <TextField
                      style={{ width: "100%" }}
                      label={
                        <IntlMessages id="auditmaster.master.advancedsearch.StartDate" />
                      }
                      variant="outlined"
                    />
                  }
                />
              </div>

              <div
                className="col-lg-3 col-sm-6 col-12  mb-4"
                style={{ position: "relative", zIndex: "999" }}
              >
                <InputDatePicker
                  filterDate={(d) => {
                    return new Date() > d;
                  }}
                  name="endDate"
                  selected={endDate}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  onChange={handleEndDate}
                  disabled={isEndDateDisabled}
                  customInput={
                    <TextField
                      style={{ width: "100%" }}
                      label={
                        <IntlMessages id="auditmaster.master.advancedsearch.EndDate" />
                      }
                      variant="outlined"
                    />
                  }
                />
              </div>

              <div className="col-lg-3 col-sm-6 col-12  mb-4">
                <FormControl component="fieldset">
                  {/* <FormLabel component="legend">Label Placement</FormLabel> */}
                  <FormGroup aria-label="position" row>
                    <FormControlLabel
                      // value={advancedSearchValidation.includeArchive}
                      control={
                        <Checkbox
                          color="primary"
                          checked={advancedSearchValidation.includeArchive}
                          onChange={handleAdvancedSearchOnChange}
                        />
                      }
                      label={
                        <IntlMessages id="auditmaster.master.advancedsearch.IncludeArchive" />
                      }
                      labelPlacement="start"
                      name="includeArchive"
                      error={advancedSearchValidationErrors.includeArchive}
                      helperText={advancedSearchValidationErrors.includeArchive}
                    />
                  </FormGroup>
                </FormControl>
              </div>
              {/* <div className="col-lg-3"></div> */}
              <div className="pt-2 ml-3 mt-3">
                <InputSearchButton
                  onClick={(event) => handleSearchClick(event)}
                />
              </div>
              <div className="pt-2 mt-3">
                <InputResetButton
                  onClick={(event) => handleResetClick(event)}
                />
              </div>
              <div style={{ marginTop: "5px" }}>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  className="ml-3 mt-4"
                  color="error"
                >
                  {isAdvancedSearchValidationText
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
  // setCurrentUrl: PropTypes.func.isRequired,
  pageNumber: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortType: PropTypes.string.isRequired,
  handleAdvancedSearchOnChange: PropTypes.func.isRequired,
};

export default EnhancedTableToolbar;
