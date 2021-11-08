/* eslint-disable react/prop-types */
import React, { useState, useRef } from "react";
import "./root.component.css";
import { TextField, Button } from "@material-ui/core";
import IntlMessages from "util/IntlMessages";
/* import Alert from "@material-ui/lab/Alert"; */
//import DetailsIcon from '@material-ui/icons/Details';
import PropTypes from "prop-types";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CardBox from "./../../../../../components/CardBox";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import InputAddButton from "../CommonComponents/AddButton";
import InputSubmitButton from "../CommonComponents/SubmitButton";
import InputCancelButton from "../CommonComponents/CancelButton";
import InputSearchButton from "../CommonComponents/SearchButton";
import InputResetButton from "../CommonComponents/ResetButton";
import InputField from "../CommonComponents/TextField";




let EnhancedTableToolbar = (props) => {
  const {
    numSelected,
    sortBy,
    name,
    sortType,
    isActiveSearch,
    categoryReset,
    productTypeReset,
    handleApplyClick,
    callResetData,
    callLocalBaseURL,
    isAdvancedSearchValidationText,
    categoryData,
    productTypeData,
    onAddButtonClick,
    onAdvancedSearchClickClean,
    handleAdvancedSearchOnChange,
    handleAutoCompleteInputReset,
    advancedSearchValidationErrors,
    nameReset,
  } = props;
  const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);

  const onAdvancedSearchClick = () => {
    onAdvancedSearchClickClean();
    setIsAdvancedSearch(!isAdvancedSearch);
  };


  const subCategoryID_AutoComplete_Ref = useRef();

  const productTypeID_AutoComplete_Ref = useRef();

  const [, setState] = useState({
    categoryId: "",
    subCategoryId: "",
    productTypeId: "",
    name: "",
    fieldName: "",
    values: [],
    event: "",
    description: "",
    actionType: "",
    referenceID: "",
    archiveIn: "",
    purgeIn: "",
    createdBy: "",
    isComparisonEnabled: "",
    createdDate: "",
    modifiedName: "",
    modifiedDate: "",
    order: "asc",
    orderBy: "name",
    selected: [],
    page: 1,
    sortBy,
    sortType,
    rowsPerPage: 10,
    data: [],
    data1: [],
    categoryOptions: [],
    menudata: [],
    catData: [],
    allData: [],
    addFormDialogOpen: false,
    isNoTableDataAlertVisible: true,
    selectedEditId: "",
    isSortAsc: true,
    isSuccessAlert: false,
    successMsg: "",
    isErrorAlert: false,
    errorMsg: "",
    isSearchActive: isActiveSearch,
  });

  const handleResetClick = (e) => {
    e.preventDefault();
    callResetData();
    nameReset();
    categoryReset();
    productTypeReset();
    callLocalBaseURL();
    setState((prevState) => ({
      ...prevState,
      advancedSearchValidationErrors: {},
      isAdvancedSearchValidationText: false,
    }));
  };

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
        <div>
          <InputAddButton
            className={classes_AddButton.button}
            onClick={(e) => onAddButtonClick(e)}
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

      {isAdvancedSearch ? (
        <div className="row">
          <CardBox styleName="col-12" heading={<IntlMessages id="ipp.common.advancedsearch.title"/>}>
            <form className="row" autoComplete="off">
              <div className="col-lg-3 col-sm-6 col-12 mb-3">
                <InputField
                  id="name"
                  label={ <IntlMessages id="product.master.advancedsearch.Name"/>}
                  onChange={(event) => handleAdvancedSearchOnChange(event)}
                  value={name}
                  error={advancedSearchValidationErrors.name}
                  helperText={advancedSearchValidationErrors.name}
                  name="name"
                  fullWidth
                />
              </div>
              <div className="col-lg-3 col-sm-6 col-12 mb-3">
                <Autocomplete
                  id="SubCategoryType"
                  name="SubCategoryType"
                  key={handleAutoCompleteInputReset}
                  ref={subCategoryID_AutoComplete_Ref}
                  autoHighlight
                  options={categoryData}
                  getOptionLabel={(option) => option.name}
                  onChange={(event, value) =>
                    handleAdvancedSearchOnChange(
                      event,
                      value,
                      subCategoryID_AutoComplete_Ref
                    )
                  }
                  renderInput={(params) => (
                    (
                      <TextField
                        {...params}
                        label={ <IntlMessages id="product.master.advancedsearch.SubCategory"/>}
                        variant="outlined"
                        error={advancedSearchValidationErrors.SubCategoryType}
                        helperText={
                          advancedSearchValidationErrors.SubCategoryType
                        }
                      />
                    )
                  )}
                  fullWidth
                />
              </div>
              <div className="col-lg-3 col-sm-6 col-12 mb-3">
                <Autocomplete
                  id="ProductType"
                  name="ProductType"
                  key={handleAutoCompleteInputReset}
                  ref={productTypeID_AutoComplete_Ref}
                  autoHighlight
                  options={productTypeData}
                  getOptionLabel={(option) => option.name}
                  onChange={(event, value) =>
                    handleAdvancedSearchOnChange(
                      event,
                      value,
                      productTypeID_AutoComplete_Ref
                    )
                  }
                  renderInput={(params) => (
                    (
                      <TextField
                        {...params}
                        label={ <IntlMessages id="product.master.advancedsearch.ProductType"/>}
                        variant="outlined"
                        error={advancedSearchValidationErrors.ProductType}
                        helperText={advancedSearchValidationErrors.ProductType}
                      />
                    )
                  )}
                  fullWidth
                />
              </div>
              <div className="col-lg-3">
              </div>
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

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  setAdvancedSearchData: PropTypes.func.isRequired,
  setResetData: PropTypes.func.isRequired,
};

export default EnhancedTableToolbar;
