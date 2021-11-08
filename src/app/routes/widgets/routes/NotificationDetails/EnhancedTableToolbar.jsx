import React, { useState, useEffect } from "react";
import Toolbar from "@material-ui/core/Toolbar";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import FilterListIcon from "@material-ui/icons/FilterList";
import CardBox from "../../../../../components/CardBox";
import TextField from "@material-ui/core/TextField";
import InputSearchButton from "../CommonComponents/SearchButton";
import InputResetButton from "../CommonComponents/ResetButton";
import IntlMessages from "util/IntlMessages";

let EnhancedTableToolbar = (props) => {
  const {
    isEnabled,
    onhandleIsEnabledChange,
    onhandleApplyClick,
    onhandleResetClick,
    tableChange,
  } = props;
  const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);

  const onAdvancedSearchClick = (e) => {
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
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
  }));

  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const loading = open && options.length === 0;

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  const [selectedDate, setSelectedDate] = React.useState();

  useEffect(() => {
    let tempDate = new Date();
    let date =
      tempDate.getDate() +
      "-" +
      tempDate.getMonth() +
      "-" +
      tempDate.getFullYear() +
      "T" +
      tempDate.getHours() +
      ":" +
      tempDate.getMinutes();
  });

  const handleDateChange = (date) => {
    console.log("Date", date);
  };

  const classes = useStyles();
  return (
    <>
      <Toolbar className="table-header">
        <div className="spacer" />
        {/* <div className='row col-12'> */}
        <div className="col-lg-3 col-sm-6 col-12">
          <FormControl variant="outlined" className="w-100 mb-2">
            <InputLabel id="isEnabled">Select</InputLabel>
            <Select
              labelId="isEnabled"
              id="isEnabled"
              value={isEnabled}
              onChange={onhandleIsEnabledChange}
              label="Is Enabled"
              name="isEnabled"
            >
              <MenuItem value="">
                <em>Select</em>
              </MenuItem>
              <MenuItem value={0}>SMS</MenuItem>
              <MenuItem value={1}>E-Mail</MenuItem>
              <MenuItem value={2}>InApp</MenuItem>
              <MenuItem value={3}>Push</MenuItem>
            </Select>
          </FormControl>
        </div>

        <Tooltip title={<IntlMessages id="EnhancedTableHead.Tooltip.List" />}>
          <IconButton
            onClick={(event) => onAdvancedSearchClick(event)}
            aria-label="Filter list"
          >
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>

      {isAdvancedSearch ? (
        <div className="row">
          <CardBox styleName="col-12" heading="Advanced Search">
            <form className="row" autoComplete="off">
              <div className="col-lg-3 col-sm-6 col-12 ml-n1">
                <FormControl variant="outlined" className="w-100 mb-2">
                  <InputLabel id="isEnabled">Select</InputLabel>
                  <Select
                    labelId="isEnabled"
                    id="isEnabled"
                    value={isEnabled}
                    onChange={tableChange}
                    label="Is Enabled"
                    name="isEnabled"
                  >
                    <MenuItem value="sms">SMS</MenuItem>
                    <MenuItem value="email">E-Mail</MenuItem>
                    <MenuItem value="inapp">InApp</MenuItem>
                    <MenuItem value="push">Push</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="col-lg-3 col-sm-6 col-12 ml-n1">
                <TextField
                  id="datetime-local"
                  label="Start Date"
                  type="datetime-local"
                  defaultValue={selectedDate}
                  onChange={handleDateChange}
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </div>
              <div className="col-lg-3 col-sm-6 col-12 ml-n1">
                <TextField
                  id="datetime-local"
                  label="End Date"
                  type="datetime-local"
                  defaultValue={selectedDate}
                  onChange={handleDateChange}
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </div>

              <div className="pt-2 ml-2">
                <InputSearchButton onClick={onhandleApplyClick} />
              </div>
              <div className="pt-2">
                <InputResetButton onClick={onhandleResetClick} />
              </div>
            </form>
          </CardBox>
        </div>
      ) : null}
    </>
  );
};

export default EnhancedTableToolbar;
