import React, { useState, useEffect } from "react";
import InfoModal from "../Modal/Info";
import TablePaginationComponent from "../CommonComponents/TablePaginationComponent";
import "./master.css";
import {
  TableFooter,
  TableCell,
  TableBody,
  IconButton,
  Tooltip,
  TableRow,
  Button,
  Grid,
  Table,
} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import IntlMessages from "util/IntlMessages";
import EnhancedTableHead from "../CommonComponents/TableHeadComponent";
import EnhancedTableToolbar from "./EnhancedTableToolbar";
import Joi from "joi-browser";
import { apigetUrl, apideleteUrl } from "../../../../../setup/middleware";
import ViewTicket from "./ViewTicket";
import {
  IPPNotification,
  ippNotify,
} from "../CommonComponents/IPPNotification";
import {
  getRecordsPerPage,
  getDateTimeFormat,
} from "../../../../../setup/ApplicatoinConfigurations.js";
import "../CommonComponents/tableStyle.css";
import AuditTimeline from "../CommonComponents/AuditTimeline/AuditTimeline";
import { Visibility } from "@material-ui/icons";
import Loader from "../CommonComponents/Loader";
import moment from "moment";

const baseURL = `${process.env.REACT_APP_BASE_URL}`;
const perPageURL = `/ots/helpdesk/my/ticket`;
const pageURL = new URL(baseURL + perPageURL);
let apiCallParams = new URLSearchParams(pageURL.search);

let pageNumber = 1;

//scheme for advance search
const schema = {
  ticketNumber: Joi.string()
    .required()
    .label("ticketNumber"),
};

