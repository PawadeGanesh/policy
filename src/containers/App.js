/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import URLSearchParams from "url-search-params";
import MomentUtils from "@date-io/moment";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { Redirect, Route, Switch } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IntlProvider } from "react-intl";
import "assets/vendors/style";
import indigoTheme from "./themes/indigoTheme";
import cyanTheme from "./themes/cyanTheme";
import orangeTheme from "./themes/orangeTheme";
import amberTheme from "./themes/amberTheme";
import pinkTheme from "./themes/pinkTheme";
import blueTheme from "./themes/blueTheme";
import purpleTheme from "./themes/purpleTheme";
import greenTheme from "./themes/greenTheme";
import AppLocale from "../lngProvider";

import {
  userSignInWithToken,
  showAuthLoader,
  verifyToken,
  refreshToken,
  sessiontimeout
} from "../actions/Auth";

import {
  AMBER,
  BLUE,
  CYAN,
  DARK_AMBER,
  DARK_BLUE,
  DARK_CYAN,
  DARK_DEEP_ORANGE,
  DARK_DEEP_PURPLE,
  DARK_GREEN,
  DARK_INDIGO,
  DARK_PINK,
  DEEP_ORANGE,
  DEEP_PURPLE,
  GREEN,
  INDIGO,
  PINK,
} from "constants/ThemeColors";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { setInitUrl } from "../actions/Auth";
import RTL from "util/RTL";
import asyncComponent from "util/asyncComponent";
import { setDarkTheme, setThemeColor } from "../actions/Setting";
import AppLayout from "./AppLayout";
import ForgotPassword from "containers/ForgotPassword";
import ResetPassword from "containers/ResetPassword";
import { userSignOut } from "actions/Auth";
import UserActivitation from "containers/UserActivitation";
import CustomerFeedBack from "containers/CustomerFeedBack";
import CustomerFeedbackSuccessPage from "containers/CustomerFeedbackSuccessPage";
import { useIdleTimer } from "react-idle-timer";

const RestrictedRoute = ({ component: Component, authUser, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      authUser ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/signin",
            state: { from: props.location },
          }}
        />
      )
    }
  />
);

