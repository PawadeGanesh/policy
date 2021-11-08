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
import InputSubmitButton from "../app/routes/widgets/routes/CommonComponents/SubmitButton"
import { useHistory } from "react-router-dom";
import {apigetUrl,apiputUrl} from "../setup/middleware";
import {IPPNotification,ippNotify,} from "../app/routes/widgets/routes/CommonComponents/IPPNotification";


const ForgotPassword = (props) => {

  const [username, setName] = useState("");

  const dispatch = useDispatch();
  const {loader, alertMessage, showMessage, authUser} = useSelector(({auth}) => auth);
  let history = useHistory();


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
   
    if(username===""||username===null){ippNotify.error("Please Enter Username.");}
    else{
      const result = await apigetUrl(`/auth/reset-password/${username}`);
      if (result.data.responseCode === "200") {
      history.push({
      pathname: "/ResetPassword",
      state: {
        userName:username,
        confirmationMessage:result.data.responseMessage,

      },
    });

    }
    else{
      ippNotify.error(result.data.responseMessage)
    }
  }
  };

  return (
    <div
      className="app-login-container d-flex justify-content-center align-items-center animated slideInUpTiny animation-duration-3">
      <div className="app-login-main-content">
        <div className="app-logo-content d-flex align-items-center justify-content-center">
          <Link className="logo-lg" to="/" title="Jambo">
            <img src={require("assets/images/logo.png")} alt="jambo" title="jambo"/>
          </Link>
        </div>

        <div className="app-login-content">
        <div className="app-login-header mb-4">
        <h1>
          <IntlMessages id="product.name" />
        </h1>
      </div>
     
          <div className="mb-4">
            <h5>Please enter the username</h5>
          </div>
 <div className="app-login-form">
            <form method="post" action="/">
              <InputField
                type="text"
                label="User Name"
                onChange={(event) => setName(event.target.value)}
                fullWidth
                defaultValue={username}
                margin="normal"
                className="mt-0 mb-2"
              />


              <div className="mb-3 mt-2 d-flex align-items-center justify-content-between">
             
              
                <InputSubmitButton
                onClick={() => handleClick()}
                />
               
                <Link to="/SignIn">
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


export default ForgotPassword;
