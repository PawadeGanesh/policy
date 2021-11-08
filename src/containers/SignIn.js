/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import IntlMessages from "util/IntlMessages";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  hideMessage,
  showAuthLoader,
  userFacebookSignIn,
  userGithubSignIn,
  userGoogleSignIn,
  userSignIn,
  userTwitterSignIn,
} from "actions/Auth";
import InputField from "../app/routes/widgets/routes/CommonComponents/TextField";
import { useLocation } from "react-router-dom";
import {
  IPPNotification,
  ippNotify,
} from "../app/routes/widgets/routes/CommonComponents/IPPNotification";
import DosandDontComponent from "../app/routes/widgets/routes/CommonComponents/DosandDont";
import PrivacyandPolicy from "../app/routes/widgets/routes/CommonComponents/PrivacyandPolicy";
import { apigetUrl } from "../setup/middleware";

const SignIn = (props) => {
  // const [email, setEmail] = useState('demo@example.com');
  // const [password, setPassword] = useState('demo#123');
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState({
    DialogOpen: false,
    dos: [],
    dont: [],
    isPrivacyPolicy: false,
    value: "",
  });
  const dispatch = useDispatch();
  const { loader, alertMessage, showMessage, authUser } = useSelector(
    ({ auth }) => auth
  );

  const socialSignUpAllowed = useSelector(
    ({ settings }) => settings.socialSignUpOption
  );
  const createAccountOption = useSelector(
    ({ settings }) => settings.createAccountOption
  );

  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      let message = location.state.confirmationMessage;
      if ("confirmationMessage" in location.state) {
        ippNotify.success(message);
      }
    }
  }, [location]);

  useEffect(() => {
    if (showMessage) {
      setTimeout(() => {
        dispatch(hideMessage());
      }, 100);
    }
    if (authUser !== null) {
      props.history.push("/");
    }
  }, [showMessage, authUser, props.history, dispatch]);

  const handleSignIn = () => {
    if (navigator.onLine) {
      dispatch(showAuthLoader());
      dispatch(userSignIn({ name, password }));
    }
  };

  const handleDND = async () => {
    let result = await apigetUrl(`/configs/guest/ui`);
    if (result.status === 200) {
      let resultdata = result.data.dataList;
      let dosString = "";
      let doNotString = "";
      for (var i = 0; i < resultdata.length; i++) {
        if (resultdata[i].key === "con.ins.dos") {
          dosString = resultdata[i].value;
        } else if (resultdata[i].key === "con.ins.donts") {
          doNotString = resultdata[i].value;
        }
      }
      setState((prevState) => ({
        ...prevState,
        DialogOpen: true,
        dont: doNotString,
        dos: dosString,
      }));
    }
  };


  const handle_RequestClose = () => {
    setState((prevState) => ({
      ...prevState,
      DialogOpen: false,
    }));
  };

  const handlePNP = () => {
    callPrivacyNPolicy();
  };

  const callPrivacyNPolicy = () => {
    apigetUrl(`/configs/guest/ui`)
      .then((res) => {
        console.log("Item", res);
        if (res.status === 200) {
          let arr = res.data.dataList;
          let item = (arr || []).find((n) => n.key === "con.pvc.policy");
          console.log("Item-123", (item || {}).value);
          setState((prevState) => ({
            ...prevState,
            value: (item || {}).value,
            isPrivacyPolicy: true,
          }));
        }
      })
      .catch((err) => console.log("err", err));
  };

  const handleClose = () => {
    setState((prevState) => ({
      ...prevState,
      isPrivacyPolicy: false,
    }));
  };

  return (
    <>
      {state.isPrivacyPolicy ? (
        <>
          <PrivacyandPolicy value={state.value} handleClose={handleClose} />
        </>
      ) : null}
      <div className="app-login-container d-flex justify-content-center align-items-center animated slideInUpTiny animation-duration-3">
        <div className="app-login-main-content">
          <div className="app-logo-content d-flex align-items-center justify-content-center">
            <Link className="logo-lg" to="/" title="InsureKart">
              <img
                src={require("assets/images/logo.png")}
                alt="InsureKart"
                title="InsureKart"
              />
            </Link>
          </div>

          <div className="app-login-content">
            <div className="app-login-header mb-4">
              <h1>
                <IntlMessages id="product.name" />
              </h1>
            </div>

            <div className="app-login-form">
              <form>
                <fieldset>
                  <InputField
                    // label={<IntlMessages id="appModule.name" />}
                    label="Username"
                    fullWidth
                    onChange={(event) => setName(event.target.value)}
                    defaultValue={name}
                    margin="normal"
                    className="mt-1 my-sm-3"
                  />
                  <InputField
                    type="password"
                    label="Password"
                    fullWidth
                    onChange={(event) => setPassword(event.target.value)}
                    defaultValue={password}
                    margin="normal"
                    className="mt-1 my-sm-3"
                  />

                  <div className="mb-3 d-flex align-items-center justify-content-between">
                    <Button
                      onClick={handleSignIn}
                      variant="contained"
                      color="primary"
                    >
                      SIGN IN
                    </Button>
                    <span>
                      <Link className="mt-2" to="/ForgotPassword">
                        Forgot Password ?
                      </Link>
                      <br />
                      <Link className="mt-2" onClick={handleDND}>
                        {"Dos & Don'ts"}
                      </Link>
                      <br />
                      <Link className="mt-2" onClick={handlePNP}>
                        {"Privacy Policy"}
                      </Link>
                    </span>
                  </div>
                  {/* <div style={{ paddingLeft: "232px" }}>
                  <Link onClick={handleDND}>Dos and Don'ts</Link>
                </div> */}

                  {socialSignUpAllowed ? (
                    <div className="app-social-block my-1 my-sm-3">
                      <IntlMessages id="signIn.connectWith" />
                      <ul className="social-link">
                        <li>
                          <IconButton
                            className="icon"
                            onClick={() => {
                              dispatch(showAuthLoader());
                              dispatch(userFacebookSignIn());
                            }}
                          >
                            <i className="zmdi zmdi-facebook" />
                          </IconButton>
                        </li>

                        <li>
                          <IconButton
                            className="icon"
                            onClick={() => {
                              dispatch(showAuthLoader());
                              dispatch(userTwitterSignIn());
                            }}
                          >
                            <i className="zmdi zmdi-twitter" />
                          </IconButton>
                        </li>

                        <li>
                          <IconButton
                            className="icon"
                            onClick={() => {
                              dispatch(showAuthLoader());
                              dispatch(userGoogleSignIn());
                            }}
                          >
                            <i className="zmdi zmdi-google-plus" />
                          </IconButton>
                        </li>

                        <li>
                          <IconButton
                            className="icon"
                            onClick={() => {
                              dispatch(showAuthLoader());
                              dispatch(userGithubSignIn());
                            }}
                          >
                            <i className="zmdi zmdi-github" />
                          </IconButton>
                        </li>
                      </ul>
                    </div>
                  ) : (
                    ""
                  )}
                </fieldset>
              </form>
            </div>
          </div>
        </div>
        {loader && (
          <div className="loader-view">
            <CircularProgress />
          </div>
        )}
        {showMessage && NotificationManager.error(alertMessage)}
        <NotificationContainer />
        <DosandDontComponent
          DialogOpen={state.DialogOpen}
          handle_RequestClose={handle_RequestClose}
          DosData={state.dos}
          DnotData={state.dont}
        />
        <IPPNotification />
      </div>
    </>
  );
};

export default SignIn;