const App = (props) => {
  // eslint-disable-next-line no-unused-vars
  const [state, setState] = useState({
    params: false,
    isBusy: true,
  });
  const dispatch = useDispatch();
  const { themeColor, darkTheme, locale, isDirectionRTL } = useSelector(
    ({ settings }) => settings
  );

  // eslint-disable-next-line no-unused-vars
  const { authUser, initURL, tokenData, loader, verifyUser } = useSelector(
    ({ auth }) => auth
  );

  const isDarkTheme = darkTheme;
  const { match, location } = props;

  // let authUser = localStorage.getItem("user_id");

  //  dispatch(showAuthLoader());
  //  dispatch(userSignIn({ email, password }));

  const params = new URLSearchParams(props.location.search);
  // let tokenId = params.has("token");
  // let referenceId = params.has("reference");
  let tokenQuery = params.get("token");
  let referenceQuery = params.get("reference");

  const handleOnIdle = () => {
    // console.log("Logout");
    dispatch(sessiontimeout());
  };

  const handleOnActive = () => {
    // console.log("time remaining");
  };

  const handleOnAction = () => {
    // console.log("user did something", getRemainingTime());
    // if (getRemainingTime() < 5000  && getRemainingTime() > 1000) {
    //   dispatch(refreshToken());
    // }
   
    if (getRemainingTime() > 59000 && getRemainingTime() < 1000) {
      dispatch(refreshToken());
    }
  };

  const { getRemainingTime } = useIdleTimer({
    timeout: 1000 * localStorage.getItem("refreshExpireTime"),
    onIdle: handleOnIdle,
    onActive: handleOnActive,
    onAction: handleOnAction,
    debounce: 500,
  });


  useEffect(() => {
    if (window.performance) {
      if (performance.navigation.type == 1) {
      } else {
        dispatch(verifyToken());
      }
    }
  }, [window]);

  useEffect(() => {
    let token = localStorage.getItem("user_id");
    if (token) {
      dispatch(verifyToken());
    }

    // if (!verifyUser) {
    //   console.log("Call api");
    //   dispatch(verifyToken());
    // }
  }, []);

  useEffect(() => {
    if (tokenQuery !== null) {
      fetchData();
    }

    async function fetchData() {
      dispatch(showAuthLoader());
      dispatch(
        userSignInWithToken({
          tokenQuery,
          referenceQuery,
        })
      );
      setState((prevState) => ({
        ...prevState,
        isBusy: false,
      }));
    }
  }, []);

  useEffect(() => {
    window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;
    if (initURL === "") {
      dispatch(setInitUrl(props.history.location.pathname));
    }
    const params = new URLSearchParams(props.location.search);
    if (params.has("theme-name")) {
      dispatch(setThemeColor(params.get("theme-name")));
    }
    if (params.has("dark-theme")) {
      dispatch(setDarkTheme());
    }
  }, [
    dispatch,
    initURL,
    props.history.location.pathname,
    props.location.search,
  ]);

  const getColorTheme = (themeColor, applyTheme) => {
    switch (themeColor) {
      case INDIGO: {
        applyTheme = createMuiTheme(indigoTheme);
        break;
      }
      case CYAN: {
        applyTheme = createMuiTheme(cyanTheme);
        break;
      }
      case AMBER: {
        applyTheme = createMuiTheme(amberTheme);
        break;
      }
      case DEEP_ORANGE: {
        applyTheme = createMuiTheme(orangeTheme);
        break;
      }
      case PINK: {
        applyTheme = createMuiTheme(pinkTheme);
        break;
      }
      case BLUE: {
        applyTheme = createMuiTheme(blueTheme);
        break;
      }
      case DEEP_PURPLE: {
        applyTheme = createMuiTheme(purpleTheme);
        break;
      }
      case GREEN: {
        applyTheme = createMuiTheme(greenTheme);
        break;
      }
      case DARK_INDIGO: {
        applyTheme = createMuiTheme({
          ...indigoTheme,
          direction: "rtl",
        });
        break;
      }
      case DARK_CYAN: {
        applyTheme = createMuiTheme(cyanTheme);
        break;
      }
      case DARK_AMBER: {
        applyTheme = createMuiTheme(amberTheme);
        break;
      }
      case DARK_DEEP_ORANGE: {
        applyTheme = createMuiTheme(orangeTheme);
        break;
      }
      case DARK_PINK: {
        applyTheme = createMuiTheme(pinkTheme);
        break;
      }
      case DARK_BLUE: {
        applyTheme = createMuiTheme(blueTheme);
        break;
      }
      case DARK_DEEP_PURPLE: {
        applyTheme = createMuiTheme(purpleTheme);
        break;
      }
      case DARK_GREEN: {
        applyTheme = createMuiTheme(greenTheme);
        break;
      }
      default:
        createMuiTheme(indigoTheme);
    }
    return applyTheme;
  };

  let applyTheme = createMuiTheme(indigoTheme);
  if (isDarkTheme) {
    document.body.classList.add("dark-theme");
    applyTheme = createMuiTheme(darkTheme);
  } else {
    applyTheme = getColorTheme(themeColor, applyTheme);
  }
  if (location.pathname === "/") {
    if (authUser === null) {
      return <Redirect to={"/signin"} />;
    } else if (initURL === "" || initURL === "/" || initURL === "/signin") {
      let dashboardType = localStorage.getItem("dashboardType");
      if (parseInt(dashboardType) === 1) {
        return <Redirect to={"/app/wireframes/dashboard/managers"} />;
      } else {
        return <Redirect to={"/app/wireframes/dashboard/agents"} />;
      }
    } 
    else if(parseInt(localStorage.getItem("dashboardType"))===0){
      return <Redirect to={"/app/wireframes/dashboard/agents"} />;
    }
    else if(parseInt(localStorage.getItem("dashboardType"))===1){
      return <Redirect to={"/app/wireframes/dashboard/managers"} />;
    }
    else {
      return <Redirect to={initURL} />;
    }
  }
  // else if (location.pathname !== "/" || location.pathname === "/signin") {
  //   if (authUser !== null) {
  //     return <Redirect to={"/app/wireframes/dashboard/agents"} />;
  //   }
  // }

  if (isDirectionRTL) {
    applyTheme.direction = "rtl";
    document.body.classList.add("rtl");
  } else {
    document.body.classList.remove("rtl");
    applyTheme.direction = "ltr";
  }

  const currentAppLocale = AppLocale[locale.locale];
  return (
    <ThemeProvider theme={applyTheme}>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <IntlProvider
          locale={currentAppLocale.locale}
          messages={currentAppLocale.messages}
        >
          <RTL>
            <div className="app-main">
              <Switch>
                <RestrictedRoute
                  path={`${match.url}app`}
                  authUser={authUser}
                  // tokenData={tokenData}
                  component={AppLayout}
                />
                <Route path="/signin" component={SignIn} />
                <Route path="/signup" component={SignUp} />
                <Route path="/forgotpassword" component={ForgotPassword} />
                <Route path="/resetpassword" component={ResetPassword} />
                <Route path="/userActivitation" component={UserActivitation} />
                <Route path="/customerfeedBack" component={CustomerFeedBack} />
                <Route
                  path="/CustomerFeedbackSuccessPage"
                  component={CustomerFeedbackSuccessPage}
                />
                <Route
                  component={asyncComponent(() =>
                    import("app/routes/extraPages/routes/404")
                  )}
                />

                {/* {tokenData && (
                  <Redirect to={"/app/wireframes/dashboard/agents"} />
                )} */}

                {/* <Route path="/signin" component={SignIn} />
                {authUser && (
                  <Route>
                    <Switch>
                      <RestrictedRoute
                        path={`${match.url}app`}
                        authUser={authUser}
                        component={AppLayout}
                      />
                    </Switch>
                  </Route>
                )}
                <Redirect to={"/signin"} /> */}
              </Switch>
            </div>
          </RTL>
        </IntlProvider>
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  );
};

export default App;
