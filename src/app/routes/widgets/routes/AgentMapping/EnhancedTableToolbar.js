import React, { useState } from "react";
import PropTypes from "prop-types";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import "./master.css";
import IntlMessages from "util/IntlMessages";
import {
  makeStyles,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@material-ui/core";
import CardBox from "./../../../../../components/CardBox/index";
import InputAddButton from "../CommonComponents/AddButton";
import InputSearchButton from "../CommonComponents/SearchButton";
import InputResetButton from "../CommonComponents/ResetButton";
import InputField from "../CommonComponents/TextField";

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
}) => {
  const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);

  const onAdvancedSearchClick = (e) => {
    onAdvancedSearchClickClean();
    setIsAdvancedSearch(!isAdvancedSearch);
  };

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
    searchValidation: {
      name: "",
    },
    errors: {},
    isAddFormSubmitDisabled: false,
    areAllAddFormFieldsPopulated: false,
    addFormDialogOpen: false,
  });


  const useStyles2 = makeStyles((theme) => ({
    button: {
      margin: theme.spacing(1),
    },
  }));

  const classes_AddButton = useStyles2();

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
        <div className="spacer" />
        <div>
          <InputAddButton
            className={classes_AddButton.button}
            onClick={() => onAddButtonClick()}
          />
            
        </div>
        <div className="actions mr-3">
          {numSelected > 0 ? (
            <Tooltip title="Delete">
              <IconButton aria-label="Delete">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title={<IntlMessages id="EnhancedTableHead.Tooltip.List" />}>
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
      {/* <Dialog
        maxWidth="sm"
        open={state.addFormDialogOpen}
        onClose={handleAddDataRequestClose}
      >
        <DialogTitle><IntlMessages id="producttype.master.modal.add.tilte"/></DialogTitle>
        <DialogContent>
          <InputField
            required
            className="mb-2"
            autoFocus
            id="name"
            error={state.errors.name}
            label={ <IntlMessages id="producttype.master.modal.add.felid.Name"/>}
            name="name"
            onChange={handleAddFormChange}
            value={state.validation.name}
            fullWidth
            helperText={state.errors.name}
          />

          <InputField
            required
            id="description"
            error={state.errors.description}
            label={ <IntlMessages id="producttype.master.modal.add.felid.Description"/>}
            name="description"
            onChange={handleAddFormChange}
            value={state.validation.description}
            fullWidth
            helperText={state.errors.description}
          />
        </DialogContent>
        <DialogActions>
          <InputCancelButton
            onClick={(e) => handleAddDataRequestClose(e)}
          />
          <InputSubmitButton
            onClick={(e) => handleAddFormDataSubmit(e)}
            disabled={!state.isAddFormSubmitDisabled}
          />
        </DialogActions>
      </Dialog> */}
      {isAdvancedSearch ? (
        <div className="row mx-1">
          <CardBox styleName="col-12" heading={<IntlMessages id="ipp.common.advancedsearch.title"/>}>
            <form className="row" autoComplete="off">
            
<div className="col-lg-3 col-sm-6 col-12 mb-3">
  <InputField
    id="outlined-basic"
    onChange={(event) => handleInputChange(event)}
    value={searchValidation.username}
    error={errors.name}
    helperText={errors.name}
    name="username"
    label={<IntlMessages id="UserManagement.master.advancedsearch.username"/>}
    fullWidth

  />

</div>
<div className="col-lg-3 col-sm-6 col-12 mb-3">
  <InputField
    id="outlined-basic"
    onChange={(event) => handleInputChange(event)}
    value={searchValidation.firstName}
    error={errors.name}
    helperText={errors.name}
    name="firstName"
    fullWidth
    label={<IntlMessages id="UserManagement.master.advancedsearch.firstname"/>}

  />

</div>

<div className="col-lg-3 col-sm-6 col-12 mb-3">
  <InputField
    id="outlined-basic"
    onChange={(event) => handleInputChange(event)}
    value={searchValidation.lastName}
    error={errors.name}
    helperText={errors.name}
    name="lastName"
    fullWidth
    label={<IntlMessages id="UserManagement.master.advancedsearch.lastname"/>}

  />

</div>

<div className="col-lg-3 col-sm-6 col-12 mb-3" >
  <InputField
    id="outlined-basic"
    onChange={(event) => handleInputChange(event)}
    value={searchValidation.email}
    error={errors.name}
    helperText={errors.name}
    name="email"
    fullWidth
    label={<IntlMessages id="UserManagement.master.advancedsearch.emailid"/>}

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
  // pageNumber: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortType: PropTypes.string.isRequired,
};

export default EnhancedTableToolbar;
