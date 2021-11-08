import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import { Tooltip } from "@material-ui/core";
import TableFooter from "@material-ui/core/TableFooter";
import TableRow from "@material-ui/core/TableRow";
import EnhancedTableHead from "../CommonComponents/TableHeadComponent";
import EnhancedTableToolbar from "./EnhancedTableToolbar";
import TablePaginationComponent from "../CommonComponents/TablePaginationComponent";
import InfoModal from "../Modal/Info";
import apiInstance from "../../../../../setup/index";
import { apigetUrl } from "../../../../../setup/middleware";
import _ from "lodash";
import { useDispatch } from "react-redux";
import { verifyToken } from "../../../../../actions/Auth";
import {
  IPPNotification,
  ippNotify,
} from "../CommonComponents/IPPNotification";
import { getRecordsPerPage } from "../../../../../setup/ApplicatoinConfigurations.js";
import "../CommonComponents/tableStyle.css";
import "./root.component.css";
import moment from "moment";
import AuditTimeline from "../CommonComponents/AuditTimeline/AuditTimeline";
import { Visibility } from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import { currencyFormater } from "../CommonComponents/formater";
import Loader from "../CommonComponents/Loader";

const baseURL = `${process.env.REACT_APP_BASE_URL}`;
const perPageURL = `/insurance/sub-categories`;
const pageURL = new URL(baseURL + perPageURL);
let apiCallParams = new URLSearchParams(pageURL.search, apiInstance);

let pageNumber = 1;

