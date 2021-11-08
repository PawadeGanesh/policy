import React, { useState } from "react";
import "./root.component.css";
import TextField from "@material-ui/core/TextField";
import Toolbar from "@material-ui/core/Toolbar";
import Tooltip from "@material-ui/core/Tooltip";
import FilterListIcon from "@material-ui/icons/FilterList";
import CardBox from "./../../../../../components/CardBox";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { MenuItem, InputLabel, FormControl } from "@material-ui/core";
import IntlMessages from "util/IntlMessages";
import InputSearchButton from "../CommonComponents/SearchButton";
import InputResetButton from "../CommonComponents/ResetButton";
import InputSelect from "../CommonComponents/Select";

const baseURL = `${process.env.REACT_APP_BASE_URL}`;

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

let EnhancedTableToolbar = ({
  handleInputChange,
  isAdvancedSearchValidationText,
  handleApplyClick,
  searchValidation,
  onAdvancedSearchClickClean,
  handleResetClick,
  error,
}) => {
  const classes = useStyles();
  const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);

  const [state, setState] = useState({
    name: "",
    code: "",
    description: "",
    actionType: "",
    createdBy: "",
    archiveIn: "",
    createdDate: "",
    modifiedBy: "",
    modifiedDate: "",
    isUserOverrideAllowed: "",
    prefernces: "",
  });

  const onAdvancedSearchClick = (e) => {
    onAdvancedSearchClickClean();
    setIsAdvancedSearch(!isAdvancedSearch);
  };

  return (
    <>
      <Toolbar className="table-header">
        <div className="spacer" />
        <div className="actions">
          <Tooltip title={<IntlMessages id="EnhancedTableHead.Tooltip.List" />}>
            <IconButton
              onClick={(event) => onAdvancedSearchClick(event)}
              aria-label="Filter list"
            >
              <FilterListIcon />
            </IconButton>
          </Tooltip>
          {/* )} */}
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
                  id="outlined-basic"
                  label={
                    <IntlMessages id="notificationdetails.master.advancedsearch.Name" />
                  }
                  variant="outlined"
                  onChange={(event) => handleInputChange(event)}
                  value={searchValidation.name}
                  error={error.name}
                  helperText={error.name}
                  name="name"
                  fullWidth
                />
              </div>
              <div className="col-lg-3 col-sm-6 col-12">
                <TextField
                  id="outlined-basic"
                  label={
                    <IntlMessages id="notificationdetails.master.advancedsearch.Code" />
                  }
                  variant="outlined"
                  onChange={(event) => handleInputChange(event)}
                  value={searchValidation.code}
                  name="code"
                  error={error.code}
                  helperText={error.code}
                  fullWidth
                />
              </div>
              <div className="col-lg-3 col-sm-6 col-12">
                <FormControl variant="outlined" className="w-100 mb-2">
                  <InputLabel id="isEditable">
                    Is UserOverride Allowed
                  </InputLabel>
                  <InputSelect
                    labelId="isUserOverrideAllowed"
                    id="isUserOverrideAllowed"
                    onChange={handleInputChange}
                    label={
                      <IntlMessages id="notificationdetails.master.advancedsearch.IsUserOverrideAllowed" />
                    }
                    name="isUserOverrideAllowed"
                    value={searchValidation.isUserOverrideAllowed}
                    onChange={(e) => handleInputChange(e)}
                  >
                    <MenuItem value="">
                      <em>Select</em>
                    </MenuItem>
                    <MenuItem value={1}>Yes</MenuItem>
                    <MenuItem value={0}>No</MenuItem>
                  </InputSelect>
                </FormControl>
              </div>
              <div className="col-lg-3"></div>
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
            </form>
          </CardBox>
        </div>
      ) : null}
    </>
  );
};

export default EnhancedTableToolbar;
