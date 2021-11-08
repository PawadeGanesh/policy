import React, { useState, useEffect } from "react";
import TableRow from "@material-ui/core/TableRow";
import Tooltip from "@material-ui/core/Tooltip";
import TableCell from "@material-ui/core/TableCell";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableFooter from "@material-ui/core/TableFooter";
import IconButton from "@material-ui/core/IconButton";
import moment from "moment";
import Toolbar from "@material-ui/core/Toolbar";
import "./master.css";
import TablePaginationComponent from "../CommonComponents/TablePaginationComponent";
import EnhancedTableHead from "../CommonComponents/TableHeadComponent";
import FilterListIcon from "@material-ui/icons/FilterList";
import CardBox from "../../../../../components/CardBox";
import InfoModal from "../Modal/Info";
import { apigetUrl } from "../../../../../setup/middleware";
import InputSearchButton from "../CommonComponents/SearchButton";
import InputResetButton from "../CommonComponents/ResetButton";
import InputDatePicker from "../CommonComponents/DatePicker";
import IntlMessages from "util/IntlMessages";
import { getRecordsPerPage } from "../../../../../setup/ApplicatoinConfigurations.js";
import "../CommonComponents/tableStyle.css";
import { TextField } from "@material-ui/core";
import AuditTimeline from "../CommonComponents/AuditTimeline/AuditTimeline";
import { Visibility } from "@material-ui/icons";
import {
  IPPNotification,
  ippNotify,
} from "../CommonComponents/IPPNotification";

const baseURL = `${process.env.REACT_APP_BASE_URL}`;
const perPageURL = `/notify/notifications?mode=email`;

const pageURL = new URL(baseURL + perPageURL);

let apiCallParams = new URLSearchParams(pageURL.search);

let pageNumber = 1;

let EnhancedTableToolbar = (props) => {
  const {
    startDate,
    endDate,
    isEndDateDisabled,
    handleStartDate,
    handleEndDate,
    handleApplyClick,
    callResetData,
    onAdvancedSearchClickClean,
  } = props;
  const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);

  const onAdvancedSearchClick = (e) => {
    onAdvancedSearchClickClean();
    setIsAdvancedSearch(!isAdvancedSearch);
  };

  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  const handleResetClick = (e) => {
    e.preventDefault();
    callResetData();
  };

  return (
    <>
      <Toolbar className="table-header">
        <div className="spacer" />

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
        <div className="row mx-3">
          <CardBox styleName="col-12" heading="Advanced Search">
            <form className="row" autoComplete="off">
              <div className="col-lg-3 col-sm-6 col-12 mb-3">
                <InputDatePicker
                  filterDate={(d) => {
                    return new Date() > d;
                  }}
                  name="startDate"
                  selected={startDate}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  onChange={handleStartDate}
                  customInput={
                    <TextField
                      style={{ width: "100%" }}
                      label={
                        <IntlMessages id="notificationdetails.report.tableheader.email.advancedsearch.StartDate" />
                      }
                      variant="outlined"
                    />
                  }
                />
              </div>

              <div className="col-lg-3 col-sm-6 col-12 mb-3">
                <InputDatePicker
                  filterDate={(d) => {
                    return new Date() > d;
                  }}
                  name="endDate"
                  selected={endDate}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  onChange={handleEndDate}
                  disabled={isEndDateDisabled}
                  customInput={
                    <TextField
                      style={{ width: "100%" }}
                      label={
                        <IntlMessages id="notificationdetails.report.tableheader.email.advancedsearch.EndDate" />
                      }
                      variant="outlined"
                    />
                  }
                />
              </div>
              <div className="col-lg-6"></div>
              <div className="pt-2 ml-2">
                <InputSearchButton onClick={(e) => handleApplyClick(e)} />
              </div>
              <div className="pt-2">
                <InputResetButton onClick={handleResetClick} />
              </div>
            </form>
          </CardBox>
        </div>
      ) : null}
    </>
  );
};