function App() {
  const setAdvancedSearchData = (data) => {
    pageNumber = 1;
    setState((prevState) => ({
      ...prevState,
      data: data,
      page: 1,
      from: 1,
      to: state.limit,
    }));
  };

  const setResetData = (data) => {
    console.log("resetData", data);
    pageNumber = 1;
    setState((prevState) => ({
      ...prevState,
      data: data,
      isInfoAlert: false,
      page: 1,
      from: 1,
      to: state.limit,
      isAdvancedSearchValidationText: false,
    }));
  };

  const setCurrentUrl = (currentUrl) => {
    setState((prevState) => ({ ...prevState, currentUrl }));
  };

  const [state, setState] = useState({
    name: "",
    archiveIn: "",
    purgeIn: "",
    isEnabled: "",
    createdBy: "",
    createdDate: "",
    modifiedName: "",
    modifiedDate: "",
    sortType: "asc",
    sortBy: "name",
    selected: [],
    page: 1,
    rowsPerPage: 5,
    data: [],
    ruleData: [],
    isLoading: true,
    isSortAsc: true,
    deleteFormDialogOpen: false,
    from: 1,
    to: 0,
    pageCount: 0,
    limit: getRecordsPerPage(),
    errors: {},
    advancedSearchValidationErrors: {},
    isAdvancedSearchValidationText: false,
    handleAutoCompleteInputReset: false,
    startDate: null,
    endDate: null,
    isEndDateDisabled: true,
    searchValidation: {
      name: "",
    },
    isAuditTimelineActive: false,
    eventId: "",
    referenceId: "",
    auditEventId: "",
    headCells: [
      {
        id: "ruleId",
        isActive: true,
        label: "CommissionLedger.RuleName",
      },
      {
        id: "amount",
        isActive: false,
        label: "CommissionLedger.Amount",
      },
      {
        id: "createdDate",
        isActive: false,
        label: "CommissionLedger.Date",
      },
    ],
  });

  const dispatch = useDispatch();

  useEffect(() => {
    console.log("resetData-234", state.data);
  }, [state.data]);

  useEffect(() => {
    getCommissionRule();
  }, []);

  const showLoader = () => {
    setTimeout(() => {
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
      }));
    }, 1000);
  };

  const callLocalBaseURL = async () => {
    const result = await apigetUrl(
      `/insurance/commission/earned?page=${state.page}&limit=${state.limit}`
    );
    if (result.data.responseCode === "200") {
      setTimeout(() => {
        setState((prevState) => ({
          ...prevState,
          data: result.data.dataList,
          page: result.data.pagination.page,
          pageCount: result.data.pagination.count,
          limit: result.data.pagination.limit,
          to: result.data.pagination.limit,
          from: 1,
          isLoading: false,
        }));
      }, 1000);
    } else {
      if (result.status === 401 || result.status === 402) {
        dispatch(verifyToken());
      } else {
        ippNotify.error(result.data.responseMessage);
        showLoader();
      }
    }

    // adding new element in the table header
    if (result.data.auditEventId >= 1) {
      let updateHeadCells = state.headCells;
      updateHeadCells.push({
        id: "timeline",
        isActive: false,
        label: "Actions",
      });
      setState((prevState) => ({
        ...prevState,
        headCells: updateHeadCells,
        auditEventId: result.data.auditEventId,
      }));
    }
  };

  const getCommissionRule = () => {
    apigetUrl(
      `/insurance/commission/rules?page=${state.page}&limit=${state.limit}&sortBy=${state.sortBy}&sortType=${state.sortType}`
    ).then((res) => {
      setState((prevState) => ({
        ...prevState,
        ruleData: res.data.dataList,
      }));
    });
  };

  const getRuleName = (ruleId) => {
    console.log("item", state.ruleData);
    const item = (state.ruleData || []).find((n) => n.id === ruleId);
    console.log("item", item);
    return (item || {}).name;
  };

  useEffect(() => {
    apiCallParams.set("page", state.page);
    apiCallParams.set("limit", state.limit);
    apiCallParams.set("sortBy", state.sortBy);
    apiCallParams.set("sortType", state.sortType);
    pageURL.search = apiCallParams.toString();
    setCurrentUrl(pageURL);
    callLocalBaseURL();
  }, []);

  const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));

  const requestSortData = async (sortBy, sortType) => {
    const { name } = state.searchValidation;
    const { startDate, endDate } = state;

    const formatStartDate = moment(startDate).format("DD-MM-yyyy HH:mm:ss");
    const formatEndDate = moment(endDate).format("DD-MM-yyyy HH:mm:ss");

    apiCallParams.set("page", state.page);
    apiCallParams.set("limit", state.limit);
    apiCallParams.set("sortBy", sortBy);
    apiCallParams.set("sortType", sortType);
    let tempArr = [];
    if (!isEmpty(name)) tempArr.push({ name });
    if (!isEmpty(startDate)) tempArr.push({ startDate: formatStartDate });
    if (!isEmpty(endDate)) tempArr.push({ endDate: formatEndDate });
    tempArr.map((p) => {
      for (var key in p) {
        if (p.hasOwnProperty(key)) {
          apiCallParams.set(key, p[key]);
        }
      }
    });
    let searchParam = apiCallParams.toString();
    pageURL.search = apiCallParams.toString();

    setCurrentUrl(pageURL);

    const result = await apigetUrl(
      `/insurance/commission/earned?` + searchParam
    );
    if (result.data.responseCode === "200") {
      setTimeout(() => {
        setState((prevState) => ({
          ...prevState,
          data: result.data.dataList,
          isLoading: false,
        }));
      }, 1000);
    } else {
      if (result.status === 401 || result.status === 402) {
        dispatch(verifyToken());
      } else {
        ippNotify.error(result.data.responseMessage);
        showLoader();
      }
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

  const handleChangeRowsPerPage = (event) => {
    let target = event.target;
    setState((prevState) => ({
      ...prevState,
      page: 1,
      isLoading: true,
    }));
    requestPageLimitCountChange(target.value);
  };

  const requestPageLimitCountChange = async (count) => {
    let res = "";

    apiCallParams.set("page", 1);
    apiCallParams.set("limit", count);
    apiCallParams.set("sortBy", state.sortBy);
    apiCallParams.set("sortType", state.sortType);

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
      if (result.status === 401 || result.status === 402) {
        dispatch(verifyToken());
      } else {
        ippNotify.error(result.data.responseMessage);
        showLoader();
      }
    }
  };

  const isSelectedFunc = (id) => {
    return state.selected.indexOf(id) !== -1;
  };

  const classes = useStyles();

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

  const handleStartDate = (date) => {
    setState((prevState) => ({
      ...prevState,
      startDate: date,
      isEndDateDisabled: false,
    }));
  };

  //Handle Policy Issue End Date
  const handleEndDate = (date) => {
    setState((prevState) => ({
      ...prevState,
      endDate: date,
    }));
  };

  const handleAdvancedSearchOnChange = (event) => {
    const { name, value } = event.target;
    if (value) {
      setState((prevState) => ({
        ...prevState,
        searchValidation: {
          name: value,
        },
      }));
    } else if (!value) {
      setState((prevState) => ({
        ...prevState,
        searchValidation: {
          name: value,
        },
      }));
    }
  };

  const isEmpty = (str) => {
    return !str || 0 === str.length;
  };

  const handleApplyClick = (e) => {
    apiCallParams.delete("name");
    apiCallParams.delete("startDate");
    apiCallParams.delete("endDate");
    e.preventDefault();

    const { name } = state.searchValidation;
    const { startDate, endDate } = state;

    const formatStartDate = moment(startDate).format("DD-MM-yyyy HH:mm:ss");
    const formatEndDate = moment(endDate).format("DD-MM-yyyy HH:mm:ss");

    let tempArr = [];
    if (!isEmpty(name)) tempArr.push({ name });
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
    });

    pageURL.search = apiCallParams.toString();
    search(apiCallParams.toString());
  };

  const handleResetClick = async (e) => {
    e.preventDefault();
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    apiCallParams.set("page", 1);
    apiCallParams.set("limit", state.limit);
    apiCallParams.set("sortBy", state.sortBy);
    apiCallParams.set("sortType", state.sortType);
    apiCallParams.delete("name");
    apiCallParams.delete("startDate");
    apiCallParams.delete("endDate");

    pageURL.search = apiCallParams.toString();

    const result = await apigetUrl(
      `/insurance/commission/earned?page=${1}&limit=${state.limit}`
    );
    if (result.data.responseCode === "200") {
      setTimeout(() => {
        console.log("resetData-123", result);
        setState((prevState) => ({
          ...prevState,
          advancedSearchValidationErrors: {},
          isAdvancedSearchValidationText: false,
          searchValidation: {
            name: "",
          },
          startDate: null,
          endDate: null,
          isLoading: false,
        }));

        setResetData(result.data.dataList);
        setPageNumber(1);
        setPageCount(result.data.pagination.count);
        setCurrentUrl(pageURL);
      }, 1000);
    } else {
      if (result.status === 401 || result.status === 402) {
        dispatch(verifyToken());
      } else {
        ippNotify.error(result.data.responseMessage);
        showLoader();
      }
    }
  };

  const onAdvancedSearchClickClean = () => {
    setState((prevState) => ({
      ...prevState,
      advancedSearchValidationErrors: {},
      isAdvancedSearchValidationText: false,
      searchValidation: {
        name: "",
      },
      startDate: null,
      endDate: null,
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
    const { name } = state.searchValidation;
    const { startDate, endDate } = state;
    if (!isEmpty(name)) {
    } else {
      apiCallParams.delete("name");
    }
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
      if (result.status === 401 || result.status === 402) {
        dispatch(verifyToken());
      } else {
        ippNotify.error(result.data.responseMessage);
        showLoader();
      }
    }
  };

  const search = async (searchURL) => {
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    const result = await apigetUrl(`/insurance/commission/earned?` + searchURL);
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
      if (result.status === 401 || result.status === 402) {
        dispatch(verifyToken());
      } else {
        setState((prevState) => ({
          ...prevState,

          isInfoAlert: true,
          infoMsg: "Your query did not match any results",
          to: 0,
          pageCount: 0,
          isLoading: false,
        }));
      }
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
      if (result.status === 401 || result.status === 402) {
        dispatch(verifyToken());
      } else {
        ippNotify.error(result.data.responseMessage);
        showLoader();
      }
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
              <div className="row">
                <div className="col-lg-4"></div>
                <div className="col-lg-4"></div>
                <div className="col-lg-4">
                  <IPPNotification />
                </div>
              </div>
              <div className="audit-master-box">
                <EnhancedTableToolbar
                  name={state.searchValidation.name}
                  startDate={state.startDate}
                  endDate={state.endDate}
                  isEndDateDisabled={state.isEndDateDisabled}
                  handleStartDate={handleStartDate}
                  handleEndDate={handleEndDate}
                  handleAdvancedSearchOnChange={handleAdvancedSearchOnChange}
                  pageCount={state.pageCount}
                  setAdvancedSearchData={setAdvancedSearchData}
                  setResetData={setResetData}
                  page={state.page}
                  pageCount={state.pageCount}
                  limit={state.limit}
                  to={state.limit}
                  rowsPerPage={state.rowsPerPage}
                  sortBy={state.sortBy}
                  sortType={state.sortType}
                  callLocalBaseURL={callLocalBaseURL}
                  handleApplyClick={handleApplyClick}
                  handleResetClick={handleResetClick}
                  advancedSearchValidationErrors={
                    state.advancedSearchValidationErrors
                  }
                  isAdvancedSearchValidationText={
                    state.isAdvancedSearchValidationText
                  }
                  handleAutoCompleteInputReset={
                    state.handleAutoCompleteInputReset
                  }
                  onAdvancedSearchClickClean={onAdvancedSearchClickClean}
                />

                <div className="flex-auto">
                  <div className="table-responsive-material">
                    <Table>
                      <EnhancedTableHead
                        order={state.sortType}
                        orderBy={state.sortBy}
                        onRequestSort={handleRequestSort}
                        rowCount={state.data.length}
                        headCell={state.headCells}
                      />
                      {state.isLoading ? <Loader /> : null}
                      {state.isInfoAlert === true ||
                      (state.data.length === 0 && state.isLoading === false) ? (
                        <InfoModal
                          className="commissionLedger"
                          message="Your query did not match any results"
                        />
                      ) : (
                        <TableBody>
                          {(state.data || []).map((n) => {
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
                                <TableCell>{getRuleName(n.ruleId)}</TableCell>
                                <TableCell>
                                  {currencyFormater(n.amount)}
                                </TableCell>
                                <TableCell>{n.createdDate}</TableCell>
                                {state.auditEventId >= 1 ? (
                                  <>
                                    <TableCell padding="none">
                                      <Tooltip title="View Audit Timeline">
                                        <IconButton
                                          style={{ marginLeft: "10%" }}
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
    </>
  );
}

export default App;
