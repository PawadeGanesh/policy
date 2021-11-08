import React, { useState } from "react";
import "./master.css";
import axios from "axios";
import { TextField, Button } from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import Typography from "@material-ui/core/Typography";
import IntlMessages from "util/IntlMessages";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CardBox from "../../../../../components/CardBox";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import Joi from "joi-browser";
import { apipostUrl } from "../../../../../setup/middleware";
import InputField from "../CommonComponents/TextField";
import InputSearchButton from "../CommonComponents/SearchButton";
import InputResetButton from "../CommonComponents/ResetButton";

const schema = {
  name: Joi.string()
    .required()
    .label("Name"),
};

let EnhancedTableToolbar = ({
  coreValue,
  getCoreDataTypes,
  typeId,
  numSelected,
  pageCount,
  getSuccessPost,
  getErrorPost,
  name,
  description,
  handleApplyClick,
  handleResetClick,
  handleAdvancedSearchOnChange,
  advancedSearchValidationErrors,
  isAdvancedSearchValidationText,
}) => {
  const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);

  const onAdvancedSearchClick = (e) => {
    setIsAdvancedSearch(!isAdvancedSearch);
  };

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
    addFormDialogOpen: false,
    selectedEditId: "",
    isSortAsc: true,
    description: "",
    additionalData: "",
    validation: {
      name: "",
    },
    errors: {},
    isAddFormSubmitDisabled: false,
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

  const onAddButtonClick = () => {
    setState((prevState) => ({
      ...prevState,
      validation: {
        name: "",
      },
      description: "",
      additionalData: "",
      addFormDialogOpen: true,
    }));
  };

  const handleAddDataRequestClose = () => {
    setState((prevState) => ({ ...prevState, addFormDialogOpen: false }));
  };

  const AddNewDataInBackend = async () => {
    let postObj = {
      name: state.validation.name,
      description: state.description,
      additionalData:
        state.additionalData === "" ? {} : JSON.parse(state.additionalData),
      typeId: typeId,
    };

    const result = await apipostUrl(`/${coreValue}/core-data`, postObj);
    if (result.data.responseCode === "200") {
      setState((prevState) => ({
        ...prevState,
        data: state.data,
        addFormDialogOpen: false,
      }));
      getSuccessPost();
      getCoreDataTypes(typeId);
    } else {
      setState((prevState) => ({
        ...prevState,
        data: state.data,
        addFormDialogOpen: true,
      }));
      getErrorPost(result);
      getCoreDataTypes(typeId);
    }
  };

  const handleAddFormSubmit = (e) => {
    AddNewDataInBackend();
  };

  const validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const propertySchema = { [name]: schema[name] };
    const { error } = Joi.validate(obj, propertySchema);
    return error ? error.details[0].message : null;
  };

  function isObjEmpty(obj) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }

    return JSON.stringify(obj) === JSON.stringify({});
  }

  const checkAreAllAddFormFieldsPopulated = (obj) => {
    return !Object.values(obj).some((x) => x === "");
  };

  const handleAddChange = (e) => {
    e.persist();
    setState((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddFormChange = ({ target: input }) => {
    const errors = { ...state.errors };

    const errorMessage = validateProperty(input);

    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const validation = { ...state.validation };

    validation[input.name] = input.value;

    const allFormFieldsPopulated = checkAreAllAddFormFieldsPopulated(
      validation
    );

    setState((prevState) => ({
      ...prevState,
      validation,
      errors,
      isAddFormSubmitDisabled: allFormFieldsPopulated && isObjEmpty(errors),
    }));
  };

  return (
    <>
      <Toolbar className="table-header">
        <div className="spacer" />
        <div>
          <Button
            variant="contained"
            color="primary"
            className={classes_AddButton.button}
            startIcon={<AddIcon />}
            onClick={(e) => onAddButtonClick(e)}
          >
            <IntlMessages id="ipp.common.ADD.button" />
          </Button>
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
        maxWidth="xs"
        open={state.addFormDialogOpen}
        onClose={handleAddDataRequestClose}
      >
        <DialogTitle>
          <IntlMessages id="coredata.master.modal.add.tilte" />
        </DialogTitle>
        <DialogContent>
          <InputField
            required
            className="mb-3"
            autoFocus
            id="name"
            error={state.errors.name}
            label={<IntlMessages id="coredata.master.modal.add.felid.Name" />}
            name="name"
            onChange={(e) => handleAddFormChange(e)}
            value={state.validation.name}
            fullWidth
            helperText={state.errors.name}
          />
          <InputField
            className="mb-3"
            id="description"
            label={
              <IntlMessages id="coredata.master.modal.add.felid.Description" />
            }
            name="description"
            value={state.description}
            onChange={(e) => handleAddChange(e)}
            fullWidth
          />
          <InputField
            autoFocus
            id="outlined-multiline-static"
            placeholder="Only JSON data is allowed"
            label={
              <IntlMessages id="coredata.master.modal.add.felid.AdditionalData" />
            }
            name="additionalData"
            multiline
            rows={2}
            fullWidth
            value={state.additionalData}
            onChange={(e) => handleAddChange(e)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={(e) => handleAddDataRequestClose(e)}
            variant="contained"
            color="secondary"
          >
            <IntlMessages id="ipp.common.Cancel.button" />
          </Button>
          <Button
            onClick={(e) => handleAddFormSubmit(e)}
            color="primary"
            variant="contained"
            disabled={!state.isAddFormSubmitDisabled}
          >
            <IntlMessages id="ipp.common.submit.button" />
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
                <TextField
                  id="outlined-basic"
                  label={
                    <IntlMessages id="coredata.master.advancedsearch.Name" />
                  }
                  variant="outlined"
                  onChange={handleAdvancedSearchOnChange}
                  value={name}
                  error={advancedSearchValidationErrors.name}
                  helperText={advancedSearchValidationErrors.name}
                  name="name"
                  fullWidth
                />
              </div>
              <div className="col-lg-3 col-sm-6 col-12 mb-3">
                <TextField
                  id="outlined-basic"
                  label={
                    <IntlMessages id="coredata.master.advancedsearch.Description" />
                  }
                  variant="outlined"
                  onChange={handleAdvancedSearchOnChange}
                  value={description}
                  error={advancedSearchValidationErrors.description}
                  helperText={advancedSearchValidationErrors.description}
                  name="description"
                  fullWidth
                />
              </div>
              <div className="col-lg-6"></div>
              <div className="pt-2 ml-2">
                <InputSearchButton onClick={handleApplyClick} />
              </div>
              <div className="pt-2">
                <InputResetButton onClick={handleResetClick} />
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
