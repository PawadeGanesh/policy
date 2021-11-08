/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import InfoModal from "../Modal/Info";
import SuccessModal from "../Modal/Success";
import ErrorModal from "../Modal/Error";
import TablePaginationComponent from "../CommonComponents/TablePaginationComponent";
import VisibilityIcon from "@material-ui/icons/Visibility";
import "./master.css";
import {
  TableFooter,
  TableCell,
  TableBody,
  IconButton,
  TableRow,
  Button,
  Grid,
  Table,
  InputLabel,
  Tooltip,
} from "@material-ui/core";
import IntlMessages from "util/IntlMessages";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import EnhancedTableHead from "../CommonComponents/TableHeadComponent";
import EnhancedTableToolbar from "./EnhancedTableToolbar";
import Joi from "joi-browser";
import moment from "moment";
import "./master.css";
import { useSelector } from "react-redux";
import { apigetUrl, apiputUrl } from "../../../../../setup/middleware";
import {
  IPPNotification,
  ippNotify,
} from "../CommonComponents/IPPNotification";
import { getRecordsPerPage } from "../../../../../setup/ApplicatoinConfigurations.js";
import "../CommonComponents/tableStyle.css";
import AuditTimeline from "../CommonComponents/AuditTimeline/AuditTimeline";
import { Visibility } from "@material-ui/icons";

const baseURL = `${process.env.REACT_APP_BASE_URL}`;
const perPageURL = "/notify/notifications/user";
const pageURL = new URL(baseURL + perPageURL);
let apiCallParams = new URLSearchParams(pageURL.search);

let pageNumber = 1;

const schema = {
  policyNum: Joi.string()
    .required()
    .label("policyNum"),
  description: Joi.string()
    .required()
    .label("Description"),
};

