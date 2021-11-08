import React, { useState, useRef } from "react";
import "./root.component.css";
import { TextField } from "@material-ui/core";
import PropTypes from "prop-types";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CardBox from "../../../../../components/CardBox";
import IconButton from "@material-ui/core/IconButton";
import IntlMessages from "util/IntlMessages";
import InputSearchButton from "../CommonComponents/SearchButton";
import InputResetButton from "../CommonComponents/ResetButton";

let EnhancedTableToolbar = (props) => {
  const eventID_AutoComplete_Ref = useRef();
  const typeID_AutoComplete_Ref = useRef();

  const {
    numSelected,
    setAdvancedSearchData,
    setResetData,
    advancedSearch_EventID_DataArray,
    advancedSearch_TypeID_DataArray,
    isAdvancedSearchValidationText,
    advancedSearchValidationErrors,
    advancedSearchValidation,
    handleResetClick,
    handleSearchClick,
    handleAdvancedSearchOnChange,
    handleAutoCompleteInputReset,
  } = props;
  const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);

  const onAdvancedSearchClick = (e) => {
    setIsAdvancedSearch(!isAdvancedSearch);
  };

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
            <form className="row" autoComplete="off">
              <div className="col-lg-3 col-sm-6 col-12 mb-3">
                <Autocomplete
                  key={handleAutoCompleteInputReset}
                  ref={eventID_AutoComplete_Ref}
                  autoHighlight
                  onChange={(event, value) =>
                    handleAdvancedSearchOnChange(
                      event,
                      value,
                      eventID_AutoComplete_Ref
                    )
                  }
                  id="eventId"
                  name="eventId"
                  options={advancedSearch_EventID_DataArray}
                  getOptionLabel={(option) => option.name}
                  // style={{ width: 300 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <IntlMessages id="notificationtempalet.master.advancedsearch.Event" />
                      }
                      variant="outlined"
                      error={advancedSearchValidationErrors.eventId}
                      helperText={advancedSearchValidationErrors.eventId}
                    />
                  )}
                  fullWidth
                />
              </div>
              <div className="col-lg-3 col-sm-6 col-12">
                <Autocomplete
                  key={handleAutoCompleteInputReset}
                  ref={typeID_AutoComplete_Ref}
                  onChange={(event, value) =>
                    handleAdvancedSearchOnChange(
                      event,
                      value,
                      typeID_AutoComplete_Ref
                    )
                  }
                  id="typeId"
                  name="typeId"
                  options={advancedSearch_TypeID_DataArray}
                  getOptionLabel={(option) => option.name}
                  // style={{ width: 300 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <IntlMessages id="notificationtempalet.master.advancedsearch.Type" />
                      }
                      variant="outlined"
                      error={advancedSearchValidationErrors.typeId}
                      helperText={advancedSearchValidationErrors.typeId}
                    />
                  )}
                  fullWidth
                />
              </div>
              <div className="col-lg-6"></div>
              <div className="pt-2 ml-2">
                <InputSearchButton
                  onClick={(event) => handleSearchClick(event)}
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
  pageNumber: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortType: PropTypes.string.isRequired,
};

export default EnhancedTableToolbar;
