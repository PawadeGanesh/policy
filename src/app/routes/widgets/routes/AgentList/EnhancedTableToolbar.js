/* eslint-disable react/prop-types */
import React, { useState } from "react";
import "./root.component.css";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import CardBox from "./../../../../../components/CardBox";
import IconButton from "@material-ui/core/IconButton";
import IntlMessages from "util/IntlMessages";
import InputSearchButton from "../CommonComponents/SearchButton";
import InputResetButton from "../CommonComponents/ResetButton";
import InputSelect from "../CommonComponents/Select";

let EnhancedTableToolbar = (props) => {
  const {
    numSelected,
    isAdvancedSearchValidationText,
    advancedSearchValidationErrors,
    advancedSearchValidation,
    handleResetClick,
    handleSearchClick,
    handleAdvancedSearchOnChange,
    onAdvancedSearchClickClean,
  } = props;

  const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);

  const onAdvancedSearchClick = () => {
    onAdvancedSearchClickClean();
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
        <div className="row">
          <CardBox
            styleName="col-12"
            heading={<IntlMessages id="ipp.common.advancedsearch.title" />}
          >
            <form className="row" autoComplete="off">
              <div className="col-lg-3 col-sm-6 col-12 mb-3">
                <TextField
                  id="name"
                  label={
                    <IntlMessages id="auditevent.master.advancedsearch.name" />
                  }
                  variant="outlined"
                  onChange={(event) => handleAdvancedSearchOnChange(event)}
                  value={advancedSearchValidation.name}
                  name="name"
                  fullWidth
                  error={advancedSearchValidationErrors.name}
                  helpertext={advancedSearchValidationErrors.name}
                />
              </div>
              <div className="col-lg-3 col-sm-6 col-12 ml-n1">
                <FormControl variant="outlined" className="w-100 mb-2">
                  <InputLabel id="isEnabled">Is Enabled</InputLabel>
                  <InputSelect
                    labelId="isEnabled"
                    id="isEnabled"
                    value={advancedSearchValidation.isEnabled}
                    onChange={handleAdvancedSearchOnChange}
                    label={
                      <IntlMessages id="auditevent.master.advancedsearch.IsEnabled" />
                    }
                    name="isEnabled"
                    error={advancedSearchValidationErrors.isEnabled}
                    helpertext={advancedSearchValidationErrors.isEnabled}
                  >
                    <MenuItem value="">
                      <em>Select</em>
                    </MenuItem>
                    <MenuItem value={1}>Enabled</MenuItem>
                    <MenuItem value={0}>Not Enabled</MenuItem>
                  </InputSelect>
                </FormControl>
              </div>
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
      ) : //   <AdvancedSearch propData={advancedSearchProps} />
      null}
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
};

export default EnhancedTableToolbar;
