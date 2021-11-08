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
  Grid,
  Table,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import IntlMessages from "util/IntlMessages";
import EnhancedTableHead from "../CommonComponents/TableHeadComponent";
import EnhancedTableToolbar from "./EnhancedTableToolbar";
import Joi from "joi-browser";
import { apigetUrl } from "../../../../../setup/middleware";
import EditAgentMapping from "./EditAgentMapping";
import {
  IPPNotification,
  ippNotify,
} from "../CommonComponents/IPPNotification";
import { getRecordsPerPage } from "../../../../../setup/ApplicatoinConfigurations.js";
import "../CommonComponents/tableStyle.css";
import AuditTimeline from "../CommonComponents/AuditTimeline/AuditTimeline";
import { Visibility } from "@material-ui/icons";
import Loader from "../CommonComponents/Loader";

const baseURL = `${process.env.REACT_APP_BASE_URL}`;
const perPageURL = `/auth/users`;
const pageURL = new URL(baseURL + perPageURL);
let apiCallParams = new URLSearchParams(pageURL.search);

let pageNumber = 1;

//advance search
const schema = {
  username: Joi.string()
    .required()
    .label("username"),
  firstName: Joi.string()
    .required()
    .label("firstName"),
  lastName: Joi.string()
    .required()
    .label("lastName"),
  email: Joi.string()
    .required()
    .label("email"),
};

