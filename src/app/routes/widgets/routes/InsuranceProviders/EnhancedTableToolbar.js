import React, { useState } from "react";
import "./root.component.css";
import axios from "axios";
import { TextField, Button } from "@material-ui/core";
import PropTypes from "prop-types";
import Toolbar from "@material-ui/core/Toolbar";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CardBox from "../../../../../components/CardBox";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import { useHistory } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import IntlMessages from "util/IntlMessages";
import InputAddButton from "../CommonComponents/AddButton";
import InputSearchButton from "../CommonComponents/SearchButton";
import InputResetButton from "../CommonComponents/ResetButton";
import InputField from "../CommonComponents/TextField";

let EnhancedTableToolbar = ({
  numSelected,
  completeState,
  onAddButtonClick,
  handleAdvanceSearchChange,
  handleApplyClick,
  error,
  searchValidation,
  isAdvancedSearchValidationText,
  onAdvancedSearchClickClean,
  callResetData,
  callLocalBaseURL,
}) => {
  const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);

  const [state, setState] = useState({
    addFormDialogOpen: false,
    productName: [],
  });

  console.log("ProductName", state.productName);

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

  const handleAddDataRequestClose = () => {
    setState((prevState) => ({ ...prevState, addFormDialogOpen: false }));
  };

  const handleAddFormDataSubmit = (e) => {};

  let history = useHistory();

  const handleResetClick = (e) => {
    e.preventDefault();
    callResetData();
    callLocalBaseURL();
  };

  const handleAddFormChange = () => {};

  return (
    <>
      <Toolbar className="table-header">
        <div className="spacer" />
        <div>
          <InputAddButton
            className={classes_AddButton.button}
            onClick={onAddButtonClick}
          />
        </div>
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
      <Dialog
        maxWidth={"xs"}
        fullWidth={true}
        open={state.addFormDialogOpen}
        onClose={handleAddDataRequestClose}
      >
        <DialogTitle>Add Insurance Provider</DialogTitle>
        <DialogContent>
          <TextField
            className="mb-3"
            id="name"
            // error={state.errors.name}
            label="Name"
            name="name"
            onChange={(e) => handleAddFormChange(e)}
            // value={state.validation.name}
            // helperText={state.errors.name}
            fullWidth
          />
          <TextField
            className="mb-3"
            id="kafka_topic"
            label="Kafka Topic"
            name="kafka_topic"
            onChange={(e) => handleAddFormChange(e)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={(e) => handleAddDataRequestClose(e)}
            color="secondary"
            variant="contained"
            className="mr-1 mb-2"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={(e) => handleAddFormDataSubmit(e)}
            color="primary"
            className="mr-3 mb-2"
            disabled={!state.isAddFormSubmitDisabled}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      {isAdvancedSearch ? (
        <div className="row">
          <CardBox
            styleName="col-12"
            heading={<IntlMessages id="ipp.common.advancedsearch.title" />}
          >
            <form className="row" autoComplete="off">
              <div className="col-lg-3 col-sm-6 col-12 mb-3">
                <InputField
                  id="name"
                  label={
                    <IntlMessages id="InsuranceProviders.master.advancedsearch.Name" />
                  }
                  onChange={handleAdvanceSearchChange}
                  value={searchValidation.name}
                  error={error.name}
                  helperText={error.name}
                  name="name"
                  fullWidth
                />
              </div>
              <div className="col-lg-3 col-sm-6 col-12 mb-3">
                <InputField
                  id="kafkaTopic"
                  label={
                    <IntlMessages id="InsuranceProviders.master.advancedsearch.KafkaTopic" />
                  }
                  onChange={handleAdvanceSearchChange}
                  value={searchValidation.kafkaTopic}
                  error={error.kafkaTopic}
                  helperText={error.kafkaTopic}
                  name="kafkaTopic"
                  fullWidth
                />
              </div>
              <div className="col-lg-6"></div>
              <div className="pt-2 ml-2">
                <InputSearchButton onClick={handleApplyClick} />
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
};

export default EnhancedTableToolbar;
