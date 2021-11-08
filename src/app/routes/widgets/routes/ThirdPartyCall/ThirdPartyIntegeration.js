import React, { useState, useEffect } from "react";
import InfoModal from "../Modal/Info";
import { useHistory, Link, useLocation } from "react-router-dom";
import { Avatar } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
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
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import IntlMessages from "util/IntlMessages";
import InputCancelButton from "../CommonComponents/CancelButton";
import EnhancedTableHead from "../CommonComponents/TableHeadComponent";
import { apigetUrl } from "../../../../../setup/middleware";
import VisibilityIcon from "@material-ui/icons/Visibility";
import {
  IPPNotification,
  ippNotify,
} from "../CommonComponents/IPPNotification";
import { getRecordsPerPage } from "../../../../../setup/ApplicatoinConfigurations.js";
import "../CommonComponents/tableStyle.css";
import JSONInput from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/en";

const TPIIntegeration = ({ selectedId, closeTPIIntegration }) => {
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
    rowsPerPage: 5,
    data: [],
    sortType: "asc",
    sortBy: "requestDate",
    isSortAsc: true,
    from: 1,
    to: 0,
    pageCount: 0,
    data: [],
    editForm_DialogOpen: false,
    RequestPayLoad: {},
    ResponsePayLoad: {},
    headCells: [
      {
        id: "name",
        isActive: false,
        label: "thirdpartycall.name",
      },
      {
        id: "productName",
        isActive: false,
        label: "thirdpartycall.productName",
      },
      {
        id: "logo",
        isActive: false,
        label: "thirdpartycall.Logo",
      },
      {
        id: "cover",
        isActive: false,
        label: "thirdpartycall.cover",
      },
      {
        id: "Premium",
        isActive: false,
        label: "thirdpartycall.Premium",
      },
      {
        id: "settlementRatio",
        isActive: false,
        label: "thirdpartycall.SettlementRatio",
      },
      {
        id: "status",
        isActive: false,
        label: "thirdpartycall.Status",
      },
      {
        id: "actions",
        isActive: false,
        label: "thirdpartycall.Actions",
      },
    ],
  });

  useEffect(() => {
    loadProductDetails();
  }, []);

  //load Product Details
  const loadProductDetails = () => {
    apigetUrl(`/insurance/enquiry/${selectedId}/quotes`)
      .then((res) => {
        console.log("res", res);
        if (`${res.status}` === "500") {
          ippNotify.error(res.statusText);
        }
        if (`${res.status}` === "401") {
          ippNotify.error(res.data.responseMessage);
        }
        let response = res.data.quotes || [];
        console.log("data result:::::" + JSON.stringify(response));
        setState((prevState) => ({
          ...prevState,
          data: response,
        }));
      })
      .catch((err) => console.log("err", err));
  };

  let history = useHistory();

  //set Advanced Search Data
  const setAdvancedSearchData = (data) => {
    setState((prevState) => ({
      ...prevState,
      data: data,
      page: 1,
      from: 1,
      to: state.limit,
    }));
  };

  //on Table Edit View Button Click
  const onTableEditViewButtonClick = async (event) => {
    let quoteID = event.currentTarget.id;
    let quotationData = state.data;
    let quatationFilter = quotationData.filter(
      (a) => a.id === parseInt(quoteID)
    );
    if (quatationFilter.length > 0) {
      let productKey = quatationFilter[0].key;
      const result = await apigetUrl(
        `/tpi/${productKey}/payload/response-quotation/${quoteID}`
      );
      const jsonResponse = result.data;
      let jsonType = typeof jsonResponse;
      let request = {};
      let response = {};
      if (jsonType === "object") {
        if ("requestPayload" in jsonResponse) {
          request = JSON.parse(jsonResponse.requestPayload);
        } else {
          request = { Request: "No Request Available" };
        }
        if ("responsePayload" in jsonResponse) {
          response = JSON.parse(jsonResponse.responsePayload);
        } else {
          response = { Response: "No Response Available" };
        }
      } else {
        request = { Request: "No Request Available" };
        response = { Response: "No Response Available" };
      }

      setState((prevState) => ({
        ...prevState,
        editForm_DialogOpen: true,
        RequestPayLoad: request,
        ResponsePayLoad: response,
      }));
    }
  };

  //handle Edit Form RequestClose
  const handle_Edit_Form_RequestClose = () => {
    setState((prevState) => ({
      ...prevState,
      editForm_DialogOpen: false,
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

  //set CurrentUrl
  const setCurrentUrl = (currentUrl) => {
    setState((prevState) => ({
      ...prevState,
      currentUrl,
    }));
  };

  //handle Request Sort
  const handleRequestSort = (event, property) => {
    const isAsc = state.sortBy === property && state.sortType === "desc";
    let currentSortOrder = isAsc ? "asc" : "desc";
    setState((prevState) => ({
      ...prevState,
      sortType: isAsc ? "asc" : "desc",
      sortBy: property,
    }));
    //requestSortData(property, currentSortOrder);
  };

  //is Selected Func
  const isSelectedFunc = (id) => {
    return state.selected.indexOf(id) !== -1;
  };

  //handle Change Rows PerPage
  const handleChangeRowsPerPage = (event) => {
    let target = event.target;
    setState((prevState) => ({
      ...prevState,
      limit: target.value,
      page: 1,
    }));
    //requestPageLimitCountChange(target.value);
  };

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

  //status Value
  const statusValue = (status) => {
    switch (status) {
      case 0:
        return "Pending";
      case 1:
        return "Success";
      case 2:
        return "Failure";
    }
  };

  //status Icon
  const statusIcon = (status) => {
    switch (status) {
      case 0:
        return "- -";
      case 1:
        return "₹";
      case 2:
        return "- -";
    }
  };

  //status Color
  const statusColor = (status) => {
    switch (status) {
      case 0:
        return "orange";
      case 1:
        return "green";
      case 2:
        return "red";
    }
  };

  //status Percentage
  const statusPer = (status) => {
    switch (status) {
      case 0:
        return "- -";
      case 1:
        return "%";
      case 2:
        return "- -";
    }
  };

  //status Empty
  const statusEmpty = (status) => {
    switch (status) {
      case 0:
        return "- -";
      case 1:
        return " ";
      case 2:
        return "- -";
    }
  };

  //edit
  const editTableContent = (
    <>
      <DialogContent>
        <div className="row">
          <div className="col-lg-6">
            <div style={{ height: "100%" }}>
              <fieldset>
                <legend class="fieldLegend">
                  <IntlMessages id="thirdpartycall.Request" />
                </legend>
                <JSONInput
                  id="a_unique_id"
                  name="integrationDetails"
                  placeholder={state.RequestPayLoad}
                  theme="dark_vscode_tribute"
                  locale={locale}
                  style={{
                    outerBox: {
                      height: "inherit",
                      padding: "5px",
                      width: "auto",
                    },
                    container: {
                      height: "inherit",
                      width: "auto",
                    },
                  }}
                />
              </fieldset>
            </div>
          </div>
          <div className="col-lg-6">
            <div style={{ height: "100%" }}>
              <fieldset>
                <legend class="fieldLegend">
                  <IntlMessages id="thirdpartycall.Response" />
                </legend>
                <JSONInput
                  id="a_unique_id"
                  name="integrationDetails"
                  placeholder={state.ResponsePayLoad}
                  theme="dark_vscode_tribute"
                  locale={locale}
                  style={{
                    outerBox: {
                      height: "inherit",
                      padding: "5px",
                      width: "auto",
                    },
                    container: {
                      height: "inherit",
                      width: "auto",
                    },
                  }}
                />
              </fieldset>
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <InputCancelButton onClick={(e) => handle_Edit_Form_RequestClose(e)} />
      </DialogActions>
    </>
  );

  return (
    <>
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
              <div className="flex-auto">
                <IPPNotification
                  action="action"
                  onclick="window.history.go(-1); return false;"
                  type="submit"
                  value="Cancel"
                />
                <div className="table-responsive-material">
                  <div style={{ margin: "0px 0px 20px 0px" }}>
                    <button
                      style={{ border: "none", backgroundColor: "transparent" }}
                      onClick={(e) => closeTPIIntegration(e)}
                    >
                      <ArrowBackIcon />
                    </button>
                  </div>
                  <Table>
                    <EnhancedTableHead
                      // order={state.sortType}
                      // orderBy={state.sortBy}
                      // onRequestSort={handleRequestSort}
                      // rowCount={state.data.length}
                      // numSelected={state.selected.length}
                      order={state.sortType}
                      orderBy={state.sortBy}
                      // onRequestSort={handleRequestSort}
                      rowCount={state.data.length}
                      headCell={state.headCells}
                    />

                    {state.isInfoAlert === true || state.data.length === 0 ? (
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
                              <TableCell>{n.name}</TableCell>
                              <TableCell>{n.productName}</TableCell>
                              <TableCell>
                                {/* <img height="60px" src={n.logo} /> */}
                                <Avatar
                                  alt="..."
                                  src={n.logo}
                                  className="user-avatar "
                                />
                              </TableCell>
                              <TableCell>
                                {statusIcon(n.status)} {n.data.cover}
                              </TableCell>
                              <TableCell>
                                {n.data.premium}
                                {statusEmpty(n.status)}
                              </TableCell>
                              <TableCell className="space-left">
                                {n.data.settlementRatio} {statusPer(n.status)}
                              </TableCell>
                              <TableCell
                                style={{ color: statusColor(n.status) }}
                              >
                                {statusValue(n.status)}
                              </TableCell>
                              <TableCell padding="none">
                                <Tooltip
                                  title={
                                    <IntlMessages id="ThirdPartyCall.Tooltip.Req-Resp" />
                                  }
                                >
                                  <IconButton
                                    style={{ marginLeft: "10%" }}
                                    id={n.id}
                                    onClick={(e) =>
                                      onTableEditViewButtonClick(e)
                                    }
                                  >
                                    <VisibilityIcon color="primary" />
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
                          // getPageFromBackEnd={getPageFromBackEnd}
                          // handleBackButtonClick={handleBackButtonClick}
                          // handleNextButtonClick={handleNextButtonClick}
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
      <Dialog
        maxWidth="sm"
        open={state.editForm_DialogOpen}
        onClose={handle_Edit_Form_RequestClose}
      >
        {editTableContent}
      </Dialog>
    </>
  );
};

export default TPIIntegeration;