function App() {
  //set advanced search data
  const setAdvancedSearchData = (data) => {
    setState((prevState) => ({
      ...prevState,
      data: data,
      page: 1,
      from: 1,
      to: state.limit,
    }));
  };

  //set reset
  const setResetData = (data) => {
    setState((prevState) => ({
      ...prevState,
      data: data,
      page: 1,
      from: 1,
      to: state.limit,
    }));
  };

  //set advanced search error
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

  //set current url
  const setCurrentUrl = (currentUrl) => {
    setState((prevState) => ({ ...prevState, currentUrl }));
  };

  const [state, setState] = useState({
    isLoading: true,
    isAddUserManagementActive: false,
    isRoCAgentActive: false,
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
    sortBy: "username",
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
      username: "",
      firstName: "",
      lastName: "",
      email: "",
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
    selectedId: "",
    keyclockid: "",
    isAuditTimelineActive: false,
    eventId: "",
    referenceId: "",
    auditEventId: "",
    headCells: [
      {
        id: "Name",
        isActive: false,
        label: "RoCAgent.master.tableheader.firstname.label",
      },
      {
        id: "EmailId",
        isActive: false,
        label: "RoCAgent.master.tableheader.lastname.label",
      },
      {
        id: "mobileno",
        isActive: false,
        label: "RoCAgent.master.tableheader.email.label",
      },
      {
        id: "Role",
        isActive: false,
        label: "RoCAgent.master.tableheader.mobile.label",
      },
      {
        id: "actions",
        isActive: false,
        label: "RoCAgent.master.tableheader.Action.label",
      },
    ],
  });

  //edit button click
  const onTableEditButtonClick = async (event, id, id2) => {
    setState((prevState) => ({
      ...prevState,
      isRoCAgentActive: true,
      selectedId: id,
      keyclockid: id2,
    }));
  };

  //load default function
  useEffect(() => {
    apiCallParams.set("page", state.page);
    apiCallParams.set("limit", state.limit);
    apiCallParams.set("sortBy", state.sortBy);
    apiCallParams.set("sortType", state.sortType);
    pageURL.search = apiCallParams.toString();

    setCurrentUrl(pageURL);
    callLocalBaseURL();
  }, []);

  //load agent details
  const callLocalBaseURL = async () => {
    const result = await apigetUrl(
      `/auth/users?page=${state.page}&limit=${state.limit}`
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
          auditEventId: result.data.auditEventId,
          isLoading: false,
        }));
      }, 1000);
    } else {
      ippNotify.error(result.data.responseMessage);
      showLoader();
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

  //sort functionality
  const requestSortData = async (sortBy, sortType) => {
    apiCallParams.set("page", state.page);
    apiCallParams.set("limit", state.limit);
    apiCallParams.set("sortBy", sortBy);
    apiCallParams.set("sortType", sortType);
    const { username, firstName, lastName, email } = state.searchValidation;
    if (!isEmpty(username)) {
      apiCallParams.set("username", username);
    } else {
      apiCallParams.delete("username");
    }
    if (!isEmpty(firstName)) {
      apiCallParams.set("firstName", firstName);
    } else {
      apiCallParams.delete("firstName");
    }
    if (!isEmpty(lastName)) {
      apiCallParams.set("lastName", lastName);
    } else {
      apiCallParams.delete("lastName");
    }
    if (!isEmpty(email)) {
      apiCallParams.set("email", email);
    } else {
      apiCallParams.delete("email");
    }

    pageURL.search = apiCallParams.toString();

    setCurrentUrl(pageURL);

    const result = await apigetUrl(
      `/auth/users?page=${state.page}&limit=${state.limit}&sortBy=${sortBy}&sortType=${sortType}`
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
      ippNotify.error(result.data.responseMessage);
      showLoader();
    }
  };

  //handle sort request
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

  //handle select all click
  const handleSelectAllClick = (event, checked) => {
    if (checked) {
      setState({ selected: state.data.map((n) => n.id) });
      return;
    }
    setState({ selected: [] });
  };

  //page limit functionality
  const requestPageLimitCountChange = async (count) => {
    let res = "";

    apiCallParams.set("page", 1);
    apiCallParams.set("limit", count);
    apiCallParams.set("sortBy", state.sortBy);
    apiCallParams.set("sortType", state.sortType);
    const { username, firstName, lastName, email } = state.searchValidation;
    if (!isEmpty(username)) {
      apiCallParams.set("username", username);
    } else {
      apiCallParams.delete("username");
    }
    if (!isEmpty(firstName)) {
      apiCallParams.set("firstName", firstName);
    } else {
      apiCallParams.delete("firstName");
    }
    if (!isEmpty(lastName)) {
      apiCallParams.set("lastName", lastName);
    } else {
      apiCallParams.delete("lastName");
    }
    if (!isEmpty(email)) {
      apiCallParams.set("email", email);
    } else {
      apiCallParams.delete("email");
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
        pageNumber = 1;
      }, 1000);
    } else {
      ippNotify.error(result.data.responseMessage);
      showLoader();
    }
  };

  //is selected
  const isSelectedFunc = (id) => {
    return state.selected.indexOf(id) !== -1;
  };

  //handle change row per page
  const handleChangeRowsPerPage = (event) => {
    let target = event.target;
    setState((prevState) => ({
      ...prevState,
      page: 1,
      isLoading: true,
    }));
    requestPageLimitCountChange(target.value);
  };

  //validate property
  const validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const propertySchema = { [name]: schema[name] };
    const { error } = Joi.validate(obj, propertySchema);
    return error ? error.details[0].message : null;
  };

  //check for empty obj functionality
  function isObjEmpty(obj) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }

    return JSON.stringify(obj) === JSON.stringify({});
  }

  //check all felids populated
  const checkAreAllEditFormFieldsPopulated = (obj) => {
    return !Object.values(obj).some((x) => x === "");
  };

  //set page data
  const setPageData = (data) => {
    setState((prevState) => ({
      ...prevState,
      data: data,
    }));
  };

  //close edit screen for roc agent
  const closeEditRoCAgent = () => {
    setState((prevState) => ({
      ...prevState,
      isRoCAgentActive: false,
    }));
  };

  //set page number
  const setPageNumber = (pageNumber) => {
    setState((prevState) => ({
      ...prevState,
      page: pageNumber,
    }));
  };

  //set page count
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

  //update form
  const update_from = (from) => {
    setState((prevState) => ({
      ...prevState,
      from: from,
    }));
  };

  //success message for add functionality
  const getSuccessUpdate = () => {
    ippNotify.success(" Successfully New User is Added");
  };

  //error message for add functionality
  const getErrorUpdate = (err) => {
    let error = err.data.responseMessage;
    ippNotify.error(error);
  };

  //success message for edit functionality
  const getEditSuccessUpdate = () => {
    ippNotify.success(" Successfully Updated");
  };

  //error message for edit functionality
  const getEditErrorUpdate = (err) => {
    let error = err.data.responseMessage;
    ippNotify.error(error);
  };

  //set search property
  const setSearchedProperty = (searchProperty) => {
    setState((prevState) => ({
      ...prevState,
      searchedProperty: searchProperty,
    }));
  };

  //handle input change
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

  const isEmpty = (str) => {
    return !str || 0 === str.length;
  };

  //handle search click
  const handleSearchClick = (e) => {
    apiCallParams.delete("name");
    apiCallParams.delete("username");
    apiCallParams.delete("firstName");
    apiCallParams.delete("lastName");
    apiCallParams.delete("email");
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

    const { username, firstName, lastName, email } = state.searchValidation;
    let tempArr = [];
    if (!isEmpty(username)) tempArr.push({ username });
    if (!isEmpty(firstName)) tempArr.push({ firstName });
    if (!isEmpty(lastName)) tempArr.push({ lastName });
    if (!isEmpty(email)) tempArr.push({ email });

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

  //pagination functionality
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

    const { username, firstName, lastName, email } = state.searchValidation;
    if (!isEmpty(username)) {
      apiCallParams.set("username", username);
    } else {
      apiCallParams.delete("username");
    }
    if (!isEmpty(firstName)) {
      apiCallParams.set("firstName", firstName);
    } else {
      apiCallParams.delete("firstName");
    }
    if (!isEmpty(lastName)) {
      apiCallParams.set("lastName", lastName);
    } else {
      apiCallParams.delete("lastName");
    }
    if (!isEmpty(email)) {
      apiCallParams.set("email", email);
    } else {
      apiCallParams.delete("email");
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

  //search functionality
  const search = async (searchURL) => {
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    const result = await apigetUrl(`/auth/users?` + searchURL);
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
    }
  };

  //reset
  const callResetData = async () => {
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    apiCallParams.set("page", 1);
    apiCallParams.set("limit", state.limit);
    apiCallParams.set("sortBy", state.sortBy);
    apiCallParams.set("sortType", state.sortType);
    apiCallParams.delete("name");
    apiCallParams.delete("userName");
    apiCallParams.delete("firstName");
    apiCallParams.delete("lastName");
    apiCallParams.delete("email");

    pageURL.search = apiCallParams.toString();

    const result = await apigetUrl(
      `/auth/users?page=${state.page}&limit=${state.limit}&sortBy=${state.sortBy}&sortType=${state.sortType}`
    );
    if (result.data.responseCode === "200") {
      setTimeout(() => {
        setState((prevState) => ({
          ...prevState,
          searchValidation: {
            username: "",
            firstName: "",
            lastName: "",
            email: "",
          },
          isInfoAlert: false,
          isAdvancedSearchValidationText: true,
          errors: {},
          isLoading: false,
        }));
      }, 1000);
      setResetData(result.data.dataList);
      setPageNumber(1);
      setPageCount(result.data.pagination.count);
      setCurrentUrl(pageURL);
    } else {
      ippNotify.error(result.data.responseMessage);
      showLoader();
    }
  };

  //on advanced search click clean up
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

  return (
    <React.Fragment>
      {state.isAuditTimelineActive ? (
        <AuditTimeline
          closeAuditTimeline={handleCloseAuditTimeline}
          eventId={state.eventId}
          referenceId={state.referenceId}
        />
      ) : state.isRoCAgentActive === true ? (
        <div>
          <EditAgentMapping
            getEditSuccessUpdate={getEditSuccessUpdate}
            getEditErrorUpdate={getEditErrorUpdate}
            closeEditRoCAgent={closeEditRoCAgent}
            callLocalBaseURL={callLocalBaseURL}
            selectedId={state.selectedId}
            keyclockid={state.keyclockid}
          />
        </div>
      ) : (
        <div className="App">
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
                  numSelected={state.selected.length}
                  page={state.page}
                  limit={state.limit}
                  sortBy={state.sortBy}
                  sortType={state.sortType}
                  setAdvancedSearchData={setAdvancedSearchData}
                  setResetData={setResetData}
                  getSuccessUpdate={getSuccessUpdate}
                  getErrorUpdate={getErrorUpdate}
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
                              <TableRow key={n.id}>
                                <TableCell>{n.firstName}</TableCell>
                                <TableCell>{n.lastName}</TableCell>
                                <TableCell>{n.email}</TableCell>
                                <TableCell>{n.mobileNumber}</TableCell>
                                <TableCell padding="none">
                                  <Tooltip
                                    title={
                                      <IntlMessages id="AgentMapping.Tooltip.Edit" />
                                    }
                                  >
                                    <IconButton
                                      id={n.username}
                                      onClick={(e) =>
                                        onTableEditButtonClick(
                                          e,
                                          n.username,
                                          n.keyCloakId
                                        )
                                      }
                                    >
                                      <EditIcon color="primary" />
                                    </IconButton>
                                  </Tooltip>
                                  {state.auditEventId >= 1 ? (
                                    <Tooltip
                                      title={
                                        <IntlMessages id="AgentMapping.Tooltip.View" />
                                      }
                                    >
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
    </React.Fragment>
  );
}

export default App;
