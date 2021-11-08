import React, { useState, useRef } from "react";
import "./root.component.css";
import { Modal, TextField, Button } from "@material-ui/core";
import PropTypes from "prop-types";
import Toolbar from "@material-ui/core/Toolbar";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import Typography from "@material-ui/core/Typography";
import CardBox from "../../../../../components/CardBox";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Joi from "joi-browser";
import IntlMessages from "util/IntlMessages";
import _ from "lodash";
import InputSearchButton from "../CommonComponents/SearchButton";
import InputResetButton from "../CommonComponents/ResetButton";
import InputField from "../CommonComponents/TextField";
import InputDatePicker from "../CommonComponents/DatePicker";

let EnhancedTableToolbar = ({
  numSelected,
  name,
  handleApplyClick,
  onAdvancedSearchClickClean,
  handleResetClick,
  handleAdvancedSearchOnChange,
  isAdvancedSearchValidationText,
  startDate,
  endDate,
  handleStartDate,
  handleEndDate,
  isEndDateDisabled,
}) => {
  const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);

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

  const classes = useStyles();
  const categoryID_AutoComplete_Ref = useRef();

  const [state, setState] = useState({
    name: "",
    categoryId: "",
    order: "asc",
    orderBy: "name",
    selected: [],
    page: 1,
    rowsPerPage: 5,
    count: 0,
    data: [],
    errors: {},
  });

  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const loading = open && options.length === 0;

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  const useStyles2 = makeStyles((theme) => ({
    button: {
      margin: theme.spacing(1),
    },
  }));

  const classes_AddButton = useStyles2();

  return (
    <>
      <Toolbar className="table-header">
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
        <div className="row">
          <CardBox
            styleName="col-12"
            heading={<IntlMessages id="ipp.common.advancedsearch.title" />}
          >
            <form autoComplete="off">
              <div className="row">
                <div className="col-lg-3 col-sm-6 col-12 mb-3">
                  <InputField
                    id="outlined-basic"
                    label={
                      <IntlMessages id="CommissionLedger.AdvanceSearch.Name" />
                    }
                    variant="outlined"
                    onChange={(event) => handleAdvancedSearchOnChange(event)}
                    value={name}
                    name="name"
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
                    name="startDate"
                    // placeholderText="Policy Issue Start Date"
                    selected={startDate}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    onChange={handleStartDate}
                    customInput={
                      <TextField
                        style={{ width: "100%" }}
                        label={
                          <IntlMessages id="CommissionLedger.AdvanceSearch.StartDate" />
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
                    name="endDate"
                    selected={endDate}
                    selectsEnd
                    startDate={endDate}
                    endDate={endDate}
                    minDate={startDate}
                    onChange={handleEndDate}
                    disabled={isEndDateDisabled}
                    customInput={
                      <TextField
                        style={{ width: "100%" }}
                        label={
                          <IntlMessages id="CommissionLedger.AdvanceSearch.EndDate" />
                        }
                        variant="outlined"
                      />
                    }
                  />
                </div>
              </div>
              <div className="row">
                <div className="pt-2 ml-2">
                  <InputSearchButton
                    onClick={(event) => handleApplyClick(event)}
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
  // numSelected: PropTypes.number.isRequired,
  setAdvancedSearchData: PropTypes.func.isRequired,
  setResetData: PropTypes.func.isRequired,
};

export default EnhancedTableToolbar;