function App() {
  const { authUser } = useSelector(({ auth }) => auth);

  let data = authUser.userDetails;
  let user = data;

  //set advance Search Data
  const setAdvancedSearchData = (data) => {
    setState((prevState) => ({
      ...prevState,
      data: data,
      page: 1,
      from: 1,
      to: state.limit,
    }));
  };

  //Set Reset Data
  const setResetData = (data) => {
    setState((prevState) => ({
      ...prevState,
      data: data,
      page: 1,
      from: 1,
      to: state.limit,
    }));
  };

  //Set Advanced Search Data
  const setAdvancedSearchError = (isErrorTrue) => {
    if (isErrorTrue) {
      setState((prevState) => ({
        ...prevState,
        data: [],
        isInfoAlert: true,
        inTableErrorMessageContent: "Your query did not match any results",
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        isInfoAlert: false,
        errorMsg: "",
      }));
    }
  };

  //Set Current Url
  const setCurrentUrl = (currentUrl) => {
    setState((prevState) => ({ ...prevState, currentUrl }));
  };

  //states
  const [state, setState] = useState({
    id: "",
    name: "",
    key: "",
    fieldType: "",
    isVisible: "",
    isEditable: "",
    selected: [],
    page: 1,
    limit: getRecordsPerPage(),
    mode: "det",
    rowsPerPage: 5,
    data: [],
    filterdata: [],
    sortType: "asc",
    sortBy: "created",
    editForm_DialogOpen: false,
    viewForm_DialogOpen: false,
    selectedEditId: "",
    selectedDeleteId: "",
    isSortAsc: true,
    from: 1,
    to: 0,
    pageCount: 0,
    deleteItem_DialogOpen: false,
    isEditForm_DataListId_Available: false,
    validation: {
      title: "",
      content: "",
      date: null,
    },
    menuItem: [],
    itemName: "",
    menuItemId: "",
    searchValidation: {
      policyNum: "",
    },

    startDate: null,
    endDate: null,
    status: "",
    PolicyExpiryDatestartDate: null,
    isPolicyExpiryDateStartDateActive: false,
    isPolicyExpiryDateEndDateDisabled: true,
    isendDateDisabled: true,
    isAdvancedSearchValidationText: false,

    errors: {},
    isEditFormSubmitDisabled: false,
    areAllEditFormFieldsPopulated: false,
    isNoTableDataAlertVisible: true,
    isSuccessAlert: false,
    isErrorAlert: false,
    errorMsg: "",
    successMsg: "",
    isInfoAlert: false,
    infoMsg: "",
    error: "",
    isLoading: false,
    inTableErrorMessageContent: "Unable to fetch data!",
    searchedProperty: "",
    selected_EditForm_RowVersion_Value: 1,
    searchActive: false,
    startdate: "",
    // endDate: "",
    isAuditTimelineActive: false,
    eventId: "",
    referenceId: "",
    auditEventId: "",
    headCells: [
      {
        id: "title",
        isActive: true,
        label: "AllNotificationForUser.master.tableheader.title.label",
      },
      {
        id: "content",
        isActive: false,
        label: "AllNotificationForUser.master.tableheader.content.label",
      },
      {
        id: "createdDate",
        isActive: true,
        label: "AllNotificationForUser.master.tableheader.createdDate.label",
      },
      {
        id: "status",
        isActive: true,
        label: "AllNotificationForUser.master.tableheader.status.label",
      },
      {
        id: "actions",
        isActive: false,
        label: "AllNotificationForUser.master.tableheader.action.label",
      },
    ],
  });

  let tempArr = [];

  
  //on page load 
  useEffect(() => {
    apiCallParams.set("page", state.page);
    apiCallParams.set("limit", state.limit);
    apiCallParams.set("sortBy", state.sortBy);
    apiCallParams.set("sortType", state.sortType);
    pageURL.search = apiCallParams.toString();
    setCurrentUrl(pageURL);
    callLocalBaseURL();
  }, []);

  
//Status Type
const statusString = (status) => {
  switch (status) {
    case 0:
      return <IntlMessages id="AllNotificationForUser.master.status.type0" />;
    case 1:
      return <IntlMessages id="AllNotificationForUser.master.status.type1" />;
    case 2:
      return <IntlMessages id="AllNotificationForUser.master.status.type2" />;

  }
};


//content Lenght
const contentLenght = (cont)=>{
if(cont.length >= 30){
  let contentslicedstring = cont.slice(0, 30);
  let resultaincontent = contentslicedstring + "...";
  return resultaincontent
}
else {
  return cont
}

}


  //page load function
  const callLocalBaseURL = async () => {
    const result = await apigetUrl(
      `/notify/notifications/user/${user && user.username}?page=${
        state.page
      }&limit=${state.limit}&mode=${state.mode}`
    );
    if (result.data.responseCode === "200") {
      const resultain = result.data.dataList;

      setState((prevState) => ({
        ...prevState,
        data: resultain,
        filterdata: result.data.dataList,
        page: result.data.pagination.page,
        pageCount: result.data.pagination.count,
        to: result.data.pagination.limit,
        limit: result.data.pagination.limit,
        auditEventId: result.data.auditEventId,
      }));
    } else {
      ippNotify.error(result.data.responseMessage);
    }
  };

  //Request Sort Function
  const requestSortData = async (sortBy, sortType) => {
    const result = await apigetUrl(
      `/notify/notifications/user/${user && user.username}?page=${
        state.page
      }&limit=${state.limit}&sortBy=${sortBy}&sortType=${sortType}&mode=${
        state.mode
      }`
    );
    if (result.data.responseCode === "200") {
      const resultain = result.data.dataList;
      setState((prevState) => ({
        ...prevState,
        data: resultain,
      }));
    } else {
      ippNotify.error(result.data.responseMessage);
    }
  };

  //Handle Request Sort
  const handleRequestSort = (event, property) => {
    const isAsc = state.sortBy === property && state.sortType === "desc";
    let currentSortOrder = isAsc ? "asc" : "desc";
    setState((prevState) => ({
      ...prevState,
      sortType: isAsc ? "asc" : "desc",
      sortBy: property,
    }));
    requestSortData(property, currentSortOrder);
  };

  //Handle Select All Click
  const handleSelectAllClick = (event, checked) => {
    if (checked) {
      setState({ selected: state.data.map((n) => n.id) });
      return;
    }
    setState({ selected: [] });
  };

  //Page Limit Function
  const requestPageLimitCountChange = async (count) => {
    update_to(count);
    update_from(1);

    const pageURL = new URL(baseURL + perPageURL + "/" + user.username);
    apiCallParams.set("page", 1);
    apiCallParams.set("limit", count);
    apiCallParams.set("sortBy", state.sortBy);
    apiCallParams.set("sortType", state.sortType);

    pageURL.search = apiCallParams.toString();
    setCurrentUrl(pageURL);

    const result = await apigetUrl(
      `/notify/notifications/user/${user &&
        user.username}?page=${1}&limit=${count}&sortBy=${
        state.sortBy
      }&sortType=${state.sortType}&mode=${state.mode}`
    );
    if (result.data.responseCode === "200") {
      const resultain = result.data.dataList;
      setState((prevState) => ({
        ...prevState,
        data: resultain,
        page: 1,
        pageCount: result.data.pagination.count,
        limit: result.data.pagination.limit,
      }));
      pageNumber = 1;
    } else {
      ippNotify.error(result.data.responseMessage);
    }
  };

  //handle Change RowsPerPage
  const handleChangeRowsPerPage = (event) => {
    let target = event.target;
    setState((prevState) => ({
      ...prevState,
      limit: target.value,
      page: 1,
    }));
    requestPageLimitCountChange(target.value);
  };

  //handle Edit Modal Request Close
  const handle_Edit_Form_RequestClose = () => {
    setState((prevState) => ({
      ...prevState,
      viewForm_DialogOpen: false,
    }));
  };

  //Validation 
  const validateProperty = ({ name, value }) => {
    //
    const obj = { [name]: value };
    const propertySchema = { [name]: schema[name] };
    const { error } = Joi.validate(obj, propertySchema);
    return error ? error.details[0].message : null;
  };


  function isObjEmpty(obj) {
    for (var prop in obj) {
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }

    return JSON.stringify(obj) === JSON.stringify({});
  }

  //set Page Data 
  const setPageData = (data) => {
    setState((prevState) => ({
      ...prevState,
      data: data,
    }));
  };

  //set Page Number
  const setPageNumber = (pageNumber) => {
    setState((prevState) => ({
      ...prevState,
      page: pageNumber,
    }));
  };

  //set Page Count
  const setPageCount = (pageCount) => {
    setState((prevState) => ({
      ...prevState,
      pageCount: pageCount,
    }));
  };

  //update to
  const update_to = (to) => {
    setState((prevState) => ({
      ...prevState,
      to: to,
    }));
  };

  //update from
  const update_from = (from) => {
    setState((prevState) => ({
      ...prevState,
      from: from,
    }));
  };

  //set Searched Property
  const setSearchedProperty = (searchProperty) => {
    setState((prevState) => ({
      ...prevState,
      searchedProperty: searchProperty,
    }));
  };

  //handle Input Change
  const handleInputChange = (event) => {
    const { target: input } = event;
    const errors = { ...state.errors };
    const errorMessage = validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const searchValidation = { ...state.searchValidation };
    searchValidation[input.name] = input.value;

    let isAnyFormFieldsPopulated = false;
    isAnyFormFieldsPopulated =
      searchValidation.policyNum !== "" || searchValidation.description !== "";
    console.log("allFormFieldsPopulated = ", isAnyFormFieldsPopulated);

    setState((prevState) => ({
      ...prevState,
      errors,
      searchValidation,
      isAdvancedSearchValidationText:
        isAnyFormFieldsPopulated && isObjEmpty(errors),
    }));
  };

  //Handle Search Click
  const handleSearchClick = (e) => {
    setState((prevState) => ({
      ...prevState,
      isAdvancedSearchValidationText: true,
      errors: {},
    }));

    e.preventDefault();

    const { key, fieldType, isEditable } = state.searchValidation;

    const PolicyIssueDateformatStartDate = moment(state.startDate).format(
      "DD-MM-yyyy HH:mm:ss"
    );
    const PolicyIssueDateformatEndDate = moment(state.endDate).format(
      "DD-MM-yyyy HH:mm:ss"
    );

    tempArr.length = 0;

    console.log(apiCallParams.toString());
    if (!isEmpty(key)) tempArr.push({ key });
    if (!isEmpty(fieldType)) tempArr.push({ fieldType });
    if (!isEmpty(isEditable)) tempArr.push({ isEditable });
    if (!isEmpty(state.startDate))
      tempArr.push({
        startDate: PolicyIssueDateformatStartDate,
      });
    if (!isEmpty(state.endDate))
      tempArr.push({ endDate: PolicyIssueDateformatEndDate });
    if (!isEmpty(state.status)) tempArr.push({ status: state.status });
    apiCallParams.set("page", 1);
    apiCallParams.set("limit", state.limit);
    apiCallParams.set("sortBy", state.sortBy);
    apiCallParams.set("sortType", state.sortType);
    apiCallParams.set("mode", state.mode);
    tempArr.map((p) => {
      for (var key in p) {
        // eslint-disable-next-line no-prototype-builtins
        if (p.hasOwnProperty(key)) {
          console.log(key + " -> " + p[key]);
          apiCallParams.set(key, p[key]);
        }
      }
    });

    search(apiCallParams.toString());
  };

  const isEmpty = (str) => {
    return !str || 0 === str.length;
  };

  //Pagination
  const getPageFromBackEnd = async (pageNumber, limit) => {
    apiCallParams.delete("status");
    apiCallParams.delete("startDate");
    apiCallParams.delete("endDate");
    setState((prevState) => ({
      ...prevState,
      page: pageNumber,
    }));
    apiCallParams.set("page", pageNumber);
    apiCallParams.set("limit", limit);
    pageURL.search = apiCallParams.toString();
    const result = await apigetUrl(
      `/notify/notifications/user/${user &&
        user.username}?page=${pageNumber}&limit=${state.limit}&mode=${
        state.mode
      }`
    );
    if (result.data.responseCode === "200") {
      const resultain = result.data.dataList;
      setState((prevState) => ({
        ...prevState,
        data: resultain,
      }));
    } else {
      ippNotify.error(result.data.responseMessage);
    }
  };

  //Search Function 
  const search = async (searchURL) => {
    const result = await apigetUrl(
      `/notify/notifications/user/${user && user.username}?` + searchURL
    );

    if (result.data.responseCode === "200") {
      const resultain = result.data.dataList;
      setAdvancedSearchData(resultain);
      setPageNumber(result.data.pagination.page);
      setPageCount(result.data.pagination.count);
      setState((prevState) => ({
        ...prevState,
        isInfoAlert: false,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        isInfoAlert: true,
        infoMsg: "Your query did not match any results",
        to: 0,
        pageCount: 0,
      }));
    }
  };

  //Handle Reset Button
  const callResetData = async () => {
    apiCallParams.set("page", 1);
    apiCallParams.set("limit", state.limit);
    apiCallParams.set("sortBy", state.sortBy);
    apiCallParams.set("sortType", state.sortType);
    apiCallParams.delete("status");
    apiCallParams.delete("startDate");
    apiCallParams.delete("endDate");
    pageURL.search = apiCallParams.toString();
    const result = await apigetUrl(
      `/notify/notifications/user/${user &&
        user.username}?page=${pageNumber}&limit=${state.limit}&mode=${
        state.mode
      }`
    );
    if (result.data.responseCode === "200") {
      const resultain = result.data.dataList;
      setState((prevState) => ({
        ...prevState,
        searchValidation: {
          policyNum: "",
        },
        startDate: null,
        endDate: null,
        PolicyExpiryDatestartDate: null,
        PolicyExpiryDateendDate: null,

        isInfoAlert: false,
        status: "",
        isAdvancedSearchValidationText: true,
        isendDateDisabled: true,
        errors: {},
      }));
      setResetData(resultain);
      setPageNumber(result.data.pagination.page);
      setPageCount(result.data.pagination.count);
      setCurrentUrl(pageURL);
    } else {
      ippNotify.error(result.data.responseMessage);
    }
  };

  //on Advanced Search Click Clean 
  const onAdvancedSearchClickClean = () => {
    setState((prevState) => ({
      ...prevState,
      searchValidation: {
        policyNum: "",
        startDate: null,
        endDate: null,
        PolicyExpiryDatestartDate: null,
        PolicyExpiryDateendDate: null,
      },
      isAdvancedSearchValidationText: true,
      errors: {},
    }));
  };


  //handle start date change
  const handlestartDate = (date) => {
    setState((prevState) => ({
      ...prevState,

      startDate: date,
      isstartDateActive: true,
      isendDateDisabled: false,
    }));
  };

  //handle end date change
  const handleendDate = (date) => {
    setState((prevState) => ({
      ...prevState,
      endDate: date,
    }));
  };

  //handle status change
  const handlestatus = (e) => {
    console.log("handlestatus:" + e.target.value);
    setState((prevState) => ({
      ...prevState,
      status: e.target.value,
    }));
  };

  //Edit Modal Pop
  const viewTableContent = (
    <>
      <DialogTitle>
        <IntlMessages id="AllNotificationForUser.master.viewmodal" />
      </DialogTitle>
      <DialogContent>
        <div className="row">
          <div className="col-lg-12">
            <InputLabel className="labelfelids">
              <b>
                <IntlMessages id="AllNotificationForUser.master.viewmodal.title" />
              </b>
            </InputLabel>
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-lg-12">{state.validation.title}</div>
        </div>
        <br />
        <div className="row">
          <div className="col-lg-12">
            <InputLabel className="labelfelids">
              <b>
                <IntlMessages id="AllNotificationForUser.master.viewmodal.content" />
              </b>
            </InputLabel>
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-lg-12">{state.validation.content}</div>
        </div>
        <br />

        <div className="row">
          <div className="col-lg-12">
            <InputLabel className="labelfelids">
              <b>
                <IntlMessages id="AllNotificationForUser.master.viewmodal.date" />
              </b>
            </InputLabel>
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-lg-12">{state.validation.date}</div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={(e) => handle_Edit_Form_RequestClose(e)}
          color="secondary"
          variant="contained"
        >
          <IntlMessages id="ipp.common.close.button" />
        </Button>
      </DialogActions>
    </>
  );

  //On Edit Button Click
  const onTableViewButtonClick = (event) => {
    let currentTarget = event.currentTarget;
    let viewresultdata = state.filterdata;
    let viewresultdatafilter = viewresultdata.filter(
      (a) => a.id == currentTarget.id
    );
    setState((prevState) => ({
      ...prevState,
      viewForm_DialogOpen: true,
      validation: {
        title: viewresultdatafilter[0].title,
        content: viewresultdatafilter[0].content,
        date: viewresultdatafilter[0].createdDate,
      },
    }));

    updatestatusdata(viewresultdatafilter);
  };

  //Status Update
  const updatestatusdata = async (dataresult) => {
    let updateapidata = dataresult;

    let data = {
      status: 2,
      rowVersion: updateapidata[0].rowVersion,
      userName: updateapidata[0].userName,
    };

    const result = await apiputUrl(
      "/notify/notifications/" + updateapidata[0].id,
      data
    );
    if (result.data.responseCode === "200") {
      callLocalBaseURL();
    } else {
      setState((prevState) => ({
        ...prevState,
        formDialogOpen: false,
        isErrorAlert: true,
        errorMsg: result.data.responseMessage,
      }));
    }
  };

  // To call the Audit Timeline
  const onTableViewClick = async(e, eventId) => {
    let result = await apigetUrl(
      `/audit/details?page=1&limit=100&sortBy=when&sortType=desc&eventId=${eventId}`
    )
    if (result.data.responseCode === "200") {
        setState((prevState) => ({
          ...prevState,
          eventId: eventId,
          referenceId: (result.data.dataList[0] || {}).referenceId,
          isAuditTimelineActive: true,
        }));
      }
      else
  {
  ippNotify.error(result.data.responseMessage);
  }
  };

  // close the Audit Timeline
  const handleCloseAuditTimeline = () => {
    setState((prevState) => ({
      ...prevState,
      isAuditTimelineActive: false,
    }));
  };

  return (
    <>
      {state.isAuditTimelineActive ? (
        <AuditTimeline
          closeAuditTimeline={handleCloseAuditTimeline}
          eventId={state.eventId}
          referenceId={state.referenceId}
        />
      ) : (
        <div className="App">
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <div></div>

              <div className="row">
                <div className="col-lg-4"></div>
                <div className="col-lg-4"></div>
                <div className="col-lg-4">
                 <IPPNotification/>
                </div>
              </div>
              <div className="audit-master-box">
                <EnhancedTableToolbar
                  numSelected={state.selected.length}
                  page={state.page}
                  limit={state.limit}
                  sortBy={state.sortBy}
                  sortType={state.sortType}
                  setAdvancedSearchData={setAdvancedSearchData}
                  setResetData={setResetData}
                  callLocalBaseURL={callLocalBaseURL}
                  setAdvancedSearchError={setAdvancedSearchError}
                  setSearchedProperty={setSearchedProperty}
                  setCurrentUrl={setCurrentUrl}
                  handleInputChange={handleInputChange}
                  validation={state.validation}
                  errors={state.errors}
                  handleSearchClick={handleSearchClick}
                  isAdvancedSearchValidationText={
                    state.isAdvancedSearchValidationText
                  }
                  callResetData={callResetData}
                  search={search}
                  searchValidation={state.searchValidation}
                  startDate={state.startDate}
                  endDate={state.endDate}
                  status={state.status}
                  isendDateDisabled={state.isendDateDisabled}
                  PolicyExpiryDatestartDate={state.PolicyExpiryDatestartDate}
                  PolicyExpiryDateendDate={state.PolicyExpiryDateendDate}
                  isPolicyExpiryDateEndDateDisabled={
                    state.isPolicyExpiryDateEndDateDisabled
                  }
                  onAdvancedSearchClickClean={onAdvancedSearchClickClean}
                  handlestartDate={handlestartDate}
                  handleendDate={handleendDate}
                  handlestatus={handlestatus}
                />

                <div className="flex-auto">
                  <div className="table-responsive-material">
                    <Table>
                      <EnhancedTableHead
                        numSelected={state.selected.length}
                        order={state.sortType}
                        orderBy={state.sortBy}
                        onRequestSort={handleRequestSort}
                        rowCount={state.data.length}
                        headCell={state.headCells}
                      />
                      {state.isInfoAlert === true || state.data.length === 0 ? (
                        <InfoModal message="Your query did not match any results" />
                      ) : (
                        <TableBody>
                          {state.data.map((n) => {
                            return (
                              <TableRow key={n.id}>
                                <TableCell align="left" width="20%">
                                  {n.title}
                                </TableCell>
                                <TableCell align="left" width="20%">
                                  {contentLenght(n.content)}
                                </TableCell>
                                <TableCell align="left" width="20%">
                                  {n.createdDate}{" "}
                                </TableCell>
                                <TableCell align="left" width="20%">
                                  {statusString(n.status)}
                                </TableCell>
                                <TableCell align="left" width="10%">
                                  <IconButton
                                    id={n.id}
                                    onClick={(e) => onTableViewButtonClick(e)}
                                  >
                                    <VisibilityIcon color="primary" />
                                  </IconButton>
                                  {state.auditEventId >= 1 ? (
                                    <Tooltip title="View Audit Timeline">
                                      <IconButton
                                        onClick={(e) =>
                                          onTableViewClick(
                                            e,
                                            state.auditEventId
                                          )
                                        }
                                      >
                                        <Visibility color="primary" />
                                      </IconButton>
                                    </Tooltip>
                                  ) : null}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      )}

                      <TableFooter>
                        <TableRow>
                          <TablePaginationComponent
                            rowsPerPage={state.limit}
                            count={state.data.length}
                            page={state.page}
                            from={state.from}
                            to={state.to}
                            limit={state.limit}
                            pageCount={state.pageCount}
                            data={state.data}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                            setPageData={setPageData}
                            setPageNumber={setPageNumber}
                            setPageCount={setPageCount}
                            update_from={update_from}
                            update_to={update_to}
                            property={state.sortBy}
                            sortType={state.sortType}
                            currentUrl={state.currentUrl}
                            getPageFromBackEnd={getPageFromBackEnd}
                          />
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </div>
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
      )}
      <Dialog
        maxWidth="sm"
        open={state.viewForm_DialogOpen}
        onClose={handle_Edit_Form_RequestClose}
      >
        {viewTableContent}
      </Dialog>
    </>
  );
}

export default App;
