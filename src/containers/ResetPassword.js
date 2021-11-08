/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import CircularProgress from '@material-ui/core/CircularProgress';
import {Link} from 'react-router-dom';
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
import { useHistory,useLocation } from "react-router-dom";
import {IPPNotification,ippNotify,} from "../app/routes/widgets/routes/CommonComponents/IPPNotification";
import InputSubmitButton from "../app/routes/widgets/routes/CommonComponents/SubmitButton"
import {apigetUrl,apiputUrl} from "../setup/middleware";


const ResetPassword = (props) => {

  const [temporaryPassword, setTemporaryPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmationPassword, setConfirmationPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [passwordValidatonRegex, setpasswordValidatonRegex] = useState("");
  const [passwordValidatonValue, setpasswordValidatonValue] = useState("");

  const dispatch = useDispatch();
  const {loader, alertMessage, showMessage, authUser} = useSelector(({auth}) => auth);

  let history = useHistory();
  const location = useLocation();

  useEffect(() => {
    if (location.state.confirmationMessage) {
    let message = location.state.confirmationMessage
    ippNotify.success(message);
    let username = setUserName(location.state.userName)
    }
    getConfigDetails() 
  }, [location]);


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


  const handleClick = async() => {
   
    if(temporaryPassword===""||temporaryPassword===null||
      newPassword===""||newPassword===null||
      confirmationPassword===""||confirmationPassword===null
    ){
      ippNotify.error("Enter the required(*) fields");
    }
    
    else if(temporaryPassword!=""||newPassword!=""||confirmationPassword!=""){
 
 if(newPassword!=confirmationPassword){
  ippNotify.error("Password & Confirmation password do not match.");
 }
 else if(newPassword===confirmationPassword){
  let expression = new RegExp(passwordValidatonRegex)
  if(expression.test(newPassword)){
  const Payload=  {
    tempPassword:temporaryPassword,
    confirmPassword:newPassword,
    reConfirmPassword: confirmationPassword,
    userName:userName
    }
    const result = await apiputUrl(`/auth/reset-password`, Payload)
    if (result.data.responseCode === "200") {
      history.push({
        pathname: "/SignIn",
        state: {
          confirmationMessage:result.data.responseMessage,
        },
      });
    }
    else{
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
            <img src={require("assets/images/logo.png")} alt="InsureKart" title="InsureKart"/>
          </Link>
        </div>

        <div className="app-login-content">
        <div className="app-login-header mb-8">
        <h1><IntlMessages id="product.name" /></h1><h3>Reset Password</h3> 
      </div>
      

          <div className="app-login-form">
            <form method="post" action="/">
              <InputField
              required
                type="text"
                label="Temporary Password"
                onChange={(event) => setTemporaryPassword(event.target.value)}
                fullWidth
                defaultValue={temporaryPassword}
                margin="normal"
                className="mt-0 mb-2"
              />

              <InputField
              required
                type="password"
                onChange={(event) => setNewPassword(event.target.value)}
                label="New Password"
                fullWidth
                defaultValue={newPassword}
                margin="normal"
                className="mt-2 mb-2"
              />

              <InputField
              required
                type="password"
                onChange={(event) => setConfirmationPassword(event.target.value)}
                label="Confirmation Password"
                fullWidth
                defaultValue={confirmationPassword}
                margin="normal"
                className="mt-2 mb-4"
              />

              <div className="mb-3 d-flex align-items-center justify-content-between">
                <InputSubmitButton
                onClick={() => handleClick()}
                />
                <Link to="/ForgotPassword">
                  Go Back
                    </Link> 
                
              </div>
            

            </form>
          </div>
        </div>

      </div>

      {
        loader &&
        <div className="loader-view">
          <CircularProgress/>
        </div>
      }
      {showMessage && NotificationManager.error(alertMessage)}
      <NotificationContainer/>
      <IPPNotification />
    </div>
  )
};


export default ResetPassword;