const CheckTicketStatus = ({ onGoBackClick }) => {
  //setAdvancedSearchData
  const setAdvancedSearchData = (data) => {
    setState((prevState) => ({
      ...prevState,
      data: data,
      page: 1,
      from: 1,
      to: state.limit,
    }));
  };

  //set Reset Data
  const setResetData = (data) => {
    setState((prevState) => ({
      ...prevState,
      data: data,
      page: 1,
      from: 1,
      to: state.limit,
    }));
  };

  //set Advanced Search Error
  const setAdvancedSearchError = (isErrorTrue, errorMessage) => {
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

  //set Current Url
  const setCurrentUrl = (currentUrl) => {
    setState((prevState) => ({ ...prevState, currentUrl }));
  };

  //state
  const [state, setState] = useState({
    isAddUserManagementActive: false,
    isViewTicketActive: false,
    id: "",
    name: "",
    key: "",
    fieldType: "",
    isVisible: "",
    isEditable: "",
    selected: [],
    page: 1,
    limit: getRecordsPerPage(),
    rowsPerPage: 5,
    data: [],
    sortType: "asc",
    sortBy: "created",
    editForm_DialogOpen: false,
    selectedEditId: "",
    selectedDeleteId: "",
    isSortAsc: true,
    from: 1,
    to: 0,
    pageCount: 0,
    deleteItem_DialogOpen: false,
    isEditForm_DataListId_Available: false,
    validation: {
      name: "",
      description: "",
    },
    menuItem: [],
    itemName: "",
    menuItemId: "",
    searchValidation: {
      ticketNumber: "",
    },
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
    inTableErrorMessageContent: "Unable to fetch data!",
    searchedProperty: "",
    selected_EditForm_RowVersion_Value: 1,
    isAdvancedSearchValidationText: true,
    searchActive: false,
    selectedId: 0,
    isAuditTimelineActive: false,
    eventId: "",
    referenceId: "",
    auditEventId: "",
    isLoading: true,
    isendDateDisabled: true,
    startDate: null,
    endDate: null,
    headCells: [
      {
        id: "Ticketnumber",
        isActive: false,
        label: "MyTickets.Table.Ticketnumber",
      },
      {
        id: "Title",
        isActive: false,
        label: "MyTickets.Table.Title",
      },
      {
        id: "Status",
        isActive: false,
        label: "MyTickets.Table.Status",
      },
      {
        id: "ReportedDate",
        isActive: false,
        label: "MyTickets.Table.ReportedDate",
      },
      {
        id: "actions",
        isActive: false,
        label: "MyTickets.Table.Action",
      },
    ],
  });

  //loader
  const showLoader = () => {
    setTimeout(() => {
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
      }));
    }, 1000);
  };

  //view by id
  const onTableEditButtonClick = async (event, id) => {
    setState((prevState) => ({
      ...prevState,
      isViewTicketActive: true,
      selectedId: id,
    }));
  };

  //delete
  const deleteItemInBackend = async (id) => {
    const result = await apideleteUrl(`/ots/helpdesk/my/ticket/` + id);
    if (result.status === 200) {
      ippNotify.success("Successfully Deleted");
      setState((prevState) => ({
        ...prevState,
        formDialogOpen: false,
        isSuccessAlert: true,
        deleteFormDialogOpen: false,
        successMsg: "Successfully Deleted",
        isLoading: true,
      }));

      callLocalBaseURL();
    } else {
      ippNotify.error("Failed to Delete");
      setState((prevState) => ({
        ...prevState,
        formDialogOpen: false,
        isErrorAlert: true,
        errorMsg: "Failed to Delete",
      }));
    }
  };

  //close delete
  const deleteForm_NoConfirm = () => {
    setState((prevState) => ({
      ...prevState,
      deleteItem_DialogOpen: false,
    }));
  };

  //yes delete
  const deleteForm_YesConfirm = () => {
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    deleteItemInBackend(state.selectedDeleteId);
    setState((prevState) => ({
      ...prevState,
      deleteItem_DialogOpen: false,
    }));
  };

  //delete modal popup
  const deleteItem_content = (
    <>
      <DialogTitle>
        <IntlMessages id="ipp.common.modal.deleteconfirmation.title" />
      </DialogTitle>
      <DialogContent>
        <p>
          <b>
            <IntlMessages id="user.master.modal.deleteconfrimation.message" />
          </b>
        </p>
      </DialogContent>
      <DialogActions>
        <Button onClick={(e) => deleteForm_YesConfirm(e)} color="secondary">
          <IntlMessages id="ipp.common.Yes.button" />
        </Button>
        <Button onClick={(e) => deleteForm_NoConfirm(e)} color="primary">
          <IntlMessages id="ipp.common.No.button" />
        </Button>
      </DialogActions>
    </>
  );

  useEffect(() => {
    apiCallParams.set("page", state.page);
    apiCallParams.set("limit", state.limit);
    apiCallParams.set("sortBy", state.sortBy);
    apiCallParams.set("sortType", state.sortType);
    pageURL.search = apiCallParams.toString();
    setCurrentUrl(pageURL);
    callLocalBaseURL();
  }, []);

  //default function load on page load
  const callLocalBaseURL = async () => {
    const result = await apigetUrl(
      `/ots/helpdesk/my/ticket?page=${state.page}&limit=${state.limit}`
    );
    if (result.data.responseCode === "200") {
      setTimeout(() => {
        setState((prevState) => ({
          ...prevState,
          data: result.data.dataList,
          page: result.data.pagination.page,
          pageCount: result.data.pagination.count,
          to: result.data.pagination.limit,
          limit: result.data.pagination.limit,
          auditEventId: (result.data || {}).auditEventId,
          isLoading: false,
        }));
      }, 1000);
    } else {
      ippNotify.error(result.data.responseMessage);
      showLoader();
    }
  };

  //sorting
  const requestSortData = async (sortBy, sortType) => {
    apiCallParams.set("page", state.page);
    apiCallParams.set("limit", state.limit);
    apiCallParams.set("sortBy", sortBy);
    apiCallParams.set("sortType", sortType);
    const { ticketNumber } = state.searchValidation;
    if (!isEmpty(ticketNumber)) {
      apiCallParams.set("ticketNumber", ticketNumber);
    } else {
      apiCallParams.delete("ticketNumber");
    }
    if (!isEmpty(state.status)) {
      apiCallParams.set("status", state.status);
    } else {
      apiCallParams.delete("status");
    }
    if (!isEmpty(state.startDate)) {
      const startDateFormater = moment(state.startDate).format(
        "DD-MM-yyyy HH:mm:ss"
      );
      apiCallParams.set("startDate", startDateFormater);
    } else {
      apiCallParams.delete("startDate");
    }
    if (!isEmpty(state.endDate)) {
      const endDateFormater = moment(state.endDate).format(
        "DD-MM-yyyy HH:mm:ss"
      );
      apiCallParams.set("endDate", endDateFormater);
    } else {
      apiCallParams.delete("endDate");
    }

    let searchParam = apiCallParams.toString();
    pageURL.search = apiCallParams.toString();

    setCurrentUrl(pageURL);

    const result = await apigetUrl(`/ots/helpdesk/my/ticket?` + searchParam);
    if (result.data.responseCode === "200") {
      setTimeout(() => {
        setState((prevState) => ({
          ...prevState,
          data: result.data.dataList,
          isLoading: false,
        }));
      }, 1000);
    } else {
      ippNotify.error(result.data.responseMessage);
      showLoader();
    }
  };

  //handle Request Sort
  const handleRequestSort = (event, property) => {
    const isAsc = state.sortBy === property && state.sortType === "desc";
    let currentSortOrder = isAsc ? "asc" : "desc";
    setState((prevState) => ({
      ...prevState,
      sortType: isAsc ? "asc" : "desc",
      sortBy: property,
      isLoading: true,
    }));

    requestSortData(property, currentSortOrder);
  };

  //handle Select All Click
  const handleSelectAllClick = (event, checked) => {
    if (checked) {
      setState({ selected: state.data.map((n) => n.id) });
      return;
    }
    setState({ selected: [] });
  };

  //request Page Limit Count Change
  const requestPageLimitCountChange = async (count) => {
    let res = "";

    apiCallParams.set("page", 1);
    apiCallParams.set("limit", count);
    const { ticketNumber } = state.searchValidation;
    if (!isEmpty(ticketNumber)) {
      apiCallParams.set("ticketNumber", ticketNumber);
    } else {
      apiCallParams.delete("ticketNumber");
    }
    if (!isEmpty(state.status)) {
      apiCallParams.set("status", state.status);
    } else {
      apiCallParams.delete("status");
    }
    if (!isEmpty(state.startDate)) {
      const startDateFormater = moment(state.startDate).format(
        "DD-MM-yyyy HH:mm:ss"
      );
      apiCallParams.set("startDate", startDateFormater);
    } else {
      apiCallParams.delete("startDate");
    }
    if (!isEmpty(state.endDate)) {
      const endDateFormater = moment(state.endDate).format(
        "DD-MM-yyyy HH:mm:ss"
      );
      apiCallParams.set("endDate", endDateFormater);
    } else {
      apiCallParams.delete("endDate");
    }

    pageURL.search = apiCallParams.toString();

    setCurrentUrl(pageURL);
    let getUrl = pageURL.pathname + pageURL.search;
    const result = await apigetUrl(`${getUrl}`);
    if (result.data.responseCode === "200") {
      setTimeout(() => {
        update_to(count);
        update_from(1);
        setState((prevState) => ({
          ...prevState,
          data: result.data.dataList,
          page: 1,
          pageCount: result.data.pagination.count,
          limit: result.data.pagination.limit,
          isLoading: false,
        }));
      }, 1000);
      pageNumber = 1;
    } else {
      ippNotify.error(result.data.responseMessage);
      showLoader();
    }
  };

  const isSelectedFunc = (id) => {
    return state.selected.indexOf(id) !== -1;
  };

  //handle Change Rows Per Page
  const handleChangeRowsPerPage = (event) => {
    let target = event.target;
    setState((prevState) => ({
      ...prevState,
      page: 1,
      isLoading: true,
    }));
    requestPageLimitCountChange(target.value);
  };

  //close delete modal popup
  const handle_Delete_Item_RequestClose = () => {
    setState((prevState) => ({
      ...prevState,
      deleteItem_DialogOpen: false,
    }));
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

  //set Page Data
  const setPageData = (data) => {
    setState((prevState) => ({
      ...prevState,
      data: data,
    }));
  };

  //close ticket
  const closeViewTicket = () => {
    setState((prevState) => ({
      ...prevState,
      isViewTicketActive: false,
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
      searchValidation.name !== "" || searchValidation.description !== "";

    setState((prevState) => ({
      ...prevState,
      errors,
      searchValidation,
      isAdvancedSearchValidationText:
        isAnyFormFieldsPopulated && isObjEmpty(errors),
    }));
  };

  //handle Search Click
  const handleSearchClick = (e) => {
    apiCallParams.delete("ticketNumber");
    apiCallParams.delete("status");
    apiCallParams.delete("startDate");
    apiCallParams.delete("endDate");
    if (state.searchValidation.name === "") {
      setState((prevState) => ({
        ...prevState,
        isAdvancedSearchValidationText: false,
      }));
      return;
    } else {
      setState((prevState) => ({
        ...prevState,
        isAdvancedSearchValidationText: true,
        errors: {},
      }));
    }
    e.preventDefault();

    const { ticketNumber } = state.searchValidation;
    let tempArr = [];

    const startDate = moment(state.startDate).format("DD-MM-yyyy HH:mm:ss");
    const endDate = moment(state.endDate).format("DD-MM-yyyy HH:mm:ss");

    if (!isEmpty(ticketNumber)) tempArr.push({ ticketNumber });
    if (!isEmpty(state.status)) tempArr.push({ status: state.status });
    if (!isEmpty(state.startDate)) tempArr.push({ startDate: startDate });
    if (!isEmpty(state.endDate)) tempArr.push({ endDate: endDate });

    apiCallParams.set("page", 1);
    apiCallParams.set("limit", state.limit);
    apiCallParams.set("sortBy", state.sortBy);
    apiCallParams.set("sortType", state.sortType);

    tempArr.map((p) => {
      for (var key in p) {
        if (p.hasOwnProperty(key)) {
          apiCallParams.set(key, p[key]);
        }
      }
    });

    pageURL.search = apiCallParams.toString();
    search(apiCallParams.toString());
  };

  const isEmpty = (str) => {
    return !str || 0 === str.length;
  };

  //get Page From BackEnd
  const getPageFromBackEnd = async (
    pageNumber,
    limit,
    temp_from,
    temp_to,
    pageCount,
    actionType
  ) => {
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));

    apiCallParams.set("page", pageNumber);
    apiCallParams.set("limit", limit);
    const { ticketNumber } = state.searchValidation;

    if (!isEmpty(ticketNumber)) {
      apiCallParams.set("ticketNumber", ticketNumber);
    } else {
      apiCallParams.delete("ticketNumber");
    }
    if (!isEmpty(state.status)) {
      apiCallParams.set("status", state.status);
    } else {
      apiCallParams.delete("status");
    }
    if (!isEmpty(state.startDate)) {
      const startDateFormater = moment(state.startDate).format(
        "DD-MM-yyyy HH:mm:ss"
      );
      apiCallParams.set("startDate", startDateFormater);
    } else {
      apiCallParams.delete("startDate");
    }
    if (!isEmpty(state.endDate)) {
      const endDateFormater = moment(state.endDate).format(
        "DD-MM-yyyy HH:mm:ss"
      );
      apiCallParams.set("endDate", endDateFormater);
    } else {
      apiCallParams.delete("endDate");
    }
    pageURL.search = apiCallParams.toString();
    let getUrl = pageURL.pathname + pageURL.search;
    const result = await apigetUrl(`${getUrl}`);
    if (result.data.responseCode === "200") {
      setTimeout(() => {
        if (actionType === "handleNextButtonClick") {
          update_from(temp_from);
          if (temp_to >= pageCount) {
            update_to(pageCount);
          } else {
            update_to(temp_to);
          }
        } else if (actionType === "handleBackButtonClick") {
          update_from(temp_from);
          update_to(temp_to);
        }
        setPageData(result.data.dataList);
        setPageNumber(result.data.pagination.page);
        setPageCount(result.data.pagination.count);
        setState((prevState) => ({
          ...prevState,
          page: pageNumber,
          isLoading: false,
        }));
      }, 1000);
    } else {
      ippNotify.error(result.data.responseMessage);
      showLoader();
    }
  };

  //search
  const search = async (searchURL) => {
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    const result = await apigetUrl(`/ots/helpdesk/my/ticket?` + searchURL);
    if (result.data.responseCode === "200") {
      setTimeout(() => {
        setAdvancedSearchData(result.data.dataList);
        setPageNumber(result.data.pagination.page);
        setPageCount(result.data.pagination.count);
        setState((prevState) => ({
          ...prevState,
          isInfoAlert: false,
          isLoading: false,
        }));
      }, 1000);
    } else {
      setState((prevState) => ({
        ...prevState,

        isInfoAlert: true,
        infoMsg: "Your query did not match any results",
        to: 0,
        pageCount: 0,
      }));
      showLoader();
    }
  };

  //call Reset Data
  const callResetData = async () => {
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    apiCallParams.set("page", 1);
    apiCallParams.set("limit", state.limit);
    apiCallParams.set("sortBy", state.sortBy);
    apiCallParams.set("sortType", state.sortType);
    apiCallParams.delete("ticketNumber");
    apiCallParams.delete("status");
    apiCallParams.delete("startDate");
    apiCallParams.delete("endDate");
    pageURL.search = apiCallParams.toString();

    const result = await apigetUrl(
      `/ots/helpdesk/my/ticket?page=${state.page}&limit=${state.limit}&sortBy=${state.sortBy}&sortType=${state.sortType}`
    );
    if (result.data.responseCode === "200") {
      setTimeout(() => {
        setState((prevState) => ({
          ...prevState,
          searchValidation: {
            ticketNumber: "",
          },
          status: 0,
          startDate: null,
          endDate: null,
          isInfoAlert: false,
          isendDateDisabled: true,
          isAdvancedSearchValidationText: true,
          errors: {},
          isLoading: false,
        }));
      }, 1000);
      setResetData(result.data.dataList);
      setPageNumber(result.data.pagination.page);
      setPageCount(result.data.pagination.count);
      setCurrentUrl(pageURL);
    } else {
      ippNotify.error(result.data.responseMessage);
    }
  };

  //on Advanced Search ClickClean
  const onAdvancedSearchClickClean = () => {
    setState((prevState) => ({
      ...prevState,
      searchValidation: {
        userName: "",
        firstName: "",
        lastName: "",
        email: "",
      },
      isAdvancedSearchValidationText: true,
      errors: {},
    }));
  };

  // To call the Audit Timeline
  const onTableViewClick = async (e, eventId) => {
    let result = await apigetUrl(
      `/audit/details?page=1&limit=100&sortBy=when&sortType=desc&eventId=${eventId}`
    );
    if (result.data.responseCode === "200") {
      setState((prevState) => ({
        ...prevState,
        eventId: eventId,
        referenceId: (result.data.dataList[0] || {}).referenceId,
        isAuditTimelineActive: true,
      }));
    } else {
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

  //status color
  const statusColor = (status) => {
    switch (status) {
      case 1:
        return "red";
      case 2:
        return "orange";
      case 3:
        return "green";
      case 4:
        return "grey";
      case 5:
        return "red";
    }
  };

  //status name
  const statusName = (status) => {
    switch (status) {
      case 1:
        return "Open";
      case 2:
        return "Resolved";
      case 3:
        return "Closed";
      case 4:
        return "Archived";
      case 5:
        return "Deleted";
    }
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
    setState((prevState) => ({
      ...prevState,
      status: e.target.value,
    }));
  };

  return (
    <React.Fragment>
      {state.isAuditTimelineActive ? (
        <AuditTimeline
          closeAuditTimeline={handleCloseAuditTimeline}
          eventId={state.eventId}
          referenceId={state.referenceId}
        />
      ) : state.isViewTicketActive === true ? (
        <div>
          <ViewTicket
            // getEditSuccessUpdate={getEditSuccessUpdate}
            // getEditErrorUpdate={getEditErrorUpdate}
            closeViewTicket={closeViewTicket}
            callLocalBaseURL={callLocalBaseURL}
            selectedId={state.selectedId}
          />
        </div>
      ) : (
        <div className="App">
          <Dialog
            maxWidth="sm"
            open={state.deleteItem_DialogOpen}
            onClose={handle_Delete_Item_RequestClose}
          >
            {deleteItem_content}
          </Dialog>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <div></div>

              <div className="row">
                <div className="col-lg-4"></div>
                <div className="col-lg-4"></div>
                <div className="col-lg-4">
                  <IPPNotification />
                </div>
              </div>
              <div className="audit-master-box">
                <EnhancedTableToolbar
                  //onAddButtonClick={onAddButtonClick}
                  numSelected={state.selected.length}
                  page={state.page}
                  limit={state.limit}
                  sortBy={state.sortBy}
                  sortType={state.sortType}
                  setAdvancedSearchData={setAdvancedSearchData}
                  setResetData={setResetData}
                  //getSuccessUpdate={getSuccessUpdate}
                  //getErrorUpdate={getErrorUpdate}
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
                  onAdvancedSearchClickClean={onAdvancedSearchClickClean}
                  onGoBackClick={onGoBackClick}
                  handlestartDate={handlestartDate}
                  handleendDate={handleendDate}
                  handlestatus={handlestatus}
                  startDate={state.startDate}
                  endDate={state.endDate}
                  status={state.status}
                  isendDateDisabled={state.isendDateDisabled}
                />

                <div className="flex-auto">
                  <div className="table-responsive-material">
                    <Table>
                      <EnhancedTableHead
                        numSelected={state.selected.length}
                        order={state.sortType}
                        orderBy={state.sortBy}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={state.data.length}
                        headCell={state.headCells}
                      />
                      {state.isLoading ? <Loader /> : null}
                      {state.isInfoAlert === true ||
                      (state.data.length === 0 && state.isLoading === false) ? (
                        <InfoModal message="Your query did not match any results" />
                      ) : (
                        <TableBody>
                          {state.data.map((n) => {
                            const isSelected = isSelectedFunc(n.id);
                            return (
                              <TableRow key={n.ticketNumber}>
                                <TableCell>{n.number}</TableCell>
                                <TableCell>{n.ticketData.subject}</TableCell>
                                <TableCell
                                  style={{ color: statusColor(n.statusId) }}
                                >
                                  {statusName(n.statusId)}
                                </TableCell>
                                <TableCell>
                                  {moment(n.createdDate).format(
                                    "DD-MM-YYYY hh:mm:ss"
                                  )}
                                </TableCell>
                                <TableCell padding="none">
                                  <Tooltip
                                    title={
                                      <IntlMessages id="MyTickets.MainPage.ToolTip.ViewTicket" />
                                    }
                                  >
                                    <IconButton
                                      id={n.ticketNumber}
                                      onClick={(e) =>
                                        onTableEditButtonClick(e, n.ticketNumber)
                                      }
                                    >
                                      <Visibility color="primary" />
                                    </IconButton>
                                  </Tooltip>
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
    </React.Fragment>
  );
};

export default CheckTicketStatus;
