import React from "react";
import "./style.css";
import Drawer from "@material-ui/core/Drawer";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import Button from "@material-ui/core/Button";
import { withRouter } from "react-router-dom";
import ListItem from "./ListItem";
import ListCompareItem from "./ListCompareItem";
// import { data } from "./data";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import axios from "axios";
import apiInstance from "setup/index";
import InfoModal from "app/routes/widgets/routes/Modal/Info";
import Search from "./Search";
import { apigetUrl } from "setup/middleware";
import { totalRevenueData } from "app/routes/dashboard/routes/CRM/data";
import Tooltip from "@material-ui/core/Tooltip";
import {
  IPPNotification,
  ippNotify,
} from "app/routes/widgets/routes/CommonComponents/IPPNotification";

import Chip from "@material-ui/core/Chip";
import Badge from "@material-ui/core/Badge";
import IntlMessages from "util/IntlMessages";

const baseURL = `${process.env.REACT_APP_BASE_URL}`;

var store = "";

class ProductList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      top: false,
      left: false,
      bottom: false,
      right: false,
      curCompareCount: 0,
      compareData: [
        {
          pos: 1,
          idx: -1,
        },
        {
          pos: 2,
          idx: -1,
        },
        {
          pos: 3,
          idx: -1,
        },
      ],
      products: [],
      product1: "",
      product2: "",
      product3: "",
      data: [],
      status: "",
      productId: 0,

      data1: 0,
      enquiryId: 0,
      selectButton: false,
      compareButton: false,
      isCompareDisabled: false,
      isInfoAlert: false,
      advanceSearchData: [],
      price: [],
      minPrice: "",
      maxPrice: "",
      ratio: [],
      minRatio: "",
      maxRatio: "",
      providers: [],
      providerId: [],
      selectedProvider: [],
      checkedA: false,
      isActive: false,
      filtersData: [],
    };
  }

  componentDidMount() {
    store = setInterval(() => {
      this.callLocalBaseURL();
    }, 5000);

    this.callLocalBaseURL();
    this.callFiltersData();
    setTimeout(() => {
      this.callBackFiltersData();
    }, 100);
  }

  componentWillUnmount() {
    clearInterval(store);
  }

  callLocalBaseURL() {
    if (
      this.props.location.state ||
      (this.props.location.state || {}).isActive === false
    ) {
      apigetUrl(`/insurance/enquiry/${this.props.location.state.id}/quotes`)
        .then((res) => {
          console.log("res", res);
          if (`${res.status}` === "500") {
            ippNotify.error(res.statusText);
          }
          if (`${res.status}` === "401") {
            ippNotify.error(res.data.responseMessage);
          }
          let response = res.data.quotes || [];
          let resData = (response || []).map((obj) => {
            let oldObj = this.state.data.find((o) => o.id === obj.id);
            if (oldObj) {
              obj.isChecked = oldObj.isChecked || false;
            } else {
              obj.isChecked = false;
            }
            return obj;
          });

          //dynamic setting Min and Max (price and ratio) value setting
          let minPrice =
            Math.floor(((res.data || {}).filtersData || {}).minPremium) || 0;

          let maxPrice =
            Math.round(((res.data || {}).filtersData || {}).maxPremium) || 0;

          let priceRange = [minPrice, maxPrice];

          let minRatio =
            Math.floor(((res.data || {}).filtersData || {}).minSettlement) || 0;

          let maxRatio =
            Math.ceil(((res.data || {}).filtersData || {}).maxSettlement) || 0;

          let ratioRange = [minRatio, maxRatio];

          let providerData = ((res.data || {}).filtersData || {}).providers;

          this.setState((prevState) => ({
            ...prevState,
            data: resData,
            data1: (response && response[0] && response[0].id) || null,
            status: (response && response.map((n) => n.status)) || [],
            productId: (res.data && res.data.productId) || null,

            filtersData: res.data.filtersData,
            // price: priceRange,
            minPrice: minPrice,
            maxPrice: maxPrice,
            // ratio: ratioRange,
            minRatio: minRatio,
            maxRatio: maxRatio,
            providers: providerData,
          }));
        })
        .catch((err) => console.log("err", err));
    } else {
      console.log("Enquiry id is not present");
      this.setState((prevState) => ({
        ...prevState,
        isInfoAlert: true,
      }));
    }
  }

  callFiltersData() {
    if (this.props.location.state) {
      apigetUrl(`/insurance/enquiry/${this.props.location.state.id}/quotes`)
        .then((res) => {
          console.log("res", res);
          if (`${res.status}` === "500") {
            ippNotify.error(res.statusText);
          }

          let minPrice = Math.floor(
            ((res.data || {}).filtersData || {}).minPremium || 0
          );
          let maxPrice =
            Math.round(((res.data || {}).filtersData || {}).maxPremium) || 0;

          let priceRange = [minPrice, maxPrice];

          let minRatio =
            Math.floor(((res.data || {}).filtersData || {}).minSettlement) || 0;
          let maxRatio =
            Math.ceil(((res.data || {}).filtersData || {}).maxSettlement) || 0;

          let ratioRange = [minRatio, maxRatio];
          console.log("ratioRange", ratioRange);

          let providerData = ((res.data || {}).filtersData || {}).providers;

          this.setState((prevState) => ({
            ...prevState,
            filtersData: res.data.filtersData,
            price: priceRange,
            ratio: ratioRange,
            // minPrice: minPrice,
            // maxPrice: maxPrice,
            // minRatio: minRatio,
            // maxRatio: maxRatio,
            // providers: providerData,
          }));
        })
        .catch((err) => console.log("err", err));
    } else {
      console.log("Enquiry id is not present");
      this.setState((prevState) => ({
        ...prevState,
        isInfoAlert: true,
      }));
    }
  }

  callBackFiltersData() {
    if ((this.props.location.state || {}).isActive) {
      const {
        id,
        price,
        ratio,
        providerId,
        checkedA,
      } = this.props.location.state;
      console.log("id", id);
      console.log("price", price);
      console.log("ratio", ratio);
      console.log("providers", providerId);

      let id_params = (providerId || [])
        .map((id) => {
          return `${id}`;
        })
        .join(",");

      apigetUrl(
        `/insurance/enquiry/${id}/quotes?minPremium=${price[0]}&maxPremium=${price[1]}&minSettlement=${ratio[0]}&maxSettlement=${ratio[1]}&providerIds=${id_params}&excludeErrors=${checkedA}`
      )
        .then((res) => {
          console.log("res", res);
          if (`${res.status}` === "500") {
            ippNotify.error(res.statusText);
          }
          let response = res.data.quotes;
          let resData = (response || []).map((obj) => {
            let oldObj = this.state.data.find((o) => o.id === obj.id);
            if (oldObj) {
              obj.isChecked = oldObj.isChecked || false;
            } else {
              obj.isChecked = false;
            }
            return obj;
          });
          if (`${res.status}` === "404") {
            this.setState((prevState) => ({
              ...prevState,
              isInfoAlert: true,
            }));
          }
          this.setState((prevState) => ({
            ...prevState,
            advanceSearchData: resData,
            left: false,
            // isActive: true,
            isActive: this.props.location.state.isActive,
            checkedA: this.props.location.state.checkedA,
            id: this.props.location.state.enquiryId,
            price: this.props.location.state.price,
            minPrice: this.props.location.state.minPrice,
            maxPrice: this.props.location.state.maxPrice,
            ratio: this.props.location.state.ratio,
            minRatio: this.props.location.state.minRatio,
            maxRatio: this.props.location.state.maxRatio,
            providers: this.props.location.state.providers,
            providerId: this.props.location.state.providerId,
            selectedProvider: this.props.location.state.selectedProvider,
          }));
        })
        .catch((err) => {
          console.log("err", err);
          this.setState((prevState) => ({
            ...prevState,
            left: false,
            isActive: false,
          }));
        });
    }
  }

  handleItemCheck = (side, open, indData) => {
    let { data } = this.state;
    var presentIndex = -1;
    var dataIndex = -1;
    var newIndexToSerertRecord;
    let doesNewItemInserted = false;

    for (var i = 0; i < this.state.compareData.length; i++) {
      if (this.state.compareData[i].idx !== -1) {
        if (this.state.compareData[i].data.id === indData.id) {
          presentIndex = i;
          break;
        }
      }
    }

    for (var i = 0; i < data.length; i++) {
      if (data[i].id === indData.id) {
        dataIndex = i;
      }
    }

    let { compareData, curCompareCount } = this.state;
    if (open) {
      for (let j = 0; j < compareData.length; j++) {
        if (compareData[j].idx === -1) {
          newIndexToSerertRecord = j;
          break;
        }
      }
      compareData.forEach((obj, i) => {});
      //If max count is not reached and not already in the array then add
      if (
        curCompareCount < 3 &&
        presentIndex === -1 &&
        newIndexToSerertRecord !== undefined
      ) {
        compareData[newIndexToSerertRecord].data = indData;
        compareData[newIndexToSerertRecord].idx = dataIndex;
        curCompareCount++;
        doesNewItemInserted = true;
      }

      data[dataIndex].isChecked =
        curCompareCount === 3 && !doesNewItemInserted ? false : open;
    } else {
      if (presentIndex !== -1) {
        // on un-check, reset the index & delete the appropriate data from 'compareData'
        compareData[presentIndex].idx = -1;
        delete compareData[presentIndex].data;
        curCompareCount--;
        data[dataIndex].isChecked = open;
      }
    }
    this.setState({
      [side]: open,
      selectButton: true,
      compareData,
      curCompareCount,
      data,
    });
  };

  handleAdvanceSearchItemCheck = (side, open, indData) => {
    // let { data } = this.state;
    let { advanceSearchData } = this.state;
    var presentIndex = -1;
    var dataIndex = -1;
    var newIndexToSerertRecord;
    let doesNewItemInserted = false;

    for (var i = 0; i < this.state.compareData.length; i++) {
      if (this.state.compareData[i].idx !== -1) {
        if (this.state.compareData[i].advanceSearchData.id === indData.id) {
          presentIndex = i;
          break;
        }
      }
    }

    for (var i = 0; i < advanceSearchData.length; i++) {
      if (advanceSearchData[i].id === indData.id) {
        dataIndex = i;
      }
    }

    let { compareData, curCompareCount } = this.state;
    if (open) {
      for (let j = 0; j < compareData.length; j++) {
        if (compareData[j].idx === -1) {
          newIndexToSerertRecord = j;
          break;
        }
      }
      compareData.forEach((obj, i) => {});
      //If max count is not reached and not already in the array then add
      if (
        curCompareCount < 3 &&
        presentIndex === -1 &&
        newIndexToSerertRecord !== undefined
      ) {
        compareData[newIndexToSerertRecord].advanceSearchData = indData;
        compareData[newIndexToSerertRecord].idx = dataIndex;
        curCompareCount++;
        doesNewItemInserted = true;
      }

      advanceSearchData[dataIndex].isChecked =
        curCompareCount === 3 && !doesNewItemInserted ? false : open;
    } else {
      if (presentIndex !== -1) {
        // on un-check, reset the index & delete the appropriate data from 'compareData'
        compareData[presentIndex].idx = -1;
        delete compareData[presentIndex].advanceSearchData;
        curCompareCount--;
        advanceSearchData[dataIndex].isChecked = open;
      }
    }
    this.setState({
      [side]: open,
      selectButton: true,
      compareData,
      curCompareCount,
      advanceSearchData,
    });
  };

  handleCheckPremium = (data) => () => {
    console.log("Click-quoteId", data.id);
    this.props.history.push({
      pathname: "/app/wireframes/health/data/",
      state: {
        enquiryid: (this.props.location.state || {}).id,
        quoteId: data.id,
      },
    });
  };

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    });
  };

  searchDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    });
  };

  handleClose = (e, indData) => {
    let { data, compareData, curCompareCount } = this.state;
    var presentIndex = -1;
    var dataIndex = -1;

    for (var i = 0; i < data.length; i++) {
      if (data[i].id === indData.id) {
        dataIndex = i;
      }
    }

    for (var i = 0; i < compareData.length; i++) {
      if (compareData[i].idx !== -1) {
        if (compareData[i].data.id === indData.id) {
          presentIndex = i;
          break;
        }
      }
    }
    if (presentIndex !== -1) {
      // delete the item from 'compateData' obj
      compareData[presentIndex].idx = -1;
      delete compareData[presentIndex].data;

      // decrease the count
      curCompareCount--;
      // after deleting from "compareData", we have to uncheck the itme from list
      data[dataIndex].isChecked = false;
    }
    this.setState({
      compareData,
      curCompareCount,
      data,
    });
  };

  handleCheckItem = () => {
    console.log("click");
    this.props.history.push({
      pathname: `/app/wireframes/health/compare/${this.state.compareData[0].idx}/${this.state.compareData[1].idx}/${this.state.compareData[2].idx}`,
      state: {
        enquiryId: this.props.location.state.id,
        product1: this.state.compareData[0].data,
        product2: this.state.compareData[1].data,
        product3: this.state.compareData[2].data,
        productId: this.state.productId,
        isActive: this.state.isActive,
      },
    });
  };

  handleAdvanceSearchCheckItem = () => {
    console.log("click");
    this.props.history.push({
      pathname: `/app/wireframes/health/compare/${this.state.compareData[0].idx}/${this.state.compareData[1].idx}/${this.state.compareData[2].idx}`,
      state: {
        enquiryId: this.props.location.state.id,
        product1: this.state.compareData[0].advanceSearchData,
        product2: this.state.compareData[1].advanceSearchData,
        product3: this.state.compareData[2].advanceSearchData,
        productId: this.state.productId,
        isActive: this.state.isActive,
        checkedA: this.state.checkedA,
        price: this.state.price,
        minPrice: this.state.minPrice,
        maxPrice: this.state.maxPrice,
        ratio: this.state.ratio,
        minRatio: this.state.minRatio,
        maxRatio: this.state.maxRatio,
        providers: this.state.providers,
        providerId: this.state.providerId,
        selectedProvider: this.state.selectedProvider,
      },
    });
  };

  handlePriceChange = (event, newValue) => {
    console.log("newValue", newValue);
    this.setState((prevState) => ({
      ...prevState,
      price: newValue,
    }));
  };

  handleRatioChange = (event, newValue) => {
    this.setState((prevState) => ({
      ...prevState,
      ratio: newValue,
    }));
  };

  handleChange = (event, value) => {
    console.log(
      "value-2",
      value.map((n) => n.id)
    );
    if (value.length !== 0) {
      this.setState((prevState) => ({
        ...prevState,
        providerId: (value || []).map((n) => n.id),
        selectedProvider: value,
      }));
    } else {
      this.setState((prevState) => ({
        ...prevState,
        providerId: (value || []).map((n) => n.id),
        selectedProvider: value,
      }));
    }
  };

  handleCheck = (e) => {
    console.log("event", e.target.checked);
    this.setState((prevState) => ({
      ...prevState,
      checkedA: !this.state.checkedA,
    }));
  };

  handleSearchClick = () => {
    const { price, ratio, providerId, checkedA } = this.state;
    console.log("price", price);
    console.log("ratio", ratio);
    console.log("providers", providerId);

    let id_params = (providerId || [])
      .map((id) => {
        return `${id}`;
      })
      .join(",");

    apigetUrl(
      `/insurance/enquiry/${this.props.location.state.id}/quotes?minPremium=${price[0]}&maxPremium=${price[1]}&minSettlement=${ratio[0]}&maxSettlement=${ratio[1]}&providerIds=${id_params}&excludeErrors=${checkedA}`
    )
      .then((res) => {
        console.log("res", res);
        if (`${res.status}` === "500") {
          ippNotify.error(res.statusText);
        }
        let response = res.data.quotes;
        let resData = (response || []).map((obj) => {
          let oldObj = this.state.data.find((o) => o.id === obj.id);
          if (oldObj) {
            obj.isChecked = oldObj.isChecked || false;
          } else {
            obj.isChecked = false;
          }
          return obj;
        });
        if (`${res.status}` === "404") {
          this.setState((prevState) => ({
            ...prevState,
            isInfoAlert: true,
          }));
        }
        this.setState((prevState) => ({
          ...prevState,
          advanceSearchData: resData,
          left: false,
          isActive: true,
          // data1: response[0].id,
          // status: response.map((n) => n.status),
          // productId: res.data.productId,
        }));
      })
      .catch((err) => {
        console.log("err", err);
        this.setState((prevState) => ({
          ...prevState,
          left: false,
          isActive: false,
        }));
      });
  };

  handleResetClick = () => {
    this.props.history.push({
      pathname: "/app/wireframes/health/quotes",
      state: {
        id: this.props.location.state.id,
        isActive: false,
      },
    });
    // this.callFiltersData();
    // this.setState((prevState) => ({
    //   ...prevState,
    //   left: false,
    //   isActive: false,
    //   checkedA: false,
    //   providers: [],
    //   providerId: [],
    //   selectedProvider: [],
    // }));
  };

  handlePreQuoteEdit = () => {
    /**
     * Purpose of this function: To EDIT-PreQuote data i.e. to start the Policy purchase flow from starting but with the
     *  pre-populated data which is already submited before.
     *
     * We are going to do the following steps
     * 1. this function will naviage to 'saleFlows', to edit the 'Pre-quote' data
     * 2. Get the form data, which is already submited to server
     * 3. Start the flow from begining, but with pre-populate data
     * 4. fill all the details (in each step) and enter OTP
     * 5. select the Policy to be purchased
     * 6. Fill all the Post-quote data and submit the form
     */
    this.props.history.push({
      pathname: "/app/wireframes/health/data/",
      state: {
        enquiryid: (this.props.location.state || {}).id,
        isPreQuoteEditMode: true,
      },
    });
  };

  getCount = () => {
    console.log("Count-123", (this.state.filtersData || {}).count);
    return (
      <Badge
        className="ml-2 mr-3 mb-1 mt-0"
        badgeContent={(this.state.filtersData || {}).count}
        color="primary"
        showZero
      />
    );
  };
  getAttemptCount = () => {
    return (
      <Badge
        className="ml-2 mr-3 mb-1 mt-0"
        badgeContent={(this.state.filtersData || {}).quotesAttemptCount}
        color="primary"
        showZero
      />
    );
  };

  calculate = () => {
    return (
      <Badge
        className="ml-2 mr-3 mb-1 mt-0"
        badgeContent={
          (this.state.filtersData || {}).quotesAttemptCount -
          (this.state.filtersData || {}).count
        }
        color="primary"
        showZero
      />
    );
  };

  getProviderCount = () => {
    return (
      <Badge
        className="ml-2 mr-3 mb-1 mt-0"
        badgeContent={(this.state.filtersData || {}).quotesProvidersCount}
        color="primary"
        showZero
      />
    );
  };
  render() {
    const { data } = this.state;
    const greeting = "Welcome to React";
    // console.log("DATA1", this.state.enquiryId);
    let allData = this.state.data;
    // console.log("Data", allData);
    // console.log("compare-data-1", this.state.compareData[0].data);
    // console.log("compare-data-2", this.state.compareData[1].data);
    // console.log("compare-data-3", this.state.compareData[2].data);

    return (
      <>
        <div className="row">
          <div className="col-lg-4"></div>
          <div className="col-lg-4"></div>
          <div className="col-lg-4">
            {/* <IPPNotification /> */}
            <IPPNotification />
          </div>
        </div>

        <div>
          {this.state.right ? null : (
            <div className="theme-option">
              <Tooltip
                title={<IntlMessages id="EnquiryList.Quoats.Tooltip.Compare" />}
                arrow
                placement={"left"}
              >
                <IconButton
                  fontSize="large"
                  onClick={this.toggleDrawer("right", true)}
                >
                  <i className="zmdi zmdi-compare text-white" />
                </IconButton>
              </Tooltip>
              <div style={{ height: "15px", backgroundColor: "white" }} />
              <Tooltip
                title={<IntlMessages id="EnquiryList.Quoats.Tooltip.Edit" />}
                arrow
                placement={"left"}
              >
                <IconButton fontSize="large" onClick={this.handlePreQuoteEdit}>
                  <i className="zmdi zmdi-border-color text-white" />
                </IconButton>
              </Tooltip>
            </div>
          )}

          {this.state.left ? null : (
            <div
              style={{
                zIndex: "1500",
                position: "fixed",
                top: "30%",
                left: "0",
                backgroundColor: "teal",
                borderTopRightRadius: "0.375rem",
                borderBottomRightRadius: "0.375rem",
                color: "white",
                boxShadow: "1px 1px 4px rgb(0 0 0 /50%)",
                cursor: "pointer",
              }}
            >
              <Tooltip
                title={<IntlMessages id="EnquiryList.Quoats.Tooltip.Search" />}
                arrow
                placement={"right"}
              >
                <SearchIcon
                  style={{ fontSize: 40 }}
                  onClick={this.searchDrawer("left", true)}
                >
                  <i className="zmdi zmdi-compare text-white" />
                </SearchIcon>
              </Tooltip>
            </div>
          )}

          {this.state.isActive ? (
            <div className="row">
              <div className="animated slideInUpTiny animation-duration-3 mb-n4 col-md-12">
                {this.state.isInfoAlert ||
                this.state.advanceSearchData.length === 0 ? (
                  <div className="quotation">
                    <InfoModal
                      message="Your query did not match any results"
                      className="mr-5"
                    />
                  </div>
                ) : (
                  this.state.advanceSearchData.map((data, index) => (
                    <ListItem
                      key={index}
                      idxVal={index}
                      data={data}
                      styleName="card shadow"
                      handleClick={this.handleAdvanceSearchItemCheck}
                      handlePremium={this.handleCheckPremium}
                      enquiryId={this.props.location.state.id}
                    />
                  ))
                )}
              </div>
            </div>
          ) : (
            <>
              {this.state.data.length === 0 ? null : (
                <div className="row mb-2" style={{ marginTop: "-20px" }}>
                  <div className="col-lg-6"></div>
                  <div className="col-lg-6">
                    <span>
                      <Chip
                        label={
                          <h3 className="pt-3 pb-1">
                            <b style={{ color: "#3f51b5" }}>
                              Got {this.getCount()} quotes,attempting to get{" "}
                              {this.calculate()} more quotes from{" "}
                              {this.getProviderCount()} providers.
                            </b>
                          </h3>
                        }
                        color="primary"
                        variant="outlined"
                      />
                    </span>
                  </div>
                </div>
              )}
              <div className="row">
                <div className="animated slideInUpTiny animation-duration-3 mb-n4 col-md-12">
                  {this.state.isInfoAlert || this.state.data.length === 0 ? (
                    <div className="quotation">
                      <InfoModal
                        message="Your query did not match any results"
                        className="mr-5"
                      />
                    </div>
                  ) : (
                    data.map((data, index) => (
                      <ListItem
                        key={index}
                        idxVal={index}
                        data={data}
                        styleName="card shadow"
                        handleClick={this.handleItemCheck}
                        handlePremium={this.handleCheckPremium}
                        enquiryId={this.props.location.state.id}
                      />
                    ))
                  )}
                </div>
              </div>
            </>
          )}

          {this.state.isActive ? (
            <Drawer
              anchor="right"
              open={this.state.right}
              onClose={this.toggleDrawer("right", false)}
            >
              <div
                tabIndex={0}
                role="button"
                onClick={this.toggleDrawer("right", false)}
                onKeyDown={this.toggleDrawer("right", false)}
              >
                <div className="">
                  <div className="color-theme-header">
                    <h3 className="color-theme-title">Compare Policies</h3>

                    <IconButton
                      className="icon-btn"
                      onClick={this.toggleDrawer("right", false)}
                    >
                      <i className="zmdi zmdi-close text-white" />
                    </IconButton>
                  </div>
                  <div className="color-theme-body">
                    {this.state.compareData[0].advanceSearchData ? (
                      <ListCompareItem
                        onCloseProduct={this.handleClose}
                        data={this.state.compareData[0].advanceSearchData}
                        //allData={this.state.data.map((n) => n)[0]}
                        styleName="card shadow"
                      />
                    ) : (
                      <div className="row">
                        <div className="col-md-12 int-content-center">
                          <div className="user-list d-flex flex-row card shadow text-center">
                            <p className="text-grey mb-1">
                              Select a Plan to Compare
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    {this.state.compareData[1].advanceSearchData ? (
                      <ListCompareItem
                        onCloseProduct={this.handleClose}
                        data={this.state.compareData[1].advanceSearchData}
                        styleName="card shadow"
                      />
                    ) : (
                      <div className="row">
                        <div className="col-md-12 int-content-center">
                          <div className="user-list d-flex flex-row card shadow text-center">
                            <p className="text-grey mb-1">
                              Select a Plan to Compare
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    {this.state.compareData[2].advanceSearchData ? (
                      <ListCompareItem
                        onCloseProduct={this.handleClose}
                        data={this.state.compareData[2].advanceSearchData}
                        //allData={this.state.data.map((n) => n)[2]}
                        styleName="card shadow"
                      />
                    ) : (
                      <div className="row">
                        <div className="col-md-12 int-content-center">
                          <div className="user-list d-flex flex-row card shadow text-center">
                            <p className="text-grey mb-1">
                              Select a Plan to Compare
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {this.state.compareData[0].advanceSearchData &&
                    this.state.compareData[1].advanceSearchData ? (
                      <div className="col-md-12 int-content-center">
                        <Button
                          variant="contained"
                          className="jr-btn bg-amber text-white"
                          onClick={this.handleAdvanceSearchCheckItem}
                        >
                          Compare Plans
                        </Button>
                        &nbsp;&nbsp;
                        <Button
                          variant="contained"
                          className="jr-btn bg-amber text-white"
                        >
                          Close
                        </Button>
                      </div>
                    ) : (
                      <div className="col-md-12 int-content-center">
                        <Button
                          variant="contained"
                          // className="jr-btn bg-amber text-white"
                          // onClick={this.handleCheckItem}
                          disabled
                        >
                          Compare Plans
                        </Button>
                        &nbsp;&nbsp;
                        <Button
                          variant="contained"
                          className="jr-btn bg-amber text-white"
                        >
                          Close
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Drawer>
          ) : (
            <Drawer
              anchor="right"
              open={this.state.right}
              onClose={this.toggleDrawer("right", false)}
            >
              <div
                tabIndex={0}
                role="button"
                onClick={this.toggleDrawer("right", false)}
                onKeyDown={this.toggleDrawer("right", false)}
              >
                <div className="">
                  <div className="color-theme-header">
                    <h3 className="color-theme-title">Compare Policies</h3>

                    <IconButton
                      className="icon-btn"
                      onClick={this.toggleDrawer("right", false)}
                    >
                      <i className="zmdi zmdi-close text-white" />
                    </IconButton>
                  </div>
                  <div className="color-theme-body">
                    {this.state.compareData[0].data ? (
                      <ListCompareItem
                        onCloseProduct={this.handleClose}
                        data={this.state.compareData[0].data}
                        //allData={this.state.data.map((n) => n)[0]}
                        styleName="card shadow"
                      />
                    ) : (
                      <div className="row">
                        <div className="col-md-12 int-content-center">
                          <div className="user-list d-flex flex-row card shadow text-center">
                            <p className="text-grey mb-1">
                              Select a Plan to Compare
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    {this.state.compareData[1].data ? (
                      <ListCompareItem
                        onCloseProduct={this.handleClose}
                        data={this.state.compareData[1].data}
                        styleName="card shadow"
                      />
                    ) : (
                      <div className="row">
                        <div className="col-md-12 int-content-center">
                          <div className="user-list d-flex flex-row card shadow text-center">
                            <p className="text-grey mb-1">
                              Select a Plan to Compare
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    {this.state.compareData[2].data ? (
                      <ListCompareItem
                        onCloseProduct={this.handleClose}
                        data={this.state.compareData[2].data}
                        //allData={this.state.data.map((n) => n)[2]}
                        styleName="card shadow"
                      />
                    ) : (
                      <div className="row">
                        <div className="col-md-12 int-content-center">
                          <div className="user-list d-flex flex-row card shadow text-center">
                            <p className="text-grey mb-1">
                              Select a Plan to Compare
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {this.state.compareData[0].data &&
                    this.state.compareData[1].data ? (
                      <div className="col-md-12 int-content-center">
                        <Button
                          variant="contained"
                          className="jr-btn bg-amber text-white"
                          onClick={this.handleCheckItem}
                        >
                          Compare Plans
                        </Button>
                        &nbsp;&nbsp;
                        <Button
                          variant="contained"
                          className="jr-btn bg-amber text-white"
                        >
                          Close
                        </Button>
                      </div>
                    ) : (
                      <div className="col-md-12 int-content-center">
                        <Button
                          variant="contained"
                          // className="jr-btn bg-amber text-white"
                          // onClick={this.handleCheckItem}
                          disabled
                        >
                          Compare Plans
                        </Button>
                        &nbsp;&nbsp;
                        <Button
                          variant="contained"
                          className="jr-btn bg-amber text-white"
                        >
                          Close
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Drawer>
          )}

          <SwipeableDrawer
            anchor="left"
            open={this.state.left}
            onClose={this.searchDrawer("left", false)}
          >
            <div tabIndex={0} role="button">
              <div
                className=""
                style={{
                  width: "500px",
                  overflowY: "auto",
                  overflowX: "hidden",
                }}
              >
                <div className="color-theme-header">
                  <h3 className="color-theme-title ml-5">Advance Search</h3>

                  <IconButton
                    className="icon-btn"
                    onClick={this.toggleDrawer("left", false)}
                  >
                    <i className="zmdi zmdi-close text-white" />
                  </IconButton>
                </div>

                <Search
                  data={this.state.providers}
                  price={this.state.price}
                  minPrice={this.state.minPrice}
                  maxPrice={this.state.maxPrice}
                  ratio={this.state.ratio}
                  minRatio={this.state.minRatio}
                  maxRatio={this.state.maxRatio}
                  checkedA={this.state.checkedA}
                  handlePriceChange={this.handlePriceChange}
                  handleRatioChange={this.handleRatioChange}
                  handleChange={this.handleChange}
                  handleSearchClick={this.handleSearchClick}
                  handleCheck={this.handleCheck}
                  handleResetClick={this.handleResetClick}
                  selectedProvider={this.state.selectedProvider}
                />
                {/* )} */}
              </div>
            </div>
          </SwipeableDrawer>
        </div>
      </>
    );
  }
}

export default withRouter(ProductList);
