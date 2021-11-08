/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Link } from 'react-router-dom';
import IntlMessages from 'util/IntlMessages';
import {
  hideMessage,
  showAuthLoader,
  userFacebookSignIn,
  userGithubSignIn,
  userGoogleSignIn,
  userSignUp,
  userTwitterSignIn
} from 'actions/Auth';
import InputField from "../app/routes/widgets/routes/CommonComponents/TextField"
import { useHistory, useLocation } from "react-router-dom";
import { IPPNotification, ippNotify, } from "../app/routes/widgets/routes/CommonComponents/IPPNotification";
import InputSubmitButton from "../app/routes/widgets/routes/CommonComponents/SubmitButton"
import { apigetUrl, apiputUrl } from "../setup/middleware";


const ResetPassword = (props) => {

  const [newPassword, setNewPassword] = useState("");
  const [token, setToken] = useState("");
  const [userName, setuserName] = useState("");
  const [confirmationPassword, setConfirmationPassword] = useState("");
  const [passwordValidatonRegex, setpasswordValidatonRegex] = useState("");
  const [passwordValidatonValue, setpasswordValidatonValue] = useState("");

  const dispatch = useDispatch();
  const { loader, alertMessage, showMessage, authUser } = useSelector(({ auth }) => auth);

  let history = useHistory();
  const location = useLocation();



  useEffect(() => {
    if (showMessage) {
      setTimeout(() => {
        dispatch(hideMessage());
      }, 3000);
    }
    if (authUser !== null) {
      props.history.push('/');
    }
  }, [showMessage, authUser, props.history, dispatch]);

  //read token and username from url
  useEffect(() => {
    let queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);
    let key = urlParams.get('token')
    let un = urlParams.get('username')
    setToken(key)
    setuserName(un)
    getConfigDetails()
  }, []);

  const getConfigDetails=async()=>{
    let result = await apigetUrl(`/configs/guest/ui`);
    if(result.status === 200){
      let resultData = result.data.dataList
      let regex=""
      let desc=""
      for(var i=0;i<resultData.length;i++){
        if(resultData[i].key==="gen.password.policy"){
          let string = resultData[i].value
          regex=string.substring(1, string.length-1)
        }
        if(resultData[i].key==="gen.password.policy.desc"){
          desc=resultData[i].value
        }
      }
      setpasswordValidatonRegex(regex)
      setpasswordValidatonValue(desc)
    }

  }


  //handle submit
  const handleClick = async () => {

    if (newPassword === "" || newPassword === null ||
      confirmationPassword === "" || confirmationPassword === null
    ) {
      ippNotify.error("Enter the required(*) fields");
    }

    else if (newPassword != "" || confirmationPassword != "") {

      if (newPassword != confirmationPassword) {
        ippNotify.error("Password & Confirmation password do not match.");
      }
      else if (newPassword === confirmationPassword) {
        let expression = new RegExp(passwordValidatonRegex)
        if(expression.test(newPassword)){
        const Payload = {
          confirmPassword: newPassword,
          reConfirmPassword: confirmationPassword,

        }
        const result = await apiputUrl(`/auth/activate-password?token=${token}&userName=${userName}`, Payload)
        if (result.data.responseCode === "200") {
          history.push({
            pathname: "/SignIn",
            state: {
              confirmationMessage: result.data.responseMessage,
            },
          });
        }
        else {
          ippNotify.error(result.data.responseMessage);

        }
      }
      else{
        ippNotify.error(passwordValidatonValue);
      }
      }
    }
  };


  return (
    <div
      className="app-login-container d-flex justify-content-center align-items-center animated slideInUpTiny animation-duration-3">
      <div className="app-login-main-content">
        <div className="app-logo-content d-flex align-items-center justify-content-center">
          <Link className="logo-lg" to="/" title="InsureKart">
            <img src={require("assets/images/logo.png")} alt="InsureKart" title="InsureKart" />
          </Link>
        </div>

        <div className="app-login-content">
          <div className="app-login-header mb-8">
            <h1><IntlMessages id="product.name" /></h1><h3><IntlMessages id="useractivation.title" /> For {userName}</h3>
          </div>


          <div className="app-login-form">
            <form method="post" action="/">
              <InputField
                required
                type="password"
                onChange={(event) => setNewPassword(event.target.value)}
                label={<IntlMessages id="useractivation.password" />}
                fullWidth
                defaultValue={newPassword}
                margin="normal"
                className="mt-2 mb-2"
              />

              <InputField
                required
                type="password"
                onChange={(event) => setConfirmationPassword(event.target.value)}
                label={<IntlMessages id="useractivation.confimpassword" />}
                fullWidth
                defaultValue={confirmationPassword}
                margin="normal"
                className="mt-2 mb-4"
              />

              <div className="mb-3 d-flex align-items-center justify-content-between">
                <InputSubmitButton
                  onClick={() => handleClick()}
                />

              </div>


            </form>
          </div>
        </div>

      </div>

      {
        loader &&
        <div className="loader-view">
          <CircularProgress />
        </div>
      }
      {showMessage && NotificationManager.error(alertMessage)}
      <NotificationContainer />
      <IPPNotification />
    </div>
  )
};


export default ResetPassword;