const EmailTable = ({ getLoadingValue }) => {
  const setAdvancedSearchData = (data) => {
    setState((prevState) => ({
      ...prevState,
      data: data,
      page: 1,
      from: 1,
      to: state.limit,
    }));
  };

  const setResetData = (data) => {
    setState((prevState) => ({
      ...prevState,
      data: data,
      page: 1,
      from: 1,
      to: state.limit,
    }));
  };

  const setCurrentUrl = (currentUrl) => {
    setState((prevState) => ({
      ...prevState,
      currentUrl,
    }));
  };

  const [state, setState] = useState({
    requestId: "",
    toNumber: "",
    message: "",
    state: "",
    isLoading: true,
    data: [],
    sortType: "desc",
    sortBy: "created",
    selected: [],
    page: 1,
    rowsPerPage: 5,
    isSortAsc: true,
    from: 1,
    to: 0,
    pageCount: 0,
    limit: getRecordsPerPage(),
    isInfoAlert: false,
    infoMsg: "",
    startDate: null,
    endDate: null,
    isStartDateActive: false,
    isEndDateDisabled: true,
    isAuditTimelineActive: false,
    eventId: "",
    referenceId: "",
    auditEventId: "",
    headCells: [
      {
        id: "toEmail",
        isActive: true,
        label: "notificationdetails.report.tableheader.email.toemail.label",
      },
      {
        id: "subject",
        isActive: true,
        label: "notificationdetails.report.tableheader.email.subjectline.label",
      },
      {
        id: "mail",
        isActive: false,
        label: "notificationdetails.report.tableheader.email.MailBody.label",
      },
      {
        id: "status",
        isActive: true,
        label: "notificationdetails.report.tableheader.email.status.label",
      },
      {
        id: "created",
        isActive: true,
        label: "notificationdetails.report.tableheader.email.createdDate.label",
      },
      {
        id: "sent",
        isActive: true,
        label: "notificationdetails.report.tableheader.email.sentDate.label",
      },
    ],
  });

  useEffect(() => {
    apiCallParams.set("page", state.page);
    apiCallParams.set("limit", state.limit);
    apiCallParams.set("sortBy", state.sortBy);
    apiCallParams.set("sortType", state.sortType);
    pageURL.search = apiCallParams.toString();
    setCurrentUrl(pageURL);
    callLocalBaseURL();
  }, []);

  useEffect(() => {
    getLoadingValue(state.isLoading);
  }, [state.isLoading]);

  const callLocalBaseURL = async () => {
    const result = await apigetUrl(
      `/notify/notifications?mode=email&page=${state.page}&limit=${state.limit}&sortBy=${state.sortBy}&sortType=${state.sortType}`
    );
    if (result.data.responseCode === "200") {
      let status = result.data.dataList.map((n) => n.status);
      console.log("status", status);
      setTimeout(() => {
        setState((prevState) => ({
          ...prevState,
          data: result.data.dataList,
          page: result.data.pagination.page,
          pageCount: result.data.pagination.count,
          limit: result.data.pagination.limit,
          to: result.data.pagination.limit,
          isLoading: false,
        }));
      }, 1000);
    } else {
      ippNotify.error(result.data.responseMessage);
      showLoader();
    }

    // adding new element in the table header
    if ((result.data || {}).auditEventId >= 1) {
      let updateHeadCells = state.headCells;
      updateHeadCells.push({
        id: "timeline",
        isActive: false,
        label: "Actions",
      });
      setState((prevState) => ({
        ...prevState,
        auditEventId: result.data.auditEventId,
        headCells: updateHeadCells,
      }));
    }
  };

  const showLoader = () => {
    setTimeout(() => {
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
      }));
    }, 5000);
  };

  const requestSortData = async (sortBy, sortType) => {
    const { startDate, endDate } = state;
    const formatStartDate = moment(startDate).format("DD-MM-YYYY hh:mm:ss");
    const formatEndDate = moment(endDate).format("DD-MM-YYYY hh:mm:ss");
    apiCallParams.set("page", state.page);
    apiCallParams.set("limit", state.limit);
    apiCallParams.set("sortBy", sortBy);
    apiCallParams.set("sortType", sortType);
    let tempArr = [];
    if (!isEmpty(startDate)) tempArr.push({ startDate: formatStartDate });
    if (!isEmpty(endDate)) tempArr.push({ endDate: formatEndDate });
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
      return p;
    });
    let searchParam = apiCallParams.toString();
    pageURL.search = apiCallParams.toString();
    setCurrentUrl(pageURL);
    const result = await apigetUrl(`/notify/notifications?` + searchParam);
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

  const requestPageLimitCountChange = async (count) => {
    let res = "";
    apiCallParams.set("page", 1);
    apiCallParams.set("limit", count);
    apiCallParams.set("sortBy", state.sortBy);
    apiCallParams.set("sortType", state.sortType);
    pageURL.search = apiCallParams.toString();
    setCurrentUrl(pageURL);
    const result = await apigetUrl(
      `/notify/notifications?mode=email&page=${1}&limit=${count}&sortBy=${
        state.sortBy
      }&sortType=${state.sortType}`
    );
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
        pageNumber = 1;
      }, 1000);
    } else {
      ippNotify.error(result.data.responseMessage);
      showLoader();
    }
  };

  const handleChangeRowsPerPage = (event) => {
    let target = event.target;
    setState((prevState) => ({
      ...prevState,
      page: 1,
      isLoading: true,
    }));
    requestPageLimitCountChange(target.value);
  };

  const isSelectedFunc = (id) => {
    return state.selected.indexOf(id) !== -1;
  };

  const setPageData = (data) => {
    setState((prevState) => ({
      ...prevState,
      data: data,
    }));
  };

  const setPageNumber = (pageNumber) => {
    setState((prevState) => ({
      ...prevState,
      page: pageNumber,
    }));
  };
  const setPageCount = (pageCount) => {
    setState((prevState) => ({
      ...prevState,
      pageCount: pageCount,
    }));
  };

  const update_to = (to) => {
    setState((prevState) => ({
      ...prevState,
      to: to,
    }));
  };

  const update_from = (from) => {
    setState((prevState) => ({
      ...prevState,
      from: from,
    }));
  };

  const getPageFromBackEnd = async (
    pageNumber,
    limit,
    temp_from,
    temp_to,
    pageCount,
    actionType
  ) => {
    const { startDate, endDate } = state;
    if (!isEmpty(startDate)) {
    } else {
      apiCallParams.delete("startDate");
    }
    if (!isEmpty(endDate)) {
    } else {
      apiCallParams.delete("endDate");
    }

    setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    apiCallParams.set("page", pageNumber);
    apiCallParams.set("limit", limit);
    pageURL.search = apiCallParams.toString();
    const result = await apigetUrl(
      `/notify/notifications?mode=email&page=${pageNumber}&limit=${limit}&sortBy=${state.sortBy}&sortType=${state.sortType}`
    );
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

  const handleStartDate = (date) => {
    setState((prevState) => ({
      ...prevState,
      startDate: date,
      isStartDateActive: true,
      isEndDateDisabled: false,
    }));
  };

  const handleEndDate = (date) => {
    setState((prevState) => ({
      ...prevState,
      endDate: date,
    }));
  };

  const isEmpty = (str) => {
    return !str || 0 === str.length;
  };

  const handleApplyClick = (e) => {
    apiCallParams.delete("startDate");
    apiCallParams.delete("endDate");
    e.preventDefault();
    const { startDate, endDate } = state;
    const formatStartDate = moment(startDate).format("DD-MM-YYYY hh:mm:ss");
    const formatEndDate = moment(endDate).format("DD-MM-YYYY hh:mm:ss");
    let tempArr = [];
    if (!isEmpty(startDate)) tempArr.push({ startDate: formatStartDate });
    if (!isEmpty(endDate)) tempArr.push({ endDate: formatEndDate });
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
      return p;
    });
    pageURL.search = apiCallParams.toString();
    search(apiCallParams.toString());
  };

  const search = async (searchURL) => {
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    console.log("searchURL", searchURL);
    const result = await apigetUrl(`/notify/notifications?` + searchURL);
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
      ippNotify.error(result.data.responseMessage);
      showLoader();
    }
  };

  const callResetData = async () => {
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    apiCallParams.set("page", 1);
    apiCallParams.set("limit", state.limit);
    apiCallParams.set("sortBy", state.sortBy);
    apiCallParams.set("sortType", state.sortType);
    apiCallParams.delete("startDate");
    apiCallParams.delete("endDate");
    pageURL.search = apiCallParams.toString();
    const result = await apigetUrl(
      `/notify/notifications?mode=email&page=${1}&limit=${state.limit}&sortBy=${
        state.sortBy
      }&sortType=${state.sortType}`
    );
    if (result.data.responseCode === "200") {
      setTimeout(() => {
        setState((prevState) => ({
          ...prevState,
          startDate: null,
          endDate: null,
          isEndDateDisabled: true,
          isInfoAlert: false,
          isLoading: false,
        }));
        setResetData(result.data.dataList);
        setPageNumber(1);
        setPageCount(result.data.pagination.count);
        setCurrentUrl(pageURL);
      }, 1000);
    } else {
      ippNotify.error(result.data.responseMessage);
      showLoader();
    }
  };

  const onAdvancedSearchClickClean = () => {
    setState((prevState) => ({
      ...prevState,
      startDate: null,
      endDate: null,
    }));
  };

  const statusTextReturn = (status) => {
    switch (status) {
      case 0:
        return "Not Sent";
      case 1:
        return "Sent";
      case 2:
        return "Error";
      case "":
        return "";
    }
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
          <EnhancedTableToolbar
            setAdvancedSearchData={setAdvancedSearchData}
            setResetData={setResetData}
            page={state.page}
            rowsPerPage={state.rowsPerPage}
            startDate={state.startDate}
            endDate={state.endDate}
            isStartDateActive={state.isStartDateActive}
            isEndDateDisabled={state.isEndDateDisabled}
            handleStartDate={handleStartDate}
            handleEndDate={handleEndDate}
            handleApplyClick={handleApplyClick}
            callResetData={callResetData}
            onAdvancedSearchClickClean={onAdvancedSearchClickClean}
          />
          <div className="flex-auto">
            <IPPNotification />
            <div className="table-responsive-material">
              <Table>
                <EnhancedTableHead
                  // numSelected={state.selected.length}
                  order={state.sortType}
                  orderBy={state.sortBy}
                  onRequestSort={handleRequestSort}
                  rowCount={state.data.length}
                  headCell={state.headCells}
                />
                {state.isInfoAlert === true ||
                (state.data.length === 0 && state.isLoading === false) ? (
                  <InfoModal message="Your query did not match any results" />
                ) : (
                  <TableBody>
                    {state.data.map((n) => {
                      const isSelected = isSelectedFunc(n.id);
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          aria-checked={isSelected}
                          tabIndex={-1}
                          key={n.id}
                          selected={isSelected}
                        >
                          <TableCell>{n.toEmails}</TableCell>
                          <TableCell>{n.subjectLine}</TableCell>
                          <TableCell>{n.mailBody}</TableCell>
                          <TableCell>{statusTextReturn(n.status)}</TableCell>
                          <TableCell>{n.createdDateDisplay}</TableCell>
                          <TableCell>{n.sentDateDisplay}</TableCell>
                          {state.auditEventId >= 1 ? (
                            <>
                              <TableCell padding="none">
                                <Tooltip title="View Audit Timeline">
                                  <IconButton
                                    style={{ marginLeft: "10%" }}
                                    onClick={(e) =>
                                      onTableViewClick(e, state.auditEventId)
                                    }
                                  >
                                    <Visibility color="primary" />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                            </>
                          ) : null}
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
                      property={state.sortBy}
                      sortType={state.sortType}
                      currentUrl={state.currentUrl}
                      onChangeRowsPerPage={handleChangeRowsPerPage}
                      setPageData={setPageData}
                      setPageNumber={setPageNumber}
                      setPageCount={setPageCount}
                      update_from={update_from}
                      update_to={update_to}
                      getPageFromBackEnd={getPageFromBackEnd}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmailTable;
