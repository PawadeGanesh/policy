/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import { useDispatch } from "react-redux";
import AppBar from "@material-ui/core/AppBar";
import Avatar from "@material-ui/core/Avatar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import { Dropdown, DropdownMenu, DropdownToggle } from "reactstrap";
import SearchBox from "components/SearchBox";
import AppNotification from "../../../../components/AppNotification";
import CardHeader from "components/dashboard/Common/CardHeader/index";
import IntlMessages from "util/IntlMessages";
import LanguageSwitcher from "components/LanguageSwitcher/index";
import Menu from "./TopNav/Menu";
import UserInfoPopup from "components/UserInfo/UserInfoPopup";
import { switchLanguage, toggleCollapsedNav } from "actions/Setting";
import { MdLanguage } from "react-icons/md";
import axios from "axios";
import "./master.css";
import { apigetUrl, apiputUrl } from "../../../../setup/middleware";
import { useSelector } from "react-redux";
import apiInstance from "../../../../setup/index";
import {Tooltip } from "@material-ui/core";

const baseURL = `${process.env.REACT_APP_BASE_URL}`;

const InsideNavHeader = () => {
  const { authUser } = useSelector(({ auth }) => auth);
  let data = authUser.userDetails;
  let user = data;
  const [state, setState] = useState({
    datanav: [],
    datastatusfilter: [],
    page: 1,
    limit: 5,
    mode: "cnt",
    modedet: "det",
    status: 0,
    notificationfound: false,
    nonotificationfound: false,
    numberofnotification: "",
  });

  const dispatch = useDispatch();
  const [searchBox, setSearchBox] = useState(false);
  const [searchText, setSearchText] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [mailNotification, setMailNotification] = useState(false);
  const [userInfo, setUserInfo] = useState(false);
  const [langSwitcher, setLangSwitcher] = useState(false);
  const [appNotification, setAppNotification] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [apps, setApps] = useState(false);

  const onAppNotificationSelect = () => {
    setAppNotification(!appNotification);
  };
  const onLangSwitcherSelect = () => {
    setLangSwitcher(!langSwitcher);
  };
  const onSearchBoxSelect = () => {
    setSearchBox(!searchBox);
  };
  const onUserInfoSelect = () => {
    setUserInfo(!userInfo);
  };
  const handleRequestClose = () => {
    setLangSwitcher(false);
    setUserInfo(false);
    setMailNotification(false);
    setAppNotification(false);
    setAppNotification(false);
    setSearchBox(false);
    setApps(false);
  };
  const onToggleCollapsedNav = () => {
    dispatch(toggleCollapsedNav());
  };

  useEffect(() => {
    callLocalBaseURL();
  }, []);

  const callLocalBaseURL = () => {
    apigetUrl(
      `/notify/notifications/user/${user && user.username}?page=${
        state.page
      }&limit=${state.limit}&status=${state.status}&mode=${state.mode}`,
      apiInstance
    )
      .then((res) => {
        let pagedatanumber = "";
        let pagecount = res.data.pagination.count;
        if (pagecount > 99) {
          pagedatanumber = "99" + "+";
        } else {
          pagedatanumber = pagecount;
        }
        setState((prevState) => ({
          ...prevState,
          datanav: res.data.pagination,
          numberofnotification: pagedatanumber,
        }));
      })
      .catch((error) => {
        console.log("Error");
      });
  };

  const getdata = async () => {
    const result = await apigetUrl(
      `/notify/notifications/user/${user && user.username}?page=${
        state.page
      }&limit=${state.limit}&status=${state.status}&mode=${state.modedet}`
    );
    if (result.data.responseCode === "200") {
      let dataresult = [];
      let datafilter1 = result.data.dataList;
      let datalength = result.data.dataList.length;
      if (datalength <= 5) {
        if (datalength != 5) {
          for (let i = 0; i < datalength; i++) {
            dataresult.push(datafilter1[i]);
          }
        } else if (datalength == 5) {
          for (let i = 0; i <= 5; i++) {
            dataresult.push(datafilter1[i]);
          }
        }
      }
      setState((prevState) => ({
        ...prevState,
        datastatusfilter: dataresult,
      }));
      updatestatusdata(dataresult);
    }
  };

  const updatestatusdata = async (dataresult) => {
    let updateapidata = dataresult;
    for (let i = 0; i < updateapidata.length; i++) {
      let data = {
        status: 1,
        rowVersion: updateapidata[i].rowVersion,
        userName: updateapidata[i].userName,
      };
      const result = await apiputUrl(
        "/notify/notifications/" + updateapidata[i].id,
        data
      );
      if (result.data.responseCode === "200") {
        callLocalBaseURL();
      }
    }
  };

  const updateSearchText = (evt) => {
    setSearchText(evt.target.value);
  };

  const onSwitchLanguage = (lang) => {
    dispatch(switchLanguage(lang));
  };
  return (
    <AppBar className="app-main-header">
      <Toolbar className="app-toolbar" disableGutters={false}>
        <div
          className="d-block d-md-none pointer mr-3"
          onClick={onToggleCollapsedNav}
        >
          <span className="jr-menu-icon">
            <span className="menu-icon" />
          </span>
        </div>

        <Link className="app-logo mr-2 d-none d-sm-block" to="/">
          <img
            src={require("assets/images/logo.png")}
            alt="InsurKart"
            title="InsurKart"
          />
        </Link>

        <SearchBox
          styleName="d-none d-lg-block"
          placeholder=""
          onChange={updateSearchText}
          value={searchText}
        />
        <Menu />

        <ul className="header-notifications list-inline ml-auto">
          <li className="d-inline-block d-lg-none list-inline-item">
            <Dropdown
              className="quick-menu nav-searchbox"
              isOpen={searchBox}
              toggle={onSearchBoxSelect}
            >
              <DropdownToggle
                className="d-inline-block"
                tag="span"
                data-toggle="dropdown"
              >
                <IconButton className="icon-btn">
                  <i className="zmdi zmdi-search zmdi-hc-fw" />
                </IconButton>
              </DropdownToggle>

              <DropdownMenu right className="p-0">
                <SearchBox
                  styleName="search-dropdown"
                  placeholder=""
                  onChange={updateSearchText}
                  value={searchText}
                />
              </DropdownMenu>
            </Dropdown>
          </li>
          <li className="list-inline-item">
            <Dropdown
              className="quick-menu"
              isOpen={langSwitcher}
              toggle={onLangSwitcherSelect}
            >
              <DropdownToggle
                className="d-inline-block"
                tag="span"
                data-toggle="dropdown"
              >
               <Tooltip title={<IntlMessages id="Language.Tooltip.Edit" />}>
                <IconButton className="icon-btn">
                  <MdLanguage />
                  {/* <i className={`flag flag-24 flag-${locale.icon}`}/> */}
                </IconButton>
                </Tooltip>
              </DropdownToggle>

              <DropdownMenu right className="w-50">
                <LanguageSwitcher
                  switchLanguage={onSwitchLanguage}
                  handleRequestClose={handleRequestClose}
                />
              </DropdownMenu>
            </Dropdown>
          </li>
          <li className="list-inline-item app-tour">
            <Dropdown
              className="quick-menu"
              isOpen={appNotification}
              toggle={onAppNotificationSelect}
              onClick={getdata}
            >
              <DropdownToggle
                className="d-inline-block"
                tag="span"
                data-toggle="dropdown"
              >
                {state.datanav.count === 0 ? (
                   <Tooltip title={<IntlMessages id="Notification.Tooltip.Edit" />}>
                  <IconButton className="icon-btn">
                    <i className="zmdi zmdi-notifications-none " />
                  </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title={<IntlMessages id="Notification.Tooltip.Edit" />}>
                  <IconButton className="icon-btn">
                    <i className="zmdi zmdi-notifications-none ">
                      <span className="notificationalert">
                        {state.numberofnotification}
                      </span>
                    </i>
                  </IconButton>
                  </Tooltip>
                )}
              </DropdownToggle>

              <DropdownMenu right>
                <CardHeader
                  styleName="align-items-center"
                  heading={<IntlMessages id="appNotification.title" />}
                  handleToggle={onAppNotificationSelect}
                />

                <AppNotification />
              </DropdownMenu>
            </Dropdown>
          </li>

          <li className="list-inline-item user-nav">
            <Dropdown
              className="quick-menu"
              isOpen={userInfo}
              toggle={onUserInfoSelect}
            >
              <DropdownToggle
                className="d-inline-block"
                tag="span"
                data-toggle="dropdown"
              >
               <Tooltip title={<IntlMessages id="Profile.Tooltip.Edit" />}>
                <IconButton className="icon-btn size-30">
                  <Avatar
                    alt="..."
                    src={require("assets/images/insurance/user_blank.png")}
                    className="size-30"
                  />
                </IconButton>
                </Tooltip>
              </DropdownToggle>

              <DropdownMenu right>
                <UserInfoPopup />
              </DropdownMenu>
            </Dropdown>
          </li>
        </ul>

        <div className="ellipse-shape" />
      </Toolbar>
    </AppBar>
  );
};

export default withRouter(InsideNavHeader);
